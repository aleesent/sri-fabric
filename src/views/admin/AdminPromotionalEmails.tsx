import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  FileText,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Copy,
  Smartphone,
  Monitor,
  Users,
  Upload,
  RefreshCw,
  Search,
  ExternalLink,
  Tag,
  ShieldCheck,
  ChevronRight,
  Code,
  Layers,
  Palette,
  Image as ImageIcon,
  Check,
  X,
  Mail,
  SlidersHorizontal,
} from 'lucide-react';
import { EMAIL_TEMPLATES, EmailTemplate } from '../../data/emailTemplates.ts';

interface AdminPromotionalEmailsProps {
  token: string;
}

interface CampaignRecord {
  id: number;
  title: string;
  subject: string;
  preheader?: string;
  senderName: string;
  senderEmail: string;
  htmlContent: string;
  recipientCount: number;
  recipientsList?: string;
  status: string;
  templateId?: string;
  deliveredCount: number;
  failedCount: number;
  errorLog?: string;
  sentAt: string;
}

interface DraftRecord {
  id: number;
  title: string;
  subject: string;
  preheader: string;
  recipients: string;
  htmlContent: string;
  templateId: string;
  updatedAt: string;
}

export const AdminPromotionalEmails: React.FC<AdminPromotionalEmailsProps> = ({ token }) => {
  // Navigation Tabs: 'compose' | 'templates' | 'drafts' | 'sent'
  const [activeTab, setActiveTab] = useState<'compose' | 'templates' | 'drafts' | 'sent'>('compose');

  // Composer Form State
  const [currentDraftId, setCurrentDraftId] = useState<number | null>(null);
  const [campaignTitle, setCampaignTitle] = useState('New Fabric Collection Launch 2026');
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [preheader, setPreheader] = useState(EMAIL_TEMPLATES[0].preheader);
  const [senderName, setSenderName] = useState('SRI FABRICS Surat');
  const [senderEmail, setSenderEmail] = useState('inquiry@srifabrics.com');
  const [recipientsText, setRecipientsText] = useState('');
  const [htmlContent, setHtmlContent] = useState(EMAIL_TEMPLATES[0].htmlContent);
  const [selectedTemplateId, setSelectedTemplateId] = useState(EMAIL_TEMPLATES[0].id);

  // Editor Display State
  const [editorMode, setEditorMode] = useState<'code' | 'blocks'>('code');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [csvInput, setCsvInput] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Test Email State
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);

  // Send Confirmation Modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendResultSummary, setSendResultSummary] = useState<any>(null);

  // Data Collections
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [selectedCampaignForView, setSelectedCampaignForView] = useState<CampaignRecord | null>(null);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<EmailTemplate | null>(null);

  // Template Search / Filter
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('ALL');

  // Load Initial Campaigns, Drafts, and Config
  useEffect(() => {
    fetchCampaigns();
    fetchDrafts();
    fetchSmtpConfig();
  }, [token]);

  const fetchSmtpConfig = () => {
    fetch('/api/admin/smtp/status', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.fromName) setSenderName(data.fromName);
        if (data.fromEmail) setSenderEmail(data.fromEmail);
        if (data.adminEmail) setTestEmailAddress(data.adminEmail);
      })
      .catch(() => {});
  };

  const fetchCampaigns = () => {
    fetch('/api/admin/promotional/campaigns', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch(() => {});
  };

  const fetchDrafts = () => {
    fetch('/api/admin/promotional/drafts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setDrafts(data);
      })
      .catch(() => {});
  };

  // Helper to extract clean valid emails
  const parseRecipients = (raw: string): { valid: string[]; invalid: string[] } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tokens = raw
      .split(/[\n,;\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const validSet = new Set<string>();
    const invalidSet = new Set<string>();

    tokens.forEach((t) => {
      if (emailRegex.test(t)) {
        validSet.add(t);
      } else {
        invalidSet.add(t);
      }
    });

    return {
      valid: Array.from(validSet),
      invalid: Array.from(invalidSet),
    };
  };

  const parsedRecipients = parseRecipients(recipientsText);

  // Quick action: Import subscribers from database
  const handleImportSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/promotional/subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        const currentList = parseRecipients(recipientsText).valid;
        const combined = Array.from(new Set([...currentList, ...list]));
        setRecipientsText(combined.join(',\n'));
        setStatusMessage({
          type: 'success',
          text: `Added ${list.length} subscribers from the database! Total: ${combined.length} recipients.`,
        });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({
          type: 'error',
          text: 'No active subscribers found in database.',
        });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to fetch subscribers.' });
    } finally {
      setLoading(false);
    }
  };

  // Quick action: Apply CSV paste
  const handleApplyCsv = () => {
    if (!csvInput.trim()) return;
    const parsed = parseRecipients(csvInput);
    const existing = parseRecipients(recipientsText).valid;
    const combined = Array.from(new Set([...existing, ...parsed.valid]));
    setRecipientsText(combined.join(',\n'));
    setCsvInput('');
    setShowRecipientModal(false);
    setStatusMessage({
      type: 'success',
      text: `Imported ${parsed.valid.length} valid email addresses!`,
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Load a ready-made template into composer
  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplateId(template.id);
    setSubject(template.subject);
    setPreheader(template.preheader);
    setCampaignTitle(template.name);
    setHtmlContent(template.htmlContent);
    setActiveTab('compose');
    setStatusMessage({
      type: 'success',
      text: `Loaded "${template.name}" template into the composer!`,
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Save draft
  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/promotional/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: currentDraftId,
          title: campaignTitle,
          subject,
          preheader,
          recipients: recipientsText,
          htmlContent,
          templateId: selectedTemplateId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save draft');
      if (!currentDraftId && data.id) setCurrentDraftId(data.id);
      fetchDrafts();
      setStatusMessage({ type: 'success', text: 'Draft saved successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving draft' });
    } finally {
      setSavingDraft(false);
    }
  };

  // Load draft into composer
  const handleLoadDraft = (draft: DraftRecord) => {
    setCurrentDraftId(draft.id);
    setCampaignTitle(draft.title);
    setSubject(draft.subject);
    setPreheader(draft.preheader || '');
    setRecipientsText(draft.recipients || '');
    setHtmlContent(draft.htmlContent);
    setSelectedTemplateId(draft.templateId || 'custom');
    setActiveTab('compose');
    setStatusMessage({ type: 'success', text: `Loaded draft "${draft.title}"` });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Delete draft
  const handleDeleteDraft = async (id: number) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    try {
      await fetch(`/api/admin/promotional/drafts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (currentDraftId === id) setCurrentDraftId(null);
      fetchDrafts();
    } catch (err) {
      console.error(err);
    }
  };

  // Send Test Email
  const handleSendTest = async () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      alert('Please enter a valid test recipient email address.');
      return;
    }
    setSendingTest(true);
    setTestResult(null);
    try {
      // Temporarily inject test email into personalized template
      const unsubUrl = `https://srifabrics.com/unsubscribe?email=${encodeURIComponent(testEmailAddress)}`;
      let testHtml = htmlContent;
      if (preheader) {
        testHtml = `
          <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
            ${preheader}
          </div>
          ${testHtml}
        `;
      }
      testHtml = testHtml.replace(/{{email}}/g, testEmailAddress).replace(/{{unsubscribe_url}}/g, unsubUrl);

      const res = await fetch('/api/admin/smtp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toEmail: testEmailAddress }),
      });
      const data = await res.json();
      setTestResult({
        success: Boolean(data.success),
        message: data.message || (data.success ? `Test email sent to ${testEmailAddress}` : 'Failed to send test email'),
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error executing test send',
      });
    } finally {
      setSendingTest(false);
    }
  };

  // Send Final Campaign
  const handleDispatchCampaign = async () => {
    if (parsedRecipients.valid.length === 0) {
      alert('Please add at least one valid recipient email address.');
      return;
    }
    setSending(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/promotional/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: campaignTitle,
          subject,
          preheader,
          senderName,
          senderEmail,
          htmlContent,
          recipients: parsedRecipients.valid,
          templateId: selectedTemplateId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch campaign');

      setSendResultSummary(data.sendResult);
      setShowSendModal(false);
      fetchCampaigns();
      setActiveTab('sent');
      setStatusMessage({
        type: 'success',
        text: `Promotional campaign dispatched! Delivered to ${data.sendResult?.delivered || 0} recipients.`,
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to dispatch campaign' });
    } finally {
      setSending(false);
    }
  };

  // Quick insertion helpers for visual builder
  const insertContentBlock = (blockHtml: string) => {
    // If the template contains closing container tags, insert before the footer or before </body>
    if (htmlContent.includes('<!-- Footer -->') || htmlContent.includes('<!-- Footer & Unsubscribe -->')) {
      const parts = htmlContent.split(/<!-- Footer/);
      setHtmlContent(`${parts[0]}\n${blockHtml}\n<!-- Footer${parts[1]}`);
    } else if (htmlContent.includes('</table>')) {
      const lastIndex = htmlContent.lastIndexOf('</table>');
      setHtmlContent(`${htmlContent.slice(0, lastIndex)}\n${blockHtml}\n${htmlContent.slice(lastIndex)}`);
    } else {
      setHtmlContent((prev) => `${prev}\n${blockHtml}`);
    }
    setStatusMessage({ type: 'success', text: 'Section block inserted into email!' });
    setTimeout(() => setStatusMessage(null), 2500);
  };

  // Preset Content Blocks
  const BLOCKS = {
    heroImage: `
      <!-- Dynamic Hero Image Block -->
      <tr>
        <td style="padding: 15px 25px; text-align: center;">
          <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80" alt="SRI Fabrics Weaves" width="570" style="width: 100%; max-width: 570px; height: auto; border-radius: 6px; display: block; border: 1px solid #ebdcc5;" />
        </td>
      </tr>
    `,
    ctaButton: `
      <!-- Dynamic Button Block -->
      <tr>
        <td style="padding: 20px 30px; text-align: center;">
          <a href="https://srifabrics.com/fabrics" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b; box-shadow: 0 4px 12px rgba(74,17,34,0.25);">
            Explore Latest Weaves &rarr;
          </a>
        </td>
      </tr>
    `,
    twoColumnGrid: `
      <!-- 2-Column Fabric Grid -->
      <tr>
        <td style="padding: 15px 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" style="padding: 8px;">
                <div style="background: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 18px 15px; text-align: center;">
                  <h4 style="margin: 0 0 6px; font-size: 14px; color: #4a1122; font-family: Georgia, serif;">Pure Silk Brocade</h4>
                  <p style="margin: 0 0 10px; font-size: 12px; color: #666; line-height: 1.4;">Zari Kadwa brocade for royal bridal couture.</p>
                  <span style="display: inline-block; background: #4a1122; color: #f7eedf; padding: 6px 14px; border-radius: 3px; font-size: 11px; font-weight: bold; text-transform: uppercase;">100m MOQ</span>
                </div>
              </td>
              <td width="50%" style="padding: 8px;">
                <div style="background: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 18px 15px; text-align: center;">
                  <h4 style="margin: 0 0 6px; font-size: 14px; color: #4a1122; font-family: Georgia, serif;">High-Twist Georgette</h4>
                  <p style="margin: 0 0 10px; font-size: 12px; color: #666; line-height: 1.4;">Lustrous drape for pret ensembles &amp; dupattas.</p>
                  <span style="display: inline-block; background: #4a1122; color: #f7eedf; padding: 6px 14px; border-radius: 3px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Ready Stock</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `,
    calloutBox: `
      <!-- Wholesale Notice Callout -->
      <tr>
        <td style="padding: 15px 30px;">
          <div style="background-color: #faf7f2; border-left: 4px solid #dfb15b; padding: 16px 20px; border-radius: 0 6px 6px 0; border-top: 1px solid #ebdcc5; border-right: 1px solid #ebdcc5; border-bottom: 1px solid #ebdcc5;">
            <p style="margin: 0 0 4px; font-size: 12px; font-weight: bold; color: #4a1122; text-transform: uppercase; letter-spacing: 0.1em;">
              Direct Mill Guarantee &bull; Surat Weaving Looms
            </p>
            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #555;">
              Custom GSM weaving, reactive dye lots, and pan-India express road and air logistics within 24 to 48 hours.
            </p>
          </div>
        </td>
      </tr>
    `,
    divider: `
      <!-- Elegant Gold Divider -->
      <tr>
        <td style="padding: 15px 30px;">
          <div style="height: 1px; background-color: #ebdcc5; width: 100%;"></div>
        </td>
      </tr>
    `,
  };

  const filteredTemplates = EMAIL_TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tpl.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
      tpl.subject.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesCategory =
      templateCategory === 'ALL' || tpl.category.toUpperCase() === templateCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
              B2B MARKETING &amp; CLIENT COMMUNICATIONS
            </span>
            <span className="px-2 py-0.5 bg-[#dfb15b]/20 text-[#4a1122] text-[10px] font-bold rounded uppercase">
              Brevo Integrated
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Promotional Email Suite
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Design, preview, test, and dispatch luxury textile marketing campaigns directly to buyers and wholesale partners.
          </p>
        </div>

        {/* Global Feedback notification */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg border flex items-center gap-2 text-xs transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Main Suite Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-2 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-[#4a1122] text-[#f7eedf] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose Email</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-[#4a1122] text-[#f7eedf] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
            <span>Ready-Made Templates ({EMAIL_TEMPLATES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'drafts'
                ? 'bg-[#4a1122] text-[#f7eedf] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Drafts ({drafts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'sent'
                ? 'bg-[#4a1122] text-[#f7eedf] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Sent Campaigns ({campaigns.length})</span>
          </button>
        </div>

        {/* Quick Test Email Button in Top Bar */}
        <button
          onClick={() => setShowTestModal(true)}
          className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#ebdcc5] text-[#4a1122] border border-[#dfb15b]/60 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>Send Test Email</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. COMPOSE EMAIL VIEW (Editor + Split Live Preview)      */}
      {/* ======================================================== */}
      {activeTab === 'compose' && (
        <div className="space-y-6">
          {/* Campaign Metadata Bar */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Campaign Title (Internal Reference)
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Wedding Season Katan Silk Launch"
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div className="md:col-span-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line seen by buyers in their inbox..."
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Preheader (Inbox Snippet)
                </label>
                <input
                  type="text"
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                  placeholder="Preview text following subject..."
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              {/* Sender Details */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="SRI FABRICS Surat"
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Sender Email (Verified Brevo Address)
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="inquiry@srifabrics.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              {/* Recipient Counter & Controls */}
              <div className="md:col-span-6 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#4a1122]" />
                    <span>Recipients ({parsedRecipients.valid.length} Valid)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleImportSubscribers}
                      disabled={loading}
                      className="text-[11px] font-semibold text-[#4a1122] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>+ Add All Subscribers</span>
                    </button>
                    <span className="text-stone-300">&bull;</span>
                    <button
                      type="button"
                      onClick={() => setShowRecipientModal(true)}
                      className="text-[11px] font-semibold text-[#4a1122] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Paste / CSV</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={2}
                    value={recipientsText}
                    onChange={(e) => setRecipientsText(e.target.value)}
                    placeholder="Enter recipient email addresses (comma, space, or newline separated)..."
                    className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-[#4a1122] font-mono leading-tight resize-none"
                  />
                  {parsedRecipients.invalid.length > 0 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-bold">
                      {parsedRecipients.invalid.length} invalid email(s) ignored
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Split: Editor (Left) & Sandbox Live Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: BUILDER & HTML EDITOR (6 cols on lg) */}
            <div className="lg:col-span-6 space-y-3">
              {/* Toolbar */}
              <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditorMode('code')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      editorMode === 'code'
                        ? 'bg-[#4a1122] text-[#f7eedf]'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>HTML Editor</span>
                  </button>

                  <button
                    onClick={() => setEditorMode('blocks')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      editorMode === 'blocks'
                        ? 'bg-[#4a1122] text-[#f7eedf]'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#dfb15b]" />
                    <span>Insert Content Blocks</span>
                  </button>
                </div>

                {/* Quick Insert Fabric Image Dropdown */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      const imgBlock = `
                        <tr>
                          <td style="padding: 15px 25px; text-align: center;">
                            <img src="${e.target.value}" alt="SRI Fabrics Weave" width="570" style="width: 100%; max-width: 570px; height: auto; border-radius: 6px; display: block;" />
                          </td>
                        </tr>
                      `;
                      insertContentBlock(imgBlock);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="bg-stone-50 border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-700 cursor-pointer focus:outline-none"
                >
                  <option value="" disabled>+ Insert Fabric Photo...</option>
                  <option value="https://srifabrics.com/slides/hero-sarees-7.jpg">Banarasi Katan Silk Saree</option>
                  <option value="https://srifabrics.com/slides/hero-fabrics-home.jpg">Digital Printing Yardage</option>
                  <option value="https://srifabrics.com/slides/hero-kurti-home.jpg">Organza &amp; Muslin Co-Ord</option>
                  <option value="https://srifabrics.com/sri3.png">Editorial Mill Campaign</option>
                  <option value="https://srifabrics.com/printing1.png">Mill Loom Machinery</option>
                </select>
              </div>

              {/* Visual Block Selector (if blocks mode) */}
              {editorMode === 'blocks' && (
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#dfb15b]/40 shadow-xs space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a1122] block">
                    Click Any Section Block to Insert Into Your Email:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => insertContentBlock(BLOCKS.heroImage)}
                      className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left transition-all hover:border-[#dfb15b] shadow-2xs group cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#dfb15b] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-stone-900">Hero Image</div>
                      <div className="text-[10px] text-stone-500">Wide 570px banner</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertContentBlock(BLOCKS.ctaButton)}
                      className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left transition-all hover:border-[#dfb15b] shadow-2xs group cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-[#dfb15b] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-stone-900">CTA Button</div>
                      <div className="text-[10px] text-stone-500">Burgundy luxury button</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertContentBlock(BLOCKS.twoColumnGrid)}
                      className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left transition-all hover:border-[#dfb15b] shadow-2xs group cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-[#dfb15b] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-stone-900">2-Column Grid</div>
                      <div className="text-[10px] text-stone-500">Twin product cards</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertContentBlock(BLOCKS.calloutBox)}
                      className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left transition-all hover:border-[#dfb15b] shadow-2xs group cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-[#dfb15b] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-stone-900">Callout Banner</div>
                      <div className="text-[10px] text-stone-500">Wholesale guarantee</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => insertContentBlock(BLOCKS.divider)}
                      className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left transition-all hover:border-[#dfb15b] shadow-2xs group cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#dfb15b] mb-1 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-stone-900">Gold Divider</div>
                      <div className="text-[10px] text-stone-500">Thin clean divider</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="p-3 bg-white hover:bg-[#4a1122] hover:text-white border border-stone-200 rounded-lg text-left transition-all shadow-2xs group cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#dfb15b] mb-1" />
                      <div className="text-xs font-bold">Pick Template</div>
                      <div className="text-[10px] text-stone-500 group-hover:text-stone-300">8 ready themes</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Code Editor Container */}
              <div className="bg-[#18050b] rounded-xl overflow-hidden border border-[#dfb15b]/30 shadow-lg">
                <div className="bg-[#24060d] px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="font-mono text-[11px] text-[#dfb15b] ml-2">email-template.html</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">
                    {htmlContent.length} chars &bull; Tables &bull; Inline CSS
                  </span>
                </div>

                <textarea
                  rows={26}
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  spellCheck={false}
                  className="w-full bg-[#18050b] text-[#f7eedf] p-4 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-[#dfb15b] selection:text-[#18050b]"
                />
              </div>

              {/* Bottom Actions Bar */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={savingDraft}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{savingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTestModal(true)}
                    className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#ebdcc5] text-[#4a1122] border border-[#dfb15b]/60 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#dfb15b]" />
                    <span>Send Test</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSendModal(true)}
                  disabled={sending || parsedRecipients.valid.length === 0}
                  className="px-6 py-2.5 bg-[#4a1122] hover:bg-[#681930] text-[#f7eedf] text-xs font-bold uppercase tracking-wider rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5 text-[#dfb15b]" />
                  <span>
                    Send Campaign ({parsedRecipients.valid.length} {parsedRecipients.valid.length === 1 ? 'Buyer' : 'Buyers'})
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE SANDBOXED PREVIEW (6 cols on lg) */}
            <div className="lg:col-span-6 space-y-3 sticky top-4">
              <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#4a1122]" />
                    <span>Live Preview</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {previewDevice === 'desktop' ? '600px width' : '360px portrait'}
                  </span>
                </div>

                {/* Desktop / Mobile Device Toggle */}
                <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-white text-[#4a1122] shadow-2xs font-bold' : 'text-stone-500'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-white text-[#4a1122] shadow-2xs font-bold' : 'text-stone-500'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Preview Window Box */}
              <div className="bg-stone-200/80 p-4 sm:p-6 rounded-2xl border border-stone-300 flex justify-center overflow-x-auto min-h-[600px]">
                <div
                  className={`transition-all duration-300 rounded-xl overflow-hidden shadow-2xl bg-white border border-stone-300 ${
                    previewDevice === 'desktop' ? 'w-[600px]' : 'w-[360px]'
                  }`}
                >
                  {/* Fake Email Client Browser Header */}
                  <div className="bg-[#f0ebe1] px-4 py-2 border-b border-stone-300/80 text-[11px] text-stone-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800 truncate">{subject}</span>
                      <span className="text-[10px] text-stone-400">Preview</span>
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      From: <strong>{senderName}</strong> &lt;{senderEmail}&gt;
                    </div>
                  </div>

                  {/* Sandboxed Iframe Preview */}
                  <iframe
                    srcDoc={htmlContent.replace(/{{unsubscribe_url}}/g, '#').replace(/{{email}}/g, 'buyer@boutique.com')}
                    title="Live Email Campaign Preview"
                    sandbox="allow-same-origin"
                    className="w-full h-[640px] border-0 bg-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. READY-MADE TEMPLATES GALLERY                          */}
      {/* ======================================================== */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Search templates by fabric, collection, season..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#4a1122]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'Collections', 'Prints', 'Offers', 'Seasonal', 'Fabrics', 'B2B', 'Greetings', 'Branding'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      templateCategory.toUpperCase() === cat.toUpperCase()
                        ? 'bg-[#4a1122] text-[#f7eedf]'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-[#dfb15b]"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] w-full bg-[#18050b] overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#4a1122]/90 backdrop-blur-xs text-[#dfb15b] font-bold text-[10px] uppercase tracking-wider border border-[#dfb15b]/30">
                      {template.category}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#4a1122] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="pt-2 text-[11px] text-stone-500 truncate">
                      <span className="font-bold text-stone-700">Subject: </span>
                      <span>{template.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplateForPreview(template)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(template)}
                    className="px-4 py-1.5 bg-[#4a1122] hover:bg-[#681930] text-[#f7eedf] rounded text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5 text-[#dfb15b]" />
                    <span>Use Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DRAFTS VIEW                                           */}
      {/* ======================================================== */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <span className="font-serif text-lg font-bold text-stone-900">
              Saved Drafts ({drafts.length})
            </span>
            <button
              onClick={() => {
                setCurrentDraftId(null);
                setActiveTab('compose');
              }}
              className="px-3.5 py-1.5 bg-[#4a1122] text-[#f7eedf] rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#dfb15b]" />
              <span>Create New Draft</span>
            </button>
          </div>

          {drafts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-stone-200 space-y-3">
              <FileText className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-stone-800">No Saved Drafts</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Any unfinished promotional email campaigns you save will appear here for you to edit and send.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3 hover:border-[#dfb15b] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a1122]">
                      Draft ID #{draft.id}
                    </span>
                    <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-1">
                      {draft.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      Subject: {draft.subject || '(No subject entered)'}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Updated: {new Date(draft.updatedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoadDraft(draft)}
                      className="px-3.5 py-1.5 bg-[#4a1122] text-[#f7eedf] rounded text-xs font-semibold flex items-center gap-1.5 hover:bg-[#681930] transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#dfb15b]" />
                      <span>Resume Editing</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SENT CAMPAIGNS VIEW                                   */}
      {/* ======================================================== */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="font-serif text-lg font-bold text-stone-900 block">
                Sent Promotional Campaigns ({campaigns.length})
              </span>
              <span className="text-xs text-stone-500">
                Log of all marketing blasts and textile previews dispatched via Brevo SMTP
              </span>
            </div>
            <button
              onClick={fetchCampaigns}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-stone-200 space-y-3">
              <Clock className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-stone-800">No Sent Campaigns Yet</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Promotional emails sent through the composer will record their recipient metrics, delivery counts, and timestamps here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Campaign Title</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Recipients</th>
                      <th className="py-3 px-4">Delivered</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Sent Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          {camp.title}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                          {camp.subject}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                          {camp.recipientCount}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                          {camp.deliveredCount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              camp.status === 'SENT'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : camp.status === 'PARTIAL'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-500 font-mono">
                          {new Date(camp.sentAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCampaignForView(camp)}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-[#dfb15b]" />
                            <span>View Email</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CSV / PASTE RECIPIENT IMPORT                    */}
      {/* ======================================================== */}
      {showRecipientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#4a1122]" />
                <span>Import Recipient Email Addresses</span>
              </h3>
              <button
                onClick={() => setShowRecipientModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Paste your list of emails from Excel, CSV, or text below. Duplicates and invalid formats will be filtered automatically.
            </p>

            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="e.g.&#10;buyer1@fashionhouse.com&#10;sales@garmentexports.in&#10;contact@boutique.co.uk"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#4a1122]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRecipientModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCsv}
                className="px-5 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded-lg hover:bg-[#681930] transition-colors cursor-pointer"
              >
                Add Recipients
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: SEND TEST EMAIL                                 */}
      {/* ======================================================== */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4a1122]" />
                <span>Send Test Email via Brevo</span>
              </h3>
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setTestResult(null);
                }}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Send a real preview copy of your current email to any inbox to verify layout and image loading before final delivery.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Test Recipient Address
              </label>
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="your-email@domain.com"
                className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#4a1122]"
              />
            </div>

            {testResult && (
              <div
                className={`p-3 rounded text-xs flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowTestModal(false);
                  setTestResult(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSendTest}
                disabled={sendingTest}
                className="px-5 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded-lg hover:bg-[#681930] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {sendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#dfb15b]" /> : <Send className="w-3.5 h-3.5 text-[#dfb15b]" />}
                <span>{sendingTest ? 'Sending Test...' : 'Send Test Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: FINAL CAMPAIGN SEND CONFIRMATION                */}
      {/* ======================================================== */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#4a1122]" />
                <span>Confirm Promotional Campaign Dispatch</span>
              </h3>
              <button onClick={() => setShowSendModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#dfb15b]/40 text-xs">
              <div>
                <span className="font-bold text-[#4a1122] block uppercase tracking-wider text-[10px]">Subject:</span>
                <span className="text-stone-900 font-semibold text-sm">{subject}</span>
              </div>
              <div>
                <span className="font-bold text-[#4a1122] block uppercase tracking-wider text-[10px]">From:</span>
                <span className="text-stone-700">{senderName} &lt;{senderEmail}&gt;</span>
              </div>
              <div>
                <span className="font-bold text-[#4a1122] block uppercase tracking-wider text-[10px]">Recipients:</span>
                <span className="text-stone-900 font-bold">{parsedRecipients.valid.length} Business Buyers</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Privacy Shield Active: Emails are dispatched individually via Brevo. Recipients will never see each other's email addresses.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDispatchCampaign}
                disabled={sending}
                className="px-6 py-2.5 bg-[#4a1122] text-[#f7eedf] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#681930] transition-colors flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#dfb15b]" />
                    <span>Dispatching via Brevo...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#dfb15b]" />
                    <span>Send {parsedRecipients.valid.length} Emails Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: SENT EMAIL HTML VIEWER                          */}
      {/* ======================================================== */}
      {selectedCampaignForView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {selectedCampaignForView.title}
                </h3>
                <p className="text-xs text-stone-500">
                  Sent on {new Date(selectedCampaignForView.sentAt).toLocaleString()} &bull; Delivered to {selectedCampaignForView.deliveredCount} recipients
                </p>
              </div>
              <button
                onClick={() => setSelectedCampaignForView(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-stone-100 flex justify-center">
              <div className="w-[600px] max-w-full bg-white shadow rounded-lg overflow-hidden border border-stone-200">
                <iframe
                  srcDoc={selectedCampaignForView.htmlContent}
                  title="Sent Email Content"
                  className="w-full h-[580px] border-0"
                />
              </div>
            </div>

            <div className="p-4 bg-white border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCampaignForView(null)}
                className="px-5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: TEMPLATE PREVIEW MODAL                          */}
      {/* ======================================================== */}
      {selectedTemplateForPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 bg-[#FAF7F2] border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#4a1122] uppercase tracking-wider">
                  Template Preview
                </span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {selectedTemplateForPreview.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTemplateForPreview(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-stone-100 flex justify-center">
              <div className="w-[600px] max-w-full bg-white shadow rounded-lg overflow-hidden border border-stone-200">
                <iframe
                  srcDoc={selectedTemplateForPreview.htmlContent}
                  title={selectedTemplateForPreview.name}
                  className="w-full h-[580px] border-0"
                />
              </div>
            </div>

            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedTemplateForPreview(null)}
                className="px-4 py-2 text-stone-600 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectTemplate(selectedTemplateForPreview);
                  setSelectedTemplateForPreview(null);
                }}
                className="px-5 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded-lg hover:bg-[#681930] flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Use This Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
