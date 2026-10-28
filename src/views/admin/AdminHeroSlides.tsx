import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../../types/index.ts';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Smartphone,
  Monitor,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  Upload,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface AdminHeroSlidesProps {
  token: string;
}

const PRESET_TEXTILES = [
  {
    name: 'Royal Burgundy Silk & Zari',
    desktop: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85',
    mobile: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1080&h=1920&q=85',
    heading: 'FABRICS FOR A BRIGHTER TOMORROW',
    kicker: 'PREMIUM TEXTILES',
    subheading: 'Exceptional quality, timeless designs and premium fabrics for every occasion.',
  },
  {
    name: 'Emerald Green Kadwa Brocade',
    desktop: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85',
    mobile: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1080&h=1920&q=85',
    heading: 'TIMELESS FABRICS. ENDLESS POSSIBILITIES.',
    kicker: 'HERITAGE & INNOVATION',
    subheading: 'Crafting luxury handloom and rapier-woven textiles with sustainable zero-waste practices.',
  },
  {
    name: 'Golden Organza & Gossamer Weave',
    desktop: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=2000&q=85',
    mobile: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1080&h=1920&q=85',
    heading: 'COUTURE-GRADE ARTISTRY & SHEER ELEGANCE',
    kicker: 'LUXURY ORGANZA & GEORGETTE',
    subheading: 'Delicate translucence engineered with high-tensile warp strength for global ateliers.',
  },
  {
    name: 'Tussar Handloom Raw Texture',
    desktop: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=85',
    mobile: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1080&h=1920&q=85',
    heading: 'NATURAL TEXTURES. BESPOKE WEAVING.',
    kicker: 'ORGANIC COTTON & LINEN',
    subheading: 'Breathable, tactile compositions crafted for high-end ready-to-wear and couture.',
  },
];

export const AdminHeroSlides: React.FC<AdminHeroSlidesProps> = ({ token }) => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSlide | null>(null);
  const [previewTabMap, setPreviewTabMap] = useState<Record<number, 'desktop' | 'mobile'>>({});
  const [formData, setFormData] = useState<Partial<HeroSlide>>({});
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<HeroSlide | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [pageFilter, setPageFilter] = useState<'all' | 'home' | 'fabrics' | 'sarees' | 'kurti-set'>('all');

  const getActiveToken = () => {
    return token || (typeof window !== 'undefined' ? localStorage.getItem('sri_admin_token') : '') || '';
  };

  const fetchItems = () => {
    const activeToken = getActiveToken();
    setLoading(true);
    fetch('/api/admin/hero-slides', {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSlides(data.sort((a, b) => a.sortOrder - b.sortOrder));
        } else {
          setSlides([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch hero slides');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const notifySlideChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('hero-slides-updated', { detail: { time: Date.now() } }));
      localStorage.setItem('sri_slides_updated', Date.now().toString());
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      kicker: 'PREMIUM TEXTILES',
      heading: 'FABRICS FOR A BRIGHTER TOMORROW',
      subheading: 'Exceptional quality, timeless designs and premium fabrics for every occasion.',
      description: 'Sourcing partner to couture designers and garment manufacturers.',
      buttonText1: 'EXPLORE COLLECTIONS',
      buttonLink1: '/fabrics',
      buttonText2: 'REQUEST AN ENQUIRY',
      buttonLink2: '/enquiry',
      imageUrl: PRESET_TEXTILES[0].desktop,
      mobileImageUrl: PRESET_TEXTILES[0].mobile,
      targetPage: pageFilter !== 'all' ? pageFilter : 'home',
      sortOrder: slides.length + 1,
      isActive: true,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: HeroSlide) => {
    setEditingItem(item);
    // Explicitly copy ONLY editable fields, stripping createdAt, updatedAt, id
    setFormData({
      kicker: item.kicker || 'PREMIUM TEXTILES',
      heading: item.heading || '',
      subheading: item.subheading || '',
      description: item.description || '',
      buttonText1: item.buttonText1 || 'EXPLORE COLLECTIONS',
      buttonLink1: item.buttonLink1 || '/fabrics',
      buttonText2: item.buttonText2 || 'REQUEST AN ENQUIRY',
      buttonLink2: item.buttonLink2 || '/enquiry',
      imageUrl: item.imageUrl || '',
      mobileImageUrl: item.mobileImageUrl || '',
      targetPage: item.targetPage || 'home',
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (slide: HeroSlide) => {
    try {
      const payload = {
        kicker: slide.kicker || 'PREMIUM TEXTILES',
        heading: `${slide.heading} (Copy)`,
        subheading: slide.subheading || '',
        description: slide.description || '',
        buttonText1: slide.buttonText1 || 'EXPLORE COLLECTIONS',
        buttonLink1: slide.buttonLink1 || '/fabrics',
        buttonText2: slide.buttonText2 || 'REQUEST AN ENQUIRY',
        buttonLink2: slide.buttonLink2 || '/enquiry',
        imageUrl: slide.imageUrl,
        mobileImageUrl: slide.mobileImageUrl || null,
        targetPage: slide.targetPage || 'home',
        sortOrder: slides.length + 1,
        isActive: true,
      };

      const activeToken = getActiveToken();
      const res = await fetch('/api/admin/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to duplicate slide');
      showSuccess('Slide duplicated successfully!');
      notifySlideChange();
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to duplicate slide');
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    // Optimistic toggle
    setSlides((prev) =>
      prev.map((s) => (s.id === slide.id ? { ...s, isActive: !s.isActive } : s))
    );
    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          isActive: !slide.isActive,
        }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      showSuccess(`Slide ${!slide.isActive ? 'activated' : 'moved to draft'}!`);
      notifySlideChange();
      fetchItems();
    } catch (err: any) {
      // Revert on error
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, isActive: slide.isActive } : s))
      );
      setError(err.message || 'Failed to update status');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const current = newSlides[index];
    const target = newSlides[targetIndex];

    const currentOrder = current.sortOrder;
    const targetOrder = target.sortOrder;

    // Instant optimistic swap
    newSlides[index] = target;
    newSlides[targetIndex] = current;
    setSlides(newSlides);

    const orderPayload = [
      { id: current.id, sortOrder: targetOrder === currentOrder ? targetOrder + (direction === 'up' ? -1 : 1) : targetOrder },
      { id: target.id, sortOrder: currentOrder },
    ];

    try {
      const activeToken = getActiveToken();
      const res = await fetch('/api/admin/hero-slides-reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ order: orderPayload }),
      });
      if (!res.ok) throw new Error('Failed to reorder');
      showSuccess('Slide order updated!');
      notifySlideChange();
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to update slide order');
      fetchItems();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'imageUrl' | 'mobileImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const rawDataUrl = loadEvt.target?.result as string;
      if (!rawDataUrl) return;

      // Compress client-side via HTML5 canvas for instant loading and snappy upload
      const img = new Image();
      img.onload = () => {
        const maxDim = targetField === 'imageUrl' ? 1920 : 1080;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, [targetField]: compressed }));
          showSuccess(`Optimized & loaded ${targetField === 'imageUrl' ? 'Desktop' : 'Mobile'} image`);
          return;
        }
        setFormData((prev) => ({ ...prev, [targetField]: rawDataUrl }));
        showSuccess(`Loaded ${targetField === 'imageUrl' ? 'Desktop' : 'Mobile'} image from device`);
      };
      img.onerror = () => {
        setFormData((prev) => ({ ...prev, [targetField]: rawDataUrl }));
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Strictly sanitize payload to eliminate any toISOString / timestamp issues
    const cleanPayload = {
      kicker: formData.kicker || 'PREMIUM TEXTILES',
      heading: formData.heading?.trim() || '',
      subheading: formData.subheading?.trim() || '',
      description: formData.description?.trim() || '',
      buttonText1: formData.buttonText1?.trim() || 'EXPLORE COLLECTIONS',
      buttonLink1: formData.buttonLink1?.trim() || '/fabrics',
      buttonText2: formData.buttonText2?.trim() || 'REQUEST AN ENQUIRY',
      buttonLink2: formData.buttonLink2?.trim() || '/enquiry',
      imageUrl: formData.imageUrl?.trim() || '',
      mobileImageUrl: formData.mobileImageUrl && formData.mobileImageUrl.trim() ? formData.mobileImageUrl.trim() : null,
      targetPage: formData.targetPage ? formData.targetPage.toLowerCase() : 'home',
      sortOrder: Number(formData.sortOrder) || 1,
      isActive: Boolean(formData.isActive ?? true),
    };

    if (!cleanPayload.heading) {
      setError('Headline Heading is required.');
      setSubmitting(false);
      return;
    }
    if (!cleanPayload.imageUrl) {
      setError('Desktop Slide Image is required.');
      setSubmitting(false);
      return;
    }

    const isEdit = !!editingItem;
    const url = isEdit ? `/api/admin/hero-slides/${editingItem.id}` : '/api/admin/hero-slides';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const activeToken = getActiveToken();
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(cleanPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save slide');

      setIsModalOpen(false);
      showSuccess(isEdit ? 'Hero slide updated successfully!' : 'New hero slide created successfully!');
      notifySlideChange();
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const activeToken = getActiveToken();
    const previousSlides = [...slides];

    // Optimistically update UI immediately so slide disappears without waiting
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirmItem(null);
    if (editingItem?.id === id) {
      setIsModalOpen(false);
      setEditingItem(null);
    }

    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete slide');
      }
      showSuccess('Hero slide deleted successfully');
      notifySlideChange();
      fetchItems();
    } catch (err: any) {
      // Revert slides if delete failed
      setSlides(previousSlides);
      setError(err.message || 'Failed to delete slide');
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_TEXTILES[0]) => {
    setFormData((prev) => ({
      ...prev,
      heading: preset.heading,
      kicker: preset.kicker,
      subheading: preset.subheading,
      imageUrl: preset.desktop,
      mobileImageUrl: preset.mobile,
    }));
    showSuccess(`Applied preset: ${preset.name}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-[100] bg-[#4a1122] text-[#f7eedf] border border-[#dfb15b]/40 px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-[#dfb15b]" />
          <span>{successMsg}</span>
        </div>
      )}
      {error && !isModalOpen && (
        <div className="fixed top-6 right-6 z-[100] bg-red-900 text-white border border-red-400 px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-2 hover:opacity-80 cursor-pointer text-sm font-bold leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122] flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-[#dfb15b]" />
            HOMEPAGE BANNER CMS
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Hero Slides Manager
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Configure full-width desktop landscape slides alongside dedicated portrait mobile screen images. Supports multiple rotating slides, instant reordering, and live preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#dfb15b]" />
            <span>Add Slide</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#faf7f2] border border-[#dfb15b]/30 rounded-lg p-3 text-xs text-stone-700">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-stone-900">
            Total Slides: <strong className="text-[#4a1122]">{slides.length}</strong>
          </span>
          <span className="text-stone-300">•</span>
          <span>
            Active in Rotation: <strong className="text-emerald-700">{slides.filter((s) => s.isActive).length}</strong>
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500">
            Slides cycle every 2 seconds on each page with smooth crossfade
          </span>
        </div>

        <div className="text-[11px] text-[#4a1122] font-semibold flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>Desktop & Mobile Images Separated</span>
        </div>
      </div>

      {/* Target Page Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <span className="text-xs font-bold text-stone-700 mr-2">Filter by Page:</span>
        {(
          [
            { id: 'all', label: 'All Slides' },
            { id: 'home', label: 'Homepage (/)' },
            { id: 'fabrics', label: 'Fabric (/fabrics)' },
            { id: 'sarees', label: 'Saree (/sarees)' },
            { id: 'kurti-set', label: 'Kurti Set (/kurti-set)' },
          ] as const
        ).map((tab) => {
          const count = tab.id === 'all' ? slides.length : slides.filter((s) => (s.targetPage || 'home') === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setPageFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                pageFilter === tab.id
                  ? 'bg-[#4a1122] text-[#f7eedf] shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${pageFilter === tab.id ? 'bg-[#dfb15b] text-[#1c050d] font-bold' : 'bg-stone-100 text-stone-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slides Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 text-sm">Loading hero slides...</div>
      ) : slides.filter((s) => pageFilter === 'all' || (s.targetPage || 'home') === pageFilter).length === 0 ? (
        <div className="p-12 bg-white rounded-xl border border-stone-200 text-center space-y-4">
          <p className="text-stone-600 text-sm">No hero slides found for this page target. Click below to add one.</p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-[#4a1122] text-[#f7eedf] text-xs font-semibold rounded inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#dfb15b]" />
            <span>Create Slide</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {slides
            .filter((s) => pageFilter === 'all' || (s.targetPage || 'home') === pageFilter)
            .map((slide, idx) => {
            const currentTab = previewTabMap[slide.id] || 'desktop';
            const hasCustomMobile = Boolean(slide.mobileImageUrl && slide.mobileImageUrl.trim());

            return (
              <div
                key={slide.id}
                className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Preview Header with Desktop / Mobile Tabs */}
                <div className="bg-[#1c050d] text-white">
                  {/* Top Bar on Card: Slide Order, Active Badge, & Preview Tab Switcher */}
                  <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#dfb15b] text-[#1c050d] font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                        Order #{slide.sortOrder}
                      </span>
                      <span className="bg-white/15 text-[#dfb15b] border border-white/20 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {slide.targetPage || 'home'}
                      </span>
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          slide.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-stone-500/30 text-stone-300 hover:bg-stone-500/40'
                        }`}
                        title="Click to toggle Active status"
                      >
                        {slide.isActive ? '● Active' : '○ Draft'}
                      </button>
                    </div>

                    {/* Desktop vs Mobile Preview Toggle */}
                    <div className="flex items-center bg-black/40 rounded p-0.5 border border-white/15">
                      <button
                        onClick={() => setPreviewTabMap((prev) => ({ ...prev, [slide.id]: 'desktop' }))}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          currentTab === 'desktop'
                            ? 'bg-[#4a1122] text-[#f7eedf]'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Desktop</span>
                      </button>
                      <button
                        onClick={() => setPreviewTabMap((prev) => ({ ...prev, [slide.id]: 'mobile' }))}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          currentTab === 'mobile'
                            ? 'bg-[#4a1122] text-[#f7eedf]'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Preview Container */}
                  {currentTab === 'desktop' ? (
                    /* Desktop Widescreen Preview (16:9) */
                    <div className="relative aspect-[16/9] w-full bg-[#120306] overflow-hidden group">
                      {slide.imageUrl ? (
                        <img
                          src={slide.imageUrl}
                          alt={slide.heading}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">
                          No Desktop Image Set
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                        <span className="text-[10px] text-[#dfb15b] font-bold uppercase tracking-widest">
                          {slide.kicker}
                        </span>
                        <h4 className="font-serif text-base font-bold text-white line-clamp-1">
                          {slide.heading}
                        </h4>
                        <p className="text-[11px] text-white/90 line-clamp-1 font-light">{slide.subheading}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[10px] text-white/90 px-2 py-0.5 rounded border border-white/20">
                        Desktop 16:9 Banner
                      </div>
                    </div>
                  ) : (
                    /* Mobile Portrait Frame Preview (9:16) */
                    <div className="relative w-full h-64 bg-[#120306] flex items-center justify-center p-3">
                      <div className="relative w-36 h-56 rounded-2xl overflow-hidden border-2 border-stone-600 shadow-2xl bg-black">
                        {hasCustomMobile ? (
                          <img
                            src={slide.mobileImageUrl || ''}
                            alt={slide.heading}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : slide.imageUrl ? (
                          <img
                            src={slide.imageUrl}
                            alt={slide.heading}
                            className="w-full h-full object-cover object-center opacity-80"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-500 text-[10px]">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-2 flex flex-col justify-end text-white">
                          <span className="text-[7px] text-[#dfb15b] font-bold uppercase tracking-wider">
                            {slide.kicker}
                          </span>
                          <h5 className="font-serif text-[9px] font-bold text-white leading-tight line-clamp-2">
                            {slide.heading}
                          </h5>
                        </div>
                        {/* Notch */}
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-stone-800 rounded-full" />
                      </div>

                      <div className="absolute top-2 right-2">
                        {hasCustomMobile ? (
                          <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] px-2 py-0.5 rounded">
                            ✓ Custom Mobile Image
                          </span>
                        ) : (
                          <span className="bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] px-2 py-0.5 rounded">
                            ⚠ Using Desktop Fallback
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Body Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#4a1122] font-bold uppercase tracking-wider mb-1">
                      <span>{slide.kicker}</span>
                      <span className="text-stone-400 font-normal">
                        CTAs: {slide.buttonText1} • {slide.buttonText2}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                      {slide.heading}
                    </h3>

                    {slide.subheading && (
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                        “{slide.subheading}”
                      </p>
                    )}

                    {/* Image Source Indicators */}
                    <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] truncate max-w-[220px]" title={slide.imageUrl}>
                        🖥️ {slide.imageUrl ? 'Desktop: URL/Asset set' : 'Desktop: Missing'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] truncate max-w-[220px] ${
                        hasCustomMobile ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`} title={slide.mobileImageUrl || 'Falling back to desktop image'}>
                        📱 {hasCustomMobile ? 'Mobile: Dedicated asset' : 'Mobile: Uses Desktop'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-stone-500 hover:text-[#4a1122] hover:bg-stone-100 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Up in Rotation"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1.5 text-stone-500 hover:text-[#4a1122] hover:bg-stone-100 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Down in Rotation"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(slide)}
                        className="p-1.5 text-stone-500 hover:text-[#4a1122] hover:bg-stone-100 rounded cursor-pointer"
                        title="Duplicate Slide"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(slide)}
                        className="px-3 py-1.5 bg-[#faf7f2] hover:bg-[#f0ece1] text-[#4a1122] border border-[#dfb15b]/40 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#dfb15b]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmItem(slide);
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded cursor-pointer transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT SLIDE WITH DEDICATED DESKTOP & MOBILE IMAGES */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-[#faf7f2] rounded-xl shadow-2xl overflow-hidden border border-stone-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#24060d] text-white px-6 py-4 flex items-center justify-between border-b border-[#dfb15b]/30 shrink-0">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f7eedf]">
                  {editingItem ? 'Edit Hero Slide' : 'Create New Hero Slide'}
                </h3>
                <p className="text-[11px] text-stone-300">
                  Separate desktop landscape and mobile portrait images for optimal presentation.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Textile Presets Quick Bar */}
              <div className="bg-white border border-stone-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-stone-700 font-semibold">
                  <span className="flex items-center gap-1.5 text-[#4a1122]">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
                    <span>Quick Fabric Presets (Fills Desktop & Mobile Assets)</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TEXTILES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 bg-[#faf7f2] hover:bg-[#4a1122] hover:text-white border border-stone-300 text-stone-800 rounded text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ============================================================ */}
              {/* IMAGE ASSETS SECTION (DESKTOP & MOBILE SEPARATED)           */}
              {/* ============================================================ */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif font-bold text-sm text-[#4a1122] border-b border-stone-200 pb-1 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#dfb15b]" />
                  <span>Slide Imagery (Separated Desktop & Mobile)</span>
                </h4>

                {/* 1. DESKTOP IMAGE */}
                <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block font-bold text-stone-900 text-xs">
                        Desktop Banner Image (Landscape / 16:9 / 2000px) *
                      </label>
                      <p className="text-[11px] text-stone-500">
                        Displayed on desktop and widescreen monitors. Recommended: 1920x1080 or 2000x800.
                      </p>
                    </div>
                    {formData.imageUrl && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Desktop Set
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or data:image/..."
                      className="flex-1 bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    />
                    <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#4a1122]" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'imageUrl')}
                      />
                    </label>
                  </div>

                  {/* Desktop Preview */}
                  {formData.imageUrl && (
                    <div className="relative aspect-[21/9] w-full rounded border border-stone-200 overflow-hidden bg-stone-900">
                      <img
                        src={formData.imageUrl}
                        alt="Desktop Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Desktop Landscape Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. MOBILE IMAGE */}
                <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-[#4a1122]" />
                        <span>Mobile Screen Image (Portrait / 9:16 or 4:5)</span>
                      </label>
                      <p className="text-[11px] text-stone-500">
                        Tailored for mobile phones. Eliminates awkward horizontal cropping on mobile screens.
                      </p>
                    </div>
                    {formData.mobileImageUrl ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Mobile Custom Set
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                        Fallback to Desktop
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.mobileImageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                      placeholder="https://... (or leave empty to fallback to desktop image)"
                      className="flex-1 bg-stone-50 border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    />
                    <label className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#4a1122]" />
                      <span>Upload Mobile</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'mobileImageUrl')}
                      />
                    </label>
                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, mobileImageUrl: formData.imageUrl })}
                        className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded text-[11px] font-medium cursor-pointer"
                        title="Copy desktop image URL to mobile field"
                      >
                        Copy Desktop
                      </button>
                    )}
                  </div>

                  {/* Mobile Preview Frame */}
                  {formData.mobileImageUrl && (
                    <div className="flex items-center gap-4 bg-stone-50 p-2.5 rounded border border-stone-200">
                      <div className="relative w-20 h-32 rounded-lg border-2 border-stone-700 overflow-hidden bg-black shrink-0">
                        <img
                          src={formData.mobileImageUrl}
                          alt="Mobile Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-stone-800 rounded-full" />
                      </div>
                      <div className="text-[11px] text-stone-600 space-y-1">
                        <p className="font-semibold text-stone-800">Mobile Portrait Framing Active</p>
                        <p className="text-stone-500">
                          Mobile visitors on smartphones will see this tailored vertical composition instead of a stretched horizontal image.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================================ */}
              {/* SLIDE COPY & HEADLINES                                       */}
              {/* ============================================================ */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif font-bold text-sm text-[#4a1122] border-b border-stone-200 pb-1">
                  Slide Copy & Content
                </h4>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Target Page for this Slide *</label>
                  <select
                    value={formData.targetPage || 'home'}
                    onChange={(e) => setFormData({ ...formData, targetPage: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  >
                    <option value="home">Homepage (/)</option>
                    <option value="fabrics">Fabric Catalogue (/fabrics)</option>
                    <option value="sarees">Saree Collection (/sarees)</option>
                    <option value="kurti-set">Kurti Set Collection (/kurti-set)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Kicker / Eyebrow</label>
                  <input
                    type="text"
                    value={formData.kicker || ''}
                    onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                    placeholder="e.g. PREMIUM TEXTILES"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Headline Heading *</label>
                  <input
                    type="text"
                    required
                    value={formData.heading || ''}
                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                    placeholder="e.g. FABRICS FOR A BRIGHTER TOMORROW"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Subheading / Lead Quote</label>
                  <textarea
                    rows={2}
                    value={formData.subheading || ''}
                    onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                    placeholder="e.g. Exceptional quality, timeless designs and premium fabrics for every occasion."
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Primary CTA Label</label>
                    <input
                      type="text"
                      value={formData.buttonText1 || ''}
                      onChange={(e) => setFormData({ ...formData, buttonText1: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Primary CTA Link</label>
                    <input
                      type="text"
                      value={formData.buttonLink1 || ''}
                      onChange={(e) => setFormData({ ...formData, buttonLink1: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Secondary CTA Label</label>
                    <input
                      type="text"
                      value={formData.buttonText2 || ''}
                      onChange={(e) => setFormData({ ...formData, buttonText2: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Secondary CTA Link</label>
                    <input
                      type="text"
                      value={formData.buttonLink2 || ''}
                      onChange={(e) => setFormData({ ...formData, buttonLink2: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Display Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder ?? 1}
                      onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={formData.isActive ?? true}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-[#4a1122]"
                      />
                      <span>Active in Slide Rotation</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3 sticky bottom-0 bg-[#faf7f2] py-2">
                <div>
                  {editingItem && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmItem(editingItem)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Slide</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] font-semibold uppercase tracking-wider rounded shadow cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-[#dfb15b]" />
                        <span>{editingItem ? 'Save Changes' : 'Create Slide'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL (IN-UI, NO WINDOW.CONFIRM) */}
      {/* ============================================================ */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#faf7f2] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-300 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Delete Slide?</h3>
                <p className="text-[11px] text-stone-500 font-medium line-clamp-1">{deleteConfirmItem.heading}</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently remove this slide from the banner rotation? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmItem.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Slide</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
