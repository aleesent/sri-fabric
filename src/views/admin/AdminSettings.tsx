import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Mail, Send, RefreshCw, Key, ShieldCheck } from 'lucide-react';

interface AdminSettingsProps {
  token: string;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ token }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Brevo SMTP Testing State
  const [smtpStatus, setSmtpStatus] = useState<any>(null);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testTargetEmail, setTestTargetEmail] = useState('');

  const fetchSmtpStatus = () => {
    fetch('/api/admin/smtp/status', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setSmtpStatus(data))
      .catch(() => {});
  };

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

    fetchSmtpStatus();
  }, [token]);

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/smtp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toEmail: testTargetEmail.trim() || undefined }),
      });
      const data = await res.json();
      setTestResult({
        success: Boolean(data.success),
        message: data.message || (data.success ? 'Test email dispatched successfully!' : 'SMTP connection failed'),
      });
      fetchSmtpStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to execute SMTP test',
      });
    } finally {
      setTestingSmtp(false);
    }
  };

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

        {/* Brevo (Sendinblue) SMTP Configuration */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
            <div>
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4a1122]" />
                <span>Brevo (Sendinblue) SMTP Configuration</span>
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Automatically dispatches B2B sample enquiries, contact leads, and customer confirmation emails.
              </p>
            </div>
            
            {/* Real-time Status Badge */}
            {smtpStatus && (
              <div className="flex flex-col sm:items-end gap-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                    smtpStatus.configured
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      smtpStatus.configured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`}
                  />
                  <span>{smtpStatus.configured ? (smtpStatus.hasApiKey ? 'Brevo REST API Active (Render Safe)' : 'Brevo SMTP Active') : 'Credentials Needed'}</span>
                </span>
                {smtpStatus.mode && (
                  <span className="text-[10px] text-stone-500 font-mono">
                    Mode: {smtpStatus.mode}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Render Cloud Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <span className="text-base shrink-0">💡</span>
            <div>
              <strong className="font-semibold">Hosting on Render.com?</strong>
              <p className="mt-0.5 text-stone-600 text-[11px] leading-relaxed">
                Render blocks outbound SMTP ports (25, 465, 587) by default. For 100% reliable delivery on live Render, add your <strong>Brevo API Key (xkeysib-...)</strong> below. Our dual engine will automatically send via Brevo&apos;s HTTPS REST API over port 443, bypassing cloud firewall blocks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1 flex items-center justify-between">
                <span>Brevo API Key (xkeysib-...) — <span className="text-[#4a1122] font-bold">Recommended for Render</span></span>
                <span className="text-[10px] text-stone-400 font-normal">Works via HTTPS Port 443</span>
              </label>
              <input
                type="password"
                value={settings.brevo_api_key || ''}
                onChange={(e) => handleChange('brevo_api_key', e.target.value)}
                placeholder="xkeysib-..."
                className="w-full bg-stone-50 border border-amber-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122] font-mono text-xs"
              />
              <span className="text-[10px] text-stone-500 mt-0.5 block">
                Found in Brevo: SMTP &amp; API &gt; API Keys &gt; Generate a new API key. Bypasses Render&apos;s SMTP port blocking.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Brevo SMTP Host
              </label>
              <input
                type="text"
                value={settings.brevo_smtp_host || 'smtp-relay.brevo.com'}
                onChange={(e) => handleChange('brevo_smtp_host', e.target.value)}
                placeholder="smtp-relay.brevo.com"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Brevo SMTP Port
              </label>
              <input
                type="text"
                value={settings.brevo_smtp_port || '587'}
                onChange={(e) => handleChange('brevo_smtp_port', e.target.value)}
                placeholder="587 (or 2525 for cloud hosts)"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Brevo supports 587, 2525 (alternate cloud port), or 465 (SSL)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Brevo SMTP Login / User (Email)
              </label>
              <input
                type="email"
                value={settings.brevo_smtp_user || ''}
                onChange={(e) => handleChange('brevo_smtp_user', e.target.value)}
                placeholder="e.g. your-brevo-account@domain.com"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Found in Brevo dashboard: SMTP &amp; API &gt; SMTP &gt; Login
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Brevo SMTP Key (Master Password)
              </label>
              <input
                type="password"
                value={settings.brevo_smtp_key || ''}
                onChange={(e) => handleChange('brevo_smtp_key', e.target.value)}
                placeholder="xsmtpsib-..."
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122] font-mono text-xs"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Your Brevo SMTP key (or set via BREVO_SMTP_KEY env var)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Sender From Email
              </label>
              <input
                type="email"
                value={settings.brevo_from_email || 'inquiry@srifabrics.com'}
                onChange={(e) => handleChange('brevo_from_email', e.target.value)}
                placeholder="inquiry@srifabrics.com"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Must be an active/verified sender domain in your Brevo account
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Sender From Name
              </label>
              <input
                type="text"
                value={settings.brevo_from_name || 'SRI FABRICS Surat'}
                onChange={(e) => handleChange('brevo_from_name', e.target.value)}
                placeholder="SRI FABRICS Surat"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Admin Notification Recipient Email
              </label>
              <input
                type="email"
                value={settings.brevo_admin_email || 'as4820000@gmail.com'}
                onChange={(e) => handleChange('brevo_admin_email', e.target.value)}
                placeholder="as4820000@gmail.com"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Where instant customer sample inquiries and contact requests are forwarded
              </span>
            </div>
          </div>

          {/* Test Email Section */}
          <div className="mt-4 p-4 rounded-lg bg-[#FAF7F2] border border-[#dfb15b]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <span className="font-semibold text-stone-900 block text-xs">Test Brevo SMTP Connection</span>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Send a real test email through Brevo SMTP relay to verify deliverability.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="email"
                  value={testTargetEmail}
                  onChange={(e) => setTestTargetEmail(e.target.value)}
                  placeholder={settings.brevo_admin_email || 'as4820000@gmail.com'}
                  className="bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-900 w-full sm:w-64 focus:outline-none focus:border-[#4a1122]"
                />
                <button
                  type="button"
                  onClick={handleTestSmtp}
                  disabled={testingSmtp}
                  className="px-4 py-1.5 bg-[#4a1122] hover:bg-[#681930] text-[#f7eedf] text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {testingSmtp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#dfb15b]" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#dfb15b]" />
                      <span>Send Test Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded flex items-start gap-2 text-xs ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-bold">{testResult.success ? 'Success: ' : 'Error: '}</span>
                <span>{testResult.message}</span>
              </div>
            </div>
          )}
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
