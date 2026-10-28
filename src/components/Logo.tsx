import React, { useState } from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold' | 'badge';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gold',
  className = '',
  showTagline = true,
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  // Generously increased sizing so the logo is distinctly visible and legible
  const containerSizes = {
    sm: 'h-10 max-w-[150px]',
    md: 'h-14 sm:h-16 md:h-18 max-w-[220px] sm:max-w-[260px]',
    lg: 'h-18 sm:h-22 max-w-[300px] sm:max-w-[350px]',
    xl: 'h-24 sm:h-30 max-w-[380px] sm:max-w-[460px]',
  };

  const emblemSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const textColor =
    variant === 'dark' ? 'text-[#1c1917]' : variant === 'light' ? 'text-white' : 'text-[#fdfaf3]';
  const taglineColor = variant === 'dark' ? 'text-[#786144]' : 'text-[#dfb15b]';

  // Standalone badge variant
  if (variant === 'badge') {
    return (
      <div
        className={`relative inline-block rounded-full overflow-hidden shadow-xl border border-[#dfb15b]/60 ${className}`}
      >
        <img
          src="/sri_logo.svg"
          alt="SRI Fabrics Official Seal"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    );
  }

  // Primary: Render the user's uploaded logo.png with high fidelity
  if (!imageError) {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src="/logo.png"
          alt="SRI FABRICS – Fabrics For A Brighter Tomorrow"
          onError={() => setImageError(true)}
          className={`${containerSizes[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
          loading="eager"
        />
      </div>
    );
  }

  // Fallback if logo.png is not found or has an error
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      <div
        className={`relative ${emblemSizes[size]} shrink-0 rounded-full overflow-hidden border border-[#dfb15b]/80 shadow-md bg-[#0d0407]`}
      >
        <img
          src="/sri_logo.svg"
          alt="SRI Fabrics Official Emblem"
          className="w-full h-full object-cover scale-[1.04]"
          loading="eager"
        />
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className={`font-serif tracking-[0.2em] font-bold uppercase ${textSizes[size]} ${textColor}`}
        >
          SRI FABRICS
        </span>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] tracking-[0.25em] font-medium uppercase ${taglineColor}`}
          >
            FABRICS FOR A BRIGHTER TOMORROW
          </span>
        )}
      </div>
    </div>
  );
};
