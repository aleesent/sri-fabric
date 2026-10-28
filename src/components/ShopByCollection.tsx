import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fabric } from '../types/index.ts';

export interface CollectionCardItem {
  id: string;
  name: string;
  link: string;
  slug?: string;
  imageUrl: string;
  subtitle: string;
  tag?: string;
}

export const FALLBACK_COLLECTION_ITEMS: CollectionCardItem[] = [
  {
    id: 'dresses',
    name: 'DRESSES',
    link: '/dresses',
    imageUrl: '/slides/hero-kurti-2.jpg',
    subtitle: 'Luxury Ethnic Ensembles',
    tag: 'Collection',
  },
  {
    id: 'sarees',
    name: 'SAREES',
    link: '/sarees',
    imageUrl: '/slides/hero-sarees-7.jpg',
    subtitle: 'Royal Banarasi & Zari Weaves',
    tag: 'Collection',
  },
  {
    id: 'top-dupatta',
    name: 'TOP + DUPATTA',
    link: '/top-dupatta',
    imageUrl: '/slides/hero-kurti-home.jpg',
    subtitle: 'Artisanal Printed Suit Lengths',
    tag: 'Collection',
  },
  {
    id: 'fabrics',
    name: 'FABRICS',
    link: '/fabrics',
    imageUrl: '/slides/hero-fabrics-home.jpg',
    subtitle: 'Direct Mill Silk Yardages',
    tag: 'Collection',
  },
];

interface ShopByCollectionProps {
  onNavigate: (path: string) => void;
  onViewFabric?: (slug: string) => void;
  products?: Fabric[];
}

export const ShopByCollection: React.FC<ShopByCollectionProps> = ({
  onNavigate,
  onViewFabric,
  products = [],
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isUserInteractingRef = useRef(false);
  const userInteractionTimeoutRef = useRef<any>(null);

  const [randomItems, setRandomItems] = useState<CollectionCardItem[]>(FALLBACK_COLLECTION_ITEMS);

  // Helper to randomize and transform products into collection cards
  const selectRandomProducts = useCallback((fabricList: Fabric[]) => {
    if (!Array.isArray(fabricList) || fabricList.length === 0) {
      return FALLBACK_COLLECTION_ITEMS;
    }

    // Shuffle and pick 8 random products
    const shuffled = [...fabricList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);

    return selected.map((fabric) => ({
      id: `fabric-${fabric.id}`,
      name: fabric.name,
      link: `/fabrics/${fabric.slug}`,
      slug: fabric.slug,
      imageUrl: fabric.primaryImageUrl || '/slides/hero-fabrics-home.jpg',
      subtitle: fabric.fabricType || 'Direct Mill Weave',
      tag: fabric.designId || fabric.fabricType || 'Bespoke Weave',
    }));
  }, []);

  // Update items when products prop updates, or fetch from API if not provided
  useEffect(() => {
    if (products && products.length > 0) {
      setRandomItems(selectRandomProducts(products));
      return;
    }

    // Fetch existing fabrics from API as standalone fallback
    let isMounted = true;
    fetch('/api/fabrics')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRandomItems(selectRandomProducts(data));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [products, selectRandomProducts]);

  // Duplicate the random products twice for seamless infinite continuous scrolling
  const carouselCards = [...randomItems, ...randomItems];

  // Helper to calculate card advance step width (card width + responsive gap)
  const getStepWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 240;
    const firstCard = el.querySelector('[data-category-card]') as HTMLElement;
    if (firstCard) {
      const style = window.getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || '16') || 16;
      return firstCard.offsetWidth + gap;
    }
    return 240;
  }, []);

  // Seamless infinite loop boundary check
  const checkInfiniteBoundary = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 2;
    if (singleSetWidth <= 0) return;

    // If scrolled past 1.5 sets, wrap backward by 1 full set seamlessly
    if (el.scrollLeft >= singleSetWidth * 1.5) {
      el.scrollLeft -= singleSetWidth;
    } else if (el.scrollLeft <= singleSetWidth * 0.1) {
      // If scrolled before 0.1 set, wrap forward by 1 full set seamlessly
      el.scrollLeft += singleSetWidth;
    }
  }, []);

  // Initialize scroll position to center of set on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const singleSetWidth = el.scrollWidth / 2;
      if (singleSetWidth > 0 && el.scrollLeft < 10) {
        el.scrollLeft = singleSetWidth * 0.5;
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [randomItems]);

  // Smooth auto-advancing interval: advances 1 card every 3.2s
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isHovered) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el || isUserInteractingRef.current) return;
      const step = getStepWidth();
      el.scrollBy({ left: step, behavior: 'smooth' });
    }, 3200);

    return () => clearInterval(interval);
  }, [isHovered, getStepWidth]);

  // Scroll listener for seamless boundary normalization
  const handleScroll = () => {
    checkInfiniteBoundary();
    isUserInteractingRef.current = true;
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 800);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = scrollRef.current;
    if (!el) return;
    const step = getStepWidth();
    el.scrollBy({ left: -step, behavior: 'smooth' });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = scrollRef.current;
    if (!el) return;
    const step = getStepWidth();
    el.scrollBy({ left: step, behavior: 'smooth' });
  };

  const handleItemClick = (item: CollectionCardItem) => {
    if (item.slug && onViewFabric) {
      onViewFabric(item.slug);
    } else {
      onNavigate(item.link);
    }
  };

  return (
    <section className="bg-[#FAF7F2] py-10 sm:py-14 w-full overflow-hidden relative select-none border-b border-stone-200">
      {/* Centered Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-7 sm:mb-9 px-4">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-900 tracking-tight leading-tight">
          Shop by collection
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-500 font-normal tracking-wide max-w-xl mx-auto">
          Explore our curated ranges of fine silks, artisanal weaves, and luxury ethnic ensembles.
        </p>
      </div>

      {/* Full-Width Flexible Carousel Container */}
      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsHovered(false), 2000);
        }}
      >
        {/* Subtle Circular Previous Arrow Control */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous collection"
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-300/80 shadow-md hover:shadow-xl flex items-center justify-center transition-all cursor-pointer z-30 backdrop-blur-sm focus:outline-none hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800" />
        </button>

        {/* Subtle Circular Next Arrow Control */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next collection"
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-300/80 shadow-md hover:shadow-xl flex items-center justify-center transition-all cursor-pointer z-30 backdrop-blur-sm focus:outline-none hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800" />
        </button>

        {/* Full-Width Flexible Infinite Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 sm:gap-4.5 overflow-x-auto scrollbar-none py-3 px-3 sm:px-6 lg:px-10 scroll-smooth touch-pan-x w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {carouselCards.map((item, idx) => {
            const uniqueKey = `${item.id}-${idx}`;
            return (
              <div
                key={uniqueKey}
                data-category-card
                onClick={() => handleItemClick(item)}
                className="group relative cursor-pointer shrink-0 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-300/60 hover:border-[#dfb15b] w-[165px] sm:w-[200px] lg:w-[230px] xl:w-[250px] aspect-[9/16] select-none"
              >
                {/* Large Vertical Rectangular Image */}
                <div className="absolute inset-0 w-full h-full bg-[#24060d] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.src.includes('hero-fabrics-home.jpg')) {
                        img.src = '/slides/hero-fabrics-home.jpg';
                      }
                    }}
                  />
                </div>

                {/* Subtle dark gradient at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Elegant Text Overlaid Near Bottom */}
                <div className="absolute bottom-3.5 sm:bottom-5 inset-x-0 px-3 sm:px-4 text-center pointer-events-none">
                  {item.subtitle && (
                    <span className="block text-[10px] sm:text-[11px] font-medium tracking-widest text-[#dfb15b] uppercase mb-1 truncate drop-shadow-sm">
                      {item.subtitle}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-sm sm:text-base lg:text-lg text-white tracking-wider uppercase drop-shadow-md line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
