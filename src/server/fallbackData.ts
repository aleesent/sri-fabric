import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { DEFAULT_SHOP_THE_LOOK_ITEMS } from '../data/shopTheLook.ts';
import { Fabric, Category, Collection, HeroSlide, Testimonial, BlogPost } from '../types/index.ts';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

// In-memory enquiry & contact submissions for when external PostgreSQL is not linked
export const inMemoryEnquiries: any[] = [];
export const inMemoryContacts: any[] = [];
export const inMemorySubscribers: string[] = [];

// Fallback Categories
export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'SAREES',
    slug: 'sarees',
    description: 'Regal Banarasi katan silks, tissue organzas, and bordered bridal textiles.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    name: 'TOP + DUPATTA',
    slug: 'top-dupatta',
    description: 'Coordinated designer top and dupatta ensembles with authentic motifs, matching bottoms, and artisanal borders.',
    imageUrl: 'https://i.pinimg.com/736x/53/22/48/53224833995ecb3594be3aef6bc95316.jpg',
    featured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    name: 'FABRICS',
    slug: 'fabrics',
    description: 'Comprehensive catalogue of pure plain, jacquard, embroidered, and dyed yardages.',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    name: 'COLLECTIONS',
    slug: 'collections',
    description: 'Exclusive seasonal designer capsules engineered for international runway and couture.',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 4,
    isActive: true,
  },
];

// Fallback Collections
export const FALLBACK_COLLECTIONS: Collection[] = [
  {
    id: 1,
    name: 'ROYAL CHINON',
    slug: 'royal-chinon',
    tagline: 'Premium Fabric',
    description: 'Silky, feather-soft viscose chinon with fluid drape and luminous pearl luster.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    name: 'PURE SILK',
    slug: 'pure-silk',
    tagline: 'Luxury Collection',
    description: '100% Mulberry raw and filament silk with certified handloom and jacquard options.',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    name: 'ORGANZA',
    slug: 'organza',
    tagline: 'Elegant & Light',
    description: 'Crisp, sheer glass organza with exquisite zari embroidery and floral filigree.',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    name: 'GEORGETTE LUXE',
    slug: 'georgette-luxe',
    tagline: 'Contemporary Elegance',
    description: 'High-twist crepe georgette with impeccable bounce and dye retention.',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 4,
    isActive: true,
  },
];

// Fallback Hero Slides
export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    kicker: 'PREMIUM TEXTILES',
    heading: 'FABRICS FOR A BRIGHTER TOMORROW',
    subheading: 'Exceptional quality, timeless designs and premium fabrics for every occasion.',
    description: 'Partnering with couture designers, global fashion houses, and garment manufacturers worldwide.',
    buttonText1: 'EXPLORE COLLECTIONS',
    buttonLink1: '/fabrics',
    buttonText2: 'REQUEST AN ENQUIRY',
    buttonLink2: '/enquiry',
    imageUrl: '/slides/hero-fabrics-5.jpg',
    mobileImageUrl: '/slides/hero-fabrics-5.jpg',
    targetPage: 'home',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    kicker: 'HERITAGE & INNOVATION',
    heading: 'TIMELESS FABRICS. ENDLESS POSSIBILITIES.',
    subheading: 'Crafting luxury handloom and rapier-woven textiles with sustainable zero-waste practices.',
    description: 'Monthly production capacity surpassing 500,000 metres with verified OEKO-TEX certified dyes.',
    buttonText1: 'VIEW FABRICS',
    buttonLink1: '/fabrics',
    buttonText2: 'REQUEST SAMPLE SWATCH',
    buttonLink2: '/enquiry',
    imageUrl: '/slides/hero-sarees-7.jpg',
    mobileImageUrl: '/slides/hero-sarees-7.jpg',
    targetPage: 'home',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    kicker: 'COUTURE ENSEMBLES',
    heading: 'FEATURED TOP + DUPATTA',
    subheading: 'Artisanal coordinated sets crafted for modern celebratory elegance.',
    description: 'Pure fabrics, hand-finished motifs, and harmonized color palettes.',
    buttonText1: 'EXPLORE SETS',
    buttonLink1: '/fabrics?category=top-dupatta',
    buttonText2: 'DOWNLOAD CATALOGUE',
    buttonLink2: '/enquiry',
    imageUrl: '/slides/hero-kurti-home.jpg',
    mobileImageUrl: '/slides/hero-kurti-home.jpg',
    targetPage: 'kurti-set',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    kicker: 'ROYAL WEAVES',
    heading: 'FEATURED SAREES',
    subheading: 'Regal Banarasi katan silks, tissue organzas, and bordered bridal sarees.',
    description: 'Authentic zari and kadwa weaving passed down through generations.',
    buttonText1: 'EXPLORE SAREES',
    buttonLink1: '/fabrics?category=sarees',
    buttonText2: 'REQUEST SWATCH',
    buttonLink2: '/enquiry',
    imageUrl: '/slides/hero-sarees-7.jpg',
    mobileImageUrl: '/slides/hero-sarees-7.jpg',
    targetPage: 'sarees',
    sortOrder: 4,
    isActive: true,
  },
];

// Fallback Testimonials
export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    clientName: 'Aarav Singhania',
    company: 'Singhania Couture, Mumbai',
    country: 'India',
    testimonial: 'SRI FABRICS has been our primary source for pure zari brocades and Mulberry silks for over 5 years. Uncompromising quality and reliable delivery.',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    sortOrder: 1,
  },
  {
    id: 2,
    clientName: 'Meera Deshmukh',
    company: 'Deshmukh Bridal House, Delhi',
    country: 'India',
    testimonial: 'The Top + Dupatta ensembles and pure tissue organzas consistently sell out within days of release. Superior finishing and flawless colors.',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    sortOrder: 2,
  },
  {
    id: 3,
    clientName: 'Rohit Verma',
    company: 'Loom & Weft Exports, Kolkata',
    country: 'India',
    testimonial: 'Timely bulk production, exact GSM consistency, and responsive customer care make SRI FABRICS an indispensable manufacturing partner.',
    rating: 5,
    featured: true,
    status: 'ACTIVE',
    sortOrder: 3,
  },
];

// Fallback Blog Posts
export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'The Art of Zari Weaving: Preserving Century-Old Traditions',
    slug: 'art-of-zari-weaving',
    excerpt: 'Discover how master weavers blend pure silver and gold threads into modern luxury textiles for international couture.',
    content: 'Full article on heritage weaving and sustainable artisan craftsmanship.',
    author: 'Master Weaver R. K. Sharma',
    categoryName: 'Heritage',
    featuredImageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    featured: true,
    publishDate: new Date().toISOString(),
    status: 'PUBLISHED',
  },
  {
    id: 2,
    title: 'Next-Generation Sustainable Textiles: OEKO-TEX Standards',
    slug: 'sustainable-textiles-standards',
    excerpt: 'How SRI FABRICS implements closed-loop water treatment and certified non-toxic botanical dyes in bulk production.',
    content: 'Full article on our environmental stewardship and zero-discharge dyeing facility.',
    author: 'Production Quality Team',
    categoryName: 'Sustainability',
    featuredImageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    featured: true,
    publishDate: new Date().toISOString(),
    status: 'PUBLISHED',
  },
];


// Fallback Manufacturing Processes & Capabilities
export const FALLBACK_PROCESSES = [
  { id: 1, stepNumber: 1, title: 'Yarn Sourcing & Grading', description: 'Certified Mulberry silks, combed cottons, and high-twist viscose yarns.', iconName: 'Leaf', sortOrder: 1, isActive: true },
  { id: 2, stepNumber: 2, title: 'High-Precision Loom Weaving', description: 'Advanced electronic jacquard and rapier looms operating 24/7.', iconName: 'Cog', sortOrder: 2, isActive: true },
  { id: 3, stepNumber: 3, title: 'Eco-Friendly Dyeing & Finishing', description: 'OEKO-TEX certified zero-discharge waterless and steam finishing.', iconName: 'Sparkles', sortOrder: 3, isActive: true },
  { id: 4, stepNumber: 4, title: 'Stringent Multi-Point Quality Audit', description: 'Inspecting every meter for tensile strength, colorfastness, and weave flawlessness.', iconName: 'CheckCircle2', sortOrder: 4, isActive: true },
];

export const FALLBACK_CAPABILITIES = [
  { id: 1, title: 'Monthly Production Capacity', metric: '500,000+ Metres', description: 'High-speed rapier and jacquard weaving lines.', sortOrder: 1, isActive: true },
  { id: 2, title: 'Custom Shade Matching', metric: '48 Hours', description: 'Computerized spectral color matching and lab dip turnaround.', sortOrder: 2, isActive: true },
  { id: 3, title: 'Global Export Footprint', metric: '25+ Countries', description: 'Certified international shipping with complete customs compliance.', sortOrder: 3, isActive: true },
];

// Fallback Site Settings
export const FALLBACK_SITE_SETTINGS: Record<string, string> = {
  site_name: 'SRI FABRICS',
  contact_phone: '9875198837',
  contact_whatsapp: '9875198837',
  contact_email: 'contact@srifabrics.com',
  address: 'Ring Road, Surat, Gujarat 395002, India',
  whatsapp_number: '9875198837',
  phone_number: '9875198837',
  shop_the_look_videos: JSON.stringify(DEFAULT_SHOP_THE_LOOK_ITEMS),
};

// Cached in-memory catalog parsed from Excel templates
let cachedExcelFabrics: Fabric[] | null = null;

export function loadFabricsFromExcel(): Fabric[] {
  if (cachedExcelFabrics && cachedExcelFabrics.length > 0) {
    return cachedExcelFabrics;
  }

  const items: Fabric[] = [];
  const files = [
    path.resolve(process.cwd(), 'public/SRI_FABRIC_Product_Catalog_Template.xlsx'),
    path.resolve(process.cwd(), 'public/SRI_FABRIC1_Product_Catalog_Template.xlsx'),
  ];

  let nextId = 1;

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    try {
      const workbook = XLSX.readFile(file);
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) continue;
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) continue;

      const rows: any[] = XLSX.utils.sheet_to_json(sheet);
      if (!rows || rows.length === 0) continue;

      const isTDFile = file.includes('SRI_FABRIC1');

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const title = (row['Product Title'] || '').trim();
        const desc = (row['Product Description'] || '').trim();
        const catName = (row['Category'] || '').trim() || (isTDFile ? 'Top + Dupatta' : 'Saree');
        const img1 = (row['Image Link 1'] || '').trim();
        const img2 = (row['Image Link 2'] || '').trim();
        const img3 = (row['Image Link 3'] || '').trim();
        const img4 = (row['Image Link 4'] || '').trim();

        if (!title || !img1) continue;

        const isTD =
          catName.toLowerCase().includes('top') ||
          catName.toLowerCase().includes('dupatta') ||
          title.toLowerCase().includes('kurta set') ||
          isTDFile;

        const baseSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        const designPrefix = isTD ? 'SRI-TD' : 'SRI-SAR';
        const designId = `${designPrefix}-${String(1000 + nextId).padStart(4, '0')}`;
        const images = [img1, img2, img3, img4].filter(Boolean);

        const categoryId = isTD ? 2 : 1; // 2: Top+Dupatta, 1: Sarees

        items.push({
          id: nextId,
          name: title,
          slug: baseSlug,
          categoryId,
          fabricType: isTD ? 'Top + Dupatta' : 'Saree',
          description: desc,
          longDescription: desc,
          primaryImageUrl: img1,
          images: images.map((url, idx) => ({
            id: nextId * 10 + idx,
            fabricId: nextId,
            imageUrl: url,
            altText: `${title} - View ${idx + 1}`,
            sortOrder: idx + 1,
          })),
          gsm: 'Customizable per buyer requirement',
          width: isTD ? 'Standard Kurta & Dupatta Cut (44" Width)' : '44 Inches (Standard Saree Width)',
          moq: 'Wholesale Bulk Orders & Custom Yardages on Request',
          keywords: designId,
          designId,
          featured: true,
          inStock: true,
          isActive: true,
          sortOrder: nextId,
          createdAt: new Date().toISOString(),
        } as unknown as Fabric);

        nextId++;
      }
    } catch (err) {
      console.warn('Error reading Excel catalog file:', file, err);
    }
  }

  cachedExcelFabrics = items;
  return items;
}
