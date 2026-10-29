import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types/index.ts';
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  ArrowRight,
  Clock,
  MessageCircle,
  Share2,
  Check,
  ChevronRight,
} from 'lucide-react';

interface BlogViewProps {
  initialSlug?: string;
  onNavigate: (path: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ initialSlug, onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
          if (initialSlug) {
            const found = data.find((p) => p.slug === initialSlug);
            if (found) setSelectedPost(found);
          }
        }
      })
      .catch((err) => console.error('Failed to load blog posts:', err))
      .finally(() => setLoading(false));
  }, [initialSlug]);

  const handleCopyShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {});
  };

  const handleSelectArticle = (post: BlogPost) => {
    setSelectedPost(post);
    if (onNavigate) {
      onNavigate(`/blog/${post.slug}`);
    } else {
      window.history.pushState({}, '', `/blog/${post.slug}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    if (onNavigate) {
      onNavigate('/blog');
    } else {
      window.history.pushState({}, '', '/blog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to render markdown content with rich responsive typography
  function renderMarkdownContent(content: string) {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

    const flushList = () => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={`ul-${elements.length}`} className="my-5 space-y-3 pl-1">
              {currentList.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-stone-700 leading-relaxed text-base sm:text-lg">
                  <span className="w-2 h-2 rounded-full bg-[#dfb15b] mt-2.5 shrink-0 ring-2 ring-[#dfb15b]/20" />
                  <div className="flex-1">{item}</div>
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`ol-${elements.length}`} className="my-5 space-y-3.5 pl-1">
              {currentList.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-stone-700 leading-relaxed text-base sm:text-lg">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4a1122] text-[#f7eedf] text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                    {idx + 1}
                  </span>
                  <div className="flex-1">{item}</div>
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    const parseInline = (text: string): React.ReactNode => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-stone-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed) {
        flushList();
        continue;
      }

      // H1 (skip if matches page title)
      if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
        flushList();
        const headingText = trimmed.replace(/^#\s+/, '');
        if (headingText.toLowerCase() === selectedPost?.title?.toLowerCase()) {
          continue;
        }
        elements.push(
          <h1 key={i} className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4a1122] mt-8 mb-4">
            {parseInline(headingText)}
          </h1>
        );
        continue;
      }

      // H2 Heading
      if (trimmed.startsWith('## ')) {
        flushList();
        const headingText = trimmed.replace(/^##\s+/, '');
        const headingId = headingText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        elements.push(
          <div key={i} id={headingId} className="scroll-mt-24 pt-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4a1122] tracking-tight pb-2.5 border-b border-stone-200">
              {parseInline(headingText)}
            </h2>
          </div>
        );
        continue;
      }

      // H3 Heading
      if (trimmed.startsWith('### ')) {
        flushList();
        const headingText = trimmed.replace(/^###\s+/, '');
        elements.push(
          <h3 key={i} className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-6 mb-2.5 tracking-tight">
            {parseInline(headingText)}
          </h3>
        );
        continue;
      }

      // Horizontal separator
      if (trimmed === '---') {
        flushList();
        elements.push(
          <div key={i} className="my-10 flex items-center gap-4 text-stone-300">
            <div className="flex-1 h-px bg-stone-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
            <div className="w-2 h-2 rounded-full bg-[#4a1122]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#dfb15b]" />
            <div className="flex-1 h-px bg-stone-200" />
          </div>
        );
        continue;
      }

      // Unordered list
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.replace(/^[-*]\s+/, '');
        if (!currentList || currentList.type !== 'ul') {
          flushList();
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(parseInline(itemText));
        continue;
      }

      // Ordered list
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        const itemText = numMatch[2];
        if (!currentList || currentList.type !== 'ol') {
          flushList();
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(parseInline(itemText));
        continue;
      }

      // Regular Paragraph
      flushList();
      elements.push(
        <p key={i} className="text-stone-700 leading-relaxed text-base sm:text-lg mb-5 font-normal">
          {parseInline(trimmed)}
        </p>
      );
    }

    flushList();
    return elements;
  }

  // ========================================================
  // ARTICLE DETAIL VIEW: EXPANDED STICKY IMAGE & CLEAN LAYOUT
  // ========================================================
  if (selectedPost) {
    const otherPost = posts.find((p) => p.id !== selectedPost.id);

    return (
      <div className="bg-[#faf7f2] min-h-screen">
        {/* Full-width flexible wrapper adjusting to wide viewports without side dead-space */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 sm:py-10">
          
          {/* Top Bar Navigation & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200/80">
            <button
              onClick={handleBackToList}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#4a1122] hover:text-[#781934] transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-stone-200/80 group-hover:bg-[#4a1122] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
              <span>Back to All Articles</span>
            </button>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={handleCopyShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:border-stone-300 shadow-2xs transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Share Guide</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/919875198837?text=${encodeURIComponent(`Hello SRI FABRIC, I am reading "${selectedPost.title}" and would like to enquire about textile sourcing and production.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Sourcing Desk</span>
              </a>
            </div>
          </div>

          {/* Article Header (Fluid Full-Width) */}
          <header className="mb-10 space-y-4 max-w-4xl">
            {/* Clean Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-600 uppercase tracking-widest font-semibold">
              <span className="text-[#4a1122] font-bold">{selectedPost.categoryName || 'FABRIC INSIGHTS'}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>SURAT TEXTILE HUB</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#dfb15b]" />
                <span>7 MIN READ</span>
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#4a1122] tracking-tight leading-[1.15]">
              {selectedPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-600 pt-1">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#dfb15b]" />
                <span className="font-medium text-stone-800">{selectedPost.author}</span>
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#dfb15b]" />
                <span>{new Date(selectedPost.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </span>
            </div>
          </header>

          {/* =================================================================== */}
          {/* TWO-COLUMN FLEXIBLE LAYOUT WITH 16:9 STICKY IMAGE & NO CLUTTER      */}
          {/* =================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
            
            {/* LEFT COLUMN: LARGE STICKY 16:9 IMAGE (Native 16:9 Visibility) */}
            <aside className="lg:col-span-6 xl:col-span-6 order-1 lg:order-1 lg:sticky lg:top-24 self-start">
              <div className="w-full rounded-2xl overflow-hidden bg-[#1f070e] border border-stone-200/90 shadow-xl transition-all duration-300">
                <div className="w-full aspect-[16/9] overflow-hidden">
                  <img
                    src={selectedPost.featuredImageUrl}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN: MAIN ARTICLE BODY */}
            <main className="lg:col-span-6 xl:col-span-6 order-2 lg:order-2 space-y-8 min-w-0">
              
              {/* Direct Rendered Markdown Content */}
              <article className="prose prose-stone max-w-none text-stone-700">
                {renderMarkdownContent(selectedPost.content)}
              </article>

              {/* Tags Section */}
              {selectedPost.tags && (
                <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-700 mr-2">
                    <Tag className="w-3.5 h-3.5 text-[#dfb15b]" />
                    <span>TOPICS:</span>
                  </div>
                  {selectedPost.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-stone-200 text-stone-700 px-3 py-1 rounded-md text-xs font-medium shadow-2xs"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Direct Sourcing Banner */}
              <div className="bg-[#24060d] text-[#f7eedf] rounded-2xl p-6 sm:p-8 border border-[#dfb15b]/30 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#dfb15b] font-bold">
                      MANUFACTURING & WHOLESALE SOURCING
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      Partner with SRI FABRIC in Surat
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                      Looking to manufacture garments, source digital printed textiles, or obtain lab dips and fabric swatches? Our textile directors are available to assist your brand.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/919875198837?text=Hello%20SRI%20FABRIC%2C%20I%20read%20your%20article%20and%20would%20like%20to%20discuss%20bulk%20textile%20sourcing."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-5 py-3 bg-[#dfb15b] hover:bg-[#ebd085] text-[#24060d] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm text-center"
                  >
                    WhatsApp +91 9875198837
                  </a>
                </div>
              </div>

              {/* Read Next Article */}
              {otherPost && (
                <div className="pt-8 border-t border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-bold text-[#4a1122]">
                      READ NEXT IN THIS SERIES
                    </span>
                    <button
                      onClick={handleBackToList}
                      className="text-xs text-[#4a1122] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>All Articles</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    onClick={() => handleSelectArticle(otherPost)}
                    className="group bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 cursor-pointer hover:border-[#dfb15b] hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-full sm:w-48 aspect-[16/9] rounded-lg overflow-hidden bg-[#24060d] shrink-0">
                      <img
                        src={otherPost.featuredImageUrl}
                        alt={otherPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#4a1122]">
                        {otherPost.categoryName || 'GUIDE'}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#4a1122] transition-colors leading-snug">
                        {otherPost.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {otherPost.excerpt}
                      </p>
                      <div className="pt-1 flex items-center gap-1 text-xs font-semibold text-[#4a1122]">
                        <span>Read this guide</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // BLOG LISTING VIEW (FLUID FULL-WIDTH 2-COLUMN GRID)
  // ========================================================
  return (
    <div className="bg-[#faf7f2] min-h-screen py-10 sm:py-12">
      {/* Full-width container adjusting gracefully without wasted left/right space */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 space-y-10">
        
        {/* Header Section */}
        <div className="border-b border-stone-200/90 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#4a1122] font-bold">
              SRI FABRIC EDITORIAL & KNOWLEDGE BASE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#4a1122] tracking-tight">
              Textile Sourcing & Manufacturing Insights
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed pt-1">
              Comprehensive industry guides, digital fabric printing methodologies, and wholesale sourcing strategies directly from Surat's premier textile manufacturing ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/fabrics')}
              className="px-4 py-2 bg-[#4a1122] hover:bg-[#681830] text-[#f7eedf] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              Explore Fabric Catalogues
            </button>
            <a
              href="https://wa.me/919875198837"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* 2-Article Responsive Grid with Generous, Balanced Cards */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#4a1122] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Loading textile publications...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10 w-full">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => handleSelectArticle(post)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:border-[#dfb15b] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* 16:9 Image Area */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#24060d]">
                  <img
                    src={post.featuredImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-[#4a1122]/90 backdrop-blur-xs text-[#f7eedf] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border border-[#dfb15b]/40 shadow-xs">
                    {post.categoryName || 'SOURCING GUIDE'}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-2.5 text-xs text-stone-500 uppercase tracking-wider font-semibold">
                      <span>{post.author || 'SRI FABRIC'}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#dfb15b]" />
                        <span>{new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span>7 MIN READ</span>
                    </div>

                    <h2 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-[#4a1122] group-hover:text-[#781934] transition-colors leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-stone-600 text-sm sm:text-base line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4a1122] group-hover:text-[#781934]">
                      <span>Read Complete Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>

                    <span className="text-xs text-stone-400 group-hover:text-stone-600 transition-colors">
                      Surat Wholesale Guide
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom B2B Sourcing Callout (Fluid & Flexible) */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#4a1122]">
              NEED CUSTOM TEXTILE SPECIFICATIONS?
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Direct Sourcing Consultation for Designers & Brands
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We supply pure silk, viscose chinon, organza, top + dupatta ensembles, and bespoke digital prints with transparent pricing, strict GSM standards, and international export compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919875198837?text=Hello%20SRI%20FABRIC%2C%20I%20am%20interested%20in%20custom%20fabric%20sourcing."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              WhatsApp: +91 9875198837
            </a>
            <button
              onClick={() => onNavigate('/enquiry')}
              className="px-5 py-2.5 bg-[#4a1122] hover:bg-[#681830] text-[#f7eedf] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              Submit Sourcing Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
