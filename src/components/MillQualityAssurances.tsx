import React from 'react';

/**
 * Universal Mill Quality Assurances & Standards
 * Clean, simple, permanent, and maintenance-free across all products.
 * No product-specific changes or certifications needed.
 */

interface MillQualityAssurancesProps {
  fabricName?: string;
  designId?: string;
  fabricType?: string;
  onRequestEnquiry?: (subject?: string) => void;
}

// 1. Direct Mill Hallmark: Interlaced Weft & Shuttle Icon
const MillLoomMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="20" cy="20" r="18.5" stroke="#4a1122" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="16.5" stroke="#dfb15b" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
    {/* Micro loom warp/weft grid */}
    <path d="M13 15H27M13 20H27M13 25H27" stroke="#4a1122" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
    <path d="M16 12V28M20 12V28M24 12V28" stroke="#4a1122" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
    {/* Clean designer loom shuttle */}
    <path
      d="M10 20C13 16.5 27 16.5 30 20C27 23.5 13 23.5 10 20Z"
      fill="#4a1122"
      stroke="#dfb15b"
      strokeWidth="1"
    />
    <circle cx="20" cy="20" r="1.6" fill="#f7eedf" />
  </svg>
);

// 2. Colorfast & Dye Penetration Hallmark: Pure Drop & Spark
const ColorfastMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="20" cy="20" r="18.5" stroke="#4a1122" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="16.5" stroke="#dfb15b" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
    {/* Pure droplet silhouette */}
    <path
      d="M20 10C20 10 27.5 18.5 27.5 23.5C27.5 27.6 24.1 30 20 30C15.9 30 12.5 27.6 12.5 23.5C12.5 18.5 20 10 20 10Z"
      fill="#fdfbf7"
      stroke="#4a1122"
      strokeWidth="1.2"
    />
    <path
      d="M20 14C20 14 25 20.5 25 24C25 26.5 22.8 28 20 28"
      fill="#dfb15b"
      opacity="0.9"
    />
    {/* Micro checkmark */}
    <path
      d="M17.5 22L19.5 24L23 20.5"
      stroke="#4a1122"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 3. Roll Quality Inspection Hallmark: Reticle & Verification Seal
const InspectionMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="20" cy="20" r="18.5" stroke="#4a1122" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="16.5" stroke="#dfb15b" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
    <circle cx="20" cy="20" r="10.5" stroke="#4a1122" strokeWidth="0.9" />
    <path d="M20 6.5V9.5M20 30.5V33.5M6.5 20H9.5M30.5 20H33.5" stroke="#dfb15b" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="20" cy="20" r="6" fill="#4a1122" />
    <path
      d="M17.5 20L19.3 21.8L22.5 18.5"
      stroke="#dfb15b"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 4. Moisture-Proof Roll Pack Hallmark: Sealed Fabric Cylinder & Shield
const PackagingMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 40 40"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="20" cy="20" r="18.5" stroke="#4a1122" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="16.5" stroke="#dfb15b" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
    {/* Roll body */}
    <path
      d="M12 15H27C29 15 30.5 16.5 30.5 18.5V21.5C30.5 23.5 29 25 27 25H12"
      stroke="#4a1122"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <ellipse cx="12" cy="20" rx="3" ry="5" fill="#fdfbf7" stroke="#4a1122" strokeWidth="1.2" />
    <circle cx="12" cy="20" r="1.2" fill="#dfb15b" />
    {/* Secure seal tick */}
    <path
      d="M21 18L24 20L21 22"
      stroke="#dfb15b"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const guarantees = [
  {
    mark: <MillLoomMark />,
    title: 'Direct Mill Weaving',
    badge: 'Surat Loom',
    detail: 'Woven & digitally printed directly at our facility with zero middlemen.',
  },
  {
    mark: <ColorfastMark />,
    title: 'Colorfast Reactive Print',
    badge: 'Deep Penetration',
    detail: 'Engineered for color retention that won’t bleed or fade in gentle wash.',
  },
  {
    mark: <InspectionMark />,
    title: 'Defect-Free Yardage',
    badge: 'Inspected Rolls',
    detail: 'Full-length yardage checked under calibrated lights before roll packaging.',
  },
  {
    mark: <PackagingMark />,
    title: 'Moisture-Barrier Packing',
    badge: 'Transit-Safe',
    detail: 'Double-wrapped in waterproof barrier film for safe nationwide delivery.',
  },
];

export const MillQualityAssurances: React.FC<MillQualityAssurancesProps> = () => {
  return (
    <div className="pt-2">
      {/* Header bar: Simple, professional & permanent */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-[#4a1122] rounded-full" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Mill Quality Assurances & Standards
          </h4>
        </div>
        <span className="text-[10px] font-semibold text-[#6b1e33] bg-[#4a1122]/5 px-2 py-0.5 rounded border border-[#4a1122]/15">
          Standard on Every Product
        </span>
      </div>

      {/* 4 Clean, Designer-Crafted Universal Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {guarantees.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#faf8f5] hover:bg-[#f6f2eb] rounded-xl border border-stone-200/90 transition-colors flex items-start gap-3"
          >
            <div className="shrink-0 mt-0.5">
              {item.mark}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <h5 className="text-xs font-bold text-stone-900 leading-tight">
                  {item.title}
                </h5>
                <span className="text-[10px] text-[#8a6a2e] font-semibold">
                  • {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
