import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Maximize2, Play, Pause } from 'lucide-react';

export interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  containerClassName?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  showControls?: boolean;
  badgeText?: string;
  onLoaded?: () => void;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  containerClassName = 'w-full h-full',
  className = '',
  aspectRatio,
  objectFit = 'cover',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  showControls = false,
  badgeText,
  onLoaded,
  ...rest
}) => {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showPlayPulse, setShowPlayPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if poster is a valid image URL rather than an MP4 file
  const isValidImagePoster =
    poster && !poster.endsWith('.mp4') && !poster.includes('.mp4') && !poster.includes('/video/');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          const video = videoRef.current;
          if (video && autoPlay) {
            video.muted = isMuted;
            video.defaultMuted = isMuted;
            const p = video.play();
            if (p !== undefined) {
              p.then(() => setIsPlaying(true)).catch(() => {
                video.muted = true;
                setIsMuted(true);
                video.play().then(() => setIsPlaying(true)).catch(() => {});
              });
            }
          }
        } else {
          // Pause when far out of view to save battery & system resources
          const video = videoRef.current;
          if (video && !video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      {
        rootMargin: '350px 0px', // Buffer 350px before entering viewport
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay, isMuted]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      video.volume = 1;
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setShowPlayPulse(true);
        setTimeout(() => setShowPlayPulse(false), 600);
      }).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      setShowPlayPulse(true);
      setTimeout(() => setShowPlayPulse(false), 600);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <div
      ref={containerRef}
      onClick={showControls ? togglePlayPause : undefined}
      className={`relative w-full h-full overflow-hidden bg-[#1a050b] select-none ${
        showControls ? 'cursor-pointer group' : ''
      } ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Crisp Zero-CLS Poster Image */}
      {isValidImagePoster && (
        <img
          src={poster}
          alt="Video Preview"
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full ${fitClass} transition-opacity duration-500 ease-out z-0 pointer-events-none ${
            isVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Lazy Video Stream */}
      {shouldLoadVideo && !hasError && (
        <video
          ref={videoRef}
          src={src}
          poster={isValidImagePoster ? poster : undefined}
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop}
          playsInline={playsInline}
          preload="metadata"
          onLoadedData={() => {
            setIsVideoReady(true);
            if (onLoaded) onLoaded();
          }}
          onPlaying={() => {
            setIsVideoReady(true);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => setHasError(true)}
          className={`w-full h-full ${fitClass} transition-opacity duration-500 ease-out ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...rest}
        />
      )}

      {/* Center Play/Pause Feedback Pulse */}
      {showControls && (showPlayPulse || !isPlaying) && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        >
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white/90 border border-white/20 shadow-xl transition-transform duration-300 transform scale-100 group-hover:scale-110">
            {isPlaying ? (
              <Pause className="w-6 h-6 text-[#dfb15b]" />
            ) : (
              <Play className="w-6 h-6 text-[#dfb15b] translate-x-0.5" />
            )}
          </div>
        </div>
      )}

      {/* Optional Top Badge */}
      {badgeText && (
        <div className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full border border-white/15">
          <span className="w-2 h-2 rounded-full bg-[#dfb15b] animate-pulse" />
          <span className="text-[10px] tracking-wider font-semibold uppercase text-stone-200">
            {badgeText}
          </span>
        </div>
      )}

      {/* Interactive Controls Bar (Bottom) */}
      {showControls && (
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          {/* Sound Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white/90 hover:text-[#dfb15b] backdrop-blur-xs flex items-center justify-center border border-white/20 transition-all shadow-md cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/80" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#dfb15b]" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-white/90 hover:text-[#dfb15b] backdrop-blur-xs flex items-center justify-center border border-white/20 transition-all shadow-md cursor-pointer"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-white/80" />
          </button>
        </div>
      )}
    </div>
  );
};
