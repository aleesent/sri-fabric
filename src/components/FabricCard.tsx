import React, { useState } from 'react';
import { Fabric } from '../types/index.ts';

interface FabricCardProps {
  fabric: Fabric;
  onViewDetails: (slug: string) => void;
  onRequestEnquiry?: (fabricName: string) => void;
  variant?: 'default' | 'shop';
}

export const FabricCard: React.FC<FabricCardProps> = ({
  fabric,
  onViewDetails,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onViewDetails(fabric.slug)}
      className="group flex flex-col cursor-pointer transition-all duration-200"
    >
      {/* 3:4 Portrait Image Container - Full garment visibility, no destructive crop */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 border border-stone-200/60 group-hover:border-stone-300 transition-colors">
        <img
          src={
            imageError
              ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%23f5f3ef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23a8a29e" font-family="sans-serif" font-size="14">SRI FABRICS</text></svg>'
              : fabric.primaryImageUrl
          }
          alt={fabric.name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Product Title - Consistent height for perfect horizontal row alignment */}
      <div className="pt-2 sm:pt-2.5 pb-1">
        <h3
          className="text-[12.5px] sm:text-[13.5px] font-medium text-stone-900 group-hover:text-[#72152b] transition-colors leading-snug line-clamp-2 h-9 sm:h-10"
          title={fabric.name}
        >
          {fabric.name}
        </h3>
      </div>
    </div>
  );
};
