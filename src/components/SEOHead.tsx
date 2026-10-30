import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'SRI FABRIC – Fabric Wholesale Surat | B2B Textile Manufacturer & Wholesaler';
const DEFAULT_DESCRIPTION = 'SRI FABRIC is Surat\'s leading B2B fabric wholesaler, textile manufacturer & custom digital printing supplier. Ready stock & made-to-order pure silks, chinon, organza & designer sarees.';
const DEFAULT_IMAGE = '/slides/hero-fabrics-home.jpg';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
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

    // 2. Standard Meta Description
    setMetaTag('meta[name="description"]', 'content', description);

    // 3. OpenGraph tags
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    setMetaTag('meta[property="og:site_name"]', 'content', 'SRI FABRIC');

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://srifabrics.com';
    const resolvedCanonical = canonicalPath
      ? `${origin}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      : typeof window !== 'undefined'
      ? `${origin}${window.location.pathname}`
      : 'https://srifabrics.com/';

    setMetaTag('meta[property="og:url"]', 'content', resolvedCanonical);

    const resolvedImage = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;
    setMetaTag('meta[property="og:image"]', 'content', resolvedImage);

    // 4. Twitter tags
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', resolvedImage);

    // 5. Canonical Link tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', resolvedCanonical);

    // 6. JSON-LD Structured Data
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
      // Optional cleanup on unmount
    };
  }, [title, description, canonicalPath, ogImage, ogType, jsonLd]);

  return null;
};
