import React from 'react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { LazyImage } from '../components/LazyImage.tsx';

// Optimized local editorial WebP visuals
import imgSourcingDesign from '../assets/images/mfg_sourcing_design_1795070380955.webp';
import imgQualityInspection from '../assets/images/mfg_quality_inspection_1795070381634.webp';
import imgWholesaleDispatch from '../assets/images/mfg_wholesale_dispatch_1795070382440.webp';

interface ManufacturingViewProps {
  onRequestEnquiry: (fabricName?: string) => void;
  onNavigate?: (path: string) => void;
}

interface CapabilityItem {
  number: string;
  title: string;
  description: string;
  scope: string;
  actionLabel: string;
  actionType: 'navigate' | 'enquiry';
  target: string;
}

interface WorkflowStage {
  number: string;
  label: string;
  title: string;
  description: string;
  focusPoints: string[];
  imageUrl: string;
  fallbackImageUrl?: string;
  imageAlt: string;
}

interface CustomRequirementItem {
  index: string;
  title: string;
  detail: string;
  enquiryTopic: string;
}

const CORE_CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    title: 'Ready-Stock Collections',
    description:
      'Explore a diverse selection of wholesale sarees, fabrics, kurti sets and ethnic wear materials available for bulk purchasing.',
    scope: 'Sarees · Fabrics · Kurti Sets · Dress Materials',
    actionLabel: 'Explore Wholesale Collections',
    actionType: 'navigate',
    target: '/collections',
  },
  {
    number: '02',
    title: 'Made-to-Order Production',
    description:
      'Develop collections according to buyer requirements, including fabric selection, designs, colors and product specifications.',
    scope: 'Buyer Specifications · Seasonal Assortments · Bulk Lots',
    actionLabel: 'Discuss Made-to-Order Production',
    actionType: 'enquiry',
    target: 'Made-to-Order Textile Production',
  },
  {
    number: '03',
    title: 'Customized Textile Solutions',
    description:
      'Work with our team to discuss product specifications, fabric requirements, design preferences and bulk-order needs.',
    scope: 'Custom Prints · Shade Matching · B2B Sourcing',
    actionLabel: 'Consult Our Textile Team',
    actionType: 'enquiry',
    target: 'Customized Textile Solutions',
  },
];

const PRODUCTION_STAGES: WorkflowStage[] = [
  {
    number: '01',
    label: 'Stage 01',
    title: 'Fabric Sourcing & Selection',
    description:
      'Carefully source and select suitable textile materials according to product requirements, design preferences and buyer specifications.',
    focusPoints: [
      'Base fabric evaluation for drape, weave character, and end-use suitability',
      'Material alignment across wholesale sarees, fabrics, kurti sets, and dress materials',
    ],
    imageUrl: '/blog1.webp',
    fallbackImageUrl: '/blog1.png',
    imageAlt: 'Curated wholesale fabrics and ethnic textiles ready for fabric sourcing and selection in Surat',
  },
  {
    number: '02',
    label: 'Stage 02',
    title: 'Design & Product Development',
    description:
      'Develop textile collections, prints, patterns and product concepts suitable for different market segments.',
    focusPoints: [
      'Print, motif, and border development tailored to regional and contemporary demand',
      'Color palette and swatch review aligned with buyer collection calendars',
    ],
    imageUrl: imgSourcingDesign,
    fallbackImageUrl: '/printing1.webp',
    imageAlt: 'Textile swatch books, color shade cards, and printed ethnic fabric development samples',
  },
  {
    number: '03',
    label: 'Stage 03',
    title: 'Processing & Production',
    description:
      'Coordinate the required textile processing, finishing and production activities according to the selected product and order specifications.',
    focusPoints: [
      'Coordinated dyeing, printing, and textile finishing workflows per order brief',
      'Consistent execution across ready-stock replenishment and made-to-order runs',
    ],
    imageUrl: '/blog2.webp',
    fallbackImageUrl: '/blog2.png',
    imageAlt: 'Coordinated textile printing and finishing production workflow at SRI FABRIC Surat',
  },
  {
    number: '04',
    label: 'Stage 04',
    title: 'Quality Inspection',
    description:
      'Inspect products for fabric appearance, print consistency, finishing, stitching (where applicable) and overall product quality.',
    focusPoints: [
      'Visual verification of print clarity, color uniformity, and fabric surface',
      'Careful review of borders, finishing, and stitching where applicable prior to packing',
    ],
    imageUrl: imgQualityInspection,
    fallbackImageUrl: '/printing1.webp',
    imageAlt: 'Textile specialist reviewing fabric appearance, print consistency, and border finishing',
  },
  {
    number: '05',
    label: 'Stage 05',
    title: 'Packaging & Bulk Dispatch',
    description:
      'Prepare completed orders for organized packaging and wholesale dispatch, ensuring proper coordination with buyers.',
    focusPoints: [
      'Structured folding, labeling, and protective packing for bulk wholesale shipments',
      'Direct buyer coordination for domestic Indian markets and international dispatch',
    ],
    imageUrl: imgWholesaleDispatch,
    fallbackImageUrl: '/slides/hero-fabrics-home.jpg',
    imageAlt: 'Organized wholesale sarees and ethnic fabric bundles prepared for bulk B2B dispatch',
  },
];

const CUSTOM_REQUIREMENTS: CustomRequirementItem[] = [
  {
    index: '01',
    title: 'Custom fabric selection',
    detail:
      'Select from silk blends, chinon, organza, georgette, cotton, muslin, and ethnic dress bases aligned with your customer segment.',
    enquiryTopic: 'Custom Fabric Selection Enquiry',
  },
  {
    index: '02',
    title: 'Design and print requirements',
    detail:
      'Develop floral, heritage, geometric, or exclusive print layouts suited to your retail label or wholesale distribution line.',
    enquiryTopic: 'Custom Design & Print Requirements',
  },
  {
    index: '03',
    title: 'Color and shade preferences',
    detail:
      'Coordinate festive, bridal, pastel, or everyday shade palettes across sarees, yardages, and coordinated ethnic sets.',
    enquiryTopic: 'Custom Color & Shade Preferences',
  },
  {
    index: '04',
    title: 'Bulk quantity requirements',
    detail:
      'Plan wholesale order volumes for multi-store retailers, regional distributors, boutiques, and fashion brands across India and abroad.',
    enquiryTopic: 'Bulk Wholesale Quantity Requirement',
  },
  {
    index: '05',
    title: 'Made-to-order collections',
    detail:
      'Build dedicated seasonal or signature ethnic wear collections developed specifically around your business brief.',
    enquiryTopic: 'Made-to-Order Collection Development',
  },
  {
    index: '06',
    title: 'Product-specific specifications',
    detail:
      'Align cut lengths, fabric widths, border styling, and finishing preferences to match your garment or retail requirements.',
    enquiryTopic: 'Product-Specific Textile Specifications',
  },
];

const PARTNER_SEGMENTS = [
  'Ethnic Wear Retailers',
  'Designer Boutiques',
  'Regional Wholesalers & Distributors',
  'Fashion Labels & Apparel Brands',
  'International B2B Buyers',
];

export const ManufacturingView: React.FC<ManufacturingViewProps> = ({
  onRequestEnquiry,
  onNavigate,
}) => {
  const handleExploreCollections = () => {
    if (onNavigate) {
      onNavigate('/collections');
    } else {
      window.location.href = '/collections';
    }
  };

  const scrollToStage = (stageNumber: string) => {
    const el = document.getElementById(`production-stage-${stageNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#faf7f2] text-[#1c1917] min-h-screen">
      {/* Quiet Breadcrumb Strip */}
      <div className="w-full bg-[#fdfbf7] border-b border-stone-200/80 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.('/')}
              className="hover:text-[#4a1122] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span aria-hidden="true" className="text-stone-300">
              /
            </span>
            <span className="text-[#4a1122] font-medium">
              Manufacturing &amp; Production
            </span>
          </nav>
          <div className="hidden sm:flex items-center gap-2 text-stone-500">
            <span>Surat, Gujarat, India</span>
            <span aria-hidden="true">·</span>
            <span>B2B Textile Wholesale &amp; Production Partner</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. MAIN HERO SECTION                                                  */}
      {/* ===================================================================== */}
      <section className="w-full border-b border-stone-200/90 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Column: Editorial Positioning */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <p className="font-display text-xs sm:text-[13px] font-semibold tracking-[0.2em] text-[#4a1122]">
                  CRAFTING TEXTILES. POWERING BUSINESSES.
                </p>

                <h1 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] font-bold text-[#1c1917] leading-[1.08] text-balance">
                  Manufacturing &amp; Textile Production Capabilities
                </h1>
              </div>

              <p className="text-[15px] sm:text-base text-stone-600 leading-[1.7] max-w-xl">
                From carefully selected fabrics to thoughtfully developed ethnic collections,{' '}
                <strong className="font-semibold text-[#1c1917]">SRI FABRIC</strong> brings together
                textile expertise, wholesale sourcing and customized production solutions to serve
                businesses across India and international markets.
              </p>

              {/* Quiet B2B Scope Metadata (Zero-Pill Discipline) */}
              <div className="pt-2 border-t border-stone-200/90 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-stone-500">
                <span>Textile Manufacturer in Surat</span>
                <span aria-hidden="true">·</span>
                <span>Wholesale Saree &amp; Fabric Supplier</span>
                <span aria-hidden="true">·</span>
                <span>Made-to-Order Textile Production</span>
              </div>

              {/* Action Row — One Dominant Primary CTA + Quiet Secondary Action */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onRequestEnquiry('Manufacturing & Bulk Textile Production Enquiry')
                  }
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[44px] bg-[#4a1122] hover:bg-[#320a16] text-[#faf7f2] text-xs font-semibold tracking-[0.14em] uppercase rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a1122]"
                >
                  <span>Consult Our Textile Team</span>
                  <ArrowRight className="w-4 h-4 text-[#dfb15b]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleExploreCollections}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[44px] bg-transparent hover:bg-stone-200/50 text-[#4a1122] border border-[#4a1122]/30 text-xs font-semibold tracking-[0.12em] uppercase rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a1122]"
                >
                  <span>Explore Wholesale Collections</span>
                </button>
              </div>
            </div>

            {/* Right Column: Dominant 16:9 / Stretch Editorial Visual */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[440px] rounded-xl overflow-hidden border border-stone-200/90 bg-[#24060d]">
                <picture className="block w-full h-full">
                  <source srcSet="/printing1.webp" type="image/webp" />
                  <img
                    src="/printing1.png"
                    alt="SRI FABRIC Surat textile collections, printed ethnic fabrics, and shade cards prepared for B2B wholesale buyers"
                    width={1672}
                    height={941}
                    loading="eager"
                    fetchPriority="high"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover block"
                  />
                </picture>
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4 text-[#faf7f2]">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-[#f7e6c4]">
                      SRI FABRIC · Surat Textile Ecosystem
                    </p>
                    <p className="text-xs text-white/80 mt-0.5">
                      Wholesale sarees, fabrics, kurti sets &amp; customized ethnic collections
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Alignment Strip — Full Width Row Below Hero Split */}
          <div className="mt-12 pt-8 border-t border-stone-200/90 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#4a1122]">
                Built for B2B Textile Buyers
              </p>
              <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
                A dedicated textile wholesale supplier in Surat supporting dependable sourcing for
                growing retail and apparel businesses.
              </p>
            </div>
            <div className="lg:col-span-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 lg:justify-end pt-1">
              {PARTNER_SEGMENTS.map((segment, idx) => (
                <React.Fragment key={segment}>
                  <span className="text-sm font-medium text-stone-800">{segment}</span>
                  {idx < PARTNER_SEGMENTS.length - 1 && (
                    <span aria-hidden="true" className="text-[#b88a38] hidden sm:inline">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. PRODUCTION CAPABILITIES (3 Core Highlights)                        */}
      {/* ===================================================================== */}
      <section
        id="production-capabilities"
        className="w-full bg-white border-b border-stone-200/90 py-16 lg:py-24 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 border-b border-stone-200">
            <div className="lg:col-span-7 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4a1122]">
                Production Capabilities
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917] leading-tight text-balance">
                Structured Sourcing &amp; Production for Wholesale Growth
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm text-stone-600 leading-relaxed">
                Whether your business requires ready-to-buy ethnic wear wholesale stock or
                made-to-order textile production developed around your own specifications, our team
                coordinates each requirement with clarity and consistency.
              </p>
            </div>
          </div>

          {/* 3 Architectural Editorial Capability Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {CORE_CAPABILITIES.map((cap) => (
              <article
                key={cap.number}
                className="flex flex-col justify-between bg-[#faf7f2] rounded-xl border border-stone-200/90 p-7 sm:p-8 transition-colors duration-200 hover:border-[#b88a38]/70"
              >
                <div className="space-y-5">
                  <div className="flex items-baseline justify-between border-b border-stone-200/90 pb-4">
                    <span className="font-serif text-3xl font-bold text-[#4a1122] tabular-nums">
                      {cap.number}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500">
                      B2B Capability
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl font-bold text-[#1c1917] leading-snug">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-stone-600 leading-[1.7]">{cap.description}</p>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-stone-200/80 space-y-4">
                  <p className="text-xs text-stone-500">{cap.scope}</p>
                  <button
                    type="button"
                    onClick={() =>
                      cap.actionType === 'navigate'
                        ? handleExploreCollections()
                        : onRequestEnquiry(cap.target)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#4a1122] hover:text-[#781934] transition-colors cursor-pointer group"
                  >
                    <span>{cap.actionLabel}</span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 text-[#b88a38] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. OUR PRODUCTION PROCESS — 5 STAGES                                  */}
      {/* ===================================================================== */}
      <section
        id="production-process"
        className="w-full bg-[#faf7f2] border-b border-stone-200/90 py-16 lg:py-24 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header + Functional Stage Jump Controls */}
          <div className="space-y-6 pb-8 border-b border-stone-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-7 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4a1122]">
                  Our Production Process
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917] leading-tight text-balance">
                  Five Stages From Fabric Selection to Bulk Dispatch
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-sm text-stone-600 leading-relaxed">
                  Every wholesale order and custom textile project follows SRI FABRIC&apos;s
                  five-stage workflow — keeping fabric selection, design development, production
                  coordination, inspection, and dispatch transparent for business buyers.
                </p>
              </div>
            </div>

            {/* Functional Quick-Jump Stage Selector */}
            <div
              role="navigation"
              aria-label="Production workflow stages"
              className="flex flex-wrap items-center gap-2 pt-2"
            >
              {PRODUCTION_STAGES.map((stage) => (
                <button
                  key={stage.number}
                  type="button"
                  onClick={() => scrollToStage(stage.number)}
                  className="px-3.5 py-2 min-h-[40px] rounded-md bg-white hover:bg-[#4a1122] text-stone-700 hover:text-[#faf7f2] border border-stone-200 hover:border-[#4a1122] text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span className="tabular-nums font-semibold mr-1.5">{stage.number}.</span>
                  <span>{stage.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5 Editorial Workflow Rows */}
          <div className="divide-y divide-stone-200/90">
            {PRODUCTION_STAGES.map((stage, index) => (
              <article
                id={`production-stage-${stage.number}`}
                key={stage.number}
                className="scroll-mt-28 py-10 first:pt-2 last:pb-2 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
              >
                {/* Stage Editorial Index */}
                <div className="lg:col-span-2 flex lg:flex-col items-baseline lg:items-start gap-3 lg:gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88a38]">
                    {stage.label}
                  </span>
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-[#4a1122] leading-none tabular-nums">
                    {stage.number}
                  </span>
                </div>

                {/* Stage Prose & Structured Focus Points */}
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-serif text-2xl sm:text-[28px] font-bold text-[#1c1917] leading-snug">
                    {stage.title}
                  </h3>
                  <p className="text-[15px] text-stone-600 leading-[1.7] max-w-xl">
                    {stage.description}
                  </p>
                  <ul className="space-y-2 pt-1">
                    {stage.focusPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-xs sm:text-[13px] text-stone-600 leading-relaxed"
                      >
                        <Check
                          className="w-4 h-4 text-[#4a1122] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stage Visual */}
                <div
                  className={`lg:col-span-4 ${
                    index % 2 === 1 ? 'lg:order-last' : ''
                  }`}
                >
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-stone-200/90 bg-[#f4eee1]">
                    <LazyImage
                      src={stage.imageUrl}
                      fallbackSrc={stage.fallbackImageUrl || '/printing1.webp'}
                      alt={stage.imageAlt}
                      width={640}
                      height={480}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. CUSTOM WHOLESALE REQUIREMENTS                                      */}
      {/* ===================================================================== */}
      <section
        id="custom-requirements"
        className="w-full bg-white border-b border-stone-200/90 py-16 lg:py-24 px-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Narrative Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4a1122]">
                Custom Wholesale Requirements
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1917] leading-tight text-balance">
                Your Requirements. Our Textile Expertise.
              </h2>
            </div>

            <p className="text-[15px] text-stone-600 leading-[1.7]">
              Looking for a particular fabric, customized design, specific color combination or
              bulk ethnic wear collection? SRI FABRIC works with business buyers to understand their
              requirements and develop suitable sourcing and production solutions.
            </p>

            <p className="text-sm text-stone-600 leading-[1.7]">
              As an established partner for{' '}
              <strong className="font-medium text-stone-800">B2B fabric Surat</strong>,{' '}
              <strong className="font-medium text-stone-800">fabric wholesale Surat</strong>, and{' '}
              <strong className="font-medium text-stone-800">textile sourcing India</strong>, we
              support wholesale saree buyers, boutique founders, and bulk fabric buyers across India
              and international trade markets.
            </p>

            {/* Clear Buyer Transparency Statement (Subtle Hairline Box, No Thick Left Stripe) */}
            <div className="p-5 rounded-lg bg-[#faf7f2] border border-stone-200/90 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4a1122]">
                Direct Specification &amp; Pricing Alignment
              </p>
              <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                Final fabric specifications, pricing and order quantities are discussed directly and
                finalized with buyers based on each project&apos;s material and production scope.
              </p>
            </div>
          </div>

          {/* Right 2-Column Structured Requirement Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CUSTOM_REQUIREMENTS.map((req) => (
              <div
                key={req.index}
                className="bg-[#faf7f2] rounded-xl border border-stone-200/90 p-6 flex flex-col justify-between gap-5 transition-colors duration-150 hover:border-[#b88a38]/70"
              >
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-[#b88a38] tabular-nums">
                    {req.index}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#1c1917] leading-snug">
                    {req.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                    {req.detail}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRequestEnquiry(req.enquiryTopic)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a1122] hover:text-[#781934] transition-colors cursor-pointer self-start group"
                >
                  <span>Discuss this requirement</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 text-[#b88a38] transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. CALL TO ACTION                                                     */}
      {/* ===================================================================== */}
      <section className="w-full bg-[#faf7f2] py-16 lg:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#24060d] text-[#faf7f2] rounded-2xl border border-[#dfb15b]/30 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#dfb15b]">
                SRI FABRIC · Wholesale &amp; Production Desk · Surat
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.12] text-balance tracking-[0.01em]">
                Let&apos;s Build Your Next Collection Together.
              </h2>

              <p className="text-sm sm:text-base text-white/80 leading-[1.7] max-w-2xl mx-auto tracking-[0.01em]">
                Connect with our textile team to discuss wholesale enquiries, customized production
                and bulk sourcing requirements.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    onRequestEnquiry('Wholesale & Custom Textile Production Consultation')
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 min-h-[48px] bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-[0.14em] rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfb15b]"
                >
                  <span>Consult Our Textile Team</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleExploreCollections}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 min-h-[48px] bg-transparent hover:bg-white/10 text-[#f7e6c4] border border-[#dfb15b]/50 text-xs font-semibold uppercase tracking-[0.14em] rounded-md transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfb15b]"
                >
                  <span>Explore Wholesale Collections</span>
                </button>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-white/60">
                <span>Wholesale Saree Supplier</span>
                <span aria-hidden="true">·</span>
                <span>Bulk Fabric Supplier India</span>
                <span aria-hidden="true">·</span>
                <span>Ethnic Wear Wholesale</span>
                <span aria-hidden="true">·</span>
                <span>Ring Road, Surat, Gujarat</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
