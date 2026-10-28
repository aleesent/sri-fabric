import React, { useState, useEffect, useMemo } from 'react';
import { Fabric } from '../types/index.ts';
import { FabricCard } from '../components/FabricCard.tsx';
import {
  Search,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import {
  SHOP_CHECKBOX_CATEGORIES,
  fabricMatchesCategory,
} from '../utils/shopData.ts';

export type CollectionType = 'saree' | 'fabric' | 'top-dupatta';

interface CatalogueViewProps {
  collectionType?: CollectionType;
  initialCategory?: string;
  initialSearch?: string;
  initialFabricType?: string;
  onViewFabric: (slug: string) => void;
  onRequestEnquiry: (fabricName?: string) => void;
  onNavigate?: (path: string) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  collectionType = 'saree',
  initialCategory,
  initialSearch = '',
  initialFabricType,
  onViewFabric,
  onRequestEnquiry,
  onNavigate,
}) => {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [loading, setLoading] = useState(true);

  const isZeroProductCategory = collectionType === 'fabric';

  const pageTitle =
    collectionType === 'fabric'
      ? 'FABRIC'
      : collectionType === 'top-dupatta'
      ? 'TOP + DUPATTA'
      : 'SAREES';

  const breadcrumbLabel =
    collectionType === 'fabric'
      ? 'Fabric'
      : collectionType === 'top-dupatta'
      ? 'Top + Dupatta'
      : 'Sarees';

  // Search input state
  const [search, setSearch] = useState(initialSearch);

  // Collapsible Accordion States
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isWeaveOpen, setIsWeaveOpen] = useState(false);

  // Filter States (Size, Color, and Price removed per requirement)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWeaves, setSelectedWeaves] = useState<string[]>([]);

  // Toolbar States (No price sorting)
  const [sortBy, setSortBy] = useState<string>('newness');
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(24);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Mobile Filter Drawer Toggle
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch Fabrics on Mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/fabrics')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFabrics(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Sync initial query
  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);

  // Toggle Category Checkbox
  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
    setCurrentPage(1);
  };

  // Toggle Weave
  const toggleWeave = (weave: string) => {
    setSelectedWeaves((prev) =>
      prev.includes(weave) ? prev.filter((w) => w !== weave) : [...prev, weave]
    );
    setCurrentPage(1);
  };

  // Reset / Clear All Filters
  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setSelectedWeaves([]);
    setCurrentPage(1);
  };

  // Check if any filter is active
  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategories.length > 0 ||
    selectedWeaves.length > 0;

  // Filtered & Sorted Fabrics
  const filteredFabrics = useMemo(() => {
    if (isZeroProductCategory) {
      return [];
    }

    let result = fabrics.filter((fabric) => {
      // 0. Filter by Collection Type (Top + Dupatta vs Saree vs Fabric)
      if (collectionType === 'top-dupatta') {
        const isTD =
          (fabric.fabricType && (fabric.fabricType.toLowerCase().includes('top') || fabric.fabricType.toLowerCase().includes('dupatta'))) ||
          (fabric.name && fabric.name.toLowerCase().includes('kurta set')) ||
          (fabric.keywords && fabric.keywords.includes('SRI-TD'));
        if (!isTD) return false;
      } else if (collectionType === 'saree') {
        const isSaree =
          (fabric.fabricType && fabric.fabricType.toLowerCase().includes('saree')) ||
          (fabric.keywords && fabric.keywords.includes('SRI-SAR')) ||
          (!fabric.fabricType?.toLowerCase().includes('top') && !fabric.name?.toLowerCase().includes('kurta set'));
        if (!isSaree) return false;
      }
      // 1. Text Search
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const fullText = `${fabric.name} ${fabric.description} ${fabric.designId || ''} ${fabric.keywords || ''}`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }

      // 2. Category Checkboxes
      if (selectedCategories.length > 0) {
        const matchAnyCategory = selectedCategories.some((catId) =>
          fabricMatchesCategory(fabric, catId)
        );
        if (!matchAnyCategory) return false;
      }

      // 3. Weave / Texture
      if (selectedWeaves.length > 0) {
        const text = `${fabric.fabricType} ${fabric.description}`.toLowerCase();
        const matchWeave = selectedWeaves.some((w) => text.includes(w.toLowerCase()));
        if (!matchWeave) return false;
      }

      return true;
    });

    // Sorting (Name & Newness only - Price sorting removed)
    result.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      // default: newness / id
      return a.id - b.id;
    });

    return result;
  }, [
    isZeroProductCategory,
    fabrics,
    search,
    selectedCategories,
    selectedWeaves,
    sortBy,
  ]);

  // Pagination calculation
  const totalItems = filteredFabrics.length;
  const perPageNumber = itemsPerPage === 'all' ? totalItems || 1 : itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPageNumber));

  const paginatedFabrics = useMemo(() => {
    if (itemsPerPage === 'all') return filteredFabrics;
    const startIndex = (currentPage - 1) * perPageNumber;
    return filteredFabrics.slice(startIndex, startIndex + perPageNumber);
  }, [filteredFabrics, currentPage, perPageNumber, itemsPerPage]);

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-stone-900 pb-20">
      {/* ============================================================ */}
      {/* 1. TOP TITLE & BREADCRUMB HEADER                             */}
      {/* ============================================================ */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 uppercase">
              {pageTitle}
            </h1>
          </div>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500">
            <button
              onClick={() => onNavigate ? onNavigate('/') : (window.location.href = '/')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-stone-300 font-bold">›</span>
            <span className="text-stone-900 font-semibold">{breadcrumbLabel}</span>
          </nav>
        </div>
      </section>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isMobileFiltersOpen ? 'Close Filters' : 'Filter Products'}</span>
        </button>

        <span className="text-xs text-stone-500 font-medium">
          {totalItems} Results
        </span>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN SHOP CONTENT AREA (Max width 1660px, 4-col desktop)  */}
      {/* ============================================================ */}
      <div className="max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-7 xl:gap-8 items-start">
          {/* ---------------------------------------------------------- */}
          {/* LEFT SIDEBAR: FILTERS PANEL (Optimized 230–245px width)    */}
          {/* ---------------------------------------------------------- */}
          <aside
            className={`w-full lg:w-[230px] xl:w-[245px] shrink-0 space-y-3.5 ${
              isMobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Search Box in Filter Sidebar */}
            <div className="border border-stone-200 bg-white p-3 shadow-2xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${pageTitle.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#f9f9f9] border border-stone-300 text-xs px-2.5 py-1.5 pr-8 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Box 1: YOU'VE SELECTED (Shown when filters are active) */}
            {hasActiveFilters && (
              <div className="border border-stone-200 bg-white p-3 space-y-2.5 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  YOU'VE SELECTED
                </h3>

                <div className="space-y-1.5 text-xs text-stone-700">
                  {/* Category chips */}
                  {selectedCategories.map((catId) => {
                    const catObj = SHOP_CHECKBOX_CATEGORIES.find((c) => c.id === catId);
                    return (
                      <div
                        key={catId}
                        onClick={() => toggleCategory(catId)}
                        className="flex items-center gap-1.5 cursor-pointer hover:text-stone-950 group"
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[10px] text-stone-500 group-hover:border-stone-900 group-hover:text-stone-900">
                          ×
                        </span>
                        <span className="truncate">{catObj?.name || catId}</span>
                      </div>
                    );
                  })}

                  {/* Weave chips */}
                  {selectedWeaves.map((weave) => (
                    <div
                      key={weave}
                      onClick={() => toggleWeave(weave)}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-stone-950 group"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[10px] text-stone-500 group-hover:border-stone-900 group-hover:text-stone-900">
                        ×
                      </span>
                      <span className="truncate">{weave}</span>
                    </div>
                  ))}

                  {/* Search query chip */}
                  {search.trim() && (
                    <div
                      onClick={() => setSearch('')}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-stone-950 group"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[10px] text-stone-500 group-hover:border-stone-900 group-hover:text-stone-900">
                        ×
                      </span>
                      <span className="truncate">"{search.trim()}"</span>
                    </div>
                  )}
                </div>

                {/* Solid Black CLEAR ALL Button */}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="w-full mt-1.5 py-2 bg-[#141414] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  CLEAR ALL
                </button>
              </div>
            )}

            {/* Box 2: CATEGORY (Checkbox list) */}
            <div className="border border-stone-200 bg-white p-3 sm:p-3.5 shadow-2xs">
              <div
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  CATEGORY
                </h3>
                <span className="text-stone-500 hover:text-stone-900">
                  {isCategoryOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </div>

              {isCategoryOpen && (
                <div className="pt-3 space-y-2">
                  {SHOP_CHECKBOX_CATEGORIES.map((cat) => {
                    const isChecked = selectedCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 text-xs text-stone-700 hover:text-stone-950 cursor-pointer select-none group"
                      >
                        <div
                          onClick={() => toggleCategory(cat.id)}
                          className={`w-3.5 h-3.5 border transition-colors flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-stone-900 border-stone-900 text-white'
                              : 'bg-white border-stone-300 group-hover:border-stone-500'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 bg-white" />}
                        </div>
                        <span className="leading-tight">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Box 3: WEAVE & TEXTURE */}
            <div className="border border-stone-200 bg-white p-3 sm:p-3.5 shadow-2xs">
              <div
                onClick={() => setIsWeaveOpen(!isWeaveOpen)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  FABRIC & WEAVE
                </h3>
                <span className="text-stone-500 hover:text-stone-900">
                  {isWeaveOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </div>

              {isWeaveOpen && (
                <div className="pt-3 space-y-2 text-xs text-stone-700">
                  {['Japan Satin', 'Dola Silk', 'Mul Cotton', 'Organza', 'Pure Silk', 'Viscose Georgette'].map(
                    (weave) => {
                      const active = selectedWeaves.includes(weave);
                      return (
                        <label
                          key={weave}
                          onClick={() => toggleWeave(weave)}
                          className="flex items-center gap-2 cursor-pointer hover:text-stone-950"
                        >
                          <div
                            className={`w-3.5 h-3.5 border transition-colors flex items-center justify-center shrink-0 ${
                              active
                                ? 'bg-stone-900 border-stone-900 text-white'
                                : 'bg-white border-stone-300'
                            }`}
                          >
                            {active && <div className="w-1.5 h-1.5 bg-white" />}
                          </div>
                          <span>{weave}</span>
                        </label>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT COLUMN: TOOLBAR & 4-COLUMN PRODUCT GRID              */}
          {/* ---------------------------------------------------------- */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* Top Toolbar Controls - Full width, clean alignment */}
            <div className="w-full bg-white px-4 py-3 sm:px-5 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700 shadow-2xs">
              {/* Left: Results Count & View Count Selector */}
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-xs">
                  {totalItems} RESULTS
                </span>

                <div className="h-3.5 w-px bg-stone-200 hidden sm:block" />

                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-stone-400">View</span>
                  {[24, 48, 'All'].map((val) => {
                    const isSelected =
                      val === 'All' ? itemsPerPage === 'all' : itemsPerPage === val;
                    return (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => {
                          setItemsPerPage(val === 'All' ? 'all' : (val as number));
                          setCurrentPage(1);
                        }}
                        className={`px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'font-bold text-stone-950 underline underline-offset-4'
                            : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Sort by Dropdown Selector */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-stone-400 font-medium hidden md:inline text-xs">Sort:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-stone-50/60 hover:bg-stone-50 border border-stone-200 hover:border-stone-400 py-1.5 pl-3 pr-8 text-xs text-stone-800 rounded-none focus:outline-none focus:border-stone-900 cursor-pointer transition-colors"
                  >
                    <option value="newness">Sort by newness</option>
                    <option value="name-asc">Sort by name: A to Z</option>
                    <option value="name-desc">Sort by name: Z to A</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Responsive 4-Column Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 min-[1380px]:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="space-y-2.5">
                    <div className="bg-stone-200 aspect-[3/4] w-full" />
                    <div className="h-4 bg-stone-200 w-3/4" />
                  </div>
                ))}
              </div>
            ) : paginatedFabrics.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 min-[1380px]:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
                {paginatedFabrics.map((fabric) => (
                  <FabricCard
                    key={fabric.id}
                    fabric={fabric}
                    onViewDetails={onViewFabric}
                    onRequestEnquiry={onRequestEnquiry}
                    variant="shop"
                  />
                ))}
              </div>
            ) : isZeroProductCategory ? (
              <div className="bg-white border border-stone-200 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-2xs">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#dfb15b]/15 text-[#855e14] flex items-center justify-center border border-[#dfb15b]/40">
                  <span className="text-2xl font-serif">✦</span>
                </div>
                <div className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-[11px] font-semibold uppercase tracking-widest mb-3">
                  0 Products Listed
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-wide mb-3">
                  {pageTitle} Collection
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto mb-6">
                  Our exclusive {pageTitle.toLowerCase()} catalogue is currently in loom scheduling and yarn preparation. Wholesale bulk orders, customized weaving specs, and swatch cards are available directly from our mills.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onRequestEnquiry(`${pageTitle} Wholesale Collection`)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#1e050c] hover:bg-[#340915] text-[#dfb15b] font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm"
                  >
                    Request {pageTitle} Enquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate ? onNavigate('/sarees') : (window.location.href = '/sarees')}
                    className="w-full sm:w-auto px-6 py-3 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Browse Sarees (27 Items)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 p-12 text-center space-y-4">
                <p className="text-stone-500 text-sm">
                  No products matched your selected criteria.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}

            {/* Bottom Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 pb-4 border-t border-stone-200 flex items-center justify-end gap-2 text-xs">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-stone-400 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                  const isActive = pg === currentPage;
                  return (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pg);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-7 h-7 flex items-center justify-center font-medium cursor-pointer transition-colors ${
                        isActive
                          ? 'text-stone-950 font-bold border-b-2 border-stone-900'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-stone-400 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
