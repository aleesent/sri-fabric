import { db, isDatabaseConfigured } from '../db/index.ts';
import { fabrics, blogPosts } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { FALLBACK_BLOG_POSTS, loadFabricsFromExcel } from './fallbackData.ts';
import { SEO_LOCATIONS } from '../data/seoLocations.ts';

export function generateRobotsTxt(baseUrl: string): string {
  return `# SRI FABRIC Robots.txt — B2B Wholesale Textile Portal
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/

# Host & Sitemap Directives
Host: ${baseUrl.replace(/^https?:\/\//, '')}
Sitemap: ${baseUrl}/sitemap.xml
`;
}

export async function generateSitemapXml(baseUrl: string): Promise<string> {
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. Static Core Pages
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/sarees', priority: '0.9', changefreq: 'daily' },
    { path: '/fabrics', priority: '0.9', changefreq: 'daily' },
    { path: '/top-dupatta', priority: '0.9', changefreq: 'daily' },
    { path: '/collections', priority: '0.85', changefreq: 'weekly' },
    { path: '/manufacturing', priority: '0.85', changefreq: 'monthly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/contact', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  ];

  // 2. Location-Based Sourcing Hub Pages
  const locationPages = Object.keys(SEO_LOCATIONS).map((slug) => ({
    path: `/locations/${slug}`,
    priority: '0.85',
    changefreq: 'weekly',
  }));

  // 3. Blog Articles
  let blogSlugs: { slug: string; updatedAt?: string }[] = [];
  try {
    if (isDatabaseConfigured()) {
      const dbBlogs = await db
        .select({ slug: blogPosts.slug, createdAt: blogPosts.createdAt })
        .from(blogPosts)
        .where(eq(blogPosts.status, 'PUBLISHED'));
      if (dbBlogs.length > 0) {
        blogSlugs = dbBlogs.map((b) => ({
          slug: b.slug,
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
      updatedAt: currentDate,
    }));
  }

  // 4. Products (Fabrics, Sarees, Kurti Sets)
  let productItems: { slug: string; name?: string; imageUrl?: string }[] = [];
  try {
    if (isDatabaseConfigured()) {
      const dbFabs = await db
        .select({
          slug: fabrics.slug,
          name: fabrics.name,
          primaryImageUrl: fabrics.primaryImageUrl,
        })
        .from(fabrics)
        .where(eq(fabrics.isActive, true));
      if (dbFabs.length > 0) {
        productItems = dbFabs.map((f) => ({
          slug: f.slug,
          name: f.name,
          imageUrl: f.primaryImageUrl || undefined,
        }));
      }
    }
  } catch {
    // fallback
  }

  if (productItems.length === 0) {
    const excelFabs = loadFabricsFromExcel();
    productItems = excelFabs.map((f) => ({
      slug: f.slug,
      name: f.name,
      imageUrl: f.primaryImageUrl,
    }));
  }

  // Build XML String
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Add Static Pages
  staticPages.forEach((p) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${p.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add Location Pages
  locationPages.forEach((p) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${p.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add Blog Articles
  blogSlugs.forEach((b) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog/${b.slug}</loc>\n`;
    xml += `    <lastmod>${b.updatedAt || currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.75</priority>\n`;
    xml += `  </url>\n`;
  });

  // Add Products
  productItems.forEach((prod) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/fabrics/${prod.slug}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.80</priority>\n`;
    if (prod.imageUrl && prod.imageUrl.startsWith('/')) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${baseUrl}${prod.imageUrl}</image:loc>\n`;
      if (prod.name) {
        const cleanName = prod.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        xml += `      <image:title>${cleanName}</image:title>\n`;
      }
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}
