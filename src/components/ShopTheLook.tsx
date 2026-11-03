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
}

const ReelCard: React.FC<ReelCardProps> = ({ item, onClick }) => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative shrink-0 w-[215px] sm:w-[235px] md:w-[250px] aspect-[9/16] rounded-[16px] sm:rounded-[18px] overflow-hidden bg-[#1f0910] shadow-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]"
      style={{ userSelect: 'none' }}
    >
      {/* Background Poster Image */}
      {item.posterUrl && (
        <img
          src={item.posterUrl}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover rounded-[16px] sm:rounded-[18px] pointer-events-none"
          loading="eager"
        />
      )}

      {/* HTML5 Autoplaying Looping Fashion Video */}
      {!videoError && (
        <video
          src={item.videoUrl}
          poster={item.posterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover rounded-[16px] sm:rounded-[18px] pointer-events-none"
        />
      )}
    </div>
  );
};

export const ShopTheLook: React.FC<ShopTheLookProps> = ({ onNavigate, onRequestEnquiry }) => {
  const [items, setItems] = useState<ShopTheLookItem[]>(DEFAULT_SHOP_THE_LOOK_ITEMS);
  const scrollRef = useRef<HTMLDivElement>(null);
  const set1Ref = useRef<HTMLDivElement>(null);

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
    <section className="bg-[#18060b] py-14 sm:py-20 lg:py-24 overflow-hidden relative select-none">
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
