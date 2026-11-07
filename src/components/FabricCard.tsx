import React from 'react';
import { Fabric } from '../types/index.ts';
import { LazyImage } from './LazyImage.tsx';

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
  return (
    <div
      onClick={() => onViewDetails(fabric.slug)}
      className="group flex flex-col cursor-pointer transition-all duration-200"
    >
      {/* 3:4 Portrait Image Container - Full garment visibility, no destructive crop */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 border border-stone-200/60 group-hover:border-stone-300 transition-colors">
        <LazyImage
          src={fabric.primaryImageUrl}
          alt={fabric.name}
          width={300}
          height={400}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          containerClassName="w-full h-full"
        />
        {fabric.fabricType && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#1c050d]/85 backdrop-blur-xs text-[#dfb15b] text-[9.5px] font-bold tracking-wider uppercase rounded-xs border border-[#dfb15b]/30 shadow-xs">
            {fabric.fabricType}
          </span>
        )}
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
