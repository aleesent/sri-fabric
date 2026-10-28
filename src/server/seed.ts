import { db, isDatabaseConfigured } from '../db/index.ts';
import {
  admins,
  heroSlides,
  categories,
  collections,
  fabrics,
  testimonials,
  blogCategories,
  blogPosts,
  manufacturingProcesses,
  manufacturingCapabilities,
  globalRegions,
  siteSettings,
  enquiries,
} from '../db/schema.ts';
import bcrypt from 'bcryptjs';
import { count } from 'drizzle-orm';
import { DEFAULT_SHOP_THE_LOOK_ITEMS } from '../data/shopTheLook.ts';

// Helper to generate elegant textile SVG data URIs
export function createTextileSvg(title: string, subtitle: string, baseColor: string, accentColor: string, pattern: 'zari' | 'crepe' | 'sheer' | 'floral' | 'loom'): string {
  let patternContent = '';

  if (pattern === 'zari') {
    patternContent = `
      <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.35"/>
        <circle cx="20" cy="20" r="3" fill="${accentColor}" opacity="0.45"/>
        <path d="M0 0 L40 40 M40 0 L0 40" stroke="${accentColor}" stroke-width="0.5" opacity="0.2"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#p)" />
    `;
  } else if (pattern === 'floral') {
    patternContent = `
      <pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="14" fill="none" stroke="${accentColor}" stroke-width="1.2" opacity="0.3"/>
        <circle cx="30" cy="30" r="6" fill="${accentColor}" opacity="0.4"/>
        <path d="M30 10 Q40 25 30 30 Q20 25 30 10 Z" fill="${accentColor}" opacity="0.25"/>
        <path d="M50 30 Q35 40 30 30 Q35 20 50 30 Z" fill="${accentColor}" opacity="0.25"/>
        <path d="M30 50 Q20 35 30 30 Q40 35 30 50 Z" fill="${accentColor}" opacity="0.25"/>
        <path d="M10 30 Q25 20 30 30 Q25 40 10 30 Z" fill="${accentColor}" opacity="0.25"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#p)" />
    `;
  } else if (pattern === 'sheer') {
    patternContent = `
      <pattern id="p" width="16" height="16" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="16" y2="16" stroke="${accentColor}" stroke-width="0.75" opacity="0.2"/>
        <line x1="16" y1="0" x2="0" y2="16" stroke="${accentColor}" stroke-width="0.75" opacity="0.2"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#p)" />
    `;
  } else if (pattern === 'crepe') {
    patternContent = `
      <pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M0 12 Q6 0 12 12 T24 12" fill="none" stroke="${accentColor}" stroke-width="0.8" opacity="0.25"/>
        <path d="M0 24 Q6 12 12 24 T24 24" fill="none" stroke="${accentColor}" stroke-width="0.8" opacity="0.25"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#p)" />
    `;
  } else {
    // Loom / modern factory pattern
    patternContent = `
      <pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse">
        <line x1="0" y1="15" x2="30" y2="15" stroke="${accentColor}" stroke-width="1" opacity="0.25"/>
        <line x1="15" y1="0" x2="15" y2="30" stroke="${accentColor}" stroke-width="1" opacity="0.25"/>
        <rect x="10" y="10" width="10" height="10" fill="none" stroke="${accentColor}" stroke-width="0.5" opacity="0.3"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#p)" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${baseColor}"/>
        <stop offset="60%" stop-color="${baseColor}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#0a0507"/>
      </linearGradient>
      <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
        <stop offset="40%" stop-color="#ffffff" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    ${patternContent}
    <rect width="100%" height="100%" fill="url(#vignette)"/>
    <!-- Subtle Golden Fabric Weave Ribbon -->
    <path d="M-50 450 Q 200 250 450 480 T 850 350" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.35"/>
    <path d="M-50 470 Q 200 270 450 500 T 850 370" fill="none" stroke="${accentColor}" stroke-width="1" opacity="0.2"/>
    <g transform="translate(400, 300)" text-anchor="middle">
      <circle r="42" fill="#13080b" stroke="${accentColor}" stroke-width="1.5" opacity="0.85"/>
      <path d="M -16 -6 L 0 -22 L 16 -6 L 0 10 Z" fill="none" stroke="${accentColor}" stroke-width="1.5"/>
      <text y="90" font-family="Cinzel, Cormorant Garamond, Georgia, serif" font-size="28" font-weight="700" fill="#fdf8f0" letter-spacing="3">${title.toUpperCase()}</text>
      <text y="125" font-family="Satoshi, sans-serif" font-size="14" font-weight="500" fill="${accentColor}" letter-spacing="2">${subtitle.toUpperCase()}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export async function seedDatabase() {
  if (!isDatabaseConfigured()) {
    console.log('ℹ️ Running in standalone mode with Excel catalog data (No external PostgreSQL configured).');
    return;
  }
  try {
    const adminCount = await db.select({ val: count() }).from(admins);
    if (adminCount[0]?.val > 0) {
      console.log('Database already seeded. Skipping initial seed.');
      return;
    }

    console.log('Seeding SRI FABRICS database...');

    // 1. Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123456', salt);

    await db.insert(admins).values({
      email: 'admin@srifabrics.com',
      passwordHash,
      name: 'SRI Fabrics Master Admin',
      role: 'admin',
    });

    // 2. Categories
    const dressImg = createTextileSvg('Dresses', 'Couture Fabric Range', '#3b121e', '#e6c387', 'crepe');
    const sareeImg = createTextileSvg('Sarees', 'Royal Katan & Brocades', '#4a1122', '#dfb15b', 'zari');
    const fabricImg = createTextileSvg('Fabrics', 'Wholesale Yardage', '#1c2826', '#d4af37', 'crepe');
    const collImg = createTextileSvg('Collections', 'Curated Seasonal Capsules', '#2c1b18', '#c9a050', 'floral');

    const [catDresses, catSarees, catFabrics, catCollections] = await db.insert(categories).values([
      {
        name: 'DRESSES',
        slug: 'dresses',
        description: 'Flowing georgettes, crepe silks, and satins tailored for luxury eveningwear and dresses.',
        imageUrl: dressImg,
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'SAREES',
        slug: 'sarees',
        description: 'Regal Banarasi katan silks, tissue organzas, and bordered bridal textiles.',
        imageUrl: sareeImg,
        featured: true,
        sortOrder: 2,
      },
      {
        name: 'FABRICS',
        slug: 'fabrics',
        description: 'Comprehensive catalogue of pure plain, jacquard, embroidered, and dyed yardages.',
        imageUrl: fabricImg,
        featured: true,
        sortOrder: 3,
      },
      {
        name: 'COLLECTIONS',
        slug: 'collections',
        description: 'Exclusive seasonal designer capsules engineered for international runway and couture.',
        imageUrl: collImg,
        featured: true,
        sortOrder: 4,
      },
    ]).returning();

    // 3. Collections
    const chinonImg = createTextileSvg('Royal Chinon', 'Premium Fabric', '#5e1b2b', '#dfb15b', 'crepe');
    const silkImg = createTextileSvg('Pure Silk', 'Luxury Collection', '#0f382c', '#e6c387', 'zari');
    const organzaImg = createTextileSvg('Organza', 'Elegant & Light', '#8c6b2d', '#fdf3d0', 'floral');
    const banarasiImg = createTextileSvg('Banarasi', 'Traditional Weave', '#6b1227', '#dfb15b', 'zari');
    const georgetteImg = createTextileSvg('Georgette Luxe', 'Contemporary Elegance', '#842044', '#f1cf8c', 'crepe');

    const [colChinon, colSilk, colOrganza, colBanarasi, colGeorgette] = await db.insert(collections).values([
      {
        name: 'ROYAL CHINON',
        slug: 'royal-chinon',
        tagline: 'Premium Fabric',
        description: 'Silky, feather-soft viscose chinon with fluid drape and luminous pearl luster.',
        imageUrl: chinonImg,
        featured: true,
        sortOrder: 1,
      },
      {
        name: 'PURE SILK',
        slug: 'pure-silk',
        tagline: 'Luxury Collection',
        description: '100% Mulberry raw and filament silk with certified handloom and jacquard options.',
        imageUrl: silkImg,
        featured: true,
        sortOrder: 2,
      },
      {
        name: 'ORGANZA',
        slug: 'organza',
        tagline: 'Elegant & Light',
        description: 'Crisp, sheer glass organza with exquisite zari embroidery and floral filigree.',
        imageUrl: organzaImg,
        featured: true,
        sortOrder: 3,
      },
      {
        name: 'GEORGETTE LUXE',
        slug: 'georgette-luxe',
        tagline: 'Contemporary Elegance',
        description: 'High-twist crepe georgette with impeccable bounce and dye retention.',
        imageUrl: georgetteImg,
        featured: true,
        sortOrder: 5,
      },
    ]).returning();

    // 4. Hero Slides
    const hero1Img = createTextileSvg('SRI FABRICS', 'Fabrics For A Brighter Tomorrow', '#420f1b', '#dfb15b', 'zari');
    const hero2Img = createTextileSvg('MASTERY IN WEFT & WARP', 'Pure Mulberry Silk & Zari Kadwa', '#1e2d24', '#e6c387', 'floral');

    await db.insert(heroSlides).values([
      {
        kicker: 'PREMIUM TEXTILES',
        heading: 'FABRICS FOR A BRIGHTER TOMORROW',
        subheading: 'Exceptional quality, timeless designs and premium fabrics for every occasion.',
        description: 'Partnering with couture designers, global fashion houses, and garment manufacturers worldwide.',
        buttonText1: 'EXPLORE COLLECTIONS',
        buttonLink1: '/fabrics',
        buttonText2: 'REQUEST AN ENQUIRY',
        buttonLink2: '/enquiry',
        imageUrl: hero1Img,
        mobileImageUrl: hero1Img,
        targetPage: 'home',
        sortOrder: 1,
        isActive: true,
      },
      {
        kicker: 'HERITAGE & INNOVATION',
        heading: 'TIMELESS FABRICS. ENDLESS POSSIBILITIES.',
        subheading: 'Crafting luxury handloom and rapier-woven textiles with sustainable zero-waste practices.',
        description: 'Monthly production capacity surpassing 500,000 metres with verified OEKO-TEX certified dyes.',
        buttonText1: 'VIEW FABRICS',
        buttonLink1: '/fabrics',
        buttonText2: 'REQUEST SAMPLE SWATCH',
        buttonLink2: '/enquiry',
        imageUrl: hero2Img,
        mobileImageUrl: hero2Img,
        targetPage: 'home',
        sortOrder: 2,
        isActive: true,
      },
    ]);

    // 5. Fabrics: Exclusively populated from public/SRI_FABRIC_Product_Catalog_Template.xlsx
    try {
      const { importExcelCatalog } = await import('./excelImporter.ts');
      await importExcelCatalog();
      console.log('Fabrics seeded exclusively from Excel catalog!');
    } catch (excelErr) {
      console.warn('Excel catalog seed error:', excelErr);
    }

    // 6. Testimonials
    const priyaImg = createTextileSvg('Priya Sharma', 'Designer', '#301319', '#dfb15b', 'zari');
    const davidImg = createTextileSvg('David Laurent', 'Director', '#11221b', '#e6c387', 'crepe');
    const fatimaImg = createTextileSvg('Fatima Al-Maktoum', 'Couturier', '#281a14', '#c9a050', 'floral');

    await db.insert(testimonials).values([
      {
        clientName: 'Priya Sharma',
        company: 'Priya Sharma Haute Couture',
        designation: 'Lead Fashion Designer',
        country: 'India',
        photoUrl: priyaImg,
        testimonial: '“SRI Fabrics has been our trusted partner for premium textiles. The quality, finish and collection are simply outstanding. Their custom fabric development team delivered our runway order on an 18-day schedule with impeccable color consistency.”',
        rating: 5,
        featured: true,
        status: 'ACTIVE',
        sortOrder: 1,
      },
      {
        clientName: 'David Laurent',
        company: 'Maison Laurent Paris',
        designation: 'Creative Director',
        country: 'France',
        photoUrl: davidImg,
        testimonial: '“Sourcing luxury silks and chinon from SRI Fabrics has elevated our ready-to-wear seasonal lines across Europe. Seamless export documentation and supreme hand-feel.”',
        rating: 5,
        featured: true,
        status: 'ACTIVE',
        sortOrder: 2,
      },
      {
        clientName: 'Fatima Al-Maktoum',
        company: 'Al-Noor Bridal Atelier',
        designation: 'Managing Director',
        country: 'United Arab Emirates',
        photoUrl: fatimaImg,
        testimonial: '“Their Banarasi weaves and embroidered organzas are the crown jewel of our bespoke wedding couture clients in the GCC. The gold zari luster never fades.”',
        rating: 5,
        featured: true,
        status: 'ACTIVE',
        sortOrder: 3,
      },
    ]);

    // 7. Blog
    const [bCatFabrics, bCatTrends, bCatCollections, bCatMfg] = await db.insert(blogCategories).values([
      { name: 'FABRICS', slug: 'fabrics' },
      { name: 'TRENDS', slug: 'trends' },
      { name: 'COLLECTIONS', slug: 'collections' },
      { name: 'MANUFACTURING', slug: 'manufacturing' },
    ]).returning();

    const blog1Img = createTextileSvg('Top 5 Fabric Trends for 2026', 'Editorial Report', '#42121e', '#e6c387', 'floral');
    const blog2Img = createTextileSvg('How to Choose Dress Fabrics', 'Textile Guide', '#192b23', '#dfb15b', 'crepe');
    const blog3Img = createTextileSvg('The Beauty of Banarasi Weaves', 'Heritage Craft', '#4a1122', '#dfb15b', 'zari');
    const blog4Img = createTextileSvg('Inside Our Manufacturing Process', 'Factory Tour', '#1e242b', '#c9a050', 'loom');

    await db.insert(blogPosts).values([
      {
        title: 'Top 5 Fabric Trends for 2026',
        slug: 'top-5-fabric-trends-for-2026',
        excerpt: 'From high-sheen liquid chinons to sustainable heritage silks, discover the key materials dominating international runways this season.',
        content: `As global luxury fashion embraces fluid movement and tactile depth, designers are gravitating toward fabrics that bridge historical artistry with modern lightness.
        
1. Fluid Viscose Chinon: The resurgence of high-twist crepe yarns provides natural stretch and drape without synthetic elastane.
2. Lightweight Kadwa Zari: Modernized Banarasi motifs with featherweight silk warps allow voluminous silhouettes without excessive weight.
3. Micro-Filament Sheers: Translucent organzas infused with soft foil printing offer architectural volume for sleeves and tiered hems.
4. Jewel-Toned Raw Silks: Deep wines, emeralds, and peacock blues are replacing subdued pastels for celebratory and evening wardrobes.
5. Zero-Discharge Sustainable Dyeing: International fashion houses now require certified clean supply chains, prioritizing OEKO-TEX verified textile mills.`,
        featuredImageUrl: blog1Img,
        categoryId: bCatFabrics.id,
        categoryName: 'FABRICS',
        author: 'SRI Fabrics Editorial Team',
        tags: 'Trends, Silks, Chinon, 2026 Fashion',
        seoTitle: 'Top 5 Fabric Trends for 2026 | SRI Fabrics Blog',
        seoDescription: 'Explore the definitive textile trends shaping fashion collections in 2026, from fluid chinons to eco-conscious silks.',
        featured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'How to Choose the Right Fabric for Your Dress?',
        slug: 'how-to-choose-the-right-fabric-for-your-dress',
        excerpt: 'A comprehensive technical guide for garment designers on balancing GSM, hand-feel, stretch, and drape.',
        content: `Selecting the right fabric is the single most critical decision in apparel manufacturing. Even a masterfully cut pattern will collapse if paired with an incompatible weave.
        
- Draping vs Structure: For column dresses and bias cuts, prioritize fabrics with high yarn twist like 60-80 GSM Chinon or Georgette. For structured A-line skirts or trench gowns, opt for 120+ GSM Katan Silk or Brocade.
- Breathability & Climate: Natural protein fibers like Mulberry Silk offer superior thermo-regulation compared to cheap polyesters.
- Dyeing & Color Fastness: Always specify whether garments will undergo post-assembly wash or piece dyeing to ensure zero shrinkage.`,
        featuredImageUrl: blog2Img,
        categoryId: bCatTrends.id,
        categoryName: 'TIPS',
        author: 'Vikram Mehta, Head of Textile Engineering',
        tags: 'Design Tips, Sourcing, Dressmaking',
        seoTitle: 'How to Choose the Right Fabric for Your Dress | Guide',
        seoDescription: 'Technical guide on selecting fabrics for evening dresses, bridal gowns, and luxury apparel.',
        featured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'The Beauty of Banarasi Weaves: History & Modern Revival',
        slug: 'the-beauty-of-banarasi-weaves',
        excerpt: 'Delving into the timeless art of Kadwa jaal, golden meenakari, and the master artisans preserving India’s finest weave.',
        content: `Banarasi weaving represents one of the world's most intricate artistic disciplines. Unlike machine prints that mimic the surface, authentic Kadwa weaving interlocks every single gold zari motif into the fabric warp without loose float threads at the back.
        
At SRI Fabrics, our master weaving clusters blend centuries of generational technique with state-of-the-art electronic Jacquard control, achieving unmatched precision and uniform tension across hundreds of metres of yardage.`,
        featuredImageUrl: blog3Img,
        categoryId: bCatCollections.id,
        categoryName: 'COLLECTIONS',
        author: 'Ananya Roy, Heritage Textile Specialist',
        tags: 'Banarasi, Heritage, Zari, Handloom',
        seoTitle: 'The Beauty of Banarasi Weaves | SRI Fabrics Heritage',
        seoDescription: 'Discover the craft, history, and modern manufacturing behind authentic Banarasi brocade fabrics.',
        featured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Inside Our Manufacturing Process',
        slug: 'inside-our-manufacturing-process',
        excerpt: 'Take a virtual walk through our Surat weaving mills, where heritage craft meets high-precision German & Swiss looms.',
        content: `From raw yarn inspection under polarized light to automated steam calendering, every bolt of fabric produced at SRI Fabrics undergoes a rigorous 5-stage manufacturing cycle.
        
Our closed-loop water treatment facility recycles 94% of process water, while our laboratory conducts 4-point ASTM D5430 fabric inspections before custom roll packaging.`,
        featuredImageUrl: blog4Img,
        categoryId: bCatMfg.id,
        categoryName: 'MANUFACTURING',
        author: 'Production Directorate, SRI Fabrics',
        tags: 'Manufacturing, Quality Control, Surat Mills',
        seoTitle: 'Inside Our Manufacturing Process | SRI Fabrics',
        seoDescription: 'A technical tour of the high-speed rapier looms and zero-discharge dye facilities at SRI Fabrics.',
        featured: true,
        status: 'PUBLISHED',
      },
    ]);

    // 8. Manufacturing Processes
    const proc1 = createTextileSvg('Stage 01', 'Yarn Selection & Testing', '#2d1b22', '#dfb15b', 'crepe');
    const proc2 = createTextileSvg('Stage 02', 'High-Speed Precision Weaving', '#162822', '#e6c387', 'loom');
    const proc3 = createTextileSvg('Stage 03', 'AZO-Free Eco Dyeing', '#361b2b', '#dfb15b', 'crepe');
    const proc4 = createTextileSvg('Stage 04', 'Calendering & Specialized Finish', '#212a33', '#c9a050', 'sheer');
    const proc5 = createTextileSvg('Stage 05', 'ASTM 4-Point Quality Inspection', '#1f1a26', '#dfb15b', 'zari');

    await db.insert(manufacturingProcesses).values([
      {
        title: 'Yarn Selection & Quality Testing',
        stepNumber: 1,
        description: 'Certified Grade-A mulberry silk, high-twist viscose filaments, and tested metallic zari are evaluated for tensile strength, elongation, and uniformity before entering the warp room.',
        imageUrl: proc1,
        highlight: '100% Tested Yarn Batches',
        sortOrder: 1,
      },
      {
        title: 'High-Precision Rapier & Jacquard Weaving',
        stepNumber: 2,
        description: 'Our Surat facility operates synchronized airjet and electronic Jacquard looms capable of executing complex weaves, dense brocades, and delicate sheers with microscopic stitch accuracy.',
        imageUrl: proc2,
        highlight: 'Micro-Tension Sensor Weaving',
        sortOrder: 2,
      },
      {
        title: 'AZO-Free Eco-Dyeing & Washing',
        stepNumber: 3,
        description: 'Computerized jet-dyeing vessels deliver flawless shade consistency across 5,000+ metre production runs, operating on non-toxic, OEKO-TEX Standard 100 compliant reactive dyestuffs.',
        imageUrl: proc3,
        highlight: 'Delta E < 0.5 Shade Consistency',
        sortOrder: 3,
      },
      {
        title: 'Calendering, Softening & Finishing',
        stepNumber: 4,
        description: 'Custom post-processing treatments including high-temperature calendering, anti-static coating, silk-touch enzyme washing, and water-repellent applications tailored to buyer specifications.',
        imageUrl: proc4,
        highlight: 'Tailored Luxury Hand-Feel',
        sortOrder: 4,
      },
      {
        title: 'ASTM 4-Point Quality Inspection & Packing',
        stepNumber: 5,
        description: 'Every single roll of fabric passes across backlit inspection frames operated by seasoned fabric auditors, followed by moisture-proof vacuum roll sealing for international ocean and air freight.',
        imageUrl: proc5,
        highlight: 'Zero-Defect Export Standard',
        sortOrder: 5,
      },
    ]);

    // 9. Manufacturing Capabilities
    await db.insert(manufacturingCapabilities).values([
      {
        title: 'Monthly Production Volume',
        metric: '500,000+ Metres',
        description: 'State-of-the-art weaving infrastructure spread across 120,000 sq. ft. in Surat, Gujarat running round-the-clock shifts.',
        icon: 'factory',
        sortOrder: 1,
      },
      {
        title: 'Custom Fabric Development Lab',
        metric: '48-Hour Lab Dips',
        description: 'In-house spectrophotometer color matching, custom GSM weighting, and rapid prototype sample strike-offs for designers.',
        icon: 'sparkles',
        sortOrder: 2,
      },
      {
        title: 'Global Export Accreditations',
        metric: 'ISO 9001 & OEKO-TEX',
        description: 'Compliant with strict European and American safety and environmental regulations, ensuring skin-safe, durable textiles.',
        icon: 'shield',
        sortOrder: 3,
      },
      {
        title: 'Worldwide Fast Track Logistics',
        metric: '35+ Export Countries',
        description: 'Dedicated B2B logistics desk handling ocean bill of lading, air couriers, customs documentation, and door-to-door delivery.',
        icon: 'truck',
        sortOrder: 4,
      },
    ]);

    // 10. Global Regions
    await db.insert(globalRegions).values([
      {
        countryName: 'United Arab Emirates',
        regionName: 'Middle East & GCC',
        exportVolume: '140,000+ Metres / Year',
        deliveryTime: '3-4 Days (Air) / 9 Days (Sea)',
        clientsCount: 52,
        flagEmoji: '🇦🇪',
        sortOrder: 1,
      },
      {
        countryName: 'United States',
        regionName: 'North America',
        exportVolume: '190,000+ Metres / Year',
        deliveryTime: '5-7 Days (Air) / 24 Days (Sea)',
        clientsCount: 78,
        flagEmoji: '🇺🇸',
        sortOrder: 2,
      },
      {
        countryName: 'United Kingdom',
        regionName: 'Europe & UK',
        exportVolume: '110,000+ Metres / Year',
        deliveryTime: '4-6 Days (Air) / 18 Days (Sea)',
        clientsCount: 44,
        flagEmoji: '🇬🇧',
        sortOrder: 3,
      },
      {
        countryName: 'France',
        regionName: 'Europe',
        exportVolume: '85,000+ Metres / Year',
        deliveryTime: '4-6 Days (Air) / 20 Days (Sea)',
        clientsCount: 31,
        flagEmoji: '🇫🇷',
        sortOrder: 4,
      },
      {
        countryName: 'Singapore',
        regionName: 'Southeast Asia',
        exportVolume: '70,000+ Metres / Year',
        deliveryTime: '3-5 Days (Air) / 11 Days (Sea)',
        clientsCount: 26,
        flagEmoji: '🇸🇬',
        sortOrder: 5,
      },
      {
        countryName: 'Australia',
        regionName: 'Oceania',
        exportVolume: '60,000+ Metres / Year',
        deliveryTime: '5-7 Days (Air) / 22 Days (Sea)',
        clientsCount: 22,
        flagEmoji: '🇦🇺',
        sortOrder: 6,
      },
    ]);

    // 11. Initial Sample Enquiries
    await db.insert(enquiries).values([
      {
        enquiryNumber: 'SRIF-2026-0001',
        name: 'Sarah Jenkins',
        companyName: 'Jenkins Couture London',
        businessEmail: 'sarah@jenkinscouture.co.uk',
        phone: '+44 20 7946 0912',
        country: 'United Kingdom',
        city: 'London',
        fabricOrCollection: 'Royal Chinon Fabric',
        requiredQuantity: '500 Metres',
        application: 'Autumn Evening Gown Collection',
        message: 'Looking for 500 metres of Royal Chinon in Dusty Rose and Emerald Green for our upcoming London Fashion Week collection. Please confirm lead time and dispatch sample swatches.',
        sampleRequired: true,
        status: 'SAMPLE REQUESTED',
        internalNotes: 'Sample swatch book dispatched via DHL Express on Oct 3rd. Tracking provided to client.',
      },
      {
        enquiryNumber: 'SRIF-2026-0002',
        name: 'Rashid Al-Hassan',
        companyName: 'Al-Hassan Textiles Trading LLC',
        businessEmail: 'rashid@alhassantextiles.ae',
        phone: '+971 50 123 4567',
        country: 'United Arab Emirates',
        city: 'Dubai',
        fabricOrCollection: 'Banarasi Fabric & Pure Silk',
        requiredQuantity: '2,500 Metres',
        application: 'Bridal Abayas and Kaftan Lines',
        message: 'Require bulk supply of heavy zari Banarasi brocades for Dubai bridal season. Need MOQ of 500m per colorway across 5 shades.',
        sampleRequired: true,
        status: 'QUOTATION SENT',
        internalNotes: 'Commercial proforma invoice and lab dips sent. Awaiting buyer confirmation on shipment schedule.',
      },
    ]);

    // 12. Site Settings
    const settings = [
      { key: 'brand_name', value: 'SRI FABRICS', description: 'Brand Display Name' },
      { key: 'tagline', value: 'FABRICS FOR A BRIGHTER TOMORROW', description: 'Brand Tagline' },
      { key: 'phone', value: '+91 98751 98837', description: 'Primary Phone Number' },
      { key: 'whatsapp', value: '+91 98751 98837', description: 'Official WhatsApp for Business' },
      { key: 'email', value: 'info@srifabrics.com', description: 'Inquiry and Sales Email' },
      { key: 'address', value: 'SRI Fabrics Mill & Export House, Ring Road Textile Market, Surat - 395002, Gujarat, India', description: 'Corporate & Mill Address' },
      { key: 'business_hours', value: 'Monday - Saturday: 9:00 AM - 7:30 PM IST', description: 'Operating Hours' },
      { key: 'seo_title', value: 'SRI Fabrics – Premium B2B Textile Manufacturer & Fabric Exporter', description: 'Global SEO Title' },
      { key: 'seo_description', value: 'SRI Fabrics is India’s premier B2B manufacturer and global exporter of luxury pure silks, chinon, organza, banarasi, and designer apparel textiles.', description: 'Global Meta Description' },
      { key: 'footer_text', value: 'We create premium fabrics that blend tradition with innovation, serving fashion brands, garment exporters, and couturiers across the globe with uncompromising excellence.', description: 'Footer summary' },
      { key: 'shop_the_look_videos', value: JSON.stringify(DEFAULT_SHOP_THE_LOOK_ITEMS), description: 'Shop The Look video carousel items with Cloudinary video references' },
    ];

    for (const s of settings) {
      await db.insert(siteSettings).values(s);
    }

    try {
      const { importExcelCatalog } = await import('./excelImporter.ts');
      await importExcelCatalog();
      console.log('Excel catalog synced successfully during seed!');
    } catch (excelErr) {
      console.warn('Excel catalog seed note:', excelErr);
    }

    console.log('Database seeding successfully finished!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
