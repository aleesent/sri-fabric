import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Mail,
  Clock,
  MapPin,
  Send,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Logo } from './Logo.tsx';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFabricName?: string;
  defaultFabricId?: number;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultFabricName = '',
  defaultFabricId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    fabricOrCollection: defaultFabricName,
    requiredQuantity: '100 Metres',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ enquiryNumber: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          businessEmail: formData.email,
          fabricOrCollection: formData.fabricOrCollection || defaultFabricName,
          fabricId: defaultFabricId,
          requiredQuantity: formData.requiredQuantity,
          message: formData.message || `Inquiry for ${formData.fabricOrCollection || 'Fabrics'}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccessData({ enquiryNumber: data.enquiryNumber });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card - 2-Sided Split: Call Option (Left) & Simple Form (Right) */}
      <div className="relative w-full max-w-4xl bg-[#faf7f2] rounded-2xl shadow-2xl overflow-hidden border border-[#dfb15b]/40 my-6 z-10">
        {/* Top Header Ribbon */}
        <div className="bg-[#24060d] text-white px-5 sm:px-7 py-4 border-b border-[#dfb15b]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="gold" showTagline={false} size="sm" />
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold tracking-wider text-[#f7eedf]">
                B2B FABRIC INQUIRY & SOURCING
              </h3>
              <p className="text-[11px] text-[#dfb15b]">
                Fast Mill Pricing • Swatch Dispatch • Instant Call Support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {successData ? (
          /* Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif text-2xl font-bold text-stone-900">
                Inquiry Received Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Thank you for your interest in SRI Fabrics. Your reference number is:
              </p>
              <div className="inline-block bg-[#24060d] text-[#dfb15b] px-5 py-2 rounded-lg font-mono font-bold tracking-widest text-base shadow border border-[#dfb15b]/40">
                {successData.enquiryNumber}
              </div>
            </div>

            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Our fabric specialist will contact you via phone or email shortly.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <a
                href="tel:+919875198837"
                className="px-6 py-2.5 bg-[#dfb15b] text-[#1c050d] font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 hover:bg-[#edd08f] transition-all shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Us Now: +91 98751 98837</span>
              </a>
              <button
                onClick={onClose}
                className="px-6 py-2.5 border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Split 2-Column: Call Option (Side 1) & Simple Form (Side 2) */
          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[82vh] overflow-y-auto">
            {/* ======================================================== */}
            {/* SIDE 1 (LEFT): Direct Call Option & Live Contacts        */}
            {/* ======================================================== */}
            <div className="md:col-span-5 bg-gradient-to-b from-[#2a0610] to-[#1a0409] text-[#f7eedf] p-6 sm:p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#dfb15b]/30 space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#dfb15b]/20 border border-[#dfb15b]/40 text-[#dfb15b] text-[10px] font-bold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>DIRECT MILL DESK</span>
                </div>

                <h4 className="font-serif text-2xl font-bold text-white leading-tight">
                  Prefer To Speak With Us Directly?
                </h4>

                <p className="text-xs text-white/80 leading-relaxed">
                  Call our fabric advisors right away for immediate swatch availability, bulk discounts, and loom scheduling.
                </p>

                {/* Call Primary Action */}
                <div className="space-y-3 pt-2">
                  <a
                    href="tel:+919875198837"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#dfb15b] to-[#f5d48d] hover:from-[#eac272] hover:to-[#ffe19f] text-[#1c050d] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#1c050d]" />
                    <span>Call: +91 98751 98837</span>
                  </a>

                  {/* WhatsApp Direct Chat */}
                  <a
                    href="https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20I%20am%20interested%20in%20direct%20mill%20wholesale%20fabrics"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2.5 shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Chat on WhatsApp (+91 98751 98837)</span>
                  </a>
                </div>
              </div>

              {/* Direct Mill Information */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-white/75">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#dfb15b] shrink-0" />
                  <span>Mon – Sat: 9:00 AM – 7:30 PM (IST)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#dfb15b] shrink-0" />
                  <a href="mailto:info@srifabrics.com" className="hover:text-[#dfb15b] underline">
                    info@srifabrics.com
                  </a>
                </div>
                <div className="flex items-start gap-2.5 text-[11px] text-white/60">
                  <MapPin className="w-4 h-4 text-[#dfb15b] shrink-0 mt-0.5" />
                  <span>Ring Road Textile Market, Surat, Gujarat, India</span>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SIDE 2 (RIGHT): Simple, Streamlined Inquiry Form         */}
            {/* ======================================================== */}
            <div className="md:col-span-7 p-6 sm:p-7 bg-[#faf7f2] space-y-5">
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Quick Inquiry Form
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Leave your details and requirements. We typically respond within 15–30 minutes.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* 1. Name */}
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#4a1122] shadow-2xs"
                  />
                </div>

                {/* 2. Phone / WhatsApp */}
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98751 98837"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#4a1122] shadow-2xs"
                  />
                </div>

                {/* 3. Email (Optional) */}
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. priya@fashionstudio.com"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#4a1122] shadow-2xs"
                  />
                </div>

                {/* 4. Fabric & Quantity Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Fabric of Interest
                    </label>
                    <input
                      type="text"
                      value={formData.fabricOrCollection}
                      onChange={(e) => setFormData({ ...formData, fabricOrCollection: e.target.value })}
                      placeholder="e.g. Dola Silk, Muslin..."
                      className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#4a1122] shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Quantity Needed
                    </label>
                    <input
                      type="text"
                      value={formData.requiredQuantity}
                      onChange={(e) => setFormData({ ...formData, requiredQuantity: e.target.value })}
                      placeholder="e.g. 100 Metres, Sample Swatches..."
                      className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#4a1122] shadow-2xs"
                    />
                  </div>
                </div>

                {/* 5. Message / Notes */}
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Notes / Requirements <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any specific color shades, GSM requirements, or delivery deadlines..."
                    className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122] resize-none shadow-2xs"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#4a1122] hover:bg-[#340915] text-[#f7eedf] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>SUBMIT INQUIRY</span>
                        <Send className="w-3.5 h-3.5 text-[#dfb15b]" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-400 text-center mt-2">
                    🔒 No spam. Direct B2B manufacturer contact only.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
