import React, { useState, useEffect, useRef } from 'react';

export interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  aspectRatio?: string;
  containerClassName?: string;
  showSkeleton?: boolean;
}

const DEFAULT_FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%23f7f4ee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23a8a29e" font-family="serif" font-size="14">SRI FABRICS</text></svg>';

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_SVG,
  priority = false,
  aspectRatio,
  containerClassName = '',
  className = '',
  width,
  height,
  showSkeleton = true,
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for early pre-buffering (400px margin ensures images load before arriving)
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '450px 0px', // Pre-load well before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [priority]);

  // Reset state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError(e);
  };

  const imageSrc = (!src || hasError) ? fallbackSrc : src;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Luxury Subtle Shimmer Placeholder — prevents CLS layout shifts */}
      {showSkeleton && !isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#f4efe8] animate-pulse pointer-events-none z-0"
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-[#ebdcc5]/40 to-transparent animate-[shimmer_1.8s_infinite] -translate-x-full" />
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          referrerPolicy="no-referrer"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...rest}
        />
      )}
    </div>
  );
};
