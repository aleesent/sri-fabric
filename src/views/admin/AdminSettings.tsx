import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminSettingsProps {
  token: string;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ token }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) {
          const map: Record<string, string> = {};
          list.forEach((item) => (map[item.key] = item.value));
          setSettings(map);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: payload }),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-stone-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
          CONFIGURATION
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
          Site & SEO Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Changes made here immediately update the header, footer, contact sections, and search engine metadata.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-6 text-xs">
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Settings updated successfully!</span>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Brand Information */}
        <div className="space-y-4">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
            Brand Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brand_name || 'SRI FABRICS'}
                onChange={(e) => handleChange('brand_name', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline || 'FABRICS FOR A BRIGHTER TOMORROW'}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="space-y-4 pt-2">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
            Contact & Location Coordinates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Telephone</label>
              <input
                type="text"
                value={settings.phone || '+91 98751 98837'}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">WhatsApp Business</label>
              <input
                type="text"
                value={settings.whatsapp || '+91 98751 98837'}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email || 'info@srifabrics.com'}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Mill & Corporate Address</label>
            <input
              type="text"
              value={settings.address || 'SRI Fabrics Mill & Export House, Ring Road Textile Market, Surat - 395002, Gujarat, India'}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Business Hours</label>
            <input
              type="text"
              value={settings.business_hours || 'Monday - Saturday: 9:00 AM - 7:30 PM IST'}
              onChange={(e) => handleChange('business_hours', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
            />
          </div>
        </div>

        {/* Global SEO Settings */}
        <div className="space-y-4 pt-2">
          <h3 className="font-serif text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
            Search Engine Optimization (SEO)
          </h3>
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default Meta Title</label>
            <input
              type="text"
              value={settings.seo_title || 'SRI Fabrics – Premium B2B Textile Manufacturer & Fabric Exporter'}
              onChange={(e) => handleChange('seo_title', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Default Meta Description</label>
            <textarea
              rows={3}
              value={settings.seo_description || 'SRI Fabrics is India’s premier B2B manufacturer and global exporter of luxury pure silks, chinon, organza, and banarasi fabrics.'}
              onChange={(e) => handleChange('seo_description', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Footer Brand Statement</label>
            <textarea
              rows={2}
              value={settings.footer_text || 'We create premium fabrics that blend tradition with innovation, serving fashion brands, garment exporters, and couturiers across the globe.'}
              onChange={(e) => handleChange('footer_text', e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded shadow flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#dfb15b]" />
            <span>{saving ? 'Saving Changes...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
