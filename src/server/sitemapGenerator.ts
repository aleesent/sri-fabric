import { db, isDatabaseConfigured } from '../db/index.ts';
import { fabrics, blogPosts } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { FALLBACK_BLOG_POSTS, loadFabricsFromExcel } from './fallbackData.ts';
import { SEO_LOCATIONS } from '../data/seoLocations.ts';

export function generateRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const domain = cleanBase.replace(/^https?:\/\//, '');

  return `# ======================================================================
# SRI FABRIC — B2B Wholesale Textile Manufacturer & Exporter
# Technical Robots Directives & Crawl Optimization
# ======================================================================

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /arvexa
Disallow: /arvexa/*
Disallow: /api/

User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /arvexa
Disallow: /arvexa/*
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /arvexa
Disallow: /arvexa/*
Disallow: /api/

# Host and Master Sitemap
Host: ${domain}
Sitemap: ${cleanBase}/sitemap.xml
`;
}

export async function generateSitemapXml(baseUrl: string): Promise<string> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. Core Primary Landing Pages
  const corePages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/sarees', priority: '0.95', changefreq: 'daily' },
    { path: '/fabrics', priority: '0.95', changefreq: 'daily' },
    { path: '/top-dupatta', priority: '0.90', changefreq: 'daily' },
    { path: '/collections', priority: '0.90', changefreq: 'weekly' },
    { path: '/manufacturing', priority: '0.85', changefreq: 'monthly' },
    { path: '/about', priority: '0.85', changefreq: 'monthly' },
    { path: '/global-reach', priority: '0.80', changefreq: 'monthly' },
    { path: '/contact', priority: '0.85', changefreq: 'monthly' },
    { path: '/blog', priority: '0.85', changefreq: 'weekly' },
  ];

  // 2. High-Intent Category & Collection Deep Links
  const categoryDeepLinks = [
    { path: '/collections/pure-silk', priority: '0.85', changefreq: 'weekly' },
    { path: '/collections/royal-chinon', priority: '0.85', changefreq: 'weekly' },
    { path: '/collections/organza', priority: '0.85', changefreq: 'weekly' },
    { path: '/collections/georgette-luxe', priority: '0.85', changefreq: 'weekly' },
    { path: '/sarees?category=banarasi', priority: '0.85', changefreq: 'weekly' },
    { path: '/sarees?category=dola-silk', priority: '0.85', changefreq: 'weekly' },
    { path: '/sarees?category=tissue-organza', priority: '0.85', changefreq: 'weekly' },
    { path: '/sarees?category=bridal', priority: '0.85', changefreq: 'weekly' },
    { path: '/fabrics?category=pure-silk', priority: '0.85', changefreq: 'weekly' },
    { path: '/fabrics?category=chinon', priority: '0.85', changefreq: 'weekly' },
    { path: '/fabrics?category=organza', priority: '0.85', changefreq: 'weekly' },
    { path: '/fabrics?category=georgette', priority: '0.85', changefreq: 'weekly' },
    { path: '/top-dupatta?category=cotton', priority: '0.80', changefreq: 'weekly' },
    { path: '/top-dupatta?category=muslin', priority: '0.80', changefreq: 'weekly' },
  ];

  // 3. Location-Based Sourcing Hub Pages (Surat, Mumbai, Delhi, Kolkata, Chennai, Hyderabad, etc.)
  const locationPages = Object.keys(SEO_LOCATIONS).map((slug) => ({
    path: `/locations/${slug}`,
    priority: '0.85',
    changefreq: 'weekly',
  }));

  // 4. Blog Articles
  let blogSlugs: { slug: string; updatedAt?: string; title?: string }[] = [];
  try {
    if (isDatabaseConfigured()) {
      const dbBlogs = await db
        .select({ slug: blogPosts.slug, title: blogPosts.title, createdAt: blogPosts.createdAt })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'PUBLISHED'));
      if (dbBlogs.length > 0) {
        blogSlugs = dbBlogs.map((b) => ({
          slug: b.slug,
          title: b.title,
          updatedAt: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : currentDate,
        }));
      }
    }
  } catch {
    // fallback
  }

  if (blogSlugs.length === 0) {
    blogSlugs = FALLBACK_BLOG_POSTS.map((b) => ({
      slug: b.slug,
      title: b.title,
      updatedAt: currentDate,
    }));
  }

  // 5. Products (Complete catalogue of all fabrics, sarees, and suits)
  const productMap = new Map<string, { slug: string; name?: string; imageUrl?: string; description?: string }>();

  // Load from Excel first to ensure all 67 items are present
  try {
    const excelFabs = loadFabricsFromExcel();
    excelFabs.forEach((f) => {
      if (f.slug) {
        productMap.set(f.slug, {
          slug: f.slug,
          name: f.name,
          imageUrl: f.primaryImageUrl || (f.images && f.images[0] ? (typeof f.images[0] === 'string' ? f.images[0] : (f.images[0] as any).imageUrl) : undefined),
          description: f.description,
        });
      }
    });
  } catch {
    // fallback
  }

  // Overlay with any DB fabrics
  try {
    if (isDatabaseConfigured()) {
      const dbFabs = await db
        .select({
          slug: fabrics.slug,
          name: fabrics.name,
          primaryImageUrl: fabrics.primaryImageUrl,
          description: fabrics.description,
        })
        .from(fabrics)
        .where(eq(fabrics.isActive, true));

      dbFabs.forEach((f) => {
        if (f.slug) {
          productMap.set(f.slug, {
            slug: f.slug,
            name: f.name,
            imageUrl: f.primaryImageUrl,
            description: f.description || undefined,
          });
        }
      });
    }
  } catch {
    // fallback
  }

  const productItems = Array.from(productMap.values());

  // Build XML String
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  // Core Pages
  corePages.forEach((p) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}${p.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Category & Collection Deep Links
  categoryDeepLinks.forEach((p) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}${escapeXml(p.path)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Location Hub Pages
  locationPages.forEach((p) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}${p.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Blog Articles
  blogSlugs.forEach((b) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}/blog/${b.slug}</loc>\n`;
    xml += `    <lastmod>${b.updatedAt || currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.75</priority>\n`;
    xml += `  </url>\n`;
  });

  // Product Pages with Google Image Sitemap metadata
  productItems.forEach((prod) => {
    xml += `  <url>\n`;
    xml += `    <loc>${cleanBase}/fabrics/${prod.slug}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.80</priority>\n`;
    if (prod.imageUrl) {
      const fullImgUrl = prod.imageUrl.startsWith('http')
        ? prod.imageUrl
        : `${cleanBase}${prod.imageUrl.startsWith('/') ? prod.imageUrl : `/${prod.imageUrl}`}`;

      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(fullImgUrl)}</image:loc>\n`;
      if (prod.name) {
        xml += `      <image:title>${escapeXml(prod.name)} | SRI FABRIC Surat</image:title>\n`;
      }
      if (prod.description) {
        xml += `      <image:caption>${escapeXml(prod.description.substring(0, 160))}</image:caption>\n`;
      }
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}
