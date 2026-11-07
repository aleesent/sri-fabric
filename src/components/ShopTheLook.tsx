import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShopTheLookItem } from '../types/index.ts';
import { DEFAULT_SHOP_THE_LOOK_ITEMS } from '../data/shopTheLook.ts';

interface ShopTheLookProps {
  onNavigate?: (path: string) => void;
  onRequestEnquiry?: (fabricName?: string) => void;
}

interface ReelCardProps {
  item: ShopTheLookItem;
  onClick: () => void;
  isNearViewport: boolean;
}

const isImage = (url?: string) => {
  if (!url) return false;
  return !url.endsWith('.mp4') && !url.includes('.mp4') && !url.includes('/video/');
};

const ReelCard: React.FC<ReelCardProps> = ({ item, onClick, isNearViewport }) => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isCardInView, setIsCardInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const posterImage = isImage(item.posterUrl) ? item.posterUrl : undefined;

  // Individual card intersection observer: only buffer video when card is approaching view
  useEffect(() => {
    if (!isNearViewport) return;
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsCardInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsCardInView(true);
          const video = videoRef.current;
          if (video) {
            video.muted = true;
            video.defaultMuted = true;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                video.muted = true;
                video.play().catch(() => {});
              });
            }
          }
        } else {
          // Pause offscreen video to save bandwidth & GPU
          const video = videoRef.current;
          if (video && !video.paused) {
            video.pause();
          }
        }
      },
      { rootMargin: '300px 100px', threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isNearViewport]);

  useEffect(() => {
    if (isCardInView && !videoError) {
      const video = videoRef.current;
      if (!video) return;
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }
  }, [isCardInView, item.videoUrl, videoError]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="relative shrink-0 w-[215px] sm:w-[235px] md:w-[250px] aspect-[9/16] rounded-[16px] sm:rounded-[18px] overflow-hidden bg-[#1f0910] shadow-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]"
      style={{ userSelect: 'none' }}
    >
      {/* Background Poster Image - Instant zero-CLS display with native lazy loading */}
      {posterImage && (
        <img
          src={posterImage}
          alt={item.title}
          width={250}
          height={444}
          className={`absolute inset-0 w-full h-full object-cover rounded-[16px] sm:rounded-[18px] pointer-events-none transition-opacity duration-500 ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* HTML5 Autoplaying Looping Fashion Video - Lazy loaded when card nears viewport */}
      {isNearViewport && isCardInView && !videoError && (
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={posterImage}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          onPlaying={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover rounded-[16px] sm:rounded-[18px] pointer-events-none transition-opacity duration-500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

export const ShopTheLook: React.FC<ShopTheLookProps> = ({ onNavigate, onRequestEnquiry }) => {
  const [items, setItems] = useState<ShopTheLookItem[]>(DEFAULT_SHOP_THE_LOOK_ITEMS);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const set1Ref = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const [isHovered, setIsHovered] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with API while retaining instant default loading
  useEffect(() => {
    let isMounted = true;
    fetch('/api/shop-the-look')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const active = data.filter((item) => item.isActive !== false);
          if (active.length > 0) {
            setItems(active);
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Intersection Observer to lazy load fashion videos only when section nears viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initialize scroll position to Set 2 (middle set) so users can scroll left or right infinitely
  useEffect(() => {
    const el = scrollRef.current;
    const set1 = set1Ref.current;
    if (!el || !set1) return;

    const timer = setTimeout(() => {
      const setWidth = set1.offsetWidth;
      if (setWidth > 0) {
        el.scrollLeft = setWidth;
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [items]);

  // Handle continuous smooth infinite marquee drift
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const SPEED = 38; // Pixels per second for smooth, luxurious drift

    const tick = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const el = scrollRef.current;
      const set1 = set1Ref.current;

      if (el && set1) {
        const setWidth = set1.offsetWidth;
        const prefersReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!isHovered && !isInteractingRef.current && !prefersReducedMotion && setWidth > 0) {
          el.scrollLeft += SPEED * dt;

          // Infinite seamless right-to-left wrap
          if (el.scrollLeft >= setWidth * 2) {
            el.scrollLeft -= setWidth;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += setWidth;
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  // Manual scroll event wrap check
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    const set1 = set1Ref.current;
    if (!el || !set1) return;

    const setWidth = set1.offsetWidth;
    if (setWidth > 0) {
      if (el.scrollLeft >= setWidth * 2) {
        el.scrollLeft -= setWidth;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += setWidth;
      }
    }
  }, []);

  // Desktop Mouse Drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    isInteractingRef.current = true;
    startXRef.current = e.pageX;
    scrollLeftStartRef.current = el.scrollLeft;
    dragDistanceRef.current = 0;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault();
    const deltaX = e.pageX - startXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);
    el.scrollLeft = scrollLeftStartRef.current - deltaX;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1200);
  };

  // Mobile Touch Swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    isInteractingRef.current = true;
    startXRef.current = e.touches[0].pageX;
    scrollLeftStartRef.current = el.scrollLeft;
    dragDistanceRef.current = 0;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const deltaX = e.touches[0].pageX - startXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);
  };

  const handleTouchEnd = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500);
  };

  const handleCardClick = () => {
    // If user dragged more than 10px, ignore click (it was a swipe drag)
    if (dragDistanceRef.current > 10) return;

    if (onNavigate) {
      onNavigate('/sarees');
    } else {
      window.location.href = '/sarees';
    }
  };

  return (
    <section ref={sectionRef} className="bg-[#18060b] py-14 sm:py-20 lg:py-24 overflow-hidden relative select-none">
      {/* Centered Master White Serif Heading */}
      <div className="text-center mb-8 sm:mb-12 md:mb-14 px-4">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-normal leading-tight">
          Shop The Look
        </h2>
      </div>

      {/* Infinite Horizontal Autoplay Video Carousel */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUp();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
        className="w-full overflow-x-auto scrollbar-none flex cursor-grab active:cursor-grabbing pb-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="flex items-center shrink-0">
          {/* Set 1 (Used to compute exact width) */}
          <div ref={set1Ref} className="flex items-center gap-4 sm:gap-[18px] pr-4 sm:pr-[18px] shrink-0">
            {items.map((item) => (
              <ReelCard
                key={`set1-${item.id}`}
                item={item}
                onClick={handleCardClick}
                isNearViewport={isNearViewport}
              />
            ))}
          </div>

          {/* Set 2 (Middle set where user starts) */}
          <div className="flex items-center gap-4 sm:gap-[18px] pr-4 sm:pr-[18px] shrink-0">
            {items.map((item) => (
              <ReelCard
                key={`set2-${item.id}`}
                item={item}
                onClick={handleCardClick}
                isNearViewport={isNearViewport}
              />
            ))}
          </div>

          {/* Set 3 (Buffer set for forward wrapping) */}
          <div className="flex items-center gap-4 sm:gap-[18px] pr-4 sm:pr-[18px] shrink-0">
            {items.map((item) => (
              <ReelCard
                key={`set3-${item.id}`}
                item={item}
                onClick={handleCardClick}
                isNearViewport={isNearViewport}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
