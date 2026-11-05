import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { Fabric } from '../types/index.ts';
import {
  Search,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onRequestEnquiry: (fabricName?: string) => void;
  onOpenTrackEnquiry?: () => void;
}

export type SearchScope = 'all' | 'saree' | 'fabric' | 'top-dupatta';

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onRequestEnquiry,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [catalogItems, setCatalogItems] = useState<Fabric[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-fetch catalogue for instant, zero-latency live autocomplete
  useEffect(() => {
    if (isSearchOpen && catalogItems.length === 0) {
      fetch('/api/fabrics')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCatalogItems(data);
        })
        .catch(() => {});
    }
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen, catalogItems.length]);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SAREE', path: '/sarees' },
    { label: 'FABRIC', path: '/fabrics' },
    { label: 'TOP + DUPATTA', path: '/top-dupatta' },
    { label: 'MANUFACTURING', path: '/manufacturing' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  // Smart Live Autocomplete Filter
  const liveResults = useMemo(() => {
    if (!searchQuery.trim() || catalogItems.length === 0) return [];

    const query = searchQuery.trim().toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);

    return catalogItems
      .filter((fabric) => {
        const ft = (fabric.fabricType || '').toLowerCase();
        const kw = (fabric.keywords || '').toLowerCase();
        const name = (fabric.name || '').toLowerCase();
        const isSaree = ft.includes('saree') || kw.includes('sri-sar');
        const isTD = ft.includes('top') || ft.includes('dupatta') || name.includes('kurta set') || kw.includes('sri-td');
        const isFabric = ft.includes('fabric') || ft.includes('printed') || kw.includes('sri-fab');

        if (searchScope === 'saree' && !isSaree) return false;
        if (searchScope === 'top-dupatta' && !isTD) return false;
        if (searchScope === 'fabric' && !isFabric) return false;

        const searchableFields = [
          fabric.name,
          fabric.fabricType,
          fabric.categoryName,
          fabric.description,
          fabric.designId,
          fabric.keywords,
          fabric.composition,
          fabric.applications,
          fabric.weaveType,
          isSaree ? 'saree sari saris' : '',
          isTD ? 'top dupatta suit kurti set kurta' : '',
          isFabric ? 'fabric yardage cloth textile than digital print printed' : '',
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return tokens.every((tok) => {
          if (searchableFields.includes(tok)) return true;
          const singular = tok.replace(/s$/, '');
          return singular.length >= 3 && searchableFields.includes(singular);
        });
      })
      .slice(0, 6);
  }, [searchQuery, searchScope, catalogItems]);

  const executeSearch = (query: string, scope: SearchScope = searchScope) => {
    const q = query.trim();
    if (!q) return;
    const scopeParam = scope !== 'all' ? `&type=${scope}` : '';
    onNavigate(`/search?search=${encodeURIComponent(q)}${scopeParam}`);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const trendingTags = [
    { label: 'Pure Silk Sarees', query: 'Silk Saree', scope: 'saree' as SearchScope },
    { label: 'Printed Fabric Yardages', query: 'Printed Fabric', scope: 'fabric' as SearchScope },
    { label: 'Top + Dupatta Sets', query: 'Top Dupatta', scope: 'top-dupatta' as SearchScope },
    { label: 'Banarasi Katan', query: 'Banarasi', scope: 'all' as SearchScope },
    { label: 'Tissue Organza', query: 'Organza', scope: 'all' as SearchScope },
    { label: 'Kalamkari Prints', query: 'Kalamkari', scope: 'all' as SearchScope },
    { label: 'Dola Silk', query: 'Dola', scope: 'all' as SearchScope },
    { label: 'Mul Cotton', query: 'Cotton', scope: 'all' as SearchScope },
  ];

  return (
    <>
      {/* Top Utility Bar (matching reference mockup) */}
      <div className="bg-[#24060d] text-[#e8d5b5] text-[11px] font-medium tracking-wider border-b border-[#dfb15b]/20 px-4 sm:px-6 lg:px-8 xl:px-10 py-2">
        <div className="max-w-[1660px] mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#dfb15b]">✦</span>
            <span>PREMIUM FABRICS</span>
            <span className="opacity-40">|</span>
            <span>QUALITY</span>
            <span className="opacity-40">|</span>
            <span>INNOVATION</span>
            <span className="opacity-40">|</span>
            <span>DIRECT MILL SOURCING</span>
            <span className="text-[#dfb15b]">✦</span>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4 sm:gap-6 ml-auto">
            {/* Social Media Icons (High-visibility gold badge styling) */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-[#dfb15b] font-semibold text-[11px] tracking-wider">Follow Us:</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://www.linkedin.com/company/sri-fabrics/"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                title="LinkedIn - SRI FABRICS"
                aria-label="LinkedIn - SRI FABRICS"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#180409]/95 backdrop-blur-md shadow-lg py-2.5 sm:py-3 border-b border-[#dfb15b]/20'
            : 'bg-[#1e050c] py-3 sm:py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between relative">
          {/* LEFT ON MOBILE: Menu Bar Hamburger Button (< lg) */}
          <div className="flex lg:hidden items-center w-10 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-[#dfb15b] bg-[#dfb15b]/15 hover:bg-[#dfb15b] hover:text-[#1c050d] rounded-lg transition-all focus:outline-none cursor-pointer border border-[#dfb15b]/40 shadow-xs"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* CENTRE ON MOBILE (< lg), LEFT ON DESKTOP (lg) */}
          <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
            <button
              onClick={() => onNavigate('/')}
              className="text-center lg:text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#dfb15b] flex items-center justify-center lg:justify-start"
            >
              <Logo variant="gold" />
            </button>
          </div>

          {/* DESKTOP CENTRE: Nav Links (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-9">
            {navLinks.map((link) => {
              const isActive =
                currentPath === link.path ||
                (link.path === '/sarees' && currentPath.startsWith('/saree')) ||
                (link.path === '/fabrics' && currentPath.startsWith('/fabric')) ||
                (link.path === '/top-dupatta' && currentPath.startsWith('/top-dupatta'));

              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`relative text-xs tracking-[0.14em] py-1 transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#dfb15b] font-semibold'
                      : 'hover:text-[#dfb15b] text-white/85'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#dfb15b]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ON MOBILE (< lg) & DESKTOP (lg): Search Bar & Actions */}
          <div className="flex items-center justify-end w-10 lg:w-auto shrink-0 gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-lg transition-all cursor-pointer border shadow-xs flex items-center gap-1.5 ${
                isSearchOpen
                  ? 'bg-[#dfb15b] text-[#1c050d] border-[#dfb15b]'
                  : 'text-[#dfb15b] bg-[#dfb15b]/15 hover:bg-[#dfb15b] hover:text-[#1c050d] border-[#dfb15b]/40'
              }`}
              title="Search all sarees, fabrics, top+dupatta"
              aria-label="Search catalogue"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              <span className="hidden xl:inline text-xs font-semibold tracking-wider">
                {isSearchOpen ? 'CLOSE' : 'SEARCH'}
              </span>
            </button>

            {/* Request Enquiry Primary CTA (Desktop) */}
            <button
              onClick={() => onRequestEnquiry()}
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#24060d] bg-gradient-to-r from-[#dfb15b] to-[#f4d188] hover:from-[#eac272] hover:to-[#ffe19f] rounded shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              REQUEST ENQUIRY
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE COMPREHENSIVE SEARCH SUITE DROPDOWN              */}
        {/* ============================================================ */}
        {isSearchOpen && (
          <div className="max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-4 border-t border-[#dfb15b]/20 bg-[#160308]/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Scope Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
              <span className="text-[11px] uppercase tracking-wider text-[#dfb15b] font-bold mr-1">
                Search In:
              </span>
              {[
                { id: 'all', label: '✦ All Collections' },
                { id: 'saree', label: 'Sarees' },
                { id: 'fabric', label: 'Fabric Yardages' },
                { id: 'top-dupatta', label: 'Top + Dupatta' },
              ].map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setSearchScope(scope.id as SearchScope)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
                    searchScope === scope.id
                      ? 'bg-[#dfb15b] text-[#1c050d] shadow-sm font-bold'
                      : 'bg-[#2a0812] text-white/70 hover:text-white border border-[#dfb15b]/20 hover:border-[#dfb15b]/50'
                  }`}
                >
                  {scope.label}
                </button>
              ))}
            </div>

            {/* Primary Search Input Field */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-[#dfb15b] absolute left-3.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchScope === 'saree'
                    ? 'Search sarees by design, Banarasi, zari, dola silk, bridal...'
                    : searchScope === 'fabric'
                    ? 'Search fabric yardages, digital prints, organza, chinon, georgette...'
                    : searchScope === 'top-dupatta'
                    ? 'Search top + dupatta suit sets, unstitched sets, muslin, kurti...'
                    : 'Search across all sarees, fabrics, top + dupatta sets, weaves, design SKUs...'
                }
                className="w-full bg-[#2a0812] text-white placeholder-white/40 text-xs sm:text-sm px-4 py-2.5 sm:py-3 pl-10 pr-24 sm:pr-28 rounded-lg border border-[#dfb15b]/40 focus:outline-none focus:border-[#dfb15b] shadow-inner"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-20 sm:right-24 p-1 text-white/50 hover:text-white cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#dfb15b] to-[#f4d188] hover:from-[#eac272] hover:to-[#ffe19f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded-md shadow transition-all cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Real-time Autocomplete Suggestions Dropdown */}
            {searchQuery.trim() ? (
              <div className="mt-3 bg-[#24060e] border border-[#dfb15b]/30 rounded-lg p-3 max-h-[360px] overflow-y-auto divide-y divide-white/5 shadow-2xl">
                <div className="text-[11px] text-[#dfb15b] font-semibold uppercase tracking-wider pb-2 flex items-center justify-between">
                  <span>Matching Items ({liveResults.length})</span>
                  <span className="text-white/40 text-[10px]">Press Enter to view full catalogue</span>
                </div>

                {liveResults.length > 0 ? (
                  <div className="space-y-1.5 pt-1.5">
                    {liveResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate(`/fabrics/${item.slug}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 rounded hover:bg-[#380a18] transition-colors cursor-pointer group"
                      >
                        <img
                          src={item.primaryImageUrl}
                          alt={item.name}
                          className="w-10 h-13 object-cover object-top rounded shrink-0 border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-[#dfb15b]/20 text-[#dfb15b] border border-[#dfb15b]/30">
                              {item.fabricType || 'Textile'}
                            </span>
                            {item.designId && (
                              <span className="text-[10px] text-white/40 font-mono">
                                {item.designId}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/90 group-hover:text-[#dfb15b] font-medium truncate mt-0.5">
                            {item.name}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#dfb15b] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => executeSearch(searchQuery)}
                        className="text-xs font-bold text-[#dfb15b] hover:underline inline-flex items-center gap-1.5 py-1 cursor-pointer"
                      >
                        <span>View all matching results in Catalogue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-white/60">
                      No direct match found for &ldquo;{searchQuery}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => executeSearch(searchQuery, 'all')}
                      className="mt-2 text-xs text-[#dfb15b] underline font-semibold cursor-pointer"
                    >
                      Search across all collections anyway &rarr;
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Suggested Trending Searches */
              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-white/40 uppercase tracking-wider mr-1">Trending:</span>
                {trendingTags.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag.query);
                      setSearchScope(tag.scope);
                      executeSearch(tag.query, tag.scope);
                    }}
                    className="px-2.5 py-1 bg-[#260710] hover:bg-[#3d0b1a] text-white/80 hover:text-[#dfb15b] text-[11px] rounded border border-white/5 hover:border-[#dfb15b]/40 transition-all cursor-pointer"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#1a050b] text-[#f7eedf] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-[#dfb15b]/30">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Logo variant="gold" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-white/60 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile In-Drawer Search Bar */}
              <div className="pt-4 pb-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) executeSearch(searchQuery);
                  }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all sarees & fabrics..."
                    className="w-full bg-[#2a0812] text-white text-xs px-3 py-2 pl-8 pr-16 rounded border border-[#dfb15b]/40 focus:outline-none focus:border-[#dfb15b]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#dfb15b] absolute left-2.5" />
                  <button
                    type="submit"
                    className="absolute right-1 px-2.5 py-1 bg-[#dfb15b] text-[#24060d] text-[11px] font-bold rounded"
                  >
                    Go
                  </button>
                </form>
              </div>

              <nav className="flex flex-col gap-2 py-4">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => {
                      onNavigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-sm tracking-widest py-2 border-b border-white/5 transition-colors ${
                      currentPath === link.path ? 'text-[#dfb15b] font-bold' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  onRequestEnquiry();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#dfb15b] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded text-center shadow"
              >
                REQUEST FABRIC ENQUIRY
              </button>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/sri-fabrics/"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all shadow-sm"
                  title="LinkedIn - SRI FABRICS"
                  aria-label="LinkedIn - SRI FABRICS"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
