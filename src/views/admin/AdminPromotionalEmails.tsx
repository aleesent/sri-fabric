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
  Tablet,
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
  ArrowUp,
  ArrowDown,
  GripVertical,
  Phone,
  MessageSquare,
  MapPin,
  Globe,
  Sliders,
  Type,
  Layout,
  Link2,
} from 'lucide-react';
import {
  EMAIL_TEMPLATES,
  EmailTemplate,
  PromotionalEmailContent,
  PromotionalProductItem,
  PromotionalCtaButton,
  PromotionalHighlightItem,
  CURATED_FABRIC_IMAGES,
  CuratedImageItem,
  generatePromotionalEmailHtml,
} from '../../data/emailTemplates.ts';

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

  // Sub-sections in Visual Composer: 'basics' | 'hero' | 'editorial' | 'products' | 'ctas' | 'highlights' | 'contacts' | 'recipients'
  const [composerSection, setComposerSection] = useState<
    'basics' | 'hero' | 'editorial' | 'products' | 'ctas' | 'highlights' | 'contacts' | 'recipients'
  >('basics');

  // Structured Content State (Single Source of Truth)
  const [content, setContent] = useState<PromotionalEmailContent>(() => ({
    ...EMAIL_TEMPLATES[0].content,
  }));

  // Campaign Meta & Sender Details
  const [currentDraftId, setCurrentDraftId] = useState<number | null>(null);
  const [campaignTitle, setCampaignTitle] = useState('Royal Heritage Weaves — Exclusive Preview 2026');
  const [senderName, setSenderName] = useState('SRI FABRICS Surat');
  const [senderEmail, setSenderEmail] = useState('inquiry@srifabrics.com');
  const [recipientsText, setRecipientsText] = useState('');

  // Dual Editor Mode: 'structured' (Visual Form) vs 'code' (Raw HTML)
  const [editorMode, setEditorMode] = useState<'structured' | 'code'>('structured');
  const [rawHtmlOverride, setRawHtmlOverride] = useState<string>('');

  // Preview State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [personalizePreview, setPersonalizePreview] = useState(true);

  // Modals & Pickers
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'hero' | { type: 'product'; productId: string } | null>(
    null
  );
  const [imagePickerCategory, setImagePickerCategory] = useState<string>('ALL');
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [csvInput, setCsvInput] = useState('');

  const [showTestModal, setShowTestModal] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [showSendModal, setShowSendModal] = useState(false);
  const [sendResultSummary, setSendResultSummary] = useState<any>(null);

  // Feedback & Loading
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data Collections
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [drafts, setDrafts] = useState<DraftRecord[]>([]);
  const [selectedCampaignForView, setSelectedCampaignForView] = useState<CampaignRecord | null>(null);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<EmailTemplate | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive final HTML: If in code mode with manual edits, use rawHtmlOverride; otherwise compile from structured content
  const activeCompiledHtml = React.useMemo(() => {
    if (editorMode === 'code' && rawHtmlOverride) {
      return rawHtmlOverride;
    }
    return generatePromotionalEmailHtml(content);
  }, [editorMode, rawHtmlOverride, content]);

  // Derive preview HTML with or without personalized variables
  const displayHtmlInPreview = React.useMemo(() => {
    let html = activeCompiledHtml;
    if (personalizePreview) {
      const unsubSample = `https://srifabrics.com/unsubscribe?email=${encodeURIComponent('arun@patelcouture.com')}`;
      html = html
        .replace(/{{name}}/g, 'Arun Patel')
        .replace(/{{company}}/g, 'Patel Couture Mumbai')
        .replace(/{{email}}/g, 'arun@patelcouture.com')
        .replace(/{{unsubscribe_url}}/g, unsubSample);
    }
    return html;
  }, [activeCompiledHtml, personalizePreview]);

  // Load initial stats, campaigns, drafts, and Brevo SMTP status
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
          text: `Added ${list.length} subscribers from database! Total: ${combined.length} recipients.`,
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
    setContent({ ...template.content });
    setCampaignTitle(template.name);
    setRawHtmlOverride('');
    setEditorMode('structured');
    setActiveTab('compose');
    setComposerSection('basics');
    setStatusMessage({
      type: 'success',
      text: `Loaded "${template.name}" into the composer!`,
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Save Draft
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
          subject: content.subject,
          preheader: content.preheader,
          recipients: recipientsText,
          htmlContent: activeCompiledHtml,
          templateId: content.templateId,
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

  // Load Draft into composer
  const handleLoadDraft = (draft: DraftRecord) => {
    setCurrentDraftId(draft.id);
    setCampaignTitle(draft.title);
    setRecipientsText(draft.recipients || '');

    // Check if matches an existing template structure
    const matchingTemplate = EMAIL_TEMPLATES.find((t) => t.id === draft.templateId);
    if (matchingTemplate) {
      setContent({
        ...matchingTemplate.content,
        subject: draft.subject,
        preheader: draft.preheader || '',
      });
      setRawHtmlOverride('');
      setEditorMode('structured');
    } else {
      setRawHtmlOverride(draft.htmlContent);
      setEditorMode('code');
    }

    setActiveTab('compose');
    setStatusMessage({ type: 'success', text: `Loaded draft "${draft.title}"` });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Delete Draft
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
      const unsubUrl = `https://srifabrics.com/unsubscribe?email=${encodeURIComponent(testEmailAddress)}`;
      let testHtml = activeCompiledHtml;
      if (content.preheader) {
        testHtml = `
          <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
            ${content.preheader}
          </div>
          ${testHtml}
        `;
      }
      testHtml = testHtml
        .replace(/{{name}}/g, 'Valued Partner')
        .replace(/{{company}}/g, 'Boutique Client')
        .replace(/{{email}}/g, testEmailAddress)
        .replace(/{{unsubscribe_url}}/g, unsubUrl);

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
          subject: content.subject,
          preheader: content.preheader,
          senderName,
          senderEmail,
          htmlContent: activeCompiledHtml,
          recipients: parsedRecipients.valid,
          templateId: content.templateId,
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

  // -------------------------------------------------------------
  // Content Manipulation Handlers
  // -------------------------------------------------------------

  const updateContentField = <K extends keyof PromotionalEmailContent>(field: K, value: PromotionalEmailContent[K]) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  // Image Selection Handler
  const handleSelectCuratedImage = (img: CuratedImageItem) => {
    if (imagePickerTarget === 'hero') {
      setContent((prev) => ({
        ...prev,
        heroImageUrl: img.url,
        heroImageAlt: img.title,
      }));
    } else if (imagePickerTarget && typeof imagePickerTarget === 'object' && imagePickerTarget.type === 'product') {
      const targetId = imagePickerTarget.productId;
      setContent((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === targetId ? { ...p, imageUrl: img.url } : p)),
      }));
    }
    setShowImagePickerModal(false);
    setImagePickerTarget(null);
  };

  // Custom Image File Upload
  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (imagePickerTarget === 'hero') {
        setContent((prev) => ({ ...prev, heroImageUrl: dataUrl }));
      } else if (imagePickerTarget && typeof imagePickerTarget === 'object' && imagePickerTarget.type === 'product') {
        const targetId = imagePickerTarget.productId;
        setContent((prev) => ({
          ...prev,
          products: prev.products.map((p) => (p.id === targetId ? { ...p, imageUrl: dataUrl } : p)),
        }));
      }
      setShowImagePickerModal(false);
      setImagePickerTarget(null);
    };
    reader.readAsDataURL(file);
  };

  // Apply URL from modal input
  const handleApplyCustomUrl = () => {
    if (!customImageUrlInput.trim()) return;
    const url = customImageUrlInput.trim();
    if (imagePickerTarget === 'hero') {
      setContent((prev) => ({ ...prev, heroImageUrl: url }));
    } else if (imagePickerTarget && typeof imagePickerTarget === 'object' && imagePickerTarget.type === 'product') {
      const targetId = imagePickerTarget.productId;
      setContent((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === targetId ? { ...p, imageUrl: url } : p)),
      }));
    }
    setCustomImageUrlInput('');
    setShowImagePickerModal(false);
    setImagePickerTarget(null);
  };

  // Product Manager Actions
  const handleAddProduct = () => {
    const newId = `prod-${Date.now()}`;
    const newProd: PromotionalProductItem = {
      id: newId,
      title: 'New Fabric Weave',
      specs: '100% Pure Silk • 110 GSM • 44" Width',
      description: 'Lustrous, fluid drape engineered for couture ensembles and bridal collections.',
      imageUrl: '/slides/hero-fabrics-5.jpg',
      badge: 'Ready Stock',
      aspectRatio: '4:3',
      linkUrl: 'https://srifabrics.com/fabrics',
    };
    setContent((prev) => ({ ...prev, products: [...prev.products, newProd] }));
  };

  const handleUpdateProduct = (id: string, updates: Partial<PromotionalProductItem>) => {
    setContent((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const handleRemoveProduct = (id: string) => {
    setContent((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= content.products.length) return;
    const copy = [...content.products];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setContent((prev) => ({ ...prev, products: copy }));
  };

  // CTA Builder Actions
  const handleAddCta = () => {
    const newId = `cta-${Date.now()}`;
    const newCta: PromotionalCtaButton = {
      id: newId,
      text: 'Explore Collection',
      url: 'https://srifabrics.com/fabrics',
      style: 'primary-burgundy',
      alignment: content.ctas[0]?.alignment || 'center',
      enabled: true,
    };
    setContent((prev) => ({ ...prev, ctas: [...prev.ctas, newCta] }));
  };

  const handleUpdateCta = (id: string, updates: Partial<PromotionalCtaButton>) => {
    setContent((prev) => ({
      ...prev,
      ctas: prev.ctas.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const handleRemoveCta = (id: string) => {
    setContent((prev) => ({
      ...prev,
      ctas: prev.ctas.filter((c) => c.id !== id),
    }));
  };

  const handleMoveCta = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= content.ctas.length) return;
    const copy = [...content.ctas];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setContent((prev) => ({ ...prev, ctas: copy }));
  };

  // Quick CTA presets
  const applyCtaPreset = (id: string, text: string, style: PromotionalCtaButton['style'], url: string) => {
    handleUpdateCta(id, { text, style, url });
  };

  // Dynamic variable insertion helper
  const insertVariable = (variable: string) => {
    setContent((prev) => ({
      ...prev,
      greeting: `${prev.greeting} ${variable}`,
    }));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#4a1122]">
              B2B TEXTILE MARKETING SUITE
            </span>
            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-mono font-medium">
              Surat Mill Edition
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Promotional Email Campaigns
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Design, preview, and dispatch luxury wholesale proposals, collection launches, and lookbooks.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowTestModal(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#4a1122]" />
            Send Test
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            {savingDraft ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="px-4 py-2 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded shadow transition-colors cursor-pointer flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-[#dfb15b]" />
            Dispatch Campaign
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-stone-200 bg-stone-50/80 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'compose'
              ? 'bg-[#4a1122] text-[#f7eedf] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          Compose &amp; Customise
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'bg-[#4a1122] text-[#f7eedf] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
          Email Templates ({EMAIL_TEMPLATES.length})
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'drafts'
              ? 'bg-[#4a1122] text-[#f7eedf] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Drafts ({drafts.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'sent'
              ? 'bg-[#4a1122] text-[#f7eedf] shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Sent Campaigns ({campaigns.length})
        </button>
      </div>

      {/* Global Status Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-medium flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. COMPOSE VIEW (Dual-Pane: Structured Form on Left, Live Preview on Right) */}
      {/* ========================================================================= */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: The Refined Visual Builder (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            {/* Top Toolbar: Switcher between Structured Form and Raw Code */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Composer Mode:
                </span>
                <div className="inline-flex bg-white rounded-md p-0.5 border border-stone-300 shadow-2xs">
                  <button
                    onClick={() => {
                      if (editorMode === 'code') {
                        // confirm back to structured
                        setEditorMode('structured');
                      }
                    }}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
                      editorMode === 'structured'
                        ? 'bg-[#4a1122] text-[#f7eedf]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Sliders className="w-3 h-3 text-[#dfb15b]" />
                    Visual Builder
                  </button>
                  <button
                    onClick={() => {
                      setRawHtmlOverride(activeCompiledHtml);
                      setEditorMode('code');
                    }}
                    className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors ${
                      editorMode === 'code'
                        ? 'bg-[#4a1122] text-[#f7eedf]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Code className="w-3 h-3 text-[#dfb15b]" />
                    HTML Source
                  </button>
                </div>
              </div>

              {/* Template Indicator */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400">Template:</span>
                <span className="font-semibold text-[#4a1122] bg-[#faf4e6] border border-[#dfb15b]/40 px-2.5 py-0.5 rounded">
                  {content.templateName}
                </span>
              </div>
            </div>

            {/* If in Raw HTML Code Mode */}
            {editorMode === 'code' ? (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <p>Edit the compiled HTML directly. Switch back to Visual Builder at any time.</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rawHtmlOverride);
                      setStatusMessage({ type: 'success', text: 'HTML copied to clipboard!' });
                      setTimeout(() => setStatusMessage(null), 2500);
                    }}
                    className="flex items-center gap-1 text-[#4a1122] hover:underline font-semibold"
                  >
                    <Copy className="w-3 h-3" /> Copy HTML
                  </button>
                </div>
                <textarea
                  value={rawHtmlOverride}
                  onChange={(e) => setRawHtmlOverride(e.target.value)}
                  rows={26}
                  className="w-full font-mono text-[11px] p-3 bg-stone-900 text-stone-100 rounded-lg border border-stone-800 leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-[#dfb15b]"
                />
              </div>
            ) : (
              /* If in Structured Visual Form Mode */
              <div>
                {/* Visual Section Navigation Tabs */}
                <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50/50 p-1.5 gap-1 text-xs">
                  {[
                    { id: 'basics', label: '1. Campaign & Sender', icon: Mail },
                    { id: 'hero', label: '2. Hero Image', icon: ImageIcon },
                    { id: 'editorial', label: '3. Copy & Greeting', icon: Type },
                    { id: 'products', label: '4. Products Showcase', icon: Layers },
                    { id: 'ctas', label: '5. CTA Builder', icon: Link2 },
                    { id: 'highlights', label: '6. Wholesale Benefits', icon: ShieldCheck },
                    { id: 'contacts', label: '7. Mill Contacts', icon: MapPin },
                    { id: 'recipients', label: '8. Recipients', icon: Users },
                  ].map((sec) => {
                    const Icon = sec.icon;
                    const isActive = composerSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setComposerSection(sec.id as any)}
                        className={`px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                          isActive
                            ? 'bg-white text-[#4a1122] font-bold border border-stone-200 shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4a1122]' : 'text-stone-400'}`} />
                        {sec.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-6 space-y-6">
                  {/* SECTION 1: BASICS (Campaign Title, Subject, Preheader, Sender) */}
                  {composerSection === 'basics' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Campaign Reference Title (Admin Only)
                        </label>
                        <input
                          type="text"
                          value={campaignTitle}
                          onChange={(e) => setCampaignTitle(e.target.value)}
                          placeholder="e.g. Royal Heritage Weaves Festive Preview 2026"
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Email Subject Line <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={content.subject}
                          onChange={(e) => updateContentField('subject', e.target.value)}
                          placeholder="e.g. Introducing The Royal Heritage Weaves — Direct from SRI FABRICS Surat Looms"
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-medium focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                        <p className="text-[11px] text-stone-400 mt-1">
                          Keep between 40-70 characters for optimal open rates across mobile and desktop.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Preheader / Preview Snippet
                        </label>
                        <input
                          type="text"
                          value={content.preheader}
                          onChange={(e) => updateContentField('preheader', e.target.value)}
                          placeholder="e.g. Explore regal Banarasi katan silks and featherlight tissue drapes."
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                        <p className="text-[11px] text-stone-400 mt-1">
                          Shows next to the subject line in buyer inboxes before the email is opened.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Sender Name</label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            Verified Sender Email (Brevo)
                          </label>
                          <input
                            type="email"
                            value={senderEmail}
                            onChange={(e) => setSenderEmail(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={() => setComposerSection('hero')}
                          className="px-4 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                        >
                          Next: Hero Image <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: HERO IMAGE (Management, Aspect Ratio, Pickers) */}
                  {composerSection === 'hero' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-stone-900">Campaign Hero Image</h4>
                          <p className="text-xs text-stone-500">
                            Prominent banner showcasing high-resolution textile photography with natural texture.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setImagePickerTarget('hero');
                            setShowImagePickerModal(true);
                          }}
                          className="px-3 py-1.5 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
                          Select From SRI Library
                        </button>
                      </div>

                      {/* Hero Image Preview Box */}
                      <div className="relative border border-stone-200 rounded-lg overflow-hidden bg-stone-100 group">
                        {content.heroImageUrl ? (
                          <div className="relative">
                            <img
                              src={content.heroImageUrl}
                              alt={content.heroImageAlt || 'Hero banner'}
                              className="w-full max-h-[300px] object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  setImagePickerTarget('hero');
                                  setShowImagePickerModal(true);
                                }}
                                className="px-3 py-1.5 bg-white text-stone-900 text-xs font-bold rounded shadow cursor-pointer flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" /> Change Image
                              </button>
                              <button
                                onClick={() => updateContentField('heroImageUrl', '')}
                                className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded shadow cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 text-center text-stone-400">
                            <ImageIcon className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                            <p className="text-xs">No hero image set.</p>
                            <button
                              onClick={() => {
                                setImagePickerTarget('hero');
                                setShowImagePickerModal(true);
                              }}
                              className="mt-2 text-xs font-bold text-[#4a1122] hover:underline"
                            >
                              Choose an image from library
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Image Details & Aspect Ratio Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Image URL / Path</label>
                          <input
                            type="text"
                            value={content.heroImageUrl}
                            onChange={(e) => updateContentField('heroImageUrl', e.target.value)}
                            placeholder="https://... or /slides/hero-sarees-7.jpg"
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            Aspect Ratio Format
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(['21:9', '16:9', '3:2', '4:3'] as const).map((ratio) => (
                              <button
                                key={ratio}
                                onClick={() => updateContentField('heroAspectRatio', ratio)}
                                className={`py-1.5 text-xs font-semibold rounded border cursor-pointer transition-colors ${
                                  content.heroAspectRatio === ratio
                                    ? 'bg-[#4a1122] text-[#f7eedf] border-[#4a1122]'
                                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                {ratio}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setComposerSection('basics')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setComposerSection('editorial')}
                          className="px-4 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                        >
                          Next: Copy &amp; Greeting <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: EDITORIAL COPY & GREETING */}
                  {composerSection === 'editorial' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Kicker Badge (Top Pill)</label>
                        <input
                          type="text"
                          value={content.kicker || ''}
                          onChange={(e) => updateContentField('kicker', e.target.value)}
                          placeholder="e.g. NEW 2026 CAPSULE or B2B STRATEGIC PARTNERSHIP"
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Main Promotional Headline <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={content.headline}
                          onChange={(e) => updateContentField('headline', e.target.value)}
                          placeholder="e.g. The Royal Heritage Weaves"
                          className="w-full font-serif text-sm font-bold px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Subheadline</label>
                        <input
                          type="text"
                          value={content.subheadline || ''}
                          onChange={(e) => updateContentField('subheadline', e.target.value)}
                          placeholder="e.g. Direct Mill Preview for Designers, Couturiers & Pret Labels"
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-stone-700">
                            Personalized Greeting (with dynamic tags)
                          </label>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-stone-400">Insert tag:</span>
                            {['{{name}}', '{{company}}', '{{email}}'].map((tag) => (
                              <button
                                key={tag}
                                onClick={() => insertVariable(tag)}
                                className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-mono text-[#4a1122] font-semibold cursor-pointer"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={content.greeting}
                          onChange={(e) => updateContentField('greeting', e.target.value)}
                          placeholder="Dear {{name}},"
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded font-medium focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Introduction Statement (B2B Persuasive Copy)
                        </label>
                        <textarea
                          rows={4}
                          value={content.introParagraph}
                          onChange={(e) => updateContentField('introParagraph', e.target.value)}
                          placeholder="Provide a concise, persuasive summary of the offer, collection, or partnership."
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded leading-relaxed focus:ring-1 focus:ring-[#4a1122] focus:outline-hidden"
                        />
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setComposerSection('hero')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setComposerSection('products')}
                          className="px-4 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                        >
                          Next: Products Showcase <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 4: PRODUCTS SHOWCASE MANAGER */}
                  {composerSection === 'products' && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-stone-900">
                            Featured Product Weaves ({content.products.length})
                          </h4>
                          <p className="text-xs text-stone-500">
                            Multi-product showcase grid with image, technical specs, description, and MOQ tags.
                          </p>
                        </div>
                        <button
                          onClick={handleAddProduct}
                          className="px-3 py-1.5 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#dfb15b]" /> Add Product
                        </button>
                      </div>

                      {/* Section Headings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">
                            Product Section Title
                          </label>
                          <input
                            type="text"
                            value={content.productSectionTitle}
                            onChange={(e) => updateContentField('productSectionTitle', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={content.productSectionSubtitle || ''}
                            onChange={(e) => updateContentField('productSectionSubtitle', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded bg-white"
                          />
                        </div>
                      </div>

                      {/* Product List */}
                      <div className="space-y-3">
                        {content.products.map((prod, idx) => (
                          <div
                            key={prod.id}
                            className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-lg space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#4a1122] text-[#f7eedf] text-[10px] font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <span className="font-serif font-bold text-xs text-stone-900 truncate">
                                  {prod.title || 'Untitled Weave'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleMoveProduct(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-stone-200 rounded text-stone-600 disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleMoveProduct(idx, 'down')}
                                  disabled={idx === content.products.length - 1}
                                  className="p-1 hover:bg-stone-200 rounded text-stone-600 disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleRemoveProduct(prod.id)}
                                  className="p-1 hover:bg-rose-100 rounded text-rose-600 cursor-pointer"
                                  title="Remove product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                              {/* Product Thumbnail & Change Button */}
                              <div className="sm:col-span-3 space-y-1.5">
                                <div className="h-24 w-full bg-stone-200 rounded overflow-hidden border border-stone-300">
                                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                                </div>
                                <button
                                  onClick={() => {
                                    setImagePickerTarget({ type: 'product', productId: prod.id });
                                    setShowImagePickerModal(true);
                                  }}
                                  className="w-full py-1 bg-white hover:bg-stone-100 text-[#4a1122] border border-stone-300 text-[10px] font-bold rounded cursor-pointer"
                                >
                                  Change Image
                                </button>
                              </div>

                              {/* Product Fields */}
                              <div className="sm:col-span-9 space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-stone-600 mb-0.5">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      value={prod.title}
                                      onChange={(e) => handleUpdateProduct(prod.id, { title: e.target.value })}
                                      className="w-full text-xs px-2 py-1 border border-stone-300 rounded bg-white"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-stone-600 mb-0.5">
                                      Badge (e.g. Ready Stock)
                                    </label>
                                    <input
                                      type="text"
                                      value={prod.badge || ''}
                                      onChange={(e) => handleUpdateProduct(prod.id, { badge: e.target.value })}
                                      className="w-full text-xs px-2 py-1 border border-stone-300 rounded bg-white"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">
                                    Technical Specs (GSM, Yarn, Width)
                                  </label>
                                  <input
                                    type="text"
                                    value={prod.specs}
                                    onChange={(e) => handleUpdateProduct(prod.id, { specs: e.target.value })}
                                    className="w-full text-xs px-2 py-1 border border-stone-300 rounded bg-white font-medium"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-stone-600 mb-0.5">
                                    Short Description
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={prod.description}
                                    onChange={(e) => handleUpdateProduct(prod.id, { description: e.target.value })}
                                    className="w-full text-xs px-2 py-1 border border-stone-300 rounded bg-white leading-relaxed"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setComposerSection('editorial')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setComposerSection('ctas')}
                          className="px-4 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                        >
                          Next: CTA Builder <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 5: CTA BUILDER (MAJOR IMPROVEMENT) */}
                  {composerSection === 'ctas' && (
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-stone-900">
                            CTA Buttons Manager &amp; Styler
                          </h4>
                          <p className="text-xs text-stone-500">
                            Customise primary &amp; secondary action buttons with custom links and styling.
                          </p>
                        </div>
                        <button
                          onClick={handleAddCta}
                          className="px-3 py-1.5 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#dfb15b]" /> Add Another CTA
                        </button>
                      </div>

                      {/* Alignment Selector */}
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <span className="text-xs font-bold text-stone-700">Button Alignment:</span>
                        <div className="inline-flex bg-white rounded border border-stone-300 p-0.5">
                          {(['center', 'left'] as const).map((align) => (
                            <button
                              key={align}
                              onClick={() => {
                                setContent((prev) => ({
                                  ...prev,
                                  ctas: prev.ctas.map((c) => ({ ...c, alignment: align })),
                                }));
                              }}
                              className={`px-3 py-1 text-xs font-semibold rounded capitalize cursor-pointer ${
                                content.ctas[0]?.alignment === align
                                  ? 'bg-[#4a1122] text-[#f7eedf]'
                                  : 'text-stone-600 hover:text-stone-900'
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* CTA Buttons List */}
                      <div className="space-y-4">
                        {content.ctas.map((cta, idx) => (
                          <div
                            key={cta.id}
                            className={`p-4 rounded-lg border transition-all ${
                              cta.enabled
                                ? 'bg-white border-stone-300 shadow-2xs'
                                : 'bg-stone-50 border-stone-200 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3 mb-3">
                              <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={cta.enabled}
                                    onChange={(e) => handleUpdateCta(cta.id, { enabled: e.target.checked })}
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4 bg-stone-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:width-3 after:transition-all peer-checked:bg-[#4a1122]"></div>
                                </label>
                                <span className="font-serif font-bold text-xs text-stone-900">
                                  Button #{idx + 1}: {cta.text || 'Untitled Button'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleMoveCta(idx, 'up')}
                                  disabled={idx === 0}
                                  className="p-1 hover:bg-stone-100 rounded text-stone-600 disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleMoveCta(idx, 'down')}
                                  disabled={idx === content.ctas.length - 1}
                                  className="p-1 hover:bg-stone-100 rounded text-stone-600 disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleRemoveCta(cta.id)}
                                  className="p-1 hover:bg-rose-100 rounded text-rose-600 cursor-pointer"
                                  title="Remove CTA"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Button Edit Controls */}
                            <div className="space-y-3 text-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                                    Button Label Text
                                  </label>
                                  <input
                                    type="text"
                                    value={cta.text}
                                    onChange={(e) => handleUpdateCta(cta.id, { text: e.target.value })}
                                    className="w-full text-xs px-3 py-1.5 border border-stone-300 rounded font-semibold focus:ring-1 focus:ring-[#4a1122]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                                    Button Visual Style
                                  </label>
                                  <select
                                    value={cta.style}
                                    onChange={(e) =>
                                      handleUpdateCta(cta.id, {
                                        style: e.target.value as PromotionalCtaButton['style'],
                                      })
                                    }
                                    className="w-full text-xs px-3 py-1.5 border border-stone-300 rounded bg-white font-medium"
                                  >
                                    <option value="primary-burgundy">Primary Solid Burgundy (Gold Border)</option>
                                    <option value="primary-gold">Primary Rich Gold (Dark Text)</option>
                                    <option value="secondary-outline">Secondary Luxury Outlined</option>
                                    <option value="whatsapp">WhatsApp Direct Green</option>
                                  </select>
                                </div>
                              </div>

                              {/* Destination URL */}
                              <div>
                                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                                  Destination Link (URL, WhatsApp or Mailto)
                                </label>
                                <input
                                  type="text"
                                  value={cta.url}
                                  onChange={(e) => handleUpdateCta(cta.id, { url: e.target.value })}
                                  placeholder="https://srifabrics.com/fabrics"
                                  className="w-full text-xs px-3 py-1.5 border border-stone-300 rounded font-mono focus:ring-1 focus:ring-[#4a1122]"
                                />
                              </div>

                              {/* Quick Presets for Text & Links */}
                              <div>
                                <span className="block text-[10px] font-bold uppercase text-stone-400 mb-1">
                                  Quick Preset Suggestions:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  <button
                                    onClick={() =>
                                      applyCtaPreset(
                                        cta.id,
                                        'Explore Collection',
                                        'primary-burgundy',
                                        'https://srifabrics.com/fabrics'
                                      )
                                    }
                                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-medium text-stone-800 cursor-pointer"
                                  >
                                    Explore Collection
                                  </button>
                                  <button
                                    onClick={() =>
                                      applyCtaPreset(
                                        cta.id,
                                        'View Latest Designs',
                                        'primary-burgundy',
                                        'https://srifabrics.com/fabrics'
                                      )
                                    }
                                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-medium text-stone-800 cursor-pointer"
                                  >
                                    View Latest Designs
                                  </button>
                                  <button
                                    onClick={() =>
                                      applyCtaPreset(
                                        cta.id,
                                        'Discover Our Catalogue',
                                        'primary-burgundy',
                                        'https://srifabrics.com/fabrics'
                                      )
                                    }
                                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-medium text-stone-800 cursor-pointer"
                                  >
                                    Discover Our Catalogue
                                  </button>
                                  <button
                                    onClick={() =>
                                      applyCtaPreset(
                                        cta.id,
                                        'Request Wholesale Pricing',
                                        'secondary-outline',
                                        'https://srifabrics.com/contact'
                                      )
                                    }
                                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-medium text-[#4a1122] cursor-pointer"
                                  >
                                    Request Wholesale Pricing
                                  </button>
                                  <button
                                    onClick={() =>
                                      applyCtaPreset(
                                        cta.id,
                                        'Enquire Now',
                                        'secondary-outline',
                                        'https://srifabrics.com/contact'
                                      )
                                    }
                                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[10px] font-medium text-[#4a1122] cursor-pointer"
                                  >
                                    Enquire Now
                                  </button>
                                  <button
                                    onClick={() =>
                                      applyCtaPreset(
                                        cta.id,
                                        'Connect With Our Team',
                                        'whatsapp',
                                        'https://wa.me/919313725514?text=Hello%20SRI%20FABRICS'
                                      )
                                    }
                                    className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded text-[10px] font-semibold text-emerald-800 cursor-pointer"
                                  >
                                    WhatsApp Desk
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setComposerSection('products')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setComposerSection('highlights')}
                          className="px-4 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                        >
                          Next: Wholesale Benefits <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 6: WHOLESALE BENEFITS HIGHLIGHTS */}
                  {composerSection === 'highlights' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-stone-900">
                          Wholesale Partnership Advantages
                        </h4>
                        <p className="text-xs text-stone-500">
                          Highlights section building credibility for B2B buyers and wholesalers.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Section Title</label>
                        <input
                          type="text"
                          value={content.partnershipTitle}
                          onChange={(e) => updateContentField('partnershipTitle', e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {content.partnershipHighlights.map((hl, idx) => (
                          <div key={hl.id} className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#dfb15b]">{hl.icon || '✦'}</span>
                              <input
                                type="text"
                                value={hl.title}
                                onChange={(e) => {
                                  const updated = [...content.partnershipHighlights];
                                  updated[idx] = { ...hl, title: e.target.value };
                                  updateContentField('partnershipHighlights', updated);
                                }}
                                className="w-full text-xs font-bold px-2 py-1 border border-stone-300 rounded bg-white"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={hl.description}
                              onChange={(e) => {
                                const updated = [...content.partnershipHighlights];
                                updated[idx] = { ...hl, description: e.target.value };
                                updateContentField('partnershipHighlights', updated);
                              }}
                              className="w-full text-xs px-2 py-1 border border-stone-300 rounded bg-white text-stone-600"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setComposerSection('ctas')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setComposerSection('contacts')}
                          className="px-4 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                        >
                          Next: Mill Contacts <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 7: MILL CONTACTS & FOOTER */}
                  {composerSection === 'contacts' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-stone-900">
                          Mill Contact Details &amp; Signature
                        </h4>
                        <p className="text-xs text-stone-500">
                          Ensures buyers have immediate contact channels via Phone, WhatsApp, and showroom address.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Closing Statement / Sign-off
                        </label>
                        <textarea
                          rows={2}
                          value={content.closingStatement}
                          onChange={(e) => updateContentField('closingStatement', e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={content.contactPhone}
                            onChange={(e) => updateContentField('contactPhone', e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">
                            WhatsApp Number (Digits only)
                          </label>
                          <input
                            type="text"
                            value={content.contactWhatsApp}
                            onChange={(e) => updateContentField('contactWhatsApp', e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Showroom &amp; Mill Address
                        </label>
                        <input
                          type="text"
                          value={content.showroomAddress}
                          onChange={(e) => updateContentField('showroomAddress', e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Subtle Brand Signature (Footer)
                        </label>
                        <input
                          type="text"
                          value={content.brandSignature}
                          onChange={(e) => updateContentField('brandSignature', e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-stone-300 rounded"
                        />
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setComposerSection('highlights')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setComposerSection('recipients')}
                          className="px-4 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                        >
                          Next: Recipients <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 8: RECIPIENTS */}
                  {composerSection === 'recipients' && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-stone-900">Campaign Recipients</h4>
                          <p className="text-xs text-stone-500">
                            Enter buyer emails, import CSV list, or include active website subscribers.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleImportSubscribers}
                            disabled={loading}
                            className="px-3 py-1.5 bg-[#faf4e6] hover:bg-[#faebd0] text-[#4a1122] border border-[#dfb15b] text-xs font-bold rounded cursor-pointer flex items-center gap-1.5"
                          >
                            <Users className="w-3.5 h-3.5" />
                            + Add All Subscribers
                          </button>
                          <button
                            onClick={() => setShowRecipientModal(true)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Import CSV
                          </button>
                        </div>
                      </div>

                      {/* Status Counter */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-stone-700">
                          Valid Recipients:{' '}
                          <span className="text-[#4a1122] font-mono text-sm">{parsedRecipients.valid.length}</span>
                        </span>
                        {parsedRecipients.invalid.length > 0 && (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {parsedRecipients.invalid.length} invalid format ignored
                          </span>
                        )}
                      </div>

                      <textarea
                        rows={6}
                        value={recipientsText}
                        onChange={(e) => setRecipientsText(e.target.value)}
                        placeholder="Enter email addresses separated by commas, spaces, or new lines:&#10;buyer@delhiboutique.com&#10;sourcing@mumbaifabrics.in"
                        className="w-full text-xs font-mono p-3 border border-stone-300 rounded leading-relaxed focus:ring-1 focus:ring-[#4a1122]"
                      />

                      <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-600 space-y-1">
                        <div className="font-bold text-stone-800 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Zero Exposure Guarantee
                        </div>
                        <p>
                          Every recipient receives their email individually via Brevo SMTP relay. Email addresses are never exposed to other buyers in CC or header lists.
                        </p>
                      </div>

                      <div className="pt-4 flex justify-between">
                        <button
                          onClick={() => setComposerSection('contacts')}
                          className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setShowSendModal(true)}
                          className="px-5 py-2 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-2 cursor-pointer shadow"
                        >
                          <Send className="w-3.5 h-3.5 text-[#dfb15b]" />
                          Review &amp; Dispatch ({parsedRecipients.valid.length})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Real-Time Live Preview Frame (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 sticky top-4">
            {/* Preview Toolbar */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#4a1122]" /> Live Preview:
                </span>
                {/* Device Selector */}
                <div className="inline-flex bg-stone-100 rounded p-0.5 border border-stone-200">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'bg-white text-[#4a1122] shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Desktop (640px)"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded cursor-pointer ${
                      previewDevice === 'tablet'
                        ? 'bg-white text-[#4a1122] shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Tablet (480px)"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'bg-white text-[#4a1122] shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                    title="Mobile (360px)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Personalization Toggle */}
              <button
                onClick={() => setPersonalizePreview(!personalizePreview)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded border cursor-pointer transition-colors flex items-center gap-1 ${
                  personalizePreview
                    ? 'bg-[#faf4e6] text-[#4a1122] border-[#dfb15b]'
                    : 'bg-white text-stone-600 border-stone-300'
                }`}
                title="Toggle between real preview data and raw variables"
              >
                <Tag className="w-3 h-3 text-[#dfb15b]" />
                {personalizePreview ? 'Preview: Arun Patel' : 'Show Variables {{...}}'}
              </button>
            </div>

            {/* Sandboxed Email Preview Container */}
            <div className="bg-stone-200 p-3 sm:p-4 rounded-xl border border-stone-300 flex justify-center overflow-x-auto min-h-[680px]">
              <div
                className={`transition-all duration-200 shadow-xl rounded-lg overflow-hidden border border-stone-400 bg-white ${
                  previewDevice === 'desktop'
                    ? 'w-full max-w-[640px]'
                    : previewDevice === 'tablet'
                    ? 'w-[480px]'
                    : 'w-[360px]'
                }`}
              >
                <iframe
                  title="Promotional Email Live Preview"
                  srcDoc={displayHtmlInPreview}
                  className="w-full h-[750px] border-none block"
                  sandbox="allow-same-origin allow-popups"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TEMPLATES GALLERY VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#4a1122]">
              LUXURY TEXTILE TEMPLATES
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
              Curated B2B Campaign Templates
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Each template is engineered for the textile wholesale industry with optimal whitespace, balanced typography, and responsive email layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EMAIL_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-stone-100 overflow-hidden group">
                    <img
                      src={tmpl.thumbnail}
                      alt={tmpl.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded bg-[#4a1122]/90 backdrop-blur-xs text-[#f7eedf] text-[10px] font-bold uppercase tracking-wider border border-[#dfb15b]/40">
                        {tmpl.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                    <div className="pt-2 text-[11px] text-stone-500">
                      <span className="font-semibold text-stone-700">Subject:</span>{' '}
                      <span className="italic truncate block">{tmpl.subject}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTemplateForPreview(tmpl)}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" /> Preview
                  </button>
                  <button
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="px-4 py-1.5 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    Use Template <ChevronRight className="w-3.5 h-3.5 text-[#dfb15b]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DRAFTS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <h2 className="font-serif text-xl font-bold text-stone-900">Saved Campaign Drafts</h2>
            <p className="text-xs text-stone-500 mt-1">
              Resume editing or discard promotional emails you have previously drafted.
            </p>
          </div>

          {drafts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-stone-200 text-stone-400">
              <FileText className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-medium text-stone-600">No saved drafts found.</p>
              <p className="text-xs mt-1">Start drafting an email in the Composer tab and click "Save Draft".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((d) => (
                <div
                  key={d.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#4a1122] uppercase tracking-wider bg-[#faf4e6] px-2 py-0.5 rounded">
                        {d.templateId || 'Custom'}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(d.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-stone-900">{d.title}</h3>
                    <p className="text-xs text-stone-600 truncate">{d.subject}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => handleDeleteDraft(d.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleLoadDraft(d)}
                      className="px-3.5 py-1.5 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded cursor-pointer flex items-center gap-1"
                    >
                      Continue Editing <ChevronRight className="w-3.5 h-3.5 text-[#dfb15b]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SENT CAMPAIGNS VIEW */}
      {/* ========================================================================= */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
            <h2 className="font-serif text-xl font-bold text-stone-900">Sent Promotional History</h2>
            <p className="text-xs text-stone-500 mt-1">
              Audit log of all campaigns dispatched via Brevo SMTP relay to wholesalers and boutiques.
            </p>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-stone-200 text-stone-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-medium text-stone-600">No campaigns dispatched yet.</p>
              <p className="text-xs mt-1">Use the composer to send your first campaign.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-700 uppercase font-bold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Campaign Title</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Recipients</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {campaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 text-stone-500 shrink-0">
                          {new Date(camp.sentAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">{camp.title}</td>
                        <td className="py-3 px-4 text-stone-600 max-w-xs truncate">{camp.subject}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#4a1122]">
                          {camp.deliveredCount} / {camp.recipientCount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              camp.status === 'SENT'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : camp.status === 'PARTIAL'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {camp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedCampaignForView(camp)}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded cursor-pointer"
                          >
                            View Details
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

      {/* ========================================================================= */}
      {/* MODAL: CURATED IMAGE & FABRIC PICKER */}
      {/* ========================================================================= */}
      {showImagePickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-[#4a1122] text-[#f7eedf] flex items-center justify-between border-b border-[#dfb15b]/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dfb15b]" />
                <h3 className="font-serif text-base font-bold">SRI Fabrics Image Library</h3>
              </div>
              <button
                onClick={() => {
                  setShowImagePickerModal(false);
                  setImagePickerTarget(null);
                }}
                className="text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom URL or File Upload Row */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-8 flex items-center gap-2">
                  <input
                    type="text"
                    value={customImageUrlInput}
                    onChange={(e) => setCustomImageUrlInput(e.target.value)}
                    placeholder="Paste external image link (e.g. Cloudinary, Unsplash)..."
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded bg-white"
                  />
                  <button
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-bold rounded cursor-pointer shrink-0"
                  >
                    Apply URL
                  </button>
                </div>

                <div className="sm:col-span-4 flex justify-end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCustomFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-semibold rounded cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#4a1122]" />
                    Upload From Computer
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-xs">
                <span className="text-[11px] font-bold text-stone-500 uppercase mr-1">Filter:</span>
                {['ALL', 'Pure Silk', 'Organza', 'Georgette', 'Mill Yardage', 'Manufacturing', 'Unstitched Suits'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setImagePickerCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors shrink-0 ${
                        imagePickerCategory === cat
                          ? 'bg-[#4a1122] text-[#f7eedf]'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Images Grid */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CURATED_FABRIC_IMAGES.filter(
                (item) => imagePickerCategory === 'ALL' || item.category === imagePickerCategory
              ).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectCuratedImage(item)}
                  className="group relative bg-stone-100 rounded-lg overflow-hidden border border-stone-300 hover:border-[#4a1122] cursor-pointer shadow-2xs hover:shadow transition-all"
                >
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2 bg-white">
                    <span className="text-[9px] uppercase font-bold text-[#dfb15b] tracking-wider block">
                      {item.category}
                    </span>
                    <span className="text-xs font-serif font-bold text-stone-900 block truncate">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SEND TEST EMAIL */}
      {/* ========================================================================= */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#4a1122]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Send Test Email</h3>
              </div>
              <button onClick={() => setShowTestModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Dispatch a test copy of this promotional campaign via Brevo to verify rendering in your own email client before sending to buyers.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Test Recipient Email</label>
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="you@example.com"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122]"
              />
            </div>

            {testResult && (
              <div
                className={`p-3 rounded text-xs ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testResult.message}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-3 py-1.5 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSendTest}
                disabled={sendingTest}
                className="px-4 py-1.5 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
              >
                {sendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {sendingTest ? 'Sending Test...' : 'Send Test Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DISPATCH CONFIRMATION */}
      {/* ========================================================================= */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#4a1122]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Confirm Campaign Dispatch</h3>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Campaign:</span>
                <span className="font-bold text-stone-900">{campaignTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Subject:</span>
                <span className="font-medium text-stone-800 text-right max-w-[280px] truncate">
                  {content.subject}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Sender:</span>
                <span className="font-medium text-stone-800">
                  {senderName} &lt;{senderEmail}&gt;
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2">
                <span className="font-bold text-stone-700">Total Recipients:</span>
                <span className="font-mono font-bold text-sm text-[#4a1122]">
                  {parsedRecipients.valid.length} buyers
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Emails will be sent individually via Brevo SMTP relay with automated unsubscribe links injected.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchCampaign}
                disabled={sending || parsedRecipients.valid.length === 0}
                className="px-5 py-2 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                {sending ? <RefreshCw className="w-4 h-4 animate-spin text-[#dfb15b]" /> : <Send className="w-4 h-4 text-[#dfb15b]" />}
                {sending ? 'Dispatching Campaign...' : `Send to ${parsedRecipients.valid.length} Recipients`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RECIPIENT IMPORT (CSV / PASTE) */}
      {/* ========================================================================= */}
      {showRecipientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#4a1122]" />
                <h3 className="font-serif text-lg font-bold text-stone-900">Import Recipient Contacts</h3>
              </div>
              <button onClick={() => setShowRecipientModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Paste email addresses directly from a CSV file, Excel column, or contact list. Addresses will be automatically cleaned, deduplicated, and validated.
            </p>

            <textarea
              rows={8}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="buyer1@boutique.com, buyer2@fabricshop.in&#10;sales@couturelabel.com"
              className="w-full text-xs font-mono p-3 border border-stone-300 rounded focus:ring-1 focus:ring-[#4a1122]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRecipientModal(false)}
                className="px-3 py-1.5 border border-stone-300 text-stone-700 text-xs font-semibold rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCsv}
                className="px-4 py-1.5 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded cursor-pointer"
              >
                Append Contacts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TEMPLATE FULL PREVIEW */}
      {/* ========================================================================= */}
      {selectedTemplateForPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#4a1122] text-[#f7eedf] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold">{selectedTemplateForPreview.name}</h3>
                <p className="text-xs text-stone-300">{selectedTemplateForPreview.description}</p>
              </div>
              <button onClick={() => setSelectedTemplateForPreview(null)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-stone-100 p-4 overflow-y-auto">
              <iframe
                title="Template Preview"
                srcDoc={selectedTemplateForPreview.htmlContent}
                className="w-full h-[600px] border-none rounded shadow bg-white"
              />
            </div>

            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedTemplateForPreview(null)}
                className="px-3 py-1.5 text-xs text-stone-600 font-semibold cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleSelectTemplate(selectedTemplateForPreview);
                  setSelectedTemplateForPreview(null);
                }}
                className="px-4 py-2 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-bold rounded cursor-pointer flex items-center gap-1.5"
              >
                Use This Template <ChevronRight className="w-3.5 h-3.5 text-[#dfb15b]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CAMPAIGN DETAILS VIEW */}
      {/* ========================================================================= */}
      {selectedCampaignForView && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-[#4a1122] text-[#f7eedf] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold">{selectedCampaignForView.title}</h3>
                <p className="text-xs text-stone-300">
                  Sent on {new Date(selectedCampaignForView.sentAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedCampaignForView(null)} className="text-stone-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 border-b border-stone-200 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-stone-400 block">Status:</span>
                <span className="font-bold text-stone-900">{selectedCampaignForView.status}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Delivered:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {selectedCampaignForView.deliveredCount} / {selectedCampaignForView.recipientCount}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Sender:</span>
                <span className="font-medium text-stone-800 truncate block">
                  {selectedCampaignForView.senderEmail}
                </span>
              </div>
            </div>

            <div className="flex-1 bg-stone-100 p-4 overflow-y-auto">
              <iframe
                title="Sent Campaign Content"
                srcDoc={selectedCampaignForView.htmlContent}
                className="w-full h-[550px] border-none rounded shadow bg-white"
              />
            </div>

            <div className="p-3 bg-white border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedCampaignForView(null)}
                className="px-4 py-1.5 bg-stone-800 text-white text-xs font-semibold rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
