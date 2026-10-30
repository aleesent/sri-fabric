import React, { useState } from 'react';
import { SEO_LOCATIONS, LocationSEOData } from '../data/seoLocations.ts';
import { SEOHead } from '../components/SEOHead.tsx';
import {
  MapPin,
  Truck,
  Clock,
  Package,
  Layers,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Phone,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Building2,
  FileCheck,
} from 'lucide-react';

interface LocationViewProps {
  locationSlug: string;
  onNavigate: (path: string) => void;
  onRequestEnquiry: (fabricName?: string) => void;
}

export const LocationView: React.FC<LocationViewProps> = ({
  locationSlug,
  onNavigate,
  onRequestEnquiry,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Fallback to 'surat' if slug not recognized
  const location: LocationSEOData = SEO_LOCATIONS[locationSlug] || SEO_LOCATIONS.surat;

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://srifabrics.com';
  const canonicalUrl = `${origin}/locations/${location.slug}`;

  // Build JSON-LD structured data: LocalBusiness + BreadcrumbList + FAQPage
  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: `SRI FABRIC – ${location.name} B2B Wholesale Hub`,
      alternateName: 'Sri Fabric Textile Wholesale Surat',
      description: location.metaDescription,
      url: canonicalUrl,
      telephone: '+91-98751-98837',
      priceRange: '₹₹',
      image: `${origin}/slides/hero-fabrics-home.jpg`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Ring Road Textile Market',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        postalCode: '395002',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 21.1959,
        longitude: 72.8302,
      },
      areaServed: [
        {
          '@type': 'City',
          name: location.name,
        },
        {
          '@type': 'State',
          name: location.state,
        },
        {
          '@type': 'Country',
          name: 'India',
        },
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:30',
          closes: '20:30',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Wholesale Sourcing Hubs',
          item: `${origin}/locations/india`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: location.name,
          item: canonicalUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: location.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-stone-900 min-h-screen">
      <SEOHead
        title={location.metaTitle}
        description={location.metaDescription}
        canonicalPath={`/locations/${location.slug}`}
        jsonLd={jsonLdData}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-[#f0ece1] border-b border-stone-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-stone-600">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-[#4a1122] transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-500">Wholesale Sourcing Hubs</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-[#4a1122]">{location.name}</span>
        </div>
      </nav>

      {/* Hero Header Section */}
      <header className="relative bg-[#1e050d] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#dfb15b]/30 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#dfb15b_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfb15b]/15 border border-[#dfb15b]/40 text-[#dfb15b] text-[11px] font-semibold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>Direct Surat Mill Supply to {location.name}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {location.h1}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-light">
            {location.subheading}
          </p>

          {/* Quick CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onRequestEnquiry(`Wholesale Sourcing Inquiry - ${location.name}`)}
              className="px-6 py-3 bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>REQUEST WHOLESALE QUOTE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={`https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20I%20am%20interested%20in%20direct%20wholesale%20textiles%20for%20${encodeURIComponent(location.name)}.`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all shadow-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP CONSULTATION</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Section 1: Market Context & Regional Wholesale Dynamics */}
        <section className="bg-white rounded-xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-[#4a1122]">
            <Building2 className="w-5 h-5 text-[#dfb15b]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1122]">
              Sourcing Direct Mill Textiles for {location.name}
            </h2>
          </div>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            {location.marketContext}
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAF7F2] p-4 rounded-lg border border-stone-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Dispatch Origin</span>
              <span className="font-bold text-[#4a1122] text-sm mt-0.5 block">Ring Road Textile Market, Surat</span>
            </div>
            <div className="bg-[#FAF7F2] p-4 rounded-lg border border-stone-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Monthly Capacity</span>
              <span className="font-bold text-[#4a1122] text-sm mt-0.5 block">500,000+ Metres Woven & Printed</span>
            </div>
            <div className="bg-[#FAF7F2] p-4 rounded-lg border border-stone-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">Dyeing & Inks</span>
              <span className="font-bold text-[#4a1122] text-sm mt-0.5 block">OEKO-TEX Compliant AZO-Free</span>
            </div>
          </div>
        </section>

        {/* Section 2: Key Fabric & Saree Collections Available */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#dfb15b] text-xs font-bold uppercase tracking-widest">
              PRODUCT PORTFOLIO
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1122]">
              Wholesale Collections Supplied to {location.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Curated ranges of plain weaves, digital printed textiles, and artisanal sarees ready for bulk dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {location.keyProducts.map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-5 border border-stone-200 shadow-xs hover:border-[#dfb15b] hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#4a1122]/10 text-[#4a1122] flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-0.5 group-hover:bg-[#4a1122] group-hover:text-[#dfb15b] transition-colors">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#4a1122] transition-colors">
                    {product}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Supplied directly from Surat looms with consistent thread tension and precise shade matching.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to catalogue */}
          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/fabrics')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4a1122] hover:text-[#731c36] transition-colors"
            >
              <span>Explore Complete Fabrics Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Section 3: Logistics, Transit & Supply Metrics */}
        <section className="bg-white rounded-xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[#dfb15b] text-xs font-bold uppercase tracking-widest">
              LOGISTICS & LEAD TIMES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1122]">
              Surat to {location.name} Transport & Supply Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5 p-4 rounded-lg bg-[#FAF7F2] border border-stone-200">
              <div className="flex items-center gap-2 text-[#4a1122]">
                <Clock className="w-4 h-4 text-[#dfb15b]" />
                <span className="font-bold text-xs uppercase tracking-wider">Dispatch Window</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700">{location.logistics.dispatchTime}</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-lg bg-[#FAF7F2] border border-stone-200">
              <div className="flex items-center gap-2 text-[#4a1122]">
                <Truck className="w-4 h-4 text-[#dfb15b]" />
                <span className="font-bold text-xs uppercase tracking-wider">Transit Duration</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700">{location.logistics.transitTime}</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-lg bg-[#FAF7F2] border border-stone-200">
              <div className="flex items-center gap-2 text-[#4a1122]">
                <Package className="w-4 h-4 text-[#dfb15b]" />
                <span className="font-bold text-xs uppercase tracking-wider">Minimum Order Quantity</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700">{location.logistics.moq}</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-lg bg-[#FAF7F2] border border-stone-200">
              <div className="flex items-center gap-2 text-[#4a1122]">
                <FileCheck className="w-4 h-4 text-[#dfb15b]" />
                <span className="font-bold text-xs uppercase tracking-wider">Swatch Sample Policy</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700">{location.logistics.sampleAvailability}</p>
            </div>

            <div className="space-y-1.5 p-4 rounded-lg bg-[#FAF7F2] border border-stone-200 sm:col-span-2">
              <div className="flex items-center gap-2 text-[#4a1122]">
                <Layers className="w-4 h-4 text-[#dfb15b]" />
                <span className="font-bold text-xs uppercase tracking-wider">Freight & Transport Channels</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700">{location.logistics.primaryCarriers}</p>
            </div>
          </div>
        </section>

        {/* Section 4: Why Wholesale Buyers in {location.name} Choose SRI FABRIC */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#dfb15b] text-xs font-bold uppercase tracking-widest">
              THE SRI FABRIC ADVANTAGE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1122]">
              Why B2B Buyers in {location.name} Partner With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {location.whyChooseUs.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#dfb15b] shrink-0" />
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#4a1122]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Expandable FAQs with Schema */}
        <section className="bg-white rounded-xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[#dfb15b] text-xs font-bold uppercase tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1122]">
              B2B Sourcing Questions for {location.name} Buyers
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {location.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-stone-200 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 bg-stone-50/60 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="font-serif font-semibold text-sm sm:text-base text-stone-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#4a1122] shrink-0 transition-transform duration-200 ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 py-4 bg-white text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/80">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Regional Hubs Interlinking Strip */}
        <section className="border-t border-stone-200 pt-10 space-y-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#4a1122]">
            Explore SRI FABRIC Wholesale Supply Across India
          </h3>
          <p className="text-xs text-stone-500">
            Select a commercial sourcing destination to view local transit times, key fabric varieties, and tailored B2B supply agreements:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.values(SEO_LOCATIONS).map((loc) => (
              <button
                key={loc.slug}
                onClick={() => onNavigate(`/locations/${loc.slug}`)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  loc.slug === location.slug
                    ? 'bg-[#4a1122] text-[#f7eedf] shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-300 hover:border-[#dfb15b] hover:text-[#4a1122]'
                }`}
              >
                {loc.name} Wholesale
              </button>
            ))}
          </div>
        </section>

        {/* Section 7: Final Conversion Call to Action */}
        <section className="bg-gradient-to-r from-[#24060d] via-[#3a0b16] to-[#1a050b] text-[#f7eedf] rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-xl border border-[#dfb15b]/30">
          <span className="text-[#dfb15b] text-xs font-bold uppercase tracking-widest">
            START YOUR B2B ORDER
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white max-w-2xl mx-auto">
            Ready to Source Direct Mill Fabrics for {location.name}?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-light leading-relaxed">
            Connect directly with our Surat mill technical sales team. We provide physical fabric swatch folders, transparent quotations, and fast, insured freight dispatch.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onRequestEnquiry(`Direct Mill Sourcing - ${location.name}`)}
              className="px-6 py-3 bg-[#dfb15b] hover:bg-[#ebd08f] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-md flex items-center gap-1.5"
            >
              <span>SUBMIT WHOLESALE INQUIRY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="tel:+919875198837"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#dfb15b]" />
              <span>CALL +91 98751 98837</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};
