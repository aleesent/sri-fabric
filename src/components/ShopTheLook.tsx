import React, { useState, useEffect } from 'react';
import { ShopTheLookItem } from '../types/index.ts';
import { DEFAULT_SHOP_THE_LOOK_ITEMS } from '../data/shopTheLook.ts';

interface ShopTheLookProps {
  onNavigate?: (path: string) => void;
  onRequestEnquiry?: (fabricName?: string) => void;
}

/**
 * Ensures Cloudinary video URLs include f_auto,q_auto transformations
 * for fast delivery, modern codecs, and buffer-free streaming.
 */
export function ensureOptimizedCloudinaryVideoUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('cloudinary.com') && url.includes('/video/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/video/upload/', '/video/upload/f_auto,q_auto/');
    }
  }
  return url;
}

/**
 * Generates lightweight, instant-loading poster thumbnail images from Cloudinary video keyframes
 * with f_auto,q_auto,so_0 (frame at 0 seconds) converted to .jpg.
 */
export function ensureOptimizedCloudinaryPosterUrl(posterUrl?: string, videoUrl?: string): string {
  if (posterUrl && posterUrl.includes('cloudinary.com')) {
    if (!posterUrl.includes('f_auto') && !posterUrl.includes('q_auto')) {
      return posterUrl.replace('/upload/', '/upload/f_auto,q_auto,so_0/');
    }
    return posterUrl;
  }
  if (videoUrl && videoUrl.includes('cloudinary.com') && videoUrl.includes('/video/upload/')) {
    const optimized = ensureOptimizedCloudinaryVideoUrl(videoUrl);
    return optimized
      .replace('/video/upload/f_auto,q_auto/', '/video/upload/f_auto,q_auto,so_0/')
      .replace('/video/upload/', '/video/upload/f_auto,q_auto,so_0/')
      .replace(/\.[a-zA-Z0-9]+$/, '.jpg');
  }
  return posterUrl || '';
}

/**
 * Pure Video Card:
 * - Constant size, zero hover animations, zero transforms
 * - Plays inline, muted, continuously looping
 */
interface VideoCardProps {
  item: ShopTheLookItem;
}

const VideoCard: React.FC<VideoCardProps> = ({ item }) => {
  const optimizedVideoUrl = ensureOptimizedCloudinaryVideoUrl(item.videoUrl);
  const optimizedPosterUrl = ensureOptimizedCloudinaryPosterUrl(item.posterUrl, item.videoUrl);

  return (
    <div
      className="relative shrink-0 rounded-lg sm:rounded-2xl overflow-hidden bg-black shadow-lg border border-white/10 w-[calc((100vw-34px)/2)] sm:w-[200px] lg:w-[230px] xl:w-[250px] aspect-[9/16] select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        <video
          src={optimizedVideoUrl}
          poster={optimizedPosterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export const ShopTheLook: React.FC<ShopTheLookProps> = () => {
  const [items, setItems] = useState<ShopTheLookItem[]>(DEFAULT_SHOP_THE_LOOK_ITEMS);

  // Fetch customizable items from API (with instant fallback to DEFAULT_SHOP_THE_LOOK_ITEMS)
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

  // Duplicate card items for a seamless infinite loop
  const duplicatedItems = [...items, ...items];

  return (
    <section className="bg-[#1c050d] text-white py-14 sm:py-20 overflow-hidden relative border-t border-b border-[#dfb15b]/20 select-none">
      {/* Centered Header: SHOP THE LOOK WITH WEB BASE DARK COLOR */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-8 sm:mb-12">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Shop The Look
        </h2>
      </div>

      {/* Continuously Moving Horizontal Track (CSS Infinite Marquee) */}
      <div
        className="w-full overflow-hidden select-none pointer-events-none"
        role="region"
        aria-label="Shop The Look Video Gallery"
      >
        <div
          className="animate-marquee flex w-max"
          style={{ animation: 'marquee 35s linear infinite' }}
        >
          {duplicatedItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="relative shrink-0 rounded-lg sm:rounded-2xl overflow-hidden bg-black shadow-lg border border-white/10 w-[calc((100vw-34px)/2)] sm:w-[200px] lg:w-[230px] xl:w-[250px] aspect-[9/16] mr-2.5 sm:mr-4 select-none pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
                <video
                  src={ensureOptimizedCloudinaryVideoUrl(item.videoUrl)}
                  poster={ensureOptimizedCloudinaryPosterUrl(item.posterUrl, item.videoUrl)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
