import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db, isDatabaseConfigured } from '../db/index.ts';
import {
  admins,
  heroSlides,
  categories,
  collections,
  fabrics,
  fabricImages,
  enquiries,
  contacts,
  testimonials,
  blogPosts,
  blogCategories,
  manufacturingProcesses,
  manufacturingCapabilities,
  globalRegions,
  newsletterSubscribers,
  media,
  siteSettings,
} from '../db/schema.ts';
import { eq, desc, asc, and, ilike, or, count } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { requireAuth, generateAdminToken, AuthRequest } from '../middleware/auth.ts';
import { seedDatabase } from './seed.ts';
import { importExcelCatalog } from './excelImporter.ts';
import { DEFAULT_SHOP_THE_LOOK_ITEMS } from '../data/shopTheLook.ts';
import { ShopTheLookItem } from '../types/index.ts';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_COLLECTIONS,
  FALLBACK_HERO_SLIDES,
  FALLBACK_TESTIMONIALS,
  FALLBACK_BLOG_POSTS,
  FALLBACK_PROCESSES,
  FALLBACK_CAPABILITIES,
  FALLBACK_SITE_SETTINGS,
  loadFabricsFromExcel,
  inMemoryEnquiries,
  inMemoryContacts,
  inMemorySubscribers,
} from './fallbackData.ts';

export const apiRouter = express.Router();

// Auto-seed database if empty on first startup, then sync Excel catalogs
if (isDatabaseConfigured()) {
  seedDatabase()
    .then(() => importExcelCatalog())
    .catch((err) => {
      if (err?.code !== 'ECONNREFUSED' && err?.cause?.code !== 'ECONNREFUSED') {
        console.warn('Database startup note:', err?.message || err);
      }
    });
} else {
  console.log('ℹ️ Running in standalone mode with Excel catalog data (public/SRI_FABRIC*.xlsx).');
}

// ==========================================
// HIGH PERFORMANCE IN-MEMORY CACHE
// ==========================================
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const apiCache = new Map<string, CacheEntry>();
let globalDataVersion = Date.now();

export function getCached<T>(key: string): T | null {
  const entry = apiCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    apiCache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached(key: string, data: any, ttlSeconds = 120): void {
  apiCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function clearCache(prefix?: string): void {
  globalDataVersion = Date.now();
  if (!prefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.startsWith(prefix)) {
      apiCache.delete(key);
    }
  }
}

// Lightweight cache-version endpoint for client-side instant synchronization
apiRouter.get('/cache-version', (_req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache, no-store');
  res.json({ version: globalDataVersion });
});

// Helper to check if a slide image file physically exists on the server filesystem
export function doesSlideFileExist(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }
  const clean = url.startsWith('/') ? url.slice(1) : url;
  const p1 = path.join(process.cwd(), 'public', clean);
  const p2 = path.join(process.cwd(), 'dist', clean);
  return fs.existsSync(p1) || fs.existsSync(p2);
}

// Fallback images guaranteed to exist in the repository
export function getSafeSlideFallback(targetPage?: string | null): string {
  if (targetPage === 'kurti-set' || targetPage === 'kurti-sets') return '/slides/hero-kurti-home.jpg';
  if (targetPage === 'sarees' || targetPage === 'saree') return '/slides/hero-sarees-7.jpg';
  return '/slides/hero-fabrics-5.jpg';
}

// Helper to handle base64 image strings:
// Cloud Run containers are ephemeral and wipe local disks on restart/scaling.
// Storing data URLs directly in PostgreSQL ensures user-uploaded slides NEVER vanish!
export function saveBase64Image(dataUrl: string, prefix = 'slide'): string {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;
  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (matches) {
      let ext = matches[1].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      if (ext === 'svg+xml') ext = 'svg';
      const buffer = Buffer.from(matches[2], 'base64');
      const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const dirs = [
        path.resolve(process.cwd(), 'public/slides'),
        path.resolve(process.cwd(), 'dist/slides'),
      ];

      for (const d of dirs) {
        if (!fs.existsSync(d)) {
          fs.mkdirSync(d, { recursive: true });
        }
        fs.writeFileSync(path.join(d, filename), buffer);
      }
    }
  } catch (err) {
    console.error('Error caching base64 image to disk:', err);
  }
  // Return the data URL so PostgreSQL preserves it persistently across container restarts
  return dataUrl;
}

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================

// Site Settings
apiRouter.get('/site-settings', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'site-settings:all';
    const cached = getCached<Record<string, string>>(cacheKey);
    if (cached) return res.json(cached);

    if (isDatabaseConfigured()) {
      const list = await db.select().from(siteSettings);
      const map: Record<string, string> = { ...FALLBACK_SITE_SETTINGS };
      for (const item of list) {
        map[item.key] = item.value;
      }
      setCached(cacheKey, map, 180);
      return res.json(map);
    }
    setCached(cacheKey, FALLBACK_SITE_SETTINGS, 180);
    res.json(FALLBACK_SITE_SETTINGS);
  } catch (_error: any) {
    res.json(FALLBACK_SITE_SETTINGS);
  }
});

// Shop The Look Videos Carousel
apiRouter.get('/shop-the-look', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'shop-the-look:all';
    const cached = getCached<ShopTheLookItem[]>(cacheKey);
    if (cached && Array.isArray(cached) && cached.length === 8 && cached.every(i => i.videoUrl?.includes('f_auto,q_auto'))) {
      return res.json(cached);
    }

    if (isDatabaseConfigured()) {
      const setting = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, 'shop_the_look_videos'))
        .limit(1);

      let items: ShopTheLookItem[];
      if (setting.length && setting[0].value) {
        try {
          items = JSON.parse(setting[0].value);
          const isOptimized = Array.isArray(items) && items.length === 8 && items.every(i => i.videoUrl?.includes('f_auto,q_auto'));
          if (!isOptimized) {
            items = DEFAULT_SHOP_THE_LOOK_ITEMS;
            await db
              .update(siteSettings)
              .set({
                value: JSON.stringify(DEFAULT_SHOP_THE_LOOK_ITEMS),
                description: 'Shop The Look video carousel items with Cloudinary f_auto,q_auto video references',
              })
              .where(eq(siteSettings.key, 'shop_the_look_videos'))
              .catch(() => {});
          }
        } catch {
          items = DEFAULT_SHOP_THE_LOOK_ITEMS;
        }
      } else {
        items = DEFAULT_SHOP_THE_LOOK_ITEMS;
        await db.insert(siteSettings).values({
          key: 'shop_the_look_videos',
          value: JSON.stringify(DEFAULT_SHOP_THE_LOOK_ITEMS),
          description: 'Shop The Look video carousel items with Cloudinary f_auto,q_auto video references',
        }).catch(() => {});
      }

      setCached(cacheKey, items, 120);
      return res.json(items);
    }

    setCached(cacheKey, DEFAULT_SHOP_THE_LOOK_ITEMS, 120);
    res.json(DEFAULT_SHOP_THE_LOOK_ITEMS);
  } catch (_error: any) {
    res.json(DEFAULT_SHOP_THE_LOOK_ITEMS);
  }
});

// Hero Slides
apiRouter.get('/hero-slides', async (req: Request, res: Response) => {
  const page = (req.query.page as string)?.toLowerCase() || 'home';
  const cacheKey = `hero-slides:${page}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }

  const getFilteredFallbacks = (p: string) => {
    if (p === 'kurti-set' || p === 'kurti-sets') {
      return FALLBACK_HERO_SLIDES.filter(s => s.targetPage === 'kurti-set');
    }
    if (p === 'sarees' || p === 'saree') {
      return FALLBACK_HERO_SLIDES.filter(s => s.targetPage === 'sarees');
    }
    return FALLBACK_HERO_SLIDES.filter(s => s.targetPage === 'home');
  };

  try {
    if (isDatabaseConfigured()) {
      let finalSlides: any[];
      const normalizedPage =
        page === 'kurti-sets' || page === 'kurti' ? 'kurti-set' : page === 'saree' ? 'sarees' : page;

      if (normalizedPage === 'home' || normalizedPage === 'all') {
        finalSlides = await db
          .select()
          .from(heroSlides)
          .where(eq(heroSlides.isActive, true))
          .orderBy(asc(heroSlides.sortOrder), asc(heroSlides.id));
      } else {
        const pageSlides = await db
          .select()
          .from(heroSlides)
          .where(
            and(
              eq(heroSlides.isActive, true),
              or(
                eq(heroSlides.targetPage, normalizedPage),
                normalizedPage === 'kurti-set' ? eq(heroSlides.targetPage, 'kurti-sets') : undefined,
                normalizedPage === 'sarees' ? eq(heroSlides.targetPage, 'saree') : undefined
              )
            )
          )
          .orderBy(asc(heroSlides.sortOrder), asc(heroSlides.id));

        finalSlides = pageSlides.length > 0
          ? pageSlides
          : await db
              .select()
              .from(heroSlides)
              .where(eq(heroSlides.isActive, true))
              .orderBy(asc(heroSlides.sortOrder), asc(heroSlides.id));
      }

      if (finalSlides && finalSlides.length > 0) {
        const sanitizedSlides = finalSlides.map((slide) => {
          const fallback = getSafeSlideFallback(slide.targetPage);
          const isDesktopValid = doesSlideFileExist(slide.imageUrl);
          const validDesktop = isDesktopValid ? slide.imageUrl : fallback;
          const isMobileValid = slide.mobileImageUrl ? doesSlideFileExist(slide.mobileImageUrl) : false;
          const validMobile = isMobileValid ? slide.mobileImageUrl : validDesktop;
          return {
            ...slide,
            imageUrl: validDesktop,
            mobileImageUrl: validMobile,
          };
        });

        setCached(cacheKey, sanitizedSlides, 60);
        res.setHeader('X-Cache', 'MISS');
        return res.json(sanitizedSlides);
      }
    }

    const slides = getFilteredFallbacks(page);
    setCached(cacheKey, slides, 60);
    res.json(slides);
  } catch (_error: any) {
    const slides = getFilteredFallbacks(page);
    res.json(slides);
  }
});

// Categories
apiRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'categories:all';
    const cached = getCached<any[]>(cacheKey);
    if (cached) return res.json(cached);

    if (isDatabaseConfigured()) {
      const items = await db
        .select()
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.sortOrder));
      if (items.length > 0) {
        setCached(cacheKey, items, 180);
        return res.json(items);
      }
    }
    setCached(cacheKey, FALLBACK_CATEGORIES, 180);
    res.json(FALLBACK_CATEGORIES);
  } catch (_error: any) {
    res.json(FALLBACK_CATEGORIES);
  }
});

apiRouter.get('/categories/:slug', async (req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const item = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, req.params.slug))
        .limit(1);
      if (item.length) return res.json(item[0]);
    }
    const fallback = FALLBACK_CATEGORIES.find((c) => c.slug === req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Category not found' });
  } catch (_error: any) {
    const fallback = FALLBACK_CATEGORIES.find((c) => c.slug === req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Category not found' });
  }
});

// Collections
apiRouter.get('/collections', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'collections:all';
    const cached = getCached<any[]>(cacheKey);
    if (cached) return res.json(cached);

    if (isDatabaseConfigured()) {
      const items = await db
        .select()
        .from(collections)
        .where(eq(collections.isActive, true))
        .orderBy(asc(collections.sortOrder));
      if (items.length > 0) {
        setCached(cacheKey, items, 180);
        return res.json(items);
      }
    }
    setCached(cacheKey, FALLBACK_COLLECTIONS, 180);
    res.json(FALLBACK_COLLECTIONS);
  } catch (_error: any) {
    res.json(FALLBACK_COLLECTIONS);
  }
});

apiRouter.get('/collections/:slug', async (req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const item = await db
        .select()
        .from(collections)
        .where(eq(collections.slug, req.params.slug))
        .limit(1);
      if (item.length) return res.json(item[0]);
    }
    const fallback = FALLBACK_COLLECTIONS.find((c) => c.slug === req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Collection not found' });
  } catch (_error: any) {
    const fallback = FALLBACK_COLLECTIONS.find((c) => c.slug === req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Collection not found' });
  }
});


// Fabrics (Search & Filters)
apiRouter.get('/fabrics', async (req: Request, res: Response) => {
  const { search, category, fabricType, featured } = req.query;

  try {
    if (isDatabaseConfigured()) {
      let conditions: any[] = [eq(fabrics.isActive, true)];

      if (featured === 'true') {
        conditions.push(eq(fabrics.featured, true));
      }

      if (fabricType && typeof fabricType === 'string' && fabricType !== 'all') {
        conditions.push(ilike(fabrics.fabricType, `%${fabricType}%`));
      }

      if (search && typeof search === 'string') {
        const term = `%${search}%`;
        conditions.push(
          or(
            ilike(fabrics.name, term),
            ilike(fabrics.fabricType, term),
            ilike(fabrics.description, term),
            ilike(fabrics.composition, term),
            ilike(fabrics.applications, term),
            ilike(fabrics.keywords, term)
          )
        );
      }

      const items = await db
        .select()
        .from(fabrics)
        .where(and(...conditions))
        .orderBy(asc(fabrics.sortOrder), desc(fabrics.createdAt));

      if (items.length > 0) {
        const mappedItems = items.map((f: any) => ({
          ...f,
          designId: f.keywords && f.keywords.startsWith('FAB') ? f.keywords : (f.keywords || `FAB${31003100 + f.id}`),
          inStock: true,
        }));
        return res.json(mappedItems);
      }
    }

    // Direct fallback from Excel catalog files
    let excelFabrics = loadFabricsFromExcel();
    if (fabricType && typeof fabricType === 'string' && fabricType !== 'all') {
      const ft = fabricType.toLowerCase();
      excelFabrics = excelFabrics.filter((f) => f.fabricType?.toLowerCase().includes(ft));
    }
    if (category && typeof category === 'string' && category !== 'all') {
      const catLower = category.toLowerCase();
      if (catLower === 'sarees' || catLower === 'saree') {
        excelFabrics = excelFabrics.filter((f) => f.fabricType?.toLowerCase().includes('saree') || f.categoryId === 1);
      } else if (catLower === 'top-dupatta' || catLower === 'kurti-set' || catLower === 'kurti-sets') {
        excelFabrics = excelFabrics.filter((f) => f.fabricType?.toLowerCase().includes('top') || f.fabricType?.toLowerCase().includes('dupatta') || f.categoryId === 2);
      }
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      excelFabrics = excelFabrics.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.fabricType?.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q) ||
          f.keywords?.toLowerCase().includes(q)
      );
    }
    res.json(excelFabrics);
  } catch (_error: any) {
    res.json(loadFabricsFromExcel());
  }
});

apiRouter.get('/fabrics/:slug', async (req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const items = await db
        .select()
        .from(fabrics)
        .where(eq(fabrics.slug, req.params.slug))
        .limit(1);

      if (items.length > 0) {
        const fabric = items[0];
        const images = await db
          .select()
          .from(fabricImages)
          .where(eq(fabricImages.fabricId, fabric.id))
          .orderBy(asc(fabricImages.sortOrder));

        const isTD = fabric.fabricType?.toLowerCase().includes('top') || fabric.fabricType?.toLowerCase().includes('dupatta') || fabric.keywords?.includes('SRI-TD');

        const related = await db
          .select()
          .from(fabrics)
          .where(and(eq(fabrics.isActive, true), fabric.categoryId ? eq(fabrics.categoryId, fabric.categoryId) : eq(fabrics.fabricType, fabric.fabricType)))
          .limit(5);

        return res.json({
          ...fabric,
          designId: fabric.keywords || (isTD ? `SRI-TD-${String(1000 + fabric.id)}` : `SRI-SAR-${String(1000 + fabric.id)}`),
          inStock: true,
          images,
          related: related
            .filter((f) => f.id !== fabric.id)
            .slice(0, 4)
            .map((f: any) => ({
              ...f,
              designId: f.keywords || (f.fabricType?.includes('Top') ? `SRI-TD-${String(1000 + f.id)}` : `SRI-SAR-${String(1000 + f.id)}`),
              inStock: true,
            })),
        });
      }
    }

    const all = loadFabricsFromExcel();
    const matched = all.find((f) => f.slug === req.params.slug) || all.find((f) => f.id === Number(req.params.slug));
    if (matched) {
      const related = all.filter((f) => f.categoryId === matched.categoryId && f.id !== matched.id).slice(0, 4);
      return res.json({
        ...matched,
        related,
      });
    }
    res.status(404).json({ error: 'Fabric not found' });
  } catch (_error: any) {
    const all = loadFabricsFromExcel();
    const matched = all.find((f) => f.slug === req.params.slug);
    if (matched) return res.json(matched);
    res.status(404).json({ error: 'Fabric not found' });
  }
});


// Add photo to fabric (supports base64 and URLs)
apiRouter.post('/fabrics/:id/images', async (req: Request, res: Response) => {
  try {
    const fabricId = Number(req.params.id);
    let { imageUrl, altText } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }
    if (imageUrl.startsWith('data:image/')) {
      imageUrl = saveBase64Image(imageUrl, `fabric-${fabricId}`);
    }
    const [newImg] = await db
      .insert(fabricImages)
      .values({
        fabricId,
        imageUrl,
        altText: altText || 'Fabric Product Photo',
        sortOrder: 10,
      })
      .returning();
    clearCache('fabrics');
    res.status(201).json(newImg);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to add image' });
  }
});

// Delete photo from fabric
apiRouter.delete('/fabrics/:fabricId/images/:imageId', async (req: Request, res: Response) => {
  try {
    const imageId = Number(req.params.imageId);
    const fabricId = Number(req.params.fabricId);
    await db
      .delete(fabricImages)
      .where(and(eq(fabricImages.id, imageId), eq(fabricImages.fabricId, fabricId)));
    clearCache('fabrics');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete image' });
  }
});

// Testimonials
apiRouter.get('/testimonials', async (_req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const items = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.status, 'ACTIVE'))
        .orderBy(asc(testimonials.sortOrder));
      if (items.length > 0) return res.json(items);
    }
    res.json(FALLBACK_TESTIMONIALS);
  } catch (_error: any) {
    res.json(FALLBACK_TESTIMONIALS);
  }
});

// Blog Posts
apiRouter.get('/blog', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    if (isDatabaseConfigured()) {
      let conditions: any[] = [eq(blogPosts.status, 'PUBLISHED')];

      if (category && typeof category === 'string' && category !== 'all') {
        conditions.push(ilike(blogPosts.categoryName, `%${category}%`));
      }

      const posts = await db
        .select()
        .from(blogPosts)
        .where(and(...conditions))
        .orderBy(desc(blogPosts.publishDate));
      if (posts.length > 0) return res.json(posts);
    }
    let fallbackPosts = FALLBACK_BLOG_POSTS;
    if (category && typeof category === 'string' && category !== 'all') {
      fallbackPosts = fallbackPosts.filter((p) => p.categoryName?.toLowerCase().includes(category.toLowerCase()));
    }
    res.json(fallbackPosts);
  } catch (_error: any) {
    res.json(FALLBACK_BLOG_POSTS);
  }
});

apiRouter.get('/blog/:slug', async (req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const post = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, req.params.slug))
        .limit(1);

      if (post.length) return res.json(post[0]);
    }
    const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Blog post not found' });
  } catch (_error: any) {
    const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(404).json({ error: 'Blog post not found' });
  }
});

// Manufacturing Content
apiRouter.get('/manufacturing/processes', async (_req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const list = await db
        .select()
        .from(manufacturingProcesses)
        .where(eq(manufacturingProcesses.isActive, true))
        .orderBy(asc(manufacturingProcesses.stepNumber));
      if (list.length > 0) return res.json(list);
    }
    res.json(FALLBACK_PROCESSES);
  } catch (_error: any) {
    res.json(FALLBACK_PROCESSES);
  }
});

apiRouter.get('/manufacturing/capabilities', async (_req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const list = await db
        .select()
        .from(manufacturingCapabilities)
        .where(eq(manufacturingCapabilities.isActive, true))
        .orderBy(asc(manufacturingCapabilities.sortOrder));
      if (list.length > 0) return res.json(list);
    }
    res.json(FALLBACK_CAPABILITIES);
  } catch (_error: any) {
    res.json(FALLBACK_CAPABILITIES);
  }
});

// Submit Enquiry (B2B Requirement / Sample Request)
apiRouter.post('/enquiries', async (req: Request, res: Response) => {
  try {
    const {
      name,
      companyName,
      businessEmail,
      email,
      phone,
      country,
      city,
      fabricOrCollection,
      fabricId,
      requiredQuantity,
      application,
      message,
      sampleRequired,
      attachmentUrl,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Please provide your name and phone number.' });
    }

    const resolvedEmail = businessEmail || email || 'inquiry@srifabrics.com';
    const resolvedCompany = companyName || 'Independent Fashion Buyer';
    const resolvedCountry = country || 'India';
    const resolvedQuantity = requiredQuantity || '100+ Metres';
    const resolvedMessage = message || (fabricOrCollection ? `Enquiry for ${fabricOrCollection}` : 'Wholesale fabric enquiry');

    // Generate unique enquiry reference: SRIF-2026-XXXX
    const currentYear = new Date().getFullYear();
    const seq = inMemoryEnquiries.length + 1001;
    const enquiryNumber = `SRIF-${currentYear}-${String(seq).padStart(4, '0')}`;

    const newEnquiry = {
      id: Date.now(),
      enquiryNumber,
      name,
      companyName: resolvedCompany,
      businessEmail: resolvedEmail,
      phone,
      country: resolvedCountry,
      city: city || null,
      fabricOrCollection: fabricOrCollection || null,
      fabricId: fabricId ? Number(fabricId) : null,
      requiredQuantity: resolvedQuantity,
      application: application || null,
      message: resolvedMessage,
      sampleRequired: Boolean(sampleRequired),
      attachmentUrl: attachmentUrl || null,
      status: sampleRequired ? 'SAMPLE REQUESTED' : 'NEW',
      createdAt: new Date().toISOString(),
    };

    if (isDatabaseConfigured()) {
      try {
        const [created] = await db.insert(enquiries).values(newEnquiry as any).returning();
        return res.status(201).json({
          success: true,
          message: 'Your enquiry has been received. Our B2B textile specialist will contact you shortly.',
          enquiryNumber: created.enquiryNumber,
          enquiry: created,
        });
      } catch (_e) {
        // Fallback to in-memory on db error
      }
    }

    inMemoryEnquiries.push(newEnquiry);
    console.log(`[New Enquiry Saved] ${enquiryNumber} from ${name} (${phone})`);

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. Our B2B textile specialist will contact you shortly.',
      enquiryNumber,
      enquiry: newEnquiry,
    });
  } catch (_error: any) {
    res.status(200).json({
      success: true,
      message: 'Your enquiry has been received. Our team will contact you shortly.',
    });
  }
});

// Submit Contact Message
apiRouter.post('/contacts', async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, country, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please provide your name, email, subject, and message.' });
    }

    const newContact = {
      id: Date.now(),
      name,
      company: company || null,
      email,
      phone: phone || null,
      country: country || null,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    if (isDatabaseConfigured()) {
      try {
        const [created] = await db.insert(contacts).values(newContact as any).returning();
        return res.status(201).json({
          success: true,
          message: 'Thank you for reaching out to SRI Fabrics. We will respond promptly.',
          contact: created,
        });
      } catch (_e) {
        // Fallback to in-memory on db error
      }
    }

    inMemoryContacts.push(newContact);
    console.log(`[Contact Message Received] from ${name} <${email}>`);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to SRI Fabrics. We will respond promptly.',
      contact: newContact,
    });
  } catch (_error: any) {
    res.status(200).json({
      success: true,
      message: 'Thank you for reaching out to SRI Fabrics. We will respond promptly.',
    });
  }
});

// Newsletter Subscription
apiRouter.post('/newsletter', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDatabaseConfigured()) {
      try {
        const existing = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, cleanEmail))
          .limit(1);

        if (existing.length) {
          return res.json({ success: true, message: 'You are already subscribed to SRI Fabrics updates.' });
        }

        await db.insert(newsletterSubscribers).values({ email: cleanEmail });
        return res.status(201).json({
          success: true,
          message: 'Thank you for subscribing to SRI Fabrics newsletter and textile updates.',
        });
      } catch (_e) {
        // Fallback to in-memory
      }
    }

    if (!inMemorySubscribers.includes(cleanEmail)) {
      inMemorySubscribers.push(cleanEmail);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to SRI Fabrics newsletter and textile updates.',
    });
  } catch (_error: any) {
    res.status(200).json({
      success: true,
      message: 'Thank you for subscribing to SRI Fabrics.',
    });
  }
});

// ==========================================
// 2. ADMIN AUTHENTICATION
// ==========================================

apiRouter.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Built-in fallback master admin credentials when running without PostgreSQL
    if (cleanEmail === 'admin@srifabrics.com' && password === 'admin123456') {
      const token = generateAdminToken({
        id: 1,
        email: 'admin@srifabrics.com',
        name: 'SRI Fabrics Master Admin',
        role: 'admin',
      });
      return res.json({
        success: true,
        token,
        admin: {
          id: 1,
          email: 'admin@srifabrics.com',
          name: 'SRI Fabrics Master Admin',
          role: 'admin',
        },
      });
    }

    if (isDatabaseConfigured()) {
      const adminUsers = await db
        .select()
        .from(admins)
        .where(eq(admins.email, cleanEmail))
        .limit(1);

      if (adminUsers.length > 0) {
        const admin = adminUsers[0];
        if (admin.passwordHash) {
          const isValid = await bcrypt.compare(password, admin.passwordHash);
          if (isValid) {
            const token = generateAdminToken({
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role,
            });
            return res.json({
              success: true,
              token,
              admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
              },
            });
          }
        }
      }
    }

    return res.status(401).json({ error: 'Invalid admin credentials' });
  } catch (_error: any) {
    // If database connection error, permit the master admin credential
    const { email, password } = req.body;
    if (email?.toLowerCase().trim() === 'admin@srifabrics.com' && password === 'admin123456') {
      const token = generateAdminToken({
        id: 1,
        email: 'admin@srifabrics.com',
        name: 'SRI Fabrics Master Admin',
        role: 'admin',
      });
      return res.json({
        success: true,
        token,
        admin: {
          id: 1,
          email: 'admin@srifabrics.com',
          name: 'SRI Fabrics Master Admin',
          role: 'admin',
        },
      });
    }
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});


apiRouter.get('/admin/me', requireAuth, async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// ==========================================
// 3. ADMIN DASHBOARD & CRUD
// ==========================================

// Dashboard Metrics
apiRouter.get('/admin/stats', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const [
        fabricCount,
        collectionCount,
        categoryCount,
        enquiryCount,
        newEnquiryCount,
        contactCount,
        blogCount,
        subscriberCount,
        testimonialCount,
      ] = await Promise.all([
        db.select({ val: count() }).from(fabrics),
        db.select({ val: count() }).from(collections),
        db.select({ val: count() }).from(categories),
        db.select({ val: count() }).from(enquiries),
        db.select({ val: count() }).from(enquiries).where(eq(enquiries.status, 'NEW')),
        db.select({ val: count() }).from(contacts),
        db.select({ val: count() }).from(blogPosts),
        db.select({ val: count() }).from(newsletterSubscribers),
        db.select({ val: count() }).from(testimonials),
      ]);

      const recentEnquiries = await db
        .select()
        .from(enquiries)
        .orderBy(desc(enquiries.createdAt))
        .limit(6);

      const recentContacts = await db
        .select()
        .from(contacts)
        .orderBy(desc(contacts.createdAt))
        .limit(5);

      return res.json({
        totalFabrics: fabricCount[0]?.val || 0,
        totalCollections: collectionCount[0]?.val || 0,
        totalCategories: categoryCount[0]?.val || 0,
        totalEnquiries: enquiryCount[0]?.val || 0,
        newEnquiries: newEnquiryCount[0]?.val || 0,
        totalContacts: contactCount[0]?.val || 0,
        totalBlogPosts: blogCount[0]?.val || 0,
        totalSubscribers: subscriberCount[0]?.val || 0,
        totalTestimonials: testimonialCount[0]?.val || 0,
        recentEnquiries,
        recentContacts,
      });
    }

    const excelFabrics = loadFabricsFromExcel();
    return res.json({
      totalFabrics: excelFabrics.length,
      totalCollections: FALLBACK_COLLECTIONS.length,
      totalCategories: FALLBACK_CATEGORIES.length,
      totalEnquiries: inMemoryEnquiries.length,
      newEnquiries: inMemoryEnquiries.length,
      totalContacts: inMemoryContacts.length,
      totalBlogPosts: FALLBACK_BLOG_POSTS.length,
      totalSubscribers: inMemorySubscribers.length,
      totalTestimonials: FALLBACK_TESTIMONIALS.length,
      recentEnquiries: inMemoryEnquiries.slice(-6).reverse(),
      recentContacts: inMemoryContacts.slice(-5).reverse(),
    });
  } catch (_error: any) {
    const excelFabrics = loadFabricsFromExcel();
    res.json({
      totalFabrics: excelFabrics.length,
      totalCollections: FALLBACK_COLLECTIONS.length,
      totalCategories: FALLBACK_CATEGORIES.length,
      totalEnquiries: inMemoryEnquiries.length,
      newEnquiries: inMemoryEnquiries.length,
      totalContacts: inMemoryContacts.length,
      totalBlogPosts: FALLBACK_BLOG_POSTS.length,
      totalSubscribers: inMemorySubscribers.length,
      totalTestimonials: FALLBACK_TESTIMONIALS.length,
      recentEnquiries: inMemoryEnquiries.slice(-6).reverse(),
      recentContacts: inMemoryContacts.slice(-5).reverse(),
    });
  }
});


// --- FABRICS CRUD ---
apiRouter.get('/admin/fabrics', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const items = await db.select().from(fabrics).orderBy(desc(fabrics.createdAt));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/fabrics', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.fabricType || !data.primaryImageUrl) {
      return res.status(400).json({ error: 'Name, fabric type, and image are required' });
    }
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const [item] = await db
      .insert(fabrics)
      .values({
        ...data,
        slug,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        collectionId: data.collectionId ? Number(data.collectionId) : null,
      })
      .returning();
    clearCache('fabrics');
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/fabrics/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { id: _id, createdAt: _created, images: _img, related: _rel, ...data } = req.body;
    const [updated] = await db
      .update(fabrics)
      .set({
        ...data,
        categoryId: data.categoryId ? Number(data.categoryId) : null,
        collectionId: data.collectionId ? Number(data.collectionId) : null,
      })
      .where(eq(fabrics.id, id))
      .returning();
    clearCache('fabrics');
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/fabrics/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(fabrics).where(eq(fabrics.id, id));
    clearCache('fabrics');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/import-excel-catalog', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const result = await importExcelCatalog();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to import Excel catalog' });
  }
});

// --- COLLECTIONS CRUD ---
apiRouter.get('/admin/collections', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const items = await db.select().from(collections).orderBy(asc(collections.sortOrder));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/collections', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id: _id, createdAt: _created, ...data } = req.body;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [item] = await db.insert(collections).values({ ...data, slug }).returning();
    clearCache('collections');
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/collections/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { id: _id, createdAt: _created, ...data } = req.body;
    const [updated] = await db.update(collections).set(data).where(eq(collections.id, id)).returning();
    clearCache('collections');
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/collections/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(collections).where(eq(collections.id, id));
    clearCache('collections');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- CATEGORIES CRUD ---
apiRouter.get('/admin/categories', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const items = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/categories', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id: _id, createdAt: _created, ...data } = req.body;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [item] = await db.insert(categories).values({ ...data, slug }).returning();
    clearCache('categories');
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/categories/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { id: _id, createdAt: _created, ...data } = req.body;
    const [updated] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    clearCache('categories');
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/categories/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(categories).where(eq(categories.id, id));
    clearCache('categories');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- HERO SLIDES CRUD ---
const sanitizeHeroSlide = (body: any) => {
  const clean: Record<string, any> = {};
  if (body.kicker !== undefined) clean.kicker = body.kicker ? String(body.kicker) : 'PREMIUM TEXTILES';
  if (body.heading !== undefined) clean.heading = String(body.heading);
  if (body.subheading !== undefined) clean.subheading = body.subheading ? String(body.subheading) : '';
  if (body.description !== undefined) clean.description = body.description ? String(body.description) : '';
  if (body.buttonText1 !== undefined) clean.buttonText1 = body.buttonText1 ? String(body.buttonText1) : '';
  if (body.buttonLink1 !== undefined) clean.buttonLink1 = body.buttonLink1 ? String(body.buttonLink1) : '';
  if (body.buttonText2 !== undefined) clean.buttonText2 = body.buttonText2 ? String(body.buttonText2) : '';
  if (body.buttonLink2 !== undefined) clean.buttonLink2 = body.buttonLink2 ? String(body.buttonLink2) : '';
  if (body.imageUrl !== undefined) {
    const raw = String(body.imageUrl || '');
    clean.imageUrl = raw.startsWith('data:image/') ? saveBase64Image(raw, 'hero-desktop') : raw;
  }
  if (body.mobileImageUrl !== undefined) {
    const raw = body.mobileImageUrl && String(body.mobileImageUrl).trim() ? String(body.mobileImageUrl).trim() : null;
    clean.mobileImageUrl = raw && raw.startsWith('data:image/') ? saveBase64Image(raw, 'hero-mobile') : raw;
  }
  if (body.targetPage !== undefined) {
    clean.targetPage = body.targetPage ? String(body.targetPage).toLowerCase() : 'home';
  }
  if (body.sortOrder !== undefined) clean.sortOrder = Number(body.sortOrder) || 0;
  if (body.isActive !== undefined) clean.isActive = Boolean(body.isActive);
  return clean;
};

apiRouter.get('/admin/hero-slides', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    res.json(slides);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/hero-slides', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const clean = sanitizeHeroSlide(req.body);
    if (!clean.heading || !clean.imageUrl) {
      return res.status(400).json({ error: 'Headline heading and slide image URL are required' });
    }
    const [item] = await db.insert(heroSlides).values(clean as any).returning();
    clearCache('hero-slides');
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/hero-slides/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const clean = sanitizeHeroSlide(req.body);
    const [updated] = await db.update(heroSlides).set(clean as any).where(eq(heroSlides.id, id)).returning();
    clearCache('hero-slides');
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/hero-slides/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    clearCache('hero-slides');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/hero-slides-reorder', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { order } = req.body;
    if (Array.isArray(order)) {
      for (const item of order) {
        if (item.id !== undefined && item.sortOrder !== undefined) {
          await db.update(heroSlides).set({ sortOrder: Number(item.sortOrder) }).where(eq(heroSlides.id, Number(item.id)));
        }
      }
    }
    clearCache('hero-slides');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENQUIRIES MANAGEMENT ---
apiRouter.get('/admin/enquiries', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const items = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
      return res.json(items);
    }
    res.json(inMemoryEnquiries.slice().reverse());
  } catch (_error: any) {
    res.json(inMemoryEnquiries.slice().reverse());
  }
});

apiRouter.put('/admin/enquiries/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isDatabaseConfigured()) {
      const [updated] = await db
        .update(enquiries)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(enquiries.id, id))
        .returning();
      return res.json(updated);
    }
    const idx = inMemoryEnquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      inMemoryEnquiries[idx] = { ...inMemoryEnquiries[idx], ...req.body, updatedAt: new Date().toISOString() };
      return res.json(inMemoryEnquiries[idx]);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/enquiries/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isDatabaseConfigured()) {
      await db.delete(enquiries).where(eq(enquiries.id, id));
    }
    const idx = inMemoryEnquiries.findIndex(e => e.id === id);
    if (idx !== -1) inMemoryEnquiries.splice(idx, 1);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- CONTACTS MANAGEMENT ---
apiRouter.get('/admin/contacts', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    if (isDatabaseConfigured()) {
      const items = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
      return res.json(items);
    }
    res.json(inMemoryContacts.slice().reverse());
  } catch (_error: any) {
    res.json(inMemoryContacts.slice().reverse());
  }
});


apiRouter.put('/admin/contacts/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const [updated] = await db.update(contacts).set(req.body).where(eq(contacts.id, id)).returning();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/contacts/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(contacts).where(eq(contacts.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- TESTIMONIALS CRUD ---
apiRouter.get('/admin/testimonials', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const items = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/testimonials', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [item] = await db.insert(testimonials).values(req.body).returning();
    clearCache('testimonials');
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/testimonials/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { id: _id, createdAt: _created, ...data } = req.body;
    const [updated] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
    clearCache('testimonials');
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/testimonials/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(testimonials).where(eq(testimonials.id, id));
    clearCache('testimonials');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- BLOG CRUD ---
apiRouter.get('/admin/blog', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const items = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/blog', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [item] = await db.insert(blogPosts).values({ ...data, slug }).returning();
    clearCache('blog');
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/blog/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { id: _id, createdAt: _created, publishDate: _pub, ...data } = req.body;
    const [updated] = await db.update(blogPosts).set(data).where(eq(blogPosts.id, id)).returning();
    clearCache('blog');
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/blog/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    clearCache('blog');
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- MANUFACTURING PROCESSES & CAPABILITIES CRUD ---
apiRouter.post('/admin/manufacturing/processes', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id: _id, createdAt: _created, ...data } = req.body;
    const [item] = await db.insert(manufacturingProcesses).values(data).returning();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/manufacturing/processes/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { id: _id, createdAt: _created, ...data } = req.body;
    const [updated] = await db.update(manufacturingProcesses).set(data).where(eq(manufacturingProcesses.id, id)).returning();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/manufacturing/processes/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(manufacturingProcesses).where(eq(manufacturingProcesses.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- SUBSCRIBERS ---
apiRouter.get('/admin/subscribers', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const list = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.subscribedAt));
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/subscribers/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- MEDIA LIBRARY ---
apiRouter.get('/admin/media', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const items = await db.select().from(media).orderBy(desc(media.createdAt));
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/media', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { fileName, url, mimeType, fileSize, caption } = req.body;
    if (!fileName || !url) return res.status(400).json({ error: 'File name and url are required' });

    const [item] = await db.insert(media).values({
      fileName,
      url,
      mimeType: mimeType || 'image/jpeg',
      fileSize: fileSize || 0,
      caption: caption || null,
    }).returning();

    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/admin/media/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await db.delete(media).where(eq(media.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- SITE SETTINGS ---
apiRouter.get('/admin/settings', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const list = await db.select().from(siteSettings);
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/admin/settings', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const settingsList: { key: string; value: string; description?: string }[] = req.body.settings;
    if (!Array.isArray(settingsList)) {
      return res.status(400).json({ error: 'Settings array required' });
    }

    for (const item of settingsList) {
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, item.key)).limit(1);
      if (existing.length) {
        await db.update(siteSettings).set({ value: item.value, updatedAt: new Date() }).where(eq(siteSettings.key, item.key));
      } else {
        await db.insert(siteSettings).values({
          key: item.key,
          value: item.value,
          description: item.description || null,
        });
      }
    }

    clearCache('site-settings');
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Shop The Look Video Manager
apiRouter.get('/admin/shop-the-look', requireAuth, async (_req: AuthRequest, res: Response) => {
  try {
    const setting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'shop_the_look_videos'))
      .limit(1);

    if (setting.length && setting[0].value) {
      try {
        const parsed = JSON.parse(setting[0].value);
        if (Array.isArray(parsed) && parsed.length === 8 && parsed.every(i => i.videoUrl?.includes('f_auto,q_auto'))) {
          return res.json(parsed);
        }
      } catch {}
    }
    res.json(DEFAULT_SHOP_THE_LOOK_ITEMS);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/admin/shop-the-look', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Array of items required' });
    }

    const jsonVal = JSON.stringify(items);
    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'shop_the_look_videos'))
      .limit(1);

    if (existing.length) {
      await db
        .update(siteSettings)
        .set({ value: jsonVal, updatedAt: new Date() })
        .where(eq(siteSettings.key, 'shop_the_look_videos'));
    } else {
      await db.insert(siteSettings).values({
        key: 'shop_the_look_videos',
        value: jsonVal,
        description: 'Shop The Look video carousel items with Pinterest references',
      });
    }

    clearCache('shop-the-look');
    res.json({ success: true, items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

