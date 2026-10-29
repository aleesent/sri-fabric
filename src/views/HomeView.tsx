import React, { useState, useEffect, useMemo } from 'react';
import {
  Fabric,
  Collection,
  Category,
  HeroSlide,
  Testimonial,
  BlogPost,
} from '../types/index.ts';
import { FabricCard } from '../components/FabricCard.tsx';
import { HeroSlider } from '../components/HeroSlider.tsx';
import { ShopTheLook } from '../components/ShopTheLook.tsx';
import { ShopByCollection } from '../components/ShopByCollection.tsx';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Diamond,
  Cog,
  Truck,
  Leaf,
  Star,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  onRequestEnquiry: (fabricName?: string) => void;
  onViewFabric: (slug: string) => void;
}

// Fabric / Loom Textile Outline Icon matching the minimal gold style of the reference image
const FabricLoomIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
    <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
    <line x1="3.5" y1="14.5" x2="20.5" y2="14.5" />
    <line x1="9" y1="4" x2="9" y2="20" />
    <line x1="15" y1="4" x2="15" y2="20" />
  </svg>
);

// Memory cache for instantaneous page switches and fast load
let cachedHomeData: {
  categories: Category[];
  collections: Collection[];
  randomPremiumFabrics: Fabric[];
  featuredFabrics: Fabric[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
} | null = null;

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onRequestEnquiry,
  onViewFabric,
}) => {
  const [categories, setCategories] = useState<Category[]>(() => cachedHomeData?.categories || []);
  const [collections, setCollections] = useState<Collection[]>(() => cachedHomeData?.collections || []);
  const [allFabrics, setAllFabrics] = useState<Fabric[]>([]);
  const [randomPremiumFabrics, setRandomPremiumFabrics] = useState<Fabric[]>(
    () => cachedHomeData?.randomPremiumFabrics || []
  );
  const [featuredFabrics, setFeaturedFabrics] = useState<Fabric[]>(() => cachedHomeData?.featuredFabrics || []);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => cachedHomeData?.testimonials || []);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => cachedHomeData?.blogPosts || []);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // Fetch or revalidate dynamic content in background
  const fetchAllHomeData = (forceFresh = false) => {
    const bust = forceFresh ? `?_t=${Date.now()}` : '';
    Promise.all([
      fetch(`/api/categories${bust}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/collections${bust}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/fabrics${bust}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/testimonials${bust}`).then((r) => r.json()).catch(() => []),
      fetch(`/api/blog${bust}`).then((r) => r.json()).catch(() => []),
    ]).then(([catData, colData, fabData, testData, blogData]) => {
      const cats = Array.isArray(catData) ? catData : [];
      const cols = Array.isArray(colData) ? colData : [];
      const allFabs = Array.isArray(fabData) ? (fabData as Fabric[]) : [];
      const tests = Array.isArray(testData) ? testData : [];
      const blogs = Array.isArray(blogData) ? blogData.slice(0, 4) : [];

      // Select 6 random products from the catalog (ensures 6 cards on phone view in a balanced 2x3 grid and 6 cards on desktop)
      const pool = allFabs.length > 0 && allFabs.length < 6 ? [...allFabs, ...allFabs] : allFabs;
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const randomSix = shuffled.slice(0, 6);

      setCategories(cats);
      setCollections(cols);
      setAllFabrics(allFabs);
      setRandomPremiumFabrics(randomSix);
      setFeaturedFabrics(allFabs.slice(0, 8));
      setTestimonials(tests);
      setBlogPosts(blogs);

      cachedHomeData = {
        categories: cats,
        collections: cols,
        randomPremiumFabrics: randomSix,
        featuredFabrics: allFabs.slice(0, 8),
        testimonials: tests,
        blogPosts: blogs,
      };
    }).catch((err) => console.error('Error fetching home data:', err));
  };

  // Filter top + dupatta products for dedicated Exclusive Mill Collection section
  const featuredTopDupatta = useMemo(() => {
    const tdList = allFabrics.filter((fabric) => {
      const typeStr = (fabric.fabricType || '').toLowerCase();
      const nameStr = (fabric.name || '').toLowerCase();
      const kwStr = (fabric.keywords || '').toLowerCase();
      return (
        typeStr.includes('top') ||
        typeStr.includes('dupatta') ||
        typeStr.includes('kurti') ||
        nameStr.includes('top') ||
        nameStr.includes('dupatta') ||
        nameStr.includes('kurta') ||
        nameStr.includes('kurti') ||
        nameStr.includes('suit') ||
        kwStr.includes('sri-td') ||
        kwStr.includes('top') ||
        kwStr.includes('dupatta')
      );
    });

    if (tdList.length >= 4) {
      return tdList.slice(0, 8);
    }

    // Fallback: supplement if needed to ensure at least 4-8 cards are displayed
    const others = allFabrics.filter((f) => !tdList.some((t) => t.id === f.id));
    return [...tdList, ...others].slice(0, 8);
  }, [allFabrics]);

  // Dedicated Featured Sarees list
  const featuredSarees = useMemo(() => {
    const sarees = allFabrics.filter((fabric) => {
      const typeStr = (fabric.fabricType || '').toLowerCase();
      const nameStr = (fabric.name || '').toLowerCase();
      const kwStr = (fabric.keywords || '').toLowerCase();
      return (
        typeStr.includes('saree') ||
        kwStr.includes('sri-sar') ||
        (!typeStr.includes('top') && !nameStr.includes('kurta') && !nameStr.includes('kurti') && !nameStr.includes('top + dupatta'))
      );
    });
    return sarees.length > 0 ? sarees.slice(0, 8) : featuredFabrics;
  }, [allFabrics, featuredFabrics]);

  useEffect(() => {
    fetchAllHomeData(false);

    // Instant real-time updates when admin makes changes
    const handleStoreUpdate = () => fetchAllHomeData(true);
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sri_store_updated') fetchAllHomeData(true);
    };

    window.addEventListener('store-data-updated', handleStoreUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', () => fetchAllHomeData(false));

    return () => {
      window.removeEventListener('store-data-updated', handleStoreUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', () => fetchAllHomeData(false));
    };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      setNewsletterStatus('success');
      setNewsletterMsg(data.message || 'Subscribed successfully!');
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterStatus('error');
      setNewsletterMsg(err.message || 'Subscription failed');
    }
  };

  const activeTestimonial = testimonials[currentTestimonial] || {
    clientName: 'Priya Sharma',
    company: 'Priya Sharma Haute Couture',
    designation: 'Fashion Designer, India',
    country: 'India',
    testimonial: '“SRI Fabrics has been our trusted partner for premium textiles. The quality, finish and collection are simply outstanding.”',
    rating: 5,
  };

  return (
    <div className="space-y-0">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (100% pure visual banner, no text, no buttons, clickable redirect) */}
      {/* ============================================================ */}
      <HeroSlider
        targetPage="home"
        autoPlayDelay={2000}
        onNavigate={onNavigate}
        onRequestEnquiry={onRequestEnquiry}
        variant="screen-fit"
      />

      {/* ============================================================ */}
      {/* 2. TRUST / USP STRIP (Exact recreation of reference image)    */}
      {/* ============================================================ */}
      <section className="bg-[#FAF6EE] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#EAE4D7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-y-10 lg:gap-0">
            {/* 1. PREMIUM QUALITY (Row 1, Col 1) */}
            <div className="relative flex flex-col items-center text-center px-3 sm:px-6 lg:px-8 h-full justify-start">
              <Diamond className="w-6 h-6 sm:w-7 sm:h-7 text-[#9E7D3B] shrink-0" strokeWidth={1.35} />
              <h3 className="font-sans font-bold text-[11px] sm:text-[13px] lg:text-[14px] uppercase tracking-wider text-[#4a1122] mt-2.5 sm:mt-3.5 mb-1 sm:mb-1.5 min-h-[32px] sm:min-h-[36px] flex items-center justify-center text-center">
                PREMIUM QUALITY
              </h3>
              <p className="font-sans text-[11px] sm:text-[12px] lg:text-[13px] text-[#555555] leading-relaxed max-w-[200px] sm:max-w-[260px] mx-auto">
                Finest fabrics, superior finish and strict thread inspection.
              </p>
              {/* Thin Vertical Gold Divider for Desktop */}
              <div
                className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[75px] bg-[#B8934C]/35"
                aria-hidden="true"
              />
              {/* Thin Vertical Divider for Mobile & Tablet (right of Col 1) */}
              <div
                className="block lg:hidden absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[70%] bg-[#B8934C]/25"
                aria-hidden="true"
              />
              {/* Thin Horizontal Divider for Mobile & Tablet (below Row 1) */}
              <div
                className="block lg:hidden absolute -bottom-4 left-3 right-3 h-[1px] bg-[#B8934C]/20"
                aria-hidden="true"
              />
            </div>

            {/* 2. ADVANCED MANUFACTURING (Row 1, Col 2) */}
            <div className="relative flex flex-col items-center text-center px-3 sm:px-6 lg:px-8 h-full justify-start">
              <Cog className="w-6 h-6 sm:w-7 sm:h-7 text-[#9E7D3B] shrink-0" strokeWidth={1.35} />
              <h3 className="font-sans font-bold text-[11px] sm:text-[13px] lg:text-[14px] uppercase tracking-wider text-[#4a1122] mt-2.5 sm:mt-3.5 mb-1 sm:mb-1.5 min-h-[32px] sm:min-h-[36px] flex items-center justify-center text-center">
                ADVANCED MANUFACTURING
              </h3>
              <p className="font-sans text-[11px] sm:text-[12px] lg:text-[13px] text-[#555555] leading-relaxed max-w-[200px] sm:max-w-[260px] mx-auto">
                Modern high-speed rapier & Jacquard looms for flawless weave.
              </p>
              {/* Thin Vertical Gold Divider for Desktop */}
              <div
                className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[75px] bg-[#B8934C]/35"
                aria-hidden="true"
              />
              {/* Thin Horizontal Divider for Mobile & Tablet (below Row 1) */}
              <div
                className="block lg:hidden absolute -bottom-4 left-3 right-3 h-[1px] bg-[#B8934C]/20"
                aria-hidden="true"
              />
            </div>

            {/* 3. DIRECT MILL STUDIO (Row 2, Col 1) */}
            <div className="relative flex flex-col items-center text-center px-3 sm:px-6 lg:px-8 h-full justify-start">
              <FabricLoomIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#9E7D3B] shrink-0" />
              <h3 className="font-sans font-bold text-[11px] sm:text-[13px] lg:text-[14px] uppercase tracking-wider text-[#4a1122] mt-2.5 sm:mt-3.5 mb-1 sm:mb-1.5 min-h-[32px] sm:min-h-[36px] flex items-center justify-center text-center">
                DIRECT MILL STUDIO
              </h3>
              <p className="font-sans text-[11px] sm:text-[12px] lg:text-[13px] text-[#555555] leading-relaxed max-w-[200px] sm:max-w-[260px] mx-auto">
                Wholesale design collections, bulk dispatch, and dedicated client advisory.
              </p>
              {/* Thin Vertical Gold Divider for Desktop */}
              <div
                className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[75px] bg-[#B8934C]/35"
                aria-hidden="true"
              />
              {/* Thin Vertical Divider for Mobile & Tablet (right of Col 1) */}
              <div
                className="block lg:hidden absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[70%] bg-[#B8934C]/25"
                aria-hidden="true"
              />
            </div>

            {/* 4. SUSTAINABLE PRACTICES (Row 2, Col 2) */}
            <div className="relative flex flex-col items-center text-center px-3 sm:px-6 lg:px-8 h-full justify-start">
              <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-[#9E7D3B] shrink-0" strokeWidth={1.35} />
              <h3 className="font-sans font-bold text-[11px] sm:text-[13px] lg:text-[14px] uppercase tracking-wider text-[#4a1122] mt-2.5 sm:mt-3.5 mb-1 sm:mb-1.5 min-h-[32px] sm:min-h-[36px] flex items-center justify-center text-center">
                SUSTAINABLE PRACTICES
              </h3>
              <p className="font-sans text-[11px] sm:text-[12px] lg:text-[13px] text-[#555555] leading-relaxed max-w-[200px] sm:max-w-[260px] mx-auto">
                AZO-free dyes, zero-liquid discharge, and ethical sourcing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CATEGORY CARDS SECTION: SHOP BY COLLECTION CAROUSEL       */}
      {/* ============================================================ */}
      <ShopByCollection
        onNavigate={onNavigate}
        onViewFabric={onViewFabric}
        products={allFabrics}
      />

      {/* ============================================================ */}
      {/* 3B. EXCLUSIVE MILL COLLECTION — FEATURED SAREES              */}
      {/* (Positioned directly above "OUR PREMIUM SELECTION")           */}
      {/* ============================================================ */}
      <section className="bg-[#faf7f2] py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-300">
            <div>
              <span className="text-[#4a1122] text-xs font-semibold uppercase tracking-[0.2em]">
                EXCLUSIVE MILL COLLECTION
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#4a1122]">
                FEATURED SAREES
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/sarees')}
              className="text-xs font-semibold uppercase tracking-wider text-[#4a1122] hover:text-[#781934] transition-colors flex items-center gap-1"
            >
              <span>VIEW ALL SAREES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid - 3:4 Portrait Cards Grid matching Exclusive Mill styling */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {featuredSarees.map((fabric) => (
              <FabricCard
                key={fabric.id}
                fabric={fabric}
                onViewDetails={onViewFabric}
                onRequestEnquiry={onRequestEnquiry}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PREMIUM FABRICS SECTION (9:16 Minimal Cards - 5 Cards)   */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-b from-[#3d0d1a] via-[#4a1122] to-[#340915] text-[#f7eedf] py-9 sm:py-12 px-3 sm:px-6 w-full">
        <div className="w-full lg:w-[82%] max-w-[1500px] mx-auto">
          {/* Minimal Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-6 gap-3">
            <div>
              <span className="text-[#dfb15b] text-xs font-semibold uppercase tracking-[0.25em]">
                OUR PREMIUM SELECTION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-1">
                Timeless Fabrics. Endless Possibilities.
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/sarees')}
              className="self-start sm:self-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow shrink-0"
            >
              <span>EXPLORE ALL SAREES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 9:16 Editorial Minimal Product Cards Grid - 6 Cards for Perfect Fit on Phone (2x3) & Desktop (1x6) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5 lg:gap-4 w-full">
            {randomPremiumFabrics.length === 0
              ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-[9/16] w-full rounded-lg bg-white/5 animate-pulse border border-white/10"
                  />
                ))
              : randomPremiumFabrics.map((fabric) => (
                  <div
                    key={fabric.id}
                    onClick={() => onViewFabric(fabric.slug)}
                    className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#20050c] border border-[#dfb15b]/25 hover:border-[#dfb15b] transition-all duration-300 shadow-xl"
                  >
                    {/* 9:16 Portrait Card */}
                    <div className="relative aspect-[9/16] w-full overflow-hidden bg-black/40">
                      <img
                        src={fabric.primaryImageUrl}
                        alt={fabric.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Subtle Bottom Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      {/* Clean Minimal Title at Bottom */}
                      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left pointer-events-none">
                        <h3 className="font-serif text-xs sm:text-sm font-semibold text-white tracking-wide leading-snug line-clamp-2 group-hover:text-[#dfb15b] transition-colors">
                          {fabric.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* UPPER-MIDDLE BRAND CAMPAIGN BANNER — FABRICS BEYOND BOUNDARIES */}
      {/* ============================================================ */}
      <section className="w-full bg-[#fcf9f2] overflow-hidden border-0">
        <div className="w-full max-w-[2000px] mx-auto">
          <img
            src="/sri3.png"
            alt="SRI FABRICS — Fabrics Beyond Boundaries Editorial Campaign"
            width={1983}
            height={793}
            className="w-full h-auto block object-contain border-0 outline-none"
            loading="lazy"
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ABOUT SRI FABRICS / MANUFACTURING (Split Section)         */}
      {/* ============================================================ */}
      <section className="bg-[#faf6f0] py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Manufacturing Facility Visual with Video Trigger */}
          <div className="lg:col-span-6 relative rounded-xl overflow-hidden shadow-2xl border border-stone-300 aspect-[16/10] bg-[#1a050b] group">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
              alt="SRI Fabrics Advanced Looms Facility"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="w-16 h-16 rounded-full bg-[#dfb15b] hover:bg-white text-[#24060d] flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer border-4 border-[#24060d]/50"
                aria-label="Watch manufacturing film"
              >
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-xs p-3.5 rounded border border-white/15 text-white flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-[#dfb15b]">SRI Fabrics Mill Floor — Surat, India</p>
                <p className="text-[11px] text-white/70">500,000+ Metres Monthly Weaving Capacity</p>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#dfb15b] text-[#24060d] font-bold rounded">
                HD TOUR
              </span>
            </div>
          </div>

          {/* Right: Editorial About Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[#4a1122] text-xs font-semibold uppercase tracking-[0.25em]">
                ABOUT SRI FABRICS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4a1122] leading-tight">
                Crafting Excellence in Every Thread
              </h2>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              At SRI Fabrics, we bring together heritage Indian weaving tradition, electronic precision technology, and superior filament yarn selection to deliver world-class textiles for global fashion markets. Our commitment to excellence ensures fabrics that inspire couturiers and endure across seasons.
            </p>

            {/* 3 Value Points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#dfb15b]/20 text-[#4a1122] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4a1122]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">Wide Range of Fabrics</h4>
                  <p className="text-xs text-stone-500">From classic handloom brocades to contemporary high-twist micro-crepes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#dfb15b]/20 text-[#4a1122] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4a1122]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">Expert Craftsmanship</h4>
                  <p className="text-xs text-stone-500">Supervised by multi-generational master weavers and textile engineers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#dfb15b]/20 text-[#4a1122] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4a1122]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">On-Time Global Delivery</h4>
                  <p className="text-xs text-stone-500">Direct courier and container shipments trusted by international garment exporters.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/about')}
                className="px-6 py-3 bg-[#4a1122] hover:bg-[#63182f] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded shadow transition-colors flex items-center gap-2"
              >
                <span>KNOW MORE</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#dfb15b]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. WHY CHOOSE SRI FABRICS                                     */}
      {/* ============================================================ */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto text-center space-y-3 mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4a1122]">
            WHY CHOOSE SRI FABRICS?
          </h2>
          <p className="font-serif italic text-stone-500 text-base">
            More Than Just Fabrics — A Promise of Excellence
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#faf7f2] rounded-lg border border-stone-200/80 hover:border-[#dfb15b] transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#4a1122] text-[#dfb15b] flex items-center justify-center mx-auto">
              <Diamond className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4a1122] text-base">Premium Quality</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Only the finest raw mulberry silk, high-twist viscose, and tested zari filaments used in our fabric warps.
            </p>
          </div>

          <div className="p-6 bg-[#faf7f2] rounded-lg border border-stone-200/80 hover:border-[#dfb15b] transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#4a1122] text-[#dfb15b] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4a1122] text-base">Innovative Designs</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Seasonal trend analysis, proprietary CAD pattern development, and bespoke Jacquard card punches.
            </p>
          </div>

          <div className="p-6 bg-[#faf7f2] rounded-lg border border-stone-200/80 hover:border-[#dfb15b] transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#4a1122] text-[#dfb15b] flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4a1122] text-base">Reliable Bulk Supply</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Consistently supplying fashion houses, boutique designers, and garment manufacturers on schedule.
            </p>
          </div>

          <div className="p-6 bg-[#faf7f2] rounded-lg border border-stone-200/80 hover:border-[#dfb15b] transition-all text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#4a1122] text-[#dfb15b] flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4a1122] text-base">Sustainable Approach</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Eco-friendly zero-discharge wet processing, biodegradable dyes, and safe working conditions.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. EXCLUSIVE MILL COLLECTION — FEATURED TOP + DUPATTA        */}
      {/* ============================================================ */}
      <section className="bg-[#faf7f2] py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-300">
            <div>
              <span className="text-[#4a1122] text-xs font-semibold uppercase tracking-[0.2em]">
                EXCLUSIVE MILL COLLECTION
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#4a1122]">
                FEATURED TOP + DUPATTA
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/top-dupatta')}
              className="text-xs font-semibold uppercase tracking-wider text-[#4a1122] hover:text-[#781934] transition-colors flex items-center gap-1"
            >
              <span>VIEW ALL TOP + DUPATTA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid - 3:4 Portrait Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {featuredTopDupatta.map((fabric) => (
              <FabricCard
                key={fabric.id}
                fabric={fabric}
                onViewDetails={onViewFabric}
                onRequestEnquiry={onRequestEnquiry}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SHOP THE LOOK — CONTINUOUS MOVING VIDEO MARQUEE SECTION       */}
      {/* ============================================================ */}
      <ShopTheLook
        onNavigate={onNavigate}
        onRequestEnquiry={onRequestEnquiry}
      />

      {/* ============================================================ */}
      {/* 8. TESTIMONIALS SECTION ("WHY OUR CLIENTS SAY")               */}
      {/* ============================================================ */}
      <section className="bg-[#380b18] text-[#f7eedf] py-16 px-4 sm:px-8 border-b border-[#dfb15b]/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[#dfb15b] text-xs font-semibold uppercase tracking-[0.25em]">
            WHY OUR CLIENTS SAY
          </span>

          <blockquote className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-white/95 leading-relaxed font-normal">
            {activeTestimonial.testimonial}
          </blockquote>

          {/* Client info */}
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#dfb15b] bg-[#20050c] shadow-lg">
              {activeTestimonial.photoUrl ? (
                <img
                  src={activeTestimonial.photoUrl}
                  alt={activeTestimonial.clientName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-lg font-bold text-[#dfb15b]">
                  {activeTestimonial.clientName.charAt(0)}
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-serif font-bold text-base text-white tracking-wide">
                {activeTestimonial.clientName}
              </h4>
              <p className="text-xs text-[#dfb15b]">
                {activeTestimonial.designation || activeTestimonial.company}
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-[#dfb15b]">
              {[...Array(activeTestimonial.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>

          {/* Testimonial Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 text-[#dfb15b] pt-4">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-1 hover:text-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentTestimonial ? 'w-5 bg-[#dfb15b]' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="p-1 hover:text-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. LATEST FROM OUR BLOG / INSIGHTS                            */}
      {/* ============================================================ */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-200">
            <div>
              <span className="text-[#4a1122] text-xs font-semibold uppercase tracking-[0.2em]">
                INDUSTRY INSIGHTS
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#4a1122]">
                LATEST FROM OUR BLOG
              </h2>
            </div>

            <button
              onClick={() => onNavigate('/blog')}
              className="text-xs font-semibold uppercase tracking-wider text-[#4a1122] hover:text-[#781934] transition-colors flex items-center gap-1"
            >
              <span>VIEW ALL ARTICLES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`grid grid-cols-1 ${blogPosts.length <= 2 ? 'md:grid-cols-2 gap-8' : 'sm:grid-cols-2 lg:grid-cols-4 gap-6'} w-full`}>
            {blogPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate(`/blog/${post.slug}`)}
                className="group bg-[#faf7f2] rounded-2xl overflow-hidden border border-stone-200/90 hover:border-[#dfb15b] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24060d]">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-[#4a1122]/90 backdrop-blur-xs text-[#f7eedf] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-[#dfb15b]/40 shadow-xs">
                    {post.categoryName || 'FABRICS'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold uppercase tracking-wider">
                      <span>{post.author || 'SRI FABRIC'}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span>7 MIN READ</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[#4a1122] group-hover:text-[#781934] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#4a1122]">
                    <span className="group-hover:text-[#781934] transition-colors">Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. NEWSLETTER STRIP (Stay Updated)                           */}
      {/* ============================================================ */}
      <section className="bg-[#2a0610] text-[#f7eedf] py-14 px-4 sm:px-8 border-b border-[#dfb15b]/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-[#dfb15b] text-xs font-semibold uppercase tracking-[0.25em]">
            STAY UPDATED
          </span>
          <h2 className="font-serif text-3xl font-bold text-white">
            Get the Latest Fabrics & Catalogues
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto">
            Subscribe to our newsletter for new seasonal arrivals, swatch books, and international textile export updates.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto pt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your business email address"
              className="flex-1 bg-white text-stone-900 placeholder-stone-400 px-4 py-3 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#dfb15b]"
            />
            <button
              type="submit"
              disabled={newsletterStatus === 'loading'}
              className="px-6 py-3 bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1 shrink-0"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {newsletterStatus === 'success' && (
            <p className="text-xs text-emerald-300 font-medium">{newsletterMsg}</p>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-xs text-red-300 font-medium">{newsletterMsg}</p>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* BRAND SIGNATURE BANNER — SRI FABRICS                         */}
      {/* ============================================================ */}
      <section className="w-full bg-[#2f040f] overflow-hidden border-0">
        <div className="w-full max-w-[2171px] mx-auto">
          <img
            src="/sri2.png"
            alt="SRI FABRICS — Fabrics For A Brighter Tomorrow"
            width={2171}
            height={724}
            className="w-full h-auto block object-contain border-0 outline-none"
            loading="lazy"
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. NEED ASSISTANCE? CTA STRIP (Matching reference)           */}
      {/* ============================================================ */}
      <section className="bg-[#120306] text-white py-10 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left CTA */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-serif text-2xl font-bold text-white">Need Assistance?</h3>
            <p className="text-xs text-white/70">
              Our textile technical advisory team is here to help you source or develop the perfect fabric.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('/contact')}
                className="px-6 py-2.5 bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5"
              >
                <span>CONTACT US</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Direct Info Box */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dfb15b]/20 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#dfb15b]" />
              </div>
              <div className="text-xs">
                <p className="text-white/60">Call / WhatsApp</p>
                <a href="tel:+919875198837" className="font-semibold text-white hover:text-[#dfb15b] transition-colors">
                  +91 98751 98837
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dfb15b]/20 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#dfb15b]" />
              </div>
              <div className="text-xs">
                <p className="text-white/60">Email Us</p>
                <p className="font-semibold text-white break-all">info@srifabrics.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dfb15b]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#dfb15b]" />
              </div>
              <div className="text-xs">
                <p className="text-white/60">Visit Mill</p>
                <p className="font-semibold text-white">Surat, Gujarat, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#1c050d] rounded-xl overflow-hidden border border-[#dfb15b]/50 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-white">
              <h3 className="font-serif text-lg font-bold text-[#dfb15b]">SRI Fabrics Manufacturing Floor Film</h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#dfb15b]/20 border border-[#dfb15b] flex items-center justify-center mx-auto text-[#dfb15b]">
                <Play className="w-8 h-8 fill-current" />
              </div>
              <h4 className="font-serif text-xl font-bold text-white">High-Speed Electronic Jacquard Looms in Operation</h4>
              <p className="text-xs text-stone-300 max-w-lg mx-auto">
                Our Surat manufacturing floor integrates high-precision European rapier looms weaving continuous filament mulberry silk and pure chinons with zero-tension sensors.
              </p>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  onNavigate('/manufacturing');
                }}
                className="px-6 py-2.5 bg-[#dfb15b] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded"
              >
                EXPLORE FULL MANUFACTURING PROCESS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
