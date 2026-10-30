import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HeroSlide } from '../types/index.ts';

interface HeroSliderProps {
  targetPage: 'home' | 'fabrics' | 'sarees' | 'kurti-set';
  autoPlayDelay?: number;
  onNavigate?: (path: string) => void;
  onRequestEnquiry?: (fabricName?: string) => void;
  onScrollToContent?: () => void;
  variant?: 'screen-fit' | 'full' | 'compact';
}

const FALLBACK_SLIDES: Record<string, HeroSlide[]> = {
  fabrics: [
    {
      id: 5,
      kicker: 'DIRECT MILL TEXTILE SOURCING',
      heading: 'WHOLESALE LUXURY FABRIC YARDAGES',
      subheading: 'Supplying pure mulberry silks, organic muslins, fluid chinons and georgettes directly to couturiers and garment manufacturers.',
      description: 'Verified OEKO-TEX certified reactive dyes, continuous yardage consistency, and custom GSM finishing.',
      buttonText1: 'BROWSE ALL WEAVES',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-fabrics-5.jpg',
      mobileImageUrl: '/slides/hero-mobile-5.jpg',
      targetPage: 'fabrics',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 102,
      kicker: 'PRECISION WEAVING & FINISHING',
      heading: 'PURE EMBROIDERED & DYED BASE FABRICS',
      subheading: 'Over 14 premium weave varieties engineered for optimal drape, tensile warp strength, and zero pilling.',
      description: 'Minimum order quantities starting at just 50 metres per shade with bespoke laboratory dip approvals in 72 hours.',
      buttonText1: 'VIEW SPECIFICATIONS',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST AN ENQUIRY',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-fabrics-2.jpg',
      mobileImageUrl: '/slides/hero-fabrics-2.jpg',
      targetPage: 'fabrics',
      sortOrder: 2,
      isActive: true,
    },
  ],
  sarees: [
    {
      id: 7,
      kicker: 'HERITAGE WEAVES & BRIDAL COUTURE',
      heading: 'REGAL DOLA SILK & KATAN SAREES',
      subheading: 'Opulent zari kadwa borders, featherlight tissue drapes, and heritage motifs crafted for bridal & festive royalty.',
      description: 'Fine filament warps with authentic gold and silver metallic zari brocading for timeless bridal heirloom collections.',
      buttonText1: 'EXPLORE SAREE FABRICS',
      buttonLink1: '/sarees',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-sarees-7.jpg',
      mobileImageUrl: '/slides/hero-mobile-7.jpg',
      targetPage: 'sarees',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 202,
      kicker: 'CONTEMPORARY DRAPES',
      heading: 'ORGANZA & MULMUL SAREE TEXTILES',
      subheading: 'Translucent glass organzas, whisper-soft mul cottons, and high-twist georgettes designed for modern saree silhouettes.',
      description: 'Breathable, lightweight falls with crisp pleating resilience and digital floral print compatibility.',
      buttonText1: 'VIEW SAREE WEAVES',
      buttonLink1: '/sarees',
      buttonText2: 'REQUEST AN ENQUIRY',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-sarees-2.jpg',
      mobileImageUrl: '/slides/hero-sarees-2.jpg',
      targetPage: 'sarees',
      sortOrder: 2,
      isActive: true,
    },
  ],
  'kurti-set': [
    {
      id: 21,
      kicker: 'ETHNIC CO-ORDS & SUIT LENGTHS',
      heading: 'ORGANIC MUSLIN & COTTON KURTI SETS',
      subheading: 'Butter-soft combed cotton, featherlight muslin, and breathable natural blends engineered for premium designer kurti sets.',
      description: 'Pre-shrunk, skin-friendly textiles with high colorfastness and luxurious hand-feel for 2-piece and 3-piece ensembles.',
      buttonText1: 'EXPLORE KURTI FABRICS',
      buttonLink1: '/kurti-set',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-desktop-21.jpg',
      mobileImageUrl: '/slides/hero-mobile-21.jpg',
      targetPage: 'kurti-set',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 302,
      kicker: 'FESTIVE SILHOUETTES & ANARKALIS',
      heading: 'ROYAL CHINON & VISCOSE ENSEMBLES',
      subheading: 'Fluid, lustrous drapery with graceful twirl and shimmer — tailored for embroidered kurtis, palazzos, and dupattas.',
      description: 'Engineered specifically for heavy thread embroidery, mirror embellishment, and luxury pret labels.',
      buttonText1: 'VIEW ENSEMBLE FABRICS',
      buttonLink1: '/kurti-set',
      buttonText2: 'REQUEST AN ENQUIRY',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-kurti-2.jpg',
      mobileImageUrl: '/slides/hero-kurti-2.jpg',
      targetPage: 'kurti-set',
      sortOrder: 2,
      isActive: true,
    },
  ],
  home: [
    {
      id: 5,
      kicker: 'DIRECT MILL TEXTILE SOURCING',
      heading: 'WHOLESALE LUXURY FABRIC YARDAGES',
      subheading: 'Supplying pure mulberry silks, organic muslins, fluid chinons and georgettes directly to couturiers and garment manufacturers.',
      description: 'Verified OEKO-TEX certified reactive dyes, continuous yardage consistency, and custom GSM finishing.',
      buttonText1: 'BROWSE ALL WEAVES',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-fabrics-5.jpg',
      mobileImageUrl: '/slides/hero-mobile-5.jpg',
      targetPage: 'fabrics',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 7,
      kicker: 'HERITAGE WEAVES & BRIDAL COUTURE',
      heading: 'REGAL DOLA SILK & KATAN SAREES',
      subheading: 'Opulent zari kadwa borders, featherlight tissue drapes, and heritage motifs crafted for bridal & festive royalty.',
      description: 'Fine filament warps with authentic gold and silver metallic zari brocading for timeless bridal heirloom collections.',
      buttonText1: 'EXPLORE SAREE FABRICS',
      buttonLink1: '/sarees',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-sarees-7.jpg',
      mobileImageUrl: '/slides/hero-mobile-7.jpg',
      targetPage: 'sarees',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 20,
      kicker: 'PREMIUM TEXTILES',
      heading: 'FABRICS FOR A BRIGHTER TOMORROW',
      subheading: 'Exceptional quality, timeless designs and premium fabrics for every occasion.',
      description: 'Partnering with couture designers, global fashion houses, and garment manufacturers worldwide.',
      buttonText1: 'EXPLORE COLLECTIONS',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST AN ENQUIRY',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-desktop-20.jpg',
      mobileImageUrl: '/slides/hero-mobile-20.jpg',
      targetPage: 'home',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 21,
      kicker: 'ETHNIC CO-ORDS & SUIT LENGTHS',
      heading: 'FABRICS FOR A BRIGHTER TOMORROW',
      subheading: 'Supplying pure mulberry silks, organic muslins, fluid chinons and georgettes directly to couturiers.',
      description: 'Pre-shrunk, skin-friendly textiles with high colorfastness and luxurious hand-feel.',
      buttonText1: 'EXPLORE COLLECTIONS',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-desktop-21.jpg',
      mobileImageUrl: '/slides/hero-mobile-21.jpg',
      targetPage: 'kurti-set',
      sortOrder: 4,
      isActive: true,
    },
  ],
};

// Global memory cache to eliminate repeated network fetches across page transitions
const slidesCache: Record<string, HeroSlide[]> = {};

// Retain preloaded Image references in memory to prevent browser garbage collection from aborting downloads
const preloadedImageInstances = new Set<HTMLImageElement>();

// Helper to eagerly preload images into browser cache for instant, zero-delay display
const preloadSlideImages = (slideList: HeroSlide[]) => {
  if (typeof window === 'undefined' || !Array.isArray(slideList)) return;
  slideList.forEach((slide) => {
    if (slide.imageUrl && !slide.imageUrl.startsWith('data:')) {
      const img = new Image();
      img.src = slide.imageUrl;
      preloadedImageInstances.add(img);
    }
    if (slide.mobileImageUrl && slide.mobileImageUrl !== slide.imageUrl && !slide.mobileImageUrl.startsWith('data:')) {
      const mImg = new Image();
      mImg.src = slide.mobileImageUrl;
      preloadedImageInstances.add(mImg);
    }
  });
};

const SlideImageRenderer: React.FC<{
  slide: HeroSlide;
  isPriority: boolean;
}> = ({ slide, isPriority }) => {
  const defaultFallback =
    slide.targetPage === 'kurti-set'
      ? '/slides/hero-kurti-home.jpg'
      : slide.targetPage === 'sarees'
      ? '/slides/hero-sarees-7.jpg'
      : '/slides/hero-fabrics-5.jpg';

  const [mobileError, setMobileError] = useState(false);
  const [desktopError, setDesktopError] = useState(false);

  useEffect(() => {
    setMobileError(false);
    setDesktopError(false);
  }, [slide.imageUrl, slide.mobileImageUrl]);

  const mobileSrc = (!mobileError && slide.mobileImageUrl) || slide.imageUrl || defaultFallback;
  const desktopSrc = (!desktopError && slide.imageUrl) || slide.mobileImageUrl || defaultFallback;

  return (
    <div className="w-full h-full relative">
      {/* Mobile view image (screen < 768px): clean portrait mobile image with instant rendering */}
      <img
        src={mobileSrc}
        alt={slide.heading || 'Sri Fabrics Luxury Textiles'}
        className="block md:hidden w-full h-full object-cover object-center"
        loading={isPriority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => {
          if (!mobileError) setMobileError(true);
        }}
      />
      {/* Desktop view image (screen >= 768px): clean landscape desktop image */}
      <img
        src={desktopSrc}
        alt={slide.heading || 'Sri Fabrics Luxury Textiles'}
        className="hidden md:block w-full h-full object-cover object-center"
        loading={isPriority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => {
          if (!desktopError) setDesktopError(true);
        }}
      />
    </div>
  );
};

export const HeroSlider: React.FC<HeroSliderProps> = ({
  targetPage,
  autoPlayDelay = 2000,
  onNavigate,
  onRequestEnquiry,
  onScrollToContent,
  variant = 'screen-fit',
}) => {
  // Initialize with cached slides or instant fallback so the slide renders instantaneously (0ms paint)
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    const cached = slidesCache[targetPage];
    const initial = cached && cached.length > 0 ? cached : FALLBACK_SLIDES[targetPage] || FALLBACK_SLIDES.home;
    preloadSlideImages(initial);
    return initial;
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Touch tracking refs to accurately differentiate swipes from clicks
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipeRef = useRef(false);

  // Keep track of current slides JSON to prevent unnecessary re-renders
  const currentJsonRef = useRef<string>(JSON.stringify(slides));

  // Eagerly preload fallback slides immediately
  useEffect(() => {
    Object.values(FALLBACK_SLIDES).forEach((list) => preloadSlideImages(list));
  }, []);

  // Fetch dynamic hero slides with stale-while-revalidate and change detection
  const fetchSlides = useCallback((forceFresh = false) => {
    const url = `/api/hero-slides?page=${encodeURIComponent(targetPage)}${forceFresh ? `&_t=${Date.now()}` : ''}`;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return null;
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const newJson = JSON.stringify(data);
          if (newJson !== currentJsonRef.current) {
            currentJsonRef.current = newJson;
            slidesCache[targetPage] = data;
            setSlides(data);
            preloadSlideImages(data);
          }
        } else {
          const fallback = FALLBACK_SLIDES[targetPage] || FALLBACK_SLIDES.home;
          const fallbackJson = JSON.stringify(fallback);
          if (fallbackJson !== currentJsonRef.current) {
            currentJsonRef.current = fallbackJson;
            slidesCache[targetPage] = fallback;
            setSlides(fallback);
            preloadSlideImages(fallback);
          }
        }
      })
      .catch((err) => {
        console.warn('Hero slides note (using active fallback):', err?.message || err);
      });
  }, [targetPage]);

  // Initial load + immediate background revalidate
  useEffect(() => {
    if (slidesCache[targetPage] && slidesCache[targetPage].length > 0) {
      setSlides(slidesCache[targetPage]);
      currentJsonRef.current = JSON.stringify(slidesCache[targetPage]);
      preloadSlideImages(slidesCache[targetPage]);
    }
    fetchSlides(false);
  }, [targetPage, fetchSlides]);

  // Real-time synchronization: listen to instant update events from Admin or other tabs
  useEffect(() => {
    const handleInstantUpdate = () => {
      delete slidesCache[targetPage];
      fetchSlides(true);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sri_slides_updated') {
        delete slidesCache[targetPage];
        fetchSlides(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSlides(false);
      }
    };

    window.addEventListener('hero-slides-updated', handleInstantUpdate);
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Background sync every 15 seconds
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchSlides(false);
      }
    }, 15000);

    return () => {
      window.removeEventListener('hero-slides-updated', handleInstantUpdate);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(syncInterval);
    };
  }, [targetPage, fetchSlides]);

  // Automatic rotation with strict 2-second delay per slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayDelay);
    return () => clearTimeout(timer);
  }, [currentSlide, slides.length, autoPlayDelay]);

  const activeSlide = slides[currentSlide] || slides[0];

  // Click on the hero slide redirects directly to that particular page section
  const handleSlideClick = () => {
    if (targetPage === 'home') {
      const dest =
        activeSlide.buttonLink1 ||
        (activeSlide.targetPage && activeSlide.targetPage !== 'home' ? `/${activeSlide.targetPage}` : null) ||
        (activeSlide.sortOrder === 1
          ? '/fabrics'
          : activeSlide.sortOrder === 2
          ? '/sarees'
          : activeSlide.sortOrder === 3
          ? '/kurti-set'
          : '/fabrics');

      if (dest) {
        if (dest.startsWith('#')) {
          document.querySelector(dest)?.scrollIntoView({ behavior: 'smooth' });
        } else if (onNavigate) {
          onNavigate(dest);
        }
      }
    } else {
      // On category page (fabrics, sarees, kurti-set), redirect to that page section
      if (onScrollToContent) {
        onScrollToContent();
      } else {
        const el =
          document.getElementById('catalogue-filter-bar') ||
          document.getElementById('catalogue-content');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (onNavigate && activeSlide.buttonLink1) {
          onNavigate(activeSlide.buttonLink1);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchStartYRef.current = e.targetTouches[0].clientY;
    isSwipeRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = Math.abs(e.targetTouches[0].clientX - touchStartXRef.current);
    const diffY = Math.abs(e.targetTouches[0].clientY - touchStartYRef.current);
    if (diffX > 10 || diffY > 10) {
      isSwipeRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsHovered(false);
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(diffX) > 40 && slides.length > 1) {
      if (diffX > 0) {
        // Swiped left -> next slide
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else {
        // Swiped right -> prev slide
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  const handleClick = () => {
    if (isSwipeRef.current) {
      // Ignore click if this gesture was a touch swipe
      isSwipeRef.current = false;
      return;
    }
    handleSlideClick();
  };

  // Section height styling:
  // Mobile: fits cleanly in the mobile viewport accounting for mobile header
  // Desktop: matches full screen luxury editorial banner
  const heightClasses =
    variant === 'compact'
      ? 'min-h-[380px] sm:min-h-[440px] lg:h-[calc(75vh-80px)] lg:min-h-[480px]'
      : 'h-[calc(100vh-125px)] sm:h-[calc(100vh-96px)] lg:h-[calc(100vh-98px)] min-h-[400px] sm:min-h-[440px] max-h-[820px]';

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSlideClick();
        }
      }}
      className={`relative ${heightClasses} bg-[#1a050b] text-[#f7eedf] flex items-center overflow-hidden border-b border-[#dfb15b]/20 select-none cursor-pointer group`}
      title="Click to explore collection"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images for all slides with smooth cross-fade */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {slide.imageUrl || slide.mobileImageUrl ? (
              <SlideImageRenderer slide={slide} isPriority={idx === 0} />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#24060d] via-[#3a0b16] to-[#120306]" />
            )}
          </div>
        ))}
      </div>

      {/* Subtle Slide Indicators at bottom center */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`h-2 sm:h-2 rounded-full transition-all duration-300 cursor-pointer p-0 focus:outline-none ${
                idx === currentSlide
                  ? 'w-7 sm:w-9 bg-[#dfb15b] shadow-md shadow-black/60'
                  : 'w-2 sm:w-2.5 bg-white/60 hover:bg-white/90'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
