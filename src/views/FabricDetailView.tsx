import React, { useState, useEffect } from 'react';
import { Fabric } from '../types/index.ts';
import { FabricCard } from '../components/FabricCard.tsx';
import { Phone, Send, Image as ImageIcon } from 'lucide-react';
import { SEOHead } from '../components/SEOHead.tsx';

interface FabricDetailViewProps {
  slug: string;
  onBack: () => void;
  onRequestEnquiry: (fabricName?: string) => void;
  onViewFabric: (slug: string) => void;
  onNavigate?: (path: string) => void;
}

interface ThumbnailSlot {
  index: number;
  url: string | null;
  hasImage: boolean;
  alt: string;
}

export const FabricDetailView: React.FC<FabricDetailViewProps> = ({
  slug,
  onBack,
  onRequestEnquiry,
  onViewFabric,
  onNavigate,
}) => {
  const [fabric, setFabric] = useState<Fabric | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/fabrics/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: Fabric) => {
        setFabric(data);
        setSelectedImageIndex(0);
        setIsDescriptionExpanded(false);
      })
      .catch((err) => console.error('Error fetching fabric:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#4a1122] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-sans">Loading saree details...</p>
        </div>
      </div>
    );
  }

  if (!fabric) {
    return (
      <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-normal text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500 max-w-sm font-sans">
          The requested saree could not be found or is currently unavailable.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 bg-[#4a1122] text-[#f7eedf] text-xs font-medium tracking-wider rounded-md cursor-pointer hover:bg-[#60192e] transition-colors"
        >
          Return to Sarees Collection
        </button>
      </div>
    );
  }

  // 1. Gather all unique available images from product data in priority order
  const availableImages: string[] = [];
  if (fabric.primaryImageUrl) {
    availableImages.push(fabric.primaryImageUrl);
  }
  if (fabric.images && Array.isArray(fabric.images)) {
    fabric.images.forEach((img) => {
      if (img?.imageUrl && !availableImages.includes(img.imageUrl)) {
        availableImages.push(img.imageUrl);
      }
    });
  }

  // 2. Build exactly 4 thumbnail slots (Image 1, Image 2, Image 3, Image 4)
  // If an image link is unavailable, show a consistent placeholder in its slot rather than shifting
  const thumbnailSlots: ThumbnailSlot[] = [0, 1, 2, 3].map((idx) => {
    const url = availableImages[idx] || null;
    return {
      index: idx,
      url,
      hasImage: !!url,
      alt: url ? `${fabric.name} - Wholesale Saree Fabric Mill Surat View ${idx + 1}` : `View ${idx + 1} Placeholder`,
    };
  });

  // Determine active main image URL
  const activeImageUrl =
    thumbnailSlots[selectedImageIndex]?.url ||
    thumbnailSlots[0]?.url ||
    fabric.primaryImageUrl ||
    '';

  const isTopDupatta =
    fabric.fabricType?.toLowerCase().includes('top') ||
    fabric.fabricType?.toLowerCase().includes('dupatta') ||
    fabric.keywords?.includes('SRI-TD') ||
    fabric.name?.toLowerCase().includes('kurta set');

  const categoryName = isTopDupatta ? 'Top + Dupatta' : (fabric.fabricType || 'Sarees');
  const categoryPath = isTopDupatta ? '/top-dupatta' : '/sarees';
  const designId = fabric.keywords || (isTopDupatta ? `SRI-TD-${String(1000 + fabric.id)}` : `SRI-SAR-${String(1000 + fabric.id)}`);

  // Build clean WhatsApp message URL
  const productUrl = typeof window !== 'undefined' ? window.location.href : `https://srifabrics.com/fabrics/${slug}`;
  const whatsappText = `Hello! I would like to enquire about ${fabric.name} (${categoryName}) on SRI FABRICS: ${productUrl}. Please share wholesale pricing, availability, and bulk order details.`;
  const whatsappHref = `https://wa.me/919875198837?text=${encodeURIComponent(whatsappText)}`;

  const productJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: fabric.name,
      image: fabric.primaryImageUrl ? [`https://srifabrics.com${fabric.primaryImageUrl}`] : undefined,
      description: fabric.description || `Wholesale ${fabric.name} (${categoryName}) direct from Surat looms. Sourcing partner to retailers and fashion labels worldwide.`,
      sku: designId,
      brand: {
        '@type': 'Brand',
        name: 'SRI FABRIC',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: (fabric as any).price || '0.00',
        priceValidUntil: '2028-12-31',
        availability: 'https://schema.org/InStock',
        url: `https://srifabrics.com/fabrics/${slug}`,
        seller: {
          '@type': 'Organization',
          name: 'SRI FABRIC',
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://srifabrics.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryName,
          item: `https://srifabrics.com${categoryPath}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: fabric.name,
          item: `https://srifabrics.com/fabrics/${slug}`,
        },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-[calc(100vh-120px)] pt-3 sm:pt-4 lg:pt-5 pb-12 sm:pb-16">
      <SEOHead
        title={`${fabric.name} | Wholesale Fabric & Saree Mill Surat`}
        description={`Wholesale ${fabric.name} (${categoryName}) direct from SRI FABRIC Surat. Premium quality, ready stock & custom bulk orders. Inquire at +91 9875198837.`}
        canonicalPath={`/fabrics/${fabric.slug}`}
        ogImage={fabric.primaryImageUrl || '/slides/hero-fabrics-home.jpg'}
        ogType="product"
        jsonLd={productJsonLd}
      />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Exact Reformation-Matched 3-Part Product Detail Container - Fits in Desktop Viewport Without Scroll */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 xl:gap-10 lg:h-[calc(100vh-140px)] lg:max-h-[calc(100vh-140px)]">
          {/* LEFT & CENTER-LEFT GALLERY SECTION (~55% width on desktop) */}
          <div className="w-full lg:w-[56%] flex flex-col-reverse lg:flex-row items-start gap-3 sm:gap-4 xl:gap-5 lg:h-full lg:max-h-full shrink-0">
            {/* 1. Left Thumbnail Panel: Exactly 4 Images vertically stacked (40–55px width on desktop) */}
            {/* Responsive: vertical column on desktop, horizontal row underneath main image on mobile */}
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-2.5 w-full lg:w-[52px] shrink-0 justify-start overflow-x-auto lg:overflow-visible pt-1 lg:pt-0">
              {thumbnailSlots.map((slot) => {
                const isSelected = selectedImageIndex === slot.index && slot.hasImage;
                return (
                  <button
                    key={slot.index}
                    type="button"
                    onClick={() => {
                      if (slot.hasImage) {
                        setSelectedImageIndex(slot.index);
                      }
                    }}
                    disabled={!slot.hasImage}
                    className={`w-[48px] sm:w-[52px] h-[64px] sm:h-[68px] shrink-0 rounded-xs border transition-all cursor-pointer overflow-hidden relative flex items-center justify-center ${
                      isSelected
                        ? 'border-stone-900 ring-1 ring-stone-900 shadow-2xs'
                        : slot.hasImage
                        ? 'border-stone-200 hover:border-stone-400 bg-white'
                        : 'border-stone-200/60 bg-[#f9f8f6] opacity-40 cursor-not-allowed'
                    }`}
                    title={slot.hasImage ? `Image ${slot.index + 1}` : `Image ${slot.index + 1} unavailable`}
                  >
                    {slot.hasImage ? (
                      <img
                        src={slot.url!}
                        alt={slot.alt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-1 text-stone-300">
                        <ImageIcon className="w-3.5 h-3.5 text-stone-300 stroke-1" />
                        <span className="text-[9px] text-stone-400 font-sans mt-0.5">{slot.index + 1}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 2. Main Product Image: Perfectly fitted to desktop viewport with object-contain */}
            <div className="w-full flex-1 relative bg-[#faf9f6] border border-stone-100 rounded-xs overflow-hidden flex items-center justify-center h-[380px] sm:h-[480px] lg:h-full lg:max-h-full">
              {activeImageUrl ? (
                <img
                  src={activeImageUrl}
                  alt={fabric.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full max-h-full max-w-full object-contain p-1.5 transition-opacity duration-200"
                />
              ) : (
                <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center text-stone-300 gap-2">
                  <ImageIcon className="w-10 h-10 stroke-1" />
                  <span className="text-xs text-stone-400">Image Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PRODUCT INFORMATION PANEL (~44% width on desktop, smoothly scrollable if needed) */}
          <div className="w-full lg:w-[44%] flex flex-col items-start pt-1 lg:pt-0 lg:h-full lg:max-h-full lg:overflow-y-auto lg:pr-3">
            {/* 1. Breadcrumb: Home / Category / Product */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 mb-4 sm:mb-5 font-sans">
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('/') : onBack())}
                className="hover:text-stone-900 transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="text-stone-300">/</span>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate(categoryPath) : onBack())}
                className="hover:text-stone-900 transition-colors cursor-pointer"
              >
                {categoryName}
              </button>
              <span className="text-stone-300">/</span>
              <span className="text-stone-900 font-medium truncate max-w-[200px] sm:max-w-[280px]">
                {fabric.name}
              </span>
            </nav>

            {/* 2. Product Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[2rem] font-normal text-stone-900 tracking-tight leading-snug mb-5">
              {fabric.name}
            </h1>

            {/* 3. Enquiry Options Just After Title: WhatsApp (WP), Form, Call */}
            <div className="w-full space-y-3 mb-6">
              {/* WhatsApp (WP) Option */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-6 rounded-md font-medium text-sm tracking-wide transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Enquire on WhatsApp</span>
              </a>

              {/* Form & Call Options */}
              <div className="grid grid-cols-2 gap-3">
                {/* Form Option: triggers B2B Enquiry modal */}
                <button
                  type="button"
                  onClick={() => onRequestEnquiry(`${fabric.name} (Design ID: ${designId})`)}
                  className="w-full flex items-center justify-center gap-2 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] py-3.5 px-4 rounded-md font-medium text-sm tracking-wide transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5 text-[#dfb15b] shrink-0" />
                  <span>Enquiry Form</span>
                </button>

                {/* Call Option */}
                <a
                  href="tel:+919875198837"
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 hover:border-stone-400 py-3.5 px-4 rounded-md font-medium text-sm tracking-wide transition-all shadow-2xs active:scale-[0.99]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#4a1122] shrink-0" />
                  <span>Call Us</span>
                </a>
              </div>

              {/* Small Supporting Text */}
              <p className="text-xs text-stone-500 font-sans tracking-wide leading-normal pt-1">
                Contact us for wholesale pricing, availability and bulk order details.
              </p>
            </div>

            {/* 4. Description in Last with "Read more" and "+" Option */}
            <div className="w-full pt-6 border-t border-stone-200 font-sans">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="font-serif text-lg font-normal text-stone-900">
                  Product Description
                </h2>
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4a1122] hover:text-[#7d1c38] transition-colors cursor-pointer select-none"
                >
                  <span className="w-5 h-5 flex items-center justify-center rounded-full border border-stone-300 text-stone-700 text-xs font-semibold leading-none">
                    {isDescriptionExpanded ? '−' : '+'}
                  </span>
                  <span>{isDescriptionExpanded ? 'Read less' : 'Read more'}</span>
                </button>
              </div>

              <div className="text-stone-600 text-sm leading-relaxed space-y-2">
                <p className={`${isDescriptionExpanded ? '' : 'line-clamp-3'} whitespace-pre-line text-stone-600`}>
                  {fabric.longDescription || fabric.description}
                </p>

                {/* Inline "+ Read more" / "− Read less" toggle */}
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-xs font-semibold text-[#4a1122] hover:text-[#7d1c38] inline-flex items-center gap-1 transition-colors cursor-pointer pt-0.5 select-none"
                >
                  <span>{isDescriptionExpanded ? '− Read less' : '+ Read more'}</span>
                </button>
              </div>

              {/* 5. Product Specifications: Always visible out of read more below it */}
              <div className="pt-5 mt-5 border-t border-stone-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider font-medium">Category</span>
                    <span className="text-stone-900 font-semibold text-sm mt-0.5 block">{categoryName || 'Saree'}</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider font-medium">Fabric & Weave</span>
                    <span className="text-stone-900 font-semibold text-sm mt-0.5 block">{fabric.fabricType || 'Saree'}</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider font-medium">Standard Width</span>
                    <span className="text-stone-900 font-semibold text-sm mt-0.5 block">{fabric.width || '44 Inches (Standard Saree Width)'}</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider font-medium">Design Code</span>
                    <span className="text-stone-900 font-mono font-semibold text-sm mt-0.5 block">{designId}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider font-medium">Minimum Order</span>
                    <span className="text-stone-900 font-semibold text-sm mt-0.5 block">{fabric.moq || 'Wholesale Bulk Orders & Custom Yardages on Request'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curated Companion & Related Section */}
        {fabric.related && fabric.related.length > 0 && (
          <div className="pt-12 border-t border-stone-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-normal text-stone-900">
                  Related {isTopDupatta ? 'Top + Dupatta Sets' : 'Sarees'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate(categoryPath) : onBack())}
                className="text-xs font-semibold text-[#4a1122] hover:text-[#7d1c38] transition-colors cursor-pointer"
              >
                View All {categoryName} →
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {fabric.related.map((rf) => (
                <FabricCard
                  key={rf.id}
                  fabric={rf}
                  onViewDetails={onViewFabric}
                  onRequestEnquiry={onRequestEnquiry}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
