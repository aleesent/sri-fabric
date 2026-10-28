import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import {
  Search,
  User,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Globe,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onRequestEnquiry: (fabricName?: string) => void;
  onOpenTrackEnquiry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onRequestEnquiry,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SAREE', path: '/sarees' },
    { label: 'FABRIC', path: '/fabrics' },
    { label: 'TOP + DUPATTA', path: '/top-dupatta' },
    { label: 'MANUFACTURING', path: '/manufacturing' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/sarees?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Utility Bar (matching reference mockup) */}
      <div className="bg-[#24060d] text-[#e8d5b5] text-[11px] font-medium tracking-wider border-b border-[#dfb15b]/20 px-4 sm:px-6 lg:px-8 xl:px-10 py-2">
        <div className="max-w-[1660px] mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#dfb15b]">✦</span>
            <span>PREMIUM FABRICS</span>
            <span className="opacity-40">|</span>
            <span>QUALITY</span>
            <span className="opacity-40">|</span>
            <span>INNOVATION</span>
            <span className="opacity-40">|</span>
            <span>DIRECT MILL SOURCING</span>
            <span className="text-[#dfb15b]">✦</span>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4 sm:gap-6 ml-auto">
            {/* Social Media Icons (High-visibility gold badge styling) */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-[#dfb15b] font-semibold text-[11px] tracking-wider">Follow Us:</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                title="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#180409]/95 backdrop-blur-md shadow-lg py-2.5 sm:py-3 border-b border-[#dfb15b]/20'
            : 'bg-[#1e050c] py-3 sm:py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between relative">
          {/* LEFT ON MOBILE: Menu Bar Hamburger Button (< lg) */}
          <div className="flex lg:hidden items-center w-10 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-[#dfb15b] bg-[#dfb15b]/15 hover:bg-[#dfb15b] hover:text-[#1c050d] rounded-lg transition-all focus:outline-none cursor-pointer border border-[#dfb15b]/40 shadow-xs"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* CENTRE ON MOBILE (< lg), LEFT ON DESKTOP (lg) */}
          <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
            <button
              onClick={() => onNavigate('/')}
              className="text-center lg:text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#dfb15b] flex items-center justify-center lg:justify-start"
            >
              <Logo variant="gold" />
            </button>
          </div>

          {/* DESKTOP CENTRE: Nav Links (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-[0.12em] text-[#e8d5b5]">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`relative py-1 cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'text-[#dfb15b] font-semibold'
                      : 'hover:text-[#dfb15b] text-white/85'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#dfb15b]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ON MOBILE (< lg) & DESKTOP (lg): Search Bar & Actions */}
          <div className="flex items-center justify-end w-10 lg:w-auto shrink-0 gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#dfb15b] bg-[#dfb15b]/15 hover:bg-[#dfb15b] hover:text-[#1c050d] rounded-lg transition-all cursor-pointer border border-[#dfb15b]/40 shadow-xs"
              title="Search Fabrics"
              aria-label="Search fabrics"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Portal Direct Link (Hidden on small phones to preserve clean bar) */}
            <button
              onClick={() => onNavigate('/admin')}
              className="hidden sm:flex p-2 text-[#dfb15b] bg-[#dfb15b]/15 hover:bg-[#dfb15b] hover:text-[#1c050d] rounded-lg transition-all cursor-pointer border border-[#dfb15b]/40 shadow-xs relative items-center gap-1"
              title="Admin CMS Portal"
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline text-[11px] font-bold tracking-wider">ADMIN</span>
            </button>

            {/* Request Enquiry Primary CTA (Desktop) */}
            <button
              onClick={() => onRequestEnquiry()}
              className="hidden lg:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#24060d] bg-gradient-to-r from-[#dfb15b] to-[#f4d188] hover:from-[#eac272] hover:to-[#ffe19f] rounded shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              REQUEST ENQUIRY
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-3 pb-2 border-t border-white/10 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees by design, fabric, or weave..."
                className="w-full bg-[#2d0913] text-white placeholder-white/40 text-xs sm:text-sm px-4 py-2.5 pl-10 pr-20 sm:pr-24 rounded border border-[#dfb15b]/40 focus:outline-none focus:border-[#dfb15b]"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#dfb15b] absolute left-3" />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-[#dfb15b] text-[#24060d] text-xs font-semibold rounded hover:bg-[#edd08f]"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#1a050b] text-[#f7eedf] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-[#dfb15b]/30">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Logo variant="gold" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-4 py-6">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => {
                      onNavigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-left text-sm tracking-widest py-2 border-b border-white/5 transition-colors ${
                      currentPath === link.path ? 'text-[#dfb15b] font-bold' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    onNavigate('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-sm tracking-widest py-2 text-white/80 hover:text-white flex items-center justify-between"
                >
                  <span>ADMIN CMS PORTAL</span>
                  <User className="w-4 h-4" />
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <button
                onClick={() => {
                  onRequestEnquiry();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#dfb15b] text-[#24060d] text-xs font-bold uppercase tracking-wider rounded text-center shadow"
              >
                REQUEST FABRIC ENQUIRY
              </button>

              {/* Social Media Icons (High-visibility gold badges) */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#dfb15b] text-[#1c050d] hover:bg-white hover:text-[#1c050d] flex items-center justify-center transition-all shadow-sm"
                  title="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>

              <div className="text-xs text-white/70 space-y-2">
                <a
                  href="tel:+919875198837"
                  className="flex items-center gap-2 hover:text-[#dfb15b] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#dfb15b]" />
                  <span>+91 98751 98837</span>
                </a>
                <a
                  href="https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20I%20am%20interested%20in%20your%20fabrics"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-xs">💬</span>
                  <span>WhatsApp: +91 98751 98837</span>
                </a>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#dfb15b]" />
                  <span>info@srifabrics.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
