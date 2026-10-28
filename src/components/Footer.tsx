import React from 'react';
import { Logo } from './Logo.tsx';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0c0305] text-[#b8a99c] pt-16 sm:pt-20 pb-10 border-t border-[#dfb15b]/20">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/5">
          {/* Column 1: Brand & Heritage (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <button
              onClick={() => onNavigate('/')}
              className="text-left focus:outline-none transition-opacity hover:opacity-90"
              aria-label="SRI Fabrics Home"
            >
              <Logo variant="gold" size="md" showTagline={true} />
            </button>

            <p className="text-xs sm:text-[13px] leading-relaxed text-stone-400 max-w-md font-light">
              Pioneers in high-speed rapier and Jacquard weaves. We craft luxury sarees,
              couture textiles, and wholesale fabric collections for prestigious fashion houses,
              garment exporters, and bridal couturiers across the globe.
            </p>

            {/* Subtle Mill Details */}
            <div className="flex items-center gap-2 text-[11px] text-[#dfb15b]/80 tracking-wider uppercase">
              <span>Surat Textile Hub</span>
              <span className="text-white/20">·</span>
              <span>Direct Mill Supply</span>
              <span className="text-white/20">·</span>
              <span>Global Dispatch</span>
            </div>

            {/* Elegant Minimal Social Outlets */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 text-stone-300 hover:text-[#dfb15b] hover:border-[#dfb15b]/60 hover:bg-[#dfb15b]/10 flex items-center justify-center transition-all duration-300"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 text-stone-300 hover:text-[#dfb15b] hover:border-[#dfb15b]/60 hover:bg-[#dfb15b]/10 flex items-center justify-center transition-all duration-300"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 text-stone-300 hover:text-[#dfb15b] hover:border-[#dfb15b]/60 hover:bg-[#dfb15b]/10 flex items-center justify-center transition-all duration-300"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 text-stone-300 hover:text-[#dfb15b] hover:border-[#dfb15b]/60 hover:bg-[#dfb15b]/10 flex items-center justify-center transition-all duration-300"
                title="Pinterest"
                aria-label="Pinterest"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.241-.188.291-.437.175-1.639-.762-2.665-3.155-2.665-5.078 0-4.137 3.007-7.935 8.675-7.935 4.557 0 8.1 3.248 8.1 7.591 0 4.529-2.855 8.175-6.818 8.175-1.332 0-2.585-.693-3.013-1.509l-.821 3.131c-.297 1.137-1.103 2.561-1.644 3.435 1.224.377 2.529.58 3.882.58 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Collections (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[#dfb15b] font-serif text-xs tracking-[0.2em] uppercase font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('/sarees')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Sarees Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/fabrics')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Fabrics Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/top-dupatta')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Top & Dupatta Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/sarees?category=dola-silk')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Dola Silk Weaves
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/sarees?category=organza')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Organza & Tissue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/sarees?category=jacquard')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Jacquard & Brocades
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: The Mill (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[#dfb15b] font-serif text-xs tracking-[0.2em] uppercase font-semibold">
              The Mill
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Our Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/manufacturing')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Looms & Technology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/manufacturing')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Quality Assurance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Sustainable Practices
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Sample Swatches
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Advisory & Contact (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[#dfb15b] font-serif text-xs tracking-[0.2em] uppercase font-semibold">
              Client Advisory
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              <a
                href="tel:+919875198837"
                className="flex items-start gap-3 group hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#dfb15b] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>+91 98751 98837</span>
              </a>

              <a
                href="https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20I%20am%20interested%20in%20direct%20mill%20wholesale%20fabrics"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 group text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">💬</span>
                <span>WhatsApp: +91 98751 98837</span>
              </a>

              <a
                href="mailto:info@srifabrics.com"
                className="flex items-start gap-3 group hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#dfb15b] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="break-all">info@srifabrics.com</span>
              </a>

              <div className="flex items-start gap-3 text-stone-400">
                <MapPin className="w-3.5 h-3.5 text-[#dfb15b] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Ring Road Textile Market, Surat - 395002, Gujarat, India
                </span>
              </div>

              <div className="flex items-start gap-3 text-stone-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#dfb15b]/70 shrink-0 mt-0.5" />
                <span>Mon – Sat · 9:30 AM – 7:30 PM IST</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/contact')}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#dfb15b] hover:text-[#ebd08f] uppercase tracking-wider transition-colors"
              >
                <span>Request Mill Visit</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Identity Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} SRI Fabrics. All rights reserved.</p>

          <p className="hidden md:block text-stone-600 tracking-wider uppercase text-[10px]">
            Fabrics For A Brighter Tomorrow
          </p>

          <div className="flex items-center gap-4 sm:gap-6 text-stone-400">
            <button
              onClick={() => onNavigate('/contact')}
              className="hover:text-stone-200 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => onNavigate('/contact')}
              className="hover:text-stone-200 transition-colors"
            >
              Terms of Supply
            </button>
            <span className="text-stone-700">·</span>
            <button
              onClick={() => onNavigate('/admin')}
              className="hover:text-[#dfb15b] text-stone-500 transition-colors"
            >
              Portal Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
