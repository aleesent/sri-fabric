import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'India',
    subject: 'Wholesale Fabric Sourcing Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'What is the Minimum Order Quantity (MOQ) for bulk fabric orders?',
      a: 'For running catalog items (such as Royal Chinon and Pure Silk), our standard MOQ begins at 50–100 metres per color shade. For custom jacquard development or exclusive Pantone strike-offs, MOQ is typically 300–500 metres.',
    },
    {
      q: 'How can I request physical sample swatches or shade cards?',
      a: 'Click "Request Enquiry" anywhere on the site and check the "Request physical fabric sample swatch" box. We courier swatch books globally via DHL Express within 24–48 hours.',
    },
    {
      q: 'Can SRI Fabrics match custom Pantone color shades or custom GSM?',
      a: 'Yes. Our Surat laboratory operates computerized spectrophotometers that provide 48-hour lab dips. Provide us your Pantone TCX/TPX code or mail a physical swatch for exact matching.',
    },
    {
      q: 'What international export terms (Incoterms) do you support?',
      a: 'We routinely fulfill orders on FOB (Nhava Sheva/JNPT/Hazira), CIF, CFR, and DDP terms, providing commercial invoices, packing lists, test certificates, and Bills of Lading.',
    },
  ];

  return (
    <div className="bg-[#faf7f2] min-h-screen py-10 px-4 sm:px-8 space-y-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Banner */}
        <div className="border-b border-stone-300 pb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#4a1122] font-semibold">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 mt-1">
            Contact Our B2B Sales & Export Team
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
            Whether you require bulk fabric sourcing, sample books, bespoke loom development, or global shipping quotes, our technical advisors are ready to assist.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Details & Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#2a0610] text-[#f7eedf] p-8 rounded-xl border border-[#dfb15b]/30 shadow-lg space-y-6">
              <h3 className="font-serif text-2xl font-bold text-white">Direct Mill Information</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#dfb15b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Mill & Export House:</strong>
                    <span className="text-white/70 leading-relaxed">SRI Fabrics Mills, Ring Road Textile Market, Surat - 395002, Gujarat, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#dfb15b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Direct Telephone:</strong>
                    <a href="tel:+919875198837" className="text-white/70 hover:text-white transition-colors">
                      +91 98751 98837
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#dfb15b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Commercial Email:</strong>
                    <span className="text-white/70">info@srifabrics.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#dfb15b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Business Hours:</strong>
                    <span className="text-white/70">Monday - Saturday: 9:00 AM - 7:30 PM (IST)</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20I%20am%20interested%20in%20direct%20mill%20fabrics"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 98751 98837)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">Message Received</h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Thank you for reaching out to SRI Fabrics. Our representative will contact you via email or phone shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-stone-500">
                  Have a question regarding bulk availability, sampling, or factory visits? Fill in the details below.
                </p>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-[#faf7f2] border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Rostova Apparel"
                      className="w-full bg-[#faf7f2] border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@rostova.com"
                      className="w-full bg-[#faf7f2] border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91..."
                      className="w-full bg-[#faf7f2] border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#faf7f2] border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query..."
                    className="w-full bg-[#faf7f2] border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow"
                >
                  <Send className="w-4 h-4 text-[#dfb15b]" />
                  <span>{loading ? 'Sending...' : 'SEND MESSAGE'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-stone-300 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-stone-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left font-serif font-bold text-sm text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#4a1122]" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
