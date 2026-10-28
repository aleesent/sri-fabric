import React from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  Send, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (path: string) => void;
  onRequestEnquiry?: (fabricName?: string) => void;
}

// Rosette flower icon matching the original brochure bullet points
const FloralRosette: React.FC<{ className?: string }> = ({ className = "w-3 h-3 text-[#650D18]" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`inline-block shrink-0 ${className}`}
  >
    <path d="M12 2C12.5 4 13.5 5 15.5 5.5C13.5 6 12.5 7 12 9C11.5 7 10.5 6 8.5 5.5C10.5 5 11.5 4 12 2Z" />
    <path d="M19 8.5C19.5 10.5 20.5 11.5 22.5 12C20.5 12.5 19.5 13.5 19 15.5C18.5 13.5 17.5 12.5 15.5 12C17.5 11.5 18.5 10.5 19 8.5Z" />
    <path d="M12 15C12.5 17 13.5 18 15.5 18.5C13.5 19 12.5 20 12 22C11.5 20 10.5 19 8.5 18.5C10.5 18 11.5 17 12 15Z" />
    <path d="M5 8.5C5.5 10.5 6.5 11.5 8.5 12C6.5 12.5 5.5 13.5 5 15.5C4.5 13.5 3.5 12.5 1.5 12C3.5 11.5 4.5 10.5 5 8.5Z" />
    <circle cx="12" cy="12" r="2.2" />
  </svg>
);

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onRequestEnquiry }) => {
  const handleEnquiry = (topic: string = 'Digital Fabric Printing') => {
    if (onRequestEnquiry) {
      onRequestEnquiry(topic);
    } else if (onNavigate) {
      onNavigate('contact');
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#292929] selection:bg-[#B69A67]/25 selection:text-[#650D18]">
      
      {/* Top Header Navigation Strip */}
      <div className="w-full bg-[#FDFBF7] border-b border-[#B69A67]/20 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 text-xs tracking-wider text-[#650D18]">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate?.('home')} 
              className="hover:text-[#B69A67] transition-colors uppercase font-medium tracking-widest text-[11px]"
            >
              Home
            </button>
            <span className="text-[#B69A67]/60">/</span>
            <span className="text-[#292929] font-medium tracking-widest uppercase text-[11px]">About SRI FABRIC</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] uppercase tracking-widest text-[#B69A67]">
            <a href="#company-introduction" className="hover:text-[#650D18] transition-colors">
              <span className="inline sm:hidden">I. Company</span>
              <span className="hidden sm:inline">I. Company Introduction</span>
            </a>
            <span>•</span>
            <a href="#founder-story" className="hover:text-[#650D18] transition-colors">
              <span className="inline sm:hidden">II. Founder</span>
              <span className="hidden sm:inline">II. Founder Story</span>
            </a>
            <span>•</span>
            <a href="#why-sri" className="hover:text-[#650D18] transition-colors">III. Why SRI</a>
          </div>
        </div>
      </div>

      {/* Main Full-Width Content Container with Subtle Spacing Between Sections */}
      <main className="w-full space-y-8 sm:space-y-12 lg:space-y-16 py-6 sm:py-10">

        {/* =========================================================================
            SECTION 1: COMPANY INTRODUCTION & SERVICES
            Desktop (>= 750px): Full-Width Original Canvas Plate with Container Queries
            Mobile (< 750px): Clean Vertically Stacked Editorial Layout
            ========================================================================= */}
        <section 
          id="company-introduction" 
          className="w-full scroll-mt-24"
        >
          {/* DESKTOP VIEW (>= 750px) */}
          <div className="hidden min-[750px]:block w-full bg-[#FAF7F2] border-y border-[#B69A67]/25 shadow-sm overflow-hidden">
            <div className="relative w-full aspect-[1682/935] [container-type:inline-size]">
              
              {/* Background Image Artwork */}
              <img 
                src="/company intro.png" 
                alt="SRI FABRIC — Company Introduction & Printing Services"
                className="w-full h-full object-cover block select-none pointer-events-none"
                loading="eager"
              />

              {/* 1. TOP-RIGHT BURGUNDY PANEL: "for all your printing needs..." + DIRECT MILL INQUIRIES */}
              <div className="absolute left-[81.4%] top-[7.2%] w-[17.5%] z-20 flex flex-col items-start text-white">
                
                {/* Headline: for all your printing needs... */}
                <div className="select-none pointer-events-none mb-[0.6cqi]">
                  <p className="text-[1.38cqi] font-serif italic text-white/95 leading-none mb-[0.25cqi]">
                    for all your
                  </p>
                  <h2 className="text-[2.6cqi] font-serif font-bold text-white tracking-tight leading-none mb-[0.25cqi]">
                    printing
                  </h2>
                  <h3 className="text-[2.4cqi] font-serif font-light text-white tracking-tight leading-none mb-[0.6cqi]">
                    needs...
                  </h3>
                  <div className="w-[4.8cqi] h-[1px] bg-[#B69A67]" />
                </div>

                {/* Direct Mill Inquiries - Flexible, Unboxed Editorial Layout */}
                <div className="w-full flex flex-col items-start gap-[0.50cqi]">
                  <div className="flex items-center gap-[0.35cqi]">
                    <Sparkles className="w-[0.70cqi] h-[0.70cqi] text-[#E5D7B7] shrink-0" />
                    <span className="text-[0.62cqi] uppercase tracking-[0.22em] text-[#E5D7B7] font-semibold">
                      Direct Mill Inquiries
                    </span>
                  </div>

                  <p className="text-[0.60cqi] text-white/85 leading-snug font-sans">
                    Custom digital printing • Surat, Gujarat
                  </p>

                  <div className="w-full flex flex-col gap-[0.42cqi] mt-[0.2cqi]">
                    <button 
                      onClick={() => handleEnquiry('Direct Mill Sampling & Digital Fabric Printing')}
                      className="w-full flex items-center justify-center gap-[0.4cqi] py-[0.45cqi] px-[0.7cqi] bg-[#650D18] hover:bg-[#851322] text-white text-[0.64cqi] font-semibold tracking-wider uppercase rounded-sm border border-[#B69A67]/60 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      <Send className="w-[0.62cqi] h-[0.62cqi] text-[#E5D7B7]" />
                      <span>Request Sampling</span>
                      <ArrowRight className="w-[0.55cqi] h-[0.55cqi] text-[#E5D7B7]" />
                    </button>

                    <div className="w-full flex items-center gap-[0.38cqi]">
                      <a 
                        href="https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20I%20am%20interested%20in%20direct%20mill%20fabric%20printing" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-[0.3cqi] py-[0.40cqi] bg-[#25D366]/90 hover:bg-[#25D366] text-white text-[0.58cqi] font-medium tracking-wide rounded-sm shadow-sm transition-all cursor-pointer"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-[0.60cqi] h-[0.60cqi]" />
                        <span>WhatsApp</span>
                      </a>
                      <a 
                        href="tel:+919875198837" 
                        className="flex-1 flex items-center justify-center gap-[0.3cqi] py-[0.40cqi] bg-white/12 hover:bg-white/22 text-white text-[0.58cqi] font-medium tracking-wide rounded-sm border border-white/20 transition-all cursor-pointer"
                        title="Direct Phone Call"
                      >
                        <PhoneCall className="w-[0.60cqi] h-[0.60cqi] text-[#E5D7B7]" />
                        <span>Call Mill</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* 2. CENTER-LEFT IVORY PANEL: SRI (Exact Original Text) */}
              <div className="absolute left-[30.6%] top-[14.8%] w-[22.6%] z-10 text-[#292929]">
                <h1 className="text-[2.6cqi] font-serif font-bold text-[#650D18] tracking-wide leading-none mb-[1.0cqi]">
                  SRI
                </h1>
                <p className="text-[0.74cqi] text-[#292929] leading-[1.48] font-sans text-justify">
                  <strong>SRI</strong> is a well known service provider of Digital Fabric Designing and Printing. Our services are offered by our very professional, experienced and skilled team mates using advanced designing technologies. We have succeeded to serve number of clients .associated with garment industry with quality, innovation and competitive prices. We have attained 100% client satisfaction by serving our clients as par their exact requirements. Owing to our ethical business polices, client centric approach, timely execution and services offered with innovative ideas and creativity; we have been able to gain a respected position in the market.
                </p>
              </div>

              {/* 3. RIGHT IVORY PANEL: Printing Solutions & Applications */}
              <div className="absolute left-[56.2%] top-[15.0%] w-[21.2%] z-10 text-[#292929]">
                <p className="text-[0.74cqi] text-[#292929] leading-[1.48] font-sans text-justify mb-[1.2cqi]">
                  Our company is one of the most promising Digital Fabric Printing Service Providers. Our world best Digital Textile Printing Solutions are widely reckoned by the clients all over the country. At our studio we provide a variety of fabric design, fabric printng and making services, from developing a specific design for you or putting your artwork in repeat to a roll of fabric specifically printed to your requirements. Our finishing & manufacturing sewing services include custom sewing services for Home Furnishings, Art Installations, Fashion, Merchandise Displays.
                </p>

                {/* APPLICATION INCLUDED Box */}
                <div className="w-[16.5cqi] py-[0.45cqi] bg-[#650D18] text-white text-center rounded-[2px] shadow-sm mb-[0.9cqi]">
                  <span className="text-[0.72cqi] font-serif font-semibold tracking-[0.16em] uppercase">
                    APPLICATION INCLUDED
                  </span>
                </div>

                {/* Two-Column Service List with Floral Rosette Bullets */}
                <div className="grid grid-cols-2 gap-x-[1.0cqi] gap-y-[0.45cqi] text-[0.70cqi] text-[#292929] font-sans">
                  <div className="flex items-center gap-[0.45cqi]">
                    <FloralRosette className="w-[0.72cqi] h-[0.72cqi] text-[#650D18]" />
                    <span>Fashion Fabric Printing</span>
                  </div>
                  <div className="flex items-center gap-[0.45cqi]">
                    <FloralRosette className="w-[0.72cqi] h-[0.72cqi] text-[#650D18]" />
                    <span>Interiors printing</span>
                  </div>
                  <div className="flex items-center gap-[0.45cqi]">
                    <FloralRosette className="w-[0.72cqi] h-[0.72cqi] text-[#650D18]" />
                    <span>Swimwear printing</span>
                  </div>
                  <div className="flex items-center gap-[0.45cqi]">
                    <FloralRosette className="w-[0.72cqi] h-[0.72cqi] text-[#650D18]" />
                    <span>Backdrops and Display</span>
                  </div>
                  <div className="flex items-center gap-[0.45cqi]">
                    <FloralRosette className="w-[0.72cqi] h-[0.72cqi] text-[#650D18]" />
                    <span>Sportswear printing</span>
                  </div>
                  <div className="flex items-center gap-[0.45cqi]">
                    <FloralRosette className="w-[0.72cqi] h-[0.72cqi] text-[#650D18]" />
                    <span>Photo Canvasses</span>
                  </div>
                </div>
              </div>

              {/* 4. BOTTOM-LEFT IVORY PANEL: Fashion Solution For You & Your Home */}
              <div className="absolute left-[6.0%] top-[67.0%] w-[30.0%] z-10 text-[#292929]">
                <div className="w-[4.6cqi] h-[1.5px] bg-[#B69A67] mb-[0.8cqi]" />
                <h2 className="text-[2.0cqi] font-serif font-medium text-[#650D18] leading-[1.15] mb-[0.2cqi]">
                  Fashion Solution For
                </h2>
                <h3 className="text-[2.2cqi] font-serif font-normal text-[#292929] leading-[1.15]">
                  You & Your Home
                </h3>
              </div>

            </div>
          </div>

          {/* MOBILE VIEW (< 750px): Clean Vertically Stacked Editorial Flow */}
          <div className="block min-[750px]:hidden w-full bg-[#FAF7F2] border-y border-[#B69A67]/25 shadow-sm overflow-hidden">
            
            {/* 1. Mobile Main Intro Text Card */}
            <div className="px-5 py-6 bg-[#FAF7F2] border-b border-[#B69A67]/20">
              <h1 className="text-2xl font-serif font-bold text-[#650D18] tracking-wide mb-3">
                SRI
              </h1>
              <p className="text-sm text-[#292929] leading-relaxed font-sans text-justify mb-4">
                <strong>SRI</strong> is a well known service provider of Digital Fabric Designing and Printing. Our services are offered by our very professional, experienced and skilled team mates using advanced designing technologies. We have succeeded to serve number of clients .associated with garment industry with quality, innovation and competitive prices. We have attained 100% client satisfaction by serving our clients as par their exact requirements. Owing to our ethical business polices, client centric approach, timely execution and services offered with innovative ideas and creativity; we have been able to gain a respected position in the market.
              </p>
              
              <div className="pt-2 border-t border-[#B69A67]/20">
                <h3 className="text-base font-serif font-medium text-[#650D18]">
                  Fashion Solution For
                </h3>
                <h4 className="text-lg font-serif font-normal text-[#292929]">
                  You & Your Home
                </h4>
              </div>
            </div>

            {/* 2. Responsive Mill Artwork Preview (printing1.png for mobile view) */}
            <div className="px-4 sm:px-5 py-4 bg-[#FAF7F2] border-b border-[#B69A67]/20">
              <div className="relative w-full aspect-[1672/941] overflow-hidden rounded-[2px] border border-[#B69A67]/35 shadow-[0_4px_20px_-4px_rgba(19,0,0,0.08)] bg-[#130000]">
                <img 
                  src="/printing1.png" 
                  alt="SRI FABRICS — Digital Textile Printing Production & Machinery"
                  className="w-full h-full object-cover block select-none pointer-events-none"
                  loading="eager"
                />
              </div>
            </div>

            {/* 3. Mobile Solutions & Applications Included */}
            <div className="px-5 py-6 bg-[#FDFBF7] border-b border-[#B69A67]/20">
              <p className="text-sm text-[#292929] leading-relaxed font-sans text-justify mb-5">
                Our company is one of the most promising Digital Fabric Printing Service Providers. Our world best Digital Textile Printing Solutions are widely reckoned by the clients all over the country. At our studio we provide a variety of fabric design, fabric printng and making services, from developing a specific design for you or putting your artwork in repeat to a roll of fabric specifically printed to your requirements. Our finishing & manufacturing sewing services include custom sewing services for Home Furnishings, Art Installations, Fashion, Merchandise Displays.
              </p>

              {/* APPLICATION INCLUDED Box */}
              <div className="w-full py-2 bg-[#650D18] text-white text-center rounded-[2px] shadow-sm mb-4">
                <span className="text-xs font-serif font-semibold tracking-widest uppercase">
                  APPLICATION INCLUDED
                </span>
              </div>

              {/* 2-Column Application List */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs text-[#292929] font-sans">
                <div className="flex items-center gap-1.5">
                  <FloralRosette className="w-3 h-3 text-[#650D18]" />
                  <span>Fashion Fabric Printing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FloralRosette className="w-3 h-3 text-[#650D18]" />
                  <span>Interiors printing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FloralRosette className="w-3 h-3 text-[#650D18]" />
                  <span>Swimwear printing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FloralRosette className="w-3 h-3 text-[#650D18]" />
                  <span>Backdrops & Display</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FloralRosette className="w-3 h-3 text-[#650D18]" />
                  <span>Sportswear printing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FloralRosette className="w-3 h-3 text-[#650D18]" />
                  <span>Photo Canvasses</span>
                </div>
              </div>
            </div>

            {/* 4. Mobile Direct Mill Inquiries & Printing Needs Banner (Shifted to End of Section) */}
            <div className="w-full bg-gradient-to-b from-[#1C0000] to-[#130000] text-white px-5 py-6">
              <p className="text-sm font-serif italic text-white/90 mb-1">
                for all your
              </p>
              <h2 className="text-2xl font-serif font-bold text-white tracking-tight leading-none mb-1">
                printing needs...
              </h2>
              <div className="w-12 h-px bg-[#B69A67] mb-4" />

              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-4 h-4 text-[#E5D7B7]" />
                <span className="text-xs uppercase tracking-widest text-[#E5D7B7] font-semibold">
                  Direct Mill Inquiries
                </span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed font-sans mb-4">
                Bespoke digital textile printing • Surat, Gujarat
              </p>

              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={() => handleEnquiry('Direct Mill Sampling & Digital Fabric Printing')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#650D18] hover:bg-[#851322] text-white text-xs font-semibold tracking-wider uppercase rounded-[2px] border border-[#B69A67]/60 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#E5D7B7]" />
                  <span>Request Sampling</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5D7B7]" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20I%20am%20interested%20in%20direct%20mill%20fabric%20printing" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366] text-white text-xs font-medium rounded-[2px] shadow-sm cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a 
                    href="tel:+919875198837" 
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/12 hover:bg-white/20 text-white text-xs font-medium rounded-[2px] border border-white/20 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#E5D7B7]" />
                    <span>Call Mill</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 2: FOUNDER STORY — MR. JIGNESSH MEHTA
            Desktop (>= 750px): Full-Width Seamless Two-Column Layout
            Mobile (< 750px): Clean Vertically Stacked Founder Biography + Artwork Card
            ========================================================================= */}
        <section 
          id="founder-story" 
          className="w-full scroll-mt-24"
        >
          {/* DESKTOP VIEW (>= 750px) */}
          <div className="hidden min-[750px]:block w-full bg-[#FAF7F2] border-y border-[#B69A67]/25 shadow-sm overflow-hidden">
            <div className="w-full grid grid-cols-2 items-stretch gap-0">
              
              {/* LHS: Text Panel (Full Left-Hand Available Width) */}
              <div className="w-full bg-[#FAF7F2] px-6 sm:px-10 lg:px-14 xl:px-20 py-10 sm:py-14 lg:py-16 flex flex-col justify-center border-r border-[#B69A67]/20">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#650D18] leading-tight mb-3">
                  Mr. Jignessh Mehta
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-px bg-[#292929]/40" />
                  <span className="text-xs text-[#292929]">❖</span>
                  <div className="w-12 h-px bg-[#292929]/40" />
                </div>

                <p className="text-sm sm:text-base lg:text-[15px] xl:text-base text-[#292929] leading-relaxed font-sans mb-4">
                  When one visionary man set out, on his mission to fulfill his dream of the perfect digital fabric printing for the world, his passion gave birth to a company called <strong className="text-[#292929] font-bold">SRI</strong>.
                </p>

                <p className="text-sm sm:text-base lg:text-[15px] xl:text-base text-[#292929] leading-relaxed font-sans mb-4">
                  The man is Jignessh Mehta. His enthusiasm for quality digital fabrics printing inspired him to bring innovations to <strong className="text-[#292929] font-bold">SRI</strong> since its inception in <strong className="text-[#650D18] font-bold">2015</strong>.
                </p>

                <p className="text-sm sm:text-base lg:text-[15px] xl:text-base text-[#292929] leading-relaxed font-sans mb-4">
                  He come with a complete love of fabrics and printing with a special passion for design. His challenge is to combine the originality of design with a printing process that promotes excellence, combining the creativity, elegance, style and art to obtain a result that makes one’s home and personal accessories feel unique and attractive. With the textural sense of a perfectly chosen fabric and color with special attention to detail, he wants to transform his vision so that it provokes, stimulates, and complements your life style.
                </p>

                <p className="text-sm sm:text-base lg:text-[15px] xl:text-base text-[#292929] leading-relaxed font-sans">
                  With 22 years of experience in textile design and textile product development, he has developed new scope in the Apparel, Home Furnishing, Art Installation, Merchandised Display.
                </p>
              </div>

              {/* RHS: Image Container (Full Right-Hand Available Width) */}
              <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden bg-[#180409]">
                <img 
                  src="/our founder.png" 
                  alt="SRI FABRIC — Founder Story Mr. Jignessh Mehta" 
                  style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'right center' }}
                  className="w-full h-full block object-cover select-none pointer-events-none"
                  loading="lazy"
                />

                {/* Right Brocade Overlay: A VISION WOVEN WITH PASSION */}
                <div className="absolute right-6 sm:right-10 top-8 z-10 text-center text-white select-none pointer-events-none max-w-[210px]">
                  <div className="flex justify-center mb-2">
                    <div className="text-base text-[#E5D7B7]">❖</div>
                  </div>

                  <h2 className="text-base sm:text-lg font-serif font-normal tracking-[0.22em] text-white uppercase leading-snug mb-2">
                    A VISION<br />
                    WOVEN WITH<br />
                    PASSION
                  </h2>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-px bg-[#E5D7B7]/60" />
                    <span className="text-[10px] text-[#E5D7B7]">❖</span>
                    <div className="w-8 h-px bg-[#E5D7B7]/60" />
                  </div>

                  <p className="text-[10px] sm:text-xs font-sans tracking-[0.26em] text-[#E5D7B7] uppercase font-medium leading-relaxed">
                    FABRICS FOR<br />
                    A BRIGHTER<br />
                    TOMORROW
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* MOBILE VIEW (< 750px): Vertically Stacked Clean Layout */}
          <div className="block min-[750px]:hidden w-full bg-[#FAF7F2] border-y border-[#B69A67]/25 shadow-sm overflow-hidden">
            
            {/* 1. Mobile Founder Biography Text Card */}
            <div className="px-5 py-6 bg-[#FAF7F2] border-b border-[#B69A67]/20">
              <h1 className="text-2xl font-serif font-bold text-[#650D18] leading-tight mb-2">
                Mr. Jignessh Mehta
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-px bg-[#292929]/40" />
                <span className="text-xs text-[#292929]">❖</span>
                <div className="w-10 h-px bg-[#292929]/40" />
              </div>

              <p className="text-sm text-[#292929] leading-relaxed font-sans mb-3 text-justify">
                When one visionary man set out, on his mission to fulfill his dream of the perfect digital fabric printing for the world, his passion gave birth to a company called <strong className="text-[#292929] font-bold">SRI</strong>.
              </p>

              <p className="text-sm text-[#292929] leading-relaxed font-sans mb-3 text-justify">
                The man is Jignessh Mehta. His enthusiasm for quality digital fabrics printing inspired him to bring innovations to <strong className="text-[#292929] font-bold">SRI</strong> since its inception in <strong className="text-[#650D18] font-bold">2015</strong>.
              </p>

              <p className="text-sm text-[#292929] leading-relaxed font-sans mb-3 text-justify">
                He come with a complete love of fabrics and printing with a special passion for design. His challenge is to combine the originality of design with a printing process that promotes excellence, combining the creativity, elegance, style and art to obtain a result that makes one’s home and personal accessories feel unique and attractive. With the textural sense of a perfectly chosen fabric and color with special attention to detail, he wants to transform his vision so that it provokes, stimulates, and complements your life style.
              </p>

              <p className="text-sm text-[#292929] leading-relaxed font-sans text-justify">
                With 22 years of experience in textile design and textile product development, he has developed new scope in the Apparel, Home Furnishing, Art Installation, Merchandised Display.
              </p>
            </div>

            {/* 2. Mobile Founder Visual Banner */}
            <div className="relative w-full h-[260px] sm:h-[320px] overflow-hidden bg-[#180409]">
              <img 
                src="/our founder.png" 
                alt="SRI FABRIC — Founder Story Mr. Jignessh Mehta" 
                style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'right center' }}
                className="w-full h-full block object-cover select-none pointer-events-none"
                loading="lazy"
              />

              {/* Mobile Verse Overlay */}
              <div className="absolute right-4 top-5 z-10 text-center text-white select-none pointer-events-none max-w-[180px] bg-black/40 backdrop-blur-xs p-3 rounded border border-white/10">
                <div className="text-sm text-[#E5D7B7] mb-1">❖</div>
                <h2 className="text-xs font-serif tracking-[0.2em] text-white uppercase leading-snug mb-1">
                  A VISION<br />
                  WOVEN WITH<br />
                  PASSION
                </h2>
                <div className="w-6 h-px bg-[#E5D7B7]/60 mx-auto mb-1" />
                <p className="text-[9px] font-sans tracking-widest text-[#E5D7B7] uppercase font-medium">
                  FABRICS FOR A BRIGHTER TOMORROW
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 3: WHY SRI FABRIC — QUALITY & COMMITMENT
            Desktop (>= 750px): Full-Width Original Canvas Plate with Container Queries
            Mobile (< 750px): Clean Vertically Stacked Capabilities & Story
            ========================================================================= */}
        <section 
          id="why-sri" 
          className="w-full scroll-mt-24"
        >
          {/* DESKTOP VIEW (>= 750px) */}
          <div className="hidden min-[750px]:block w-full bg-[#FAF7F2] border-y border-[#B69A67]/25 shadow-sm overflow-hidden">
            <div className="relative w-full aspect-[1683/935] [container-type:inline-size]">
              
              {/* Background Image Artwork */}
              <img 
                src="/why sri all in.png" 
                alt="SRI FABRIC — Why Us? Quality & Commitment"
                className="w-full h-full object-cover block select-none pointer-events-none"
                loading="lazy"
              />

              {/* 1. TOP-RIGHT IVORY PANEL */}
              <div className="absolute left-[80.8%] top-[7.0%] w-[17.5%] z-10 text-[#292929]">
                <h3 className="text-[1.32cqi] font-serif text-[#650D18] leading-[1.18] mb-[0.1cqi]">
                  Customer First,
                </h3>
                <h3 className="text-[1.32cqi] font-serif text-[#650D18] leading-[1.18] mb-[0.1cqi]">
                  Integrity-Based,
                </h3>
                <h3 className="text-[1.32cqi] font-serif text-[#650D18] leading-[1.18] mb-[0.2cqi]">
                  Pursuit of
                </h3>
                <h2 className="text-[3.5cqi] font-serif font-normal text-[#292929] leading-none tracking-tight">
                  Quality
                </h2>
              </div>

              {/* 2. CENTER-LEFT IVORY PANEL: Why Us? & Bullet List */}
              <div className="absolute left-[31.0%] top-[11.8%] w-[21.8%] z-10 text-[#292929]">
                <h1 className="text-[2.4cqi] font-serif font-bold text-[#650D18] leading-none mb-[0.8cqi]">
                  Why Us?
                </h1>

                <p className="text-[0.73cqi] text-[#292929] leading-[1.44] font-sans mb-[0.7cqi]">
                  Our Digital Fabric Printing service is quite dependable. We believe in the satisfaction of our client as the stepping stone for success.
                </p>

                <div className="w-full h-[1px] bg-[#650D18]/30 mb-[0.6cqi]" />

                <p className="text-[0.71cqi] text-[#292929] leading-[1.42] font-sans mb-[0.6cqi]">
                  Capacity to offer high quality & reliable digital fabric printing solutions for clients who want to see their textile designs replicated on fabric rather than paper.
                </p>
                <div className="w-full h-[1px] bg-[#650D18]/30 mb-[0.6cqi]" />

                <p className="text-[0.71cqi] text-[#292929] leading-[1.42] font-sans mb-[0.6cqi]">
                  We sustain the advantage of printing traditional fabrics digitally with utmost accuracy and can handle bulk orders with complete ease.
                </p>
                <div className="w-full h-[1px] bg-[#650D18]/30 mb-[0.6cqi]" />

                <p className="text-[0.71cqi] text-[#292929] leading-[1.42] font-sans mb-[0.6cqi]">
                  We combine technology & skilled manpower to offer quality digital fabric printing.
                </p>
                <div className="w-full h-[1px] bg-[#650D18]/30 mb-[0.6cqi]" />

                <p className="text-[0.71cqi] text-[#292929] leading-[1.42] font-sans mb-[0.6cqi]">
                  We treat job individual with due respect to its own character.
                </p>
                <div className="w-full h-[1px] bg-[#650D18]/30 mb-[0.6cqi]" />

                <p className="text-[0.71cqi] text-[#292929] leading-[1.42] font-sans">
                  We can print on various types of blends like cotton, silk, polyester, modal, viscose, nylon etc.
                </p>
              </div>

              {/* 3. RIGHT-MIDDLE IVORY PANEL: Three Narrative Paragraphs */}
              <div className="absolute left-[56.4%] top-[14.0%] w-[21.4%] z-10 text-[#292929]">
                <p className="text-[0.73cqi] text-[#292929] leading-[1.46] font-sans text-justify mb-[1.0cqi]">
                  A resourceful digital fabric printing solutions provider for fashion, interior and marketing industries, we are the company focused on absolute quality, creativity and full commitment to customised textile solutions.
                </p>

                <p className="text-[0.73cqi] text-[#292929] leading-[1.46] font-sans text-justify mb-[1.0cqi]">
                  This digital process means little to no setup costs, your choice of short or long print runs and the ability to repeat your prints in future. Our water-based dyes are environmentally-friendly, and dye-sublimation ensure that your print will never wash or wear-it become part of fabric!
                </p>

                <p className="text-[0.73cqi] text-[#292929] leading-[1.46] font-sans text-justify">
                  By providing high quality digital fabric printing solutions, we have established ourselves as one of the leading players in our sphere of activity across the globe. We take pride in our excellent track record for serving our clients with consistently superior & creative digital printing solutions. Today, we have a long list of satisfied customers who always look up to us for their various requirements.
                </p>
              </div>

              {/* 4. BOTTOM-LEFT IVORY PANEL */}
              <div className="absolute left-[4.2%] top-[73.0%] w-[34.0%] z-10 text-[#292929]">
                <div className="w-[4.6cqi] h-[1.5px] bg-[#B69A67] mb-[0.8cqi]" />
                <h2 className="text-[2.0cqi] font-serif font-medium text-[#650D18] leading-[1.16] mb-[0.2cqi]">
                  SRI - Bringing your
                </h2>
                <h3 className="text-[2.2cqi] font-serif font-normal text-[#292929] leading-[1.16]">
                  Fashion and
                </h3>
                <h3 className="text-[2.2cqi] font-serif font-normal text-[#292929] leading-[1.16]">
                  Interior Design ideas to life
                </h3>
              </div>

            </div>
          </div>

          {/* MOBILE VIEW (< 750px): Vertically Stacked Quality & Solutions */}
          <div className="block min-[750px]:hidden w-full bg-[#FAF7F2] border-y border-[#B69A67]/25 shadow-sm overflow-hidden">
            
            {/* 1. Mobile Quality Motto */}
            <div className="px-5 py-5 bg-[#FAF7F2] border-b border-[#B69A67]/20">
              <h3 className="text-base font-serif text-[#650D18] leading-tight">
                Customer First, Integrity-Based,
              </h3>
              <h3 className="text-sm font-serif text-[#650D18] mb-1">
                Pursuit of
              </h3>
              <h2 className="text-3xl font-serif font-bold text-[#292929] tracking-tight">
                Quality
              </h2>
            </div>

            {/* 2. Mobile Why Us? Capabilities */}
            <div className="px-5 py-6 bg-[#FAF7F2] border-b border-[#B69A67]/20">
              <h1 className="text-2xl font-serif font-bold text-[#650D18] mb-2">
                Why Us?
              </h1>
              <p className="text-sm text-[#292929] leading-relaxed font-sans mb-4 text-justify">
                Our Digital Fabric Printing service is quite dependable. We believe in the satisfaction of our client as the stepping stone for success.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#292929] font-sans">
                <div className="pt-2 border-t border-[#650D18]/20 flex items-start gap-2">
                  <span className="text-[#650D18] font-bold">1.</span>
                  <p>Capacity to offer high quality & reliable digital fabric printing solutions for clients who want to see their textile designs replicated on fabric rather than paper.</p>
                </div>
                <div className="pt-2 border-t border-[#650D18]/20 flex items-start gap-2">
                  <span className="text-[#650D18] font-bold">2.</span>
                  <p>We sustain the advantage of printing traditional fabrics digitally with utmost accuracy and can handle bulk orders with complete ease.</p>
                </div>
                <div className="pt-2 border-t border-[#650D18]/20 flex items-start gap-2">
                  <span className="text-[#650D18] font-bold">3.</span>
                  <p>We combine technology & skilled manpower to offer quality digital fabric printing.</p>
                </div>
                <div className="pt-2 border-t border-[#650D18]/20 flex items-start gap-2">
                  <span className="text-[#650D18] font-bold">4.</span>
                  <p>We treat job individual with due respect to its own character.</p>
                </div>
                <div className="pt-2 border-t border-[#650D18]/20 flex items-start gap-2">
                  <span className="text-[#650D18] font-bold">5.</span>
                  <p>We can print on various types of blends like cotton, silk, polyester, modal, viscose, nylon etc.</p>
                </div>
              </div>
            </div>

            {/* 3. Mobile Visual Artwork Banner (why sri1.png for mobile view) */}
            <div className="px-4 sm:px-5 py-4 bg-[#FAF7F2] border-b border-[#B69A67]/20">
              <div className="relative w-full aspect-[1882/836] overflow-hidden rounded-[2px] border border-[#B69A67]/35 shadow-[0_4px_20px_-4px_rgba(19,0,0,0.08)] bg-[#130000] flex items-center justify-center">
                <img 
                  src="/why sri1.png" 
                  alt="SRI FABRICS — Fabrics For A Brighter Tomorrow"
                  className="w-full h-full object-contain block select-none pointer-events-none"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 4. Mobile Digital Solutions Narrative */}
            <div className="px-5 py-6 bg-[#FDFBF7]">
              <p className="text-sm text-[#292929] leading-relaxed font-sans text-justify mb-3">
                A resourceful digital fabric printing solutions provider for fashion, interior and marketing industries, we are the company focused on absolute quality, creativity and full commitment to customised textile solutions.
              </p>
              <p className="text-sm text-[#292929] leading-relaxed font-sans text-justify mb-3">
                This digital process means little to no setup costs, your choice of short or long print runs and the ability to repeat your prints in future. Our water-based dyes are environmentally-friendly, and dye-sublimation ensure that your print will never wash or wear-it become part of fabric!
              </p>
              <p className="text-sm text-[#292929] leading-relaxed font-sans text-justify mb-5">
                By providing high quality digital fabric printing solutions, we have established ourselves as one of the leading players in our sphere of activity across the globe. We take pride in our excellent track record for serving our clients with consistently superior & creative digital printing solutions. Today, we have a long list of satisfied customers who always look up to us for their various requirements.
              </p>

              <div className="pt-4 border-t border-[#B69A67]/25">
                <h2 className="text-base font-serif font-medium text-[#650D18]">
                  SRI - Bringing your
                </h2>
                <h3 className="text-lg font-serif font-normal text-[#292929]">
                  Fashion and Interior Design ideas to life
                </h3>
              </div>
            </div>

          </div>
        </section>

      </main>

    </div>
  );
};
