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
      id: 101,
      kicker: 'DIRECT MILL TEXTILE SOURCING',
      heading: 'WHOLESALE LUXURY FABRIC YARDAGES',
      subheading: 'Supplying pure mulberry silks, organic muslins, fluid chinons and georgettes directly to couturiers and garment manufacturers.',
      description: 'Verified OEKO-TEX certified reactive dyes, continuous yardage consistency, and custom GSM finishing.',
      buttonText1: 'BROWSE ALL WEAVES',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-fabrics-5.jpg',
      mobileImageUrl: '/slides/hero-fabrics-5.jpg',
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
      id: 201,
      kicker: 'HERITAGE WEAVES & BRIDAL COUTURE',
      heading: 'REGAL DOLA SILK & KATAN SAREES',
      subheading: 'Opulent zari kadwa borders, featherlight tissue drapes, and heritage motifs crafted for bridal & festive royalty.',
      description: 'Fine filament warps with authentic gold and silver metallic zari brocading for timeless bridal heirloom collections.',
      buttonText1: 'EXPLORE SAREE FABRICS',
      buttonLink1: '/sarees',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-sarees-7.jpg',
      mobileImageUrl: '/slides/hero-sarees-7.jpg',
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
      id: 301,
      kicker: 'ETHNIC CO-ORDS & SUIT LENGTHS',
      heading: 'ORGANIC MUSLIN & COTTON KURTI SETS',
      subheading: 'Butter-soft combed cotton, featherlight muslin, and breathable natural blends engineered for premium designer kurti sets.',
      description: 'Pre-shrunk, skin-friendly textiles with high colorfastness and luxurious hand-feel for 2-piece and 3-piece ensembles.',
      buttonText1: 'EXPLORE KURTI FABRICS',
      buttonLink1: '/kurti-set',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-kurti-home.jpg',
      mobileImageUrl: '/slides/hero-kurti-home.jpg',
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
      id: 1,
      kicker: 'PREMIUM TEXTILES',
      heading: 'FABRICS FOR A BRIGHTER TOMORROW',
      subheading: 'Exceptional quality, timeless designs and premium fabrics for every occasion.',
      description: 'Partnering with couture designers, global fashion houses, and garment manufacturers worldwide.',
      buttonText1: 'EXPLORE COLLECTIONS',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST AN ENQUIRY',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-fabrics-home.jpg',
      mobileImageUrl: '/slides/hero-fabrics-home.jpg',
      targetPage: 'home',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 101,
      kicker: 'DIRECT MILL TEXTILE SOURCING',
      heading: 'WHOLESALE LUXURY FABRIC YARDAGES',
      subheading: 'Supplying pure mulberry silks, organic muslins, fluid chinons and georgettes directly to couturiers and garment manufacturers.',
      description: 'Verified OEKO-TEX certified reactive dyes, continuous yardage consistency, and custom GSM finishing.',
      buttonText1: 'BROWSE ALL WEAVES',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-fabrics-5.jpg',
      mobileImageUrl: '/slides/hero-fabrics-5.jpg',
      targetPage: 'fabrics',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 201,
      kicker: 'HERITAGE WEAVES & BRIDAL COUTURE',
      heading: 'REGAL DOLA SILK & KATAN SAREES',
      subheading: 'Opulent zari kadwa borders, featherlight tissue drapes, and heritage motifs crafted for bridal & festive royalty.',
      description: 'Fine filament warps with authentic gold and silver metallic zari brocading for timeless bridal heirloom collections.',
      buttonText1: 'EXPLORE SAREE FABRICS',
      buttonLink1: '/sarees',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-sarees-7.jpg',
      mobileImageUrl: '/slides/hero-sarees-7.jpg',
      targetPage: 'sarees',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 301,
      kicker: 'ETHNIC CO-ORDS & SUIT LENGTHS',
      heading: 'ORGANIC MUSLIN & COTTON KURTI SETS',
      subheading: 'Butter-soft combed cotton, featherlight muslin, and breathable natural blends engineered for premium designer kurti sets.',
      description: 'Pre-shrunk, skin-friendly textiles with high colorfastness and luxurious hand-feel for 2-piece and 3-piece ensembles.',
      buttonText1: 'EXPLORE KURTI FABRICS',
      buttonLink1: '/kurti-set',
      buttonText2: 'REQUEST SAMPLE SWATCH',
      buttonLink2: '/enquiry',
      imageUrl: '/slides/hero-kurti-home.jpg',
      mobileImageUrl: '/slides/hero-kurti-home.jpg',
      targetPage: 'kurti-set',
      sortOrder: 4,
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
      sortOrder: 5,
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
  if (typeof window === 'undefined') return;
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

  const [hasMobileError, setHasMobileError] = useState(false);
  const [hasImgError, setHasImgError] = useState(false);

  // Reset error states whenever the slide URLs change
  useEffect(() => {
    setHasMobileError(false);
    setHasImgError(false);
  }, [slide.imageUrl, slide.mobileImageUrl]);

  const hasDistinctMobile = Boolean(
    slide.mobileImageUrl &&
    slide.mobileImageUrl.trim() &&
    slide.mobileImageUrl !== slide.imageUrl &&
    !hasMobileError
  );

  // If mobile source failed or is absent, attempt desktop image before resorting to default static asset
  const resolvedDesktopSrc = hasImgError
    ? defaultFallback
    : (slide.imageUrl || defaultFallback);

  return (
    <div className="w-full h-full relative">
      {hasDistinctMobile ? (
        <picture className="w-full h-full block">
          <source
            media="(max-width: 768px)"
            srcSet={slide.mobileImageUrl!}
          />
          <img
            src={resolvedDesktopSrc}
            alt={slide.heading || 'Sri Fabrics Luxury Textiles'}
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            onError={() => {
              // First unmount mobile source to try desktop image
              if (!hasMobileError) {
                setHasMobileError(true);
              } else {
                setHasImgError(true);
              }
            }}
          />
        </picture>
      ) : (
        <img
          src={
            hasImgError
              ? defaultFallback
              : (slide.mobileImageUrl && !hasMobileError ? slide.mobileImageUrl : slide.imageUrl) || defaultFallback
          }
          alt={slide.heading || 'Sri Fabrics Luxury Textiles'}
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          onError={() => setHasImgError(true)}
        />
      )}
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
    const initial = (cached && cached.length > 0) ? cached : (FALLBACK_SLIDES[targetPage] || FALLBACK_SLIDES.home);
    preloadSlideImages(initial);
    return initial;
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Keep track of the current slides JSON to prevent unnecessary re-renders
  const currentJsonRef = useRef<string>(JSON.stringify(slides));

  // Eagerly preload fallback slides for all pages immediately
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
    window.addEventListener('focus', handleInstantUpdate);

    // Periodic background sync every 8 seconds so any update appears automatically without refresh
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchSlides(false);
      }
    }, 8000);

    return () => {
      window.removeEventListener('hero-slides-updated', handleInstantUpdate);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleInstantUpdate);
      clearInterval(syncInterval);
    };
  }, [targetPage, fetchSlides]);

  // Automatic rotation with strict 2-second delay per slide (unconditional across all sections)
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
        (activeSlide.sortOrder === 1 ? '/fabrics' :
         activeSlide.sortOrder === 2 ? '/sarees' :
         activeSlide.sortOrder === 3 ? '/kurti-set' : '/fabrics');

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

  // Section height styling:
  // Engineered so the hero slide fits in the screen viewport perfectly on all devices
  const heightClasses =
    variant === 'compact'
      ? 'min-h-[420px] sm:min-h-[460px] lg:h-[calc(75vh-80px)] lg:min-h-[480px]'
      : 'h-[calc(100svh-90px)] sm:h-[calc(100svh-96px)] lg:h-[calc(100vh-98px)] max-h-[calc(100vh-98px)] min-h-[440px]';

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={handleSlideClick}
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
      onTouchStart={(e) => {
        setIsHovered(true);
        setTouchStart(e.targetTouches[0].clientX);
      }}
      onTouchEnd={(e) => {
        setIsHovered(false);
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;
        if (diff > 50 && slides.length > 1) {
          // Swiped left -> next slide
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        } else if (diff < -50 && slides.length > 1) {
          // Swiped right -> prev slide
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        }
        setTouchStart(null);
      }}
    >
      {/* Background Images for all slides with smooth cross-fade (Fixed, no zoom/scale animation, 100% visible) */}
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

      {/* Subtle Slide Indicators at bottom center (pure visual dots, non-button) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
          {slides.map((_, idx) => (
            <span
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-7 sm:w-9 bg-[#dfb15b] shadow-md shadow-black/50'
                  : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

