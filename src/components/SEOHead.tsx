import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'SRI FABRIC – Fabric Wholesale Surat | B2B Textile Manufacturer & Wholesaler';
const DEFAULT_DESCRIPTION = "SRI FABRIC is Surat's premier B2B fabric wholesaler, textile manufacturer & custom digital printing supplier. Ready stock & made-to-order pure silks, chinon, organza & designer sarees directly from Surat looms.";
const DEFAULT_KEYWORDS = 'fabric wholesale Surat, wholesale sarees Surat, B2B textile manufacturer Surat, pure silk fabric wholesale, Banarasi sarees wholesale, chinon fabric Surat, organza fabric wholesale, viscose georgette manufacturer, Surat textile market Ring Road, bulk fabric supplier India, custom digital fabric printing Surat, textile mill Surat';
const DEFAULT_IMAGE = '/slides/hero-fabrics-home.jpg';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update document title
    document.title = title;

    // Helper to get or create a tag
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const match = selector.match(/name="([^"]+)"/);
          if (match) el.setAttribute('name', match[1]);
        } else if (selector.startsWith('meta[property=')) {
          const match = selector.match(/property="([^"]+)"/);
          if (match) el.setAttribute('property', match[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[name="keywords"]', 'content', keywords);
    setMetaTag('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('meta[name="author"]', 'content', 'SRI FABRIC Surat');
    setMetaTag('meta[name="publisher"]', 'content', 'SRI FABRIC');

    // 3. Geographic / Local B2B SEO Tags
    setMetaTag('meta[name="geo.region"]', 'content', 'IN-GJ');
    setMetaTag('meta[name="geo.placename"]', 'content', 'Surat, Gujarat, India');
    setMetaTag('meta[name="geo.position"]', 'content', '21.1959;72.8302');
    setMetaTag('meta[name="ICBM"]', 'content', '21.1959, 72.8302');

    // 4. OpenGraph tags
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    setMetaTag('meta[property="og:site_name"]', 'content', 'SRI FABRIC');

    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('run.app'));
    const origin = isLocal ? window.location.origin : 'https://www.srifabric.com';
    const resolvedCanonical = canonicalPath
      ? `${origin}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      : typeof window !== 'undefined'
      ? `${origin}${window.location.pathname}`
      : 'https://www.srifabric.com/';

    setMetaTag('meta[property="og:url"]', 'content', resolvedCanonical);

    const resolvedImage = ogImage.startsWith('http')
      ? ogImage
      : `${origin}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;
    setMetaTag('meta[property="og:image"]', 'content', resolvedImage);

    // 5. Twitter tags
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', resolvedImage);

    // 6. Canonical Link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', resolvedCanonical);

    // 7. JSON-LD Structured Data
    let scriptTag = document.getElementById('dynamic-page-jsonld') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-page-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Clean up dynamic script if needed
    };
  }, [title, description, keywords, canonicalPath, ogImage, ogType, jsonLd]);

  return null;
};
