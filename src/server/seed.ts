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
import { count, eq } from 'drizzle-orm';
import { DEFAULT_SHOP_THE_LOOK_ITEMS } from '../data/shopTheLook.ts';
import { FALLBACK_BLOG_POSTS } from './fallbackData.ts';

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
      console.log('Database already seeded. Ensuring latest featured blog post is synced.');
      try {
        const firstBlog = FALLBACK_BLOG_POSTS[0];
        if (firstBlog) {
          await db
            .update(blogPosts)
            .set({
              title: firstBlog.title,
              slug: firstBlog.slug,
              excerpt: firstBlog.excerpt,
              content: firstBlog.content,
              featuredImageUrl: firstBlog.featuredImageUrl,
              categoryName: firstBlog.categoryName || 'SOURCING GUIDE',
              author: firstBlog.author,
              tags: firstBlog.tags || 'Surat Textile, B2B Wholesale, Digital Printing',
              publishDate: new Date(),
            })
            .where(eq(blogPosts.id, 1));
        }
      } catch (err) {
        console.warn('Could not update seeded blog post 1:', err);
      }
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
        title: 'B2B Fabric Wholesale in Surat: A Complete Guide for Textile Buyers',
        slug: 'b2b-fabric-wholesale-in-surat-guide',
        excerpt: 'Surat is a well-known centre of India\'s textile industry. Discover how to source B2B fabrics, custom digital printing, and wholesale production with confidence.',
        content: `Surat is a well-known centre of India's textile industry, attracting garment manufacturers, fashion labels, boutiques, textile traders and businesses looking for fabric sourcing and textile production services. For companies searching for **B2B fabric wholesale in Surat**, selecting the right supplier is an important step towards building a reliable and efficient supply chain.

Whether you manufacture ethnic wear, develop contemporary clothing collections, source materials for garment production or work in interior design, the right textile partner can help you coordinate fabric requirements, design development, printing and production planning.

At **SRI FABRIC**, our focus includes digital fabric printing, textile design and customised textile solutions for fashion, interiors and other creative applications. Our approach is centred on understanding the buyer's requirements and discussing suitable solutions for each project.

## Why Is Surat an Important Destination for Textile Sourcing?

Surat has an established textile trading and production ecosystem. Businesses sourcing textiles can explore suppliers and services associated with fabric trading, printing, processing and garment manufacturing.

For B2B buyers, the advantage of working with a suitable textile supplier is not simply access to material. It is the ability to discuss the requirements of the finished product, including fabric selection, print design, intended application and order planning.

For example, a garment manufacturer may require printed fabric for a new clothing collection, while an interior business may need a customised textile design for a decorative project. These businesses have different requirements, making supplier selection an important part of the sourcing process.

## What Should You Look for in a B2B Fabric Wholesale Supplier?

### 1. Fabric Selection and Suitability

The correct fabric depends on the intended application. Fabrics for tunics, dresses, sarees, tops, sportswear and home furnishings can require different compositions, constructions and performance characteristics.

Before confirming an order, explain how the material will be used. Discuss fabric composition, width, colour, texture, drape, finishing and other specifications relevant to the final product.

At SRI FABRIC, fabric requirements can be discussed according to the buyer's project rather than assuming that one specification will suit every application.

### 2. Custom Fabric Design and Printing

Businesses developing original collections may require exclusive artwork, repeat patterns, customised colour combinations or print designs prepared for specific products.

Digital fabric printing can support a range of design possibilities on compatible textiles. The final result depends on the fabric, printing equipment, ink system, artwork preparation and finishing process.

If your business needs customised prints, discuss the artwork, fabric compatibility, design dimensions and sample approval process before placing a bulk order.

### 3. Quality Checks and Sample Approval

A fabric sample allows buyers to evaluate the material and its suitability before committing to a larger production requirement.

Depending on the project, review the fabric's feel, appearance, width, print clarity, colour reproduction and finishing. For repeat orders, agree on the approved sample and written specifications that will guide production.

Clear reference standards are especially useful for businesses that manufacture garments or supply finished products to their own customers.

### 4. Transparent Quotations

When comparing fabric wholesalers in Surat, evaluate quotations using equivalent specifications.

Ask whether the price includes fabric, printing, finishing, packaging or other services. Confirm the applicable quantity requirements (MOQs), delivery timelines, payment terms, and applicable taxes or shipping.

At SRI FABRIC, we provide transparent, itemised quotations so buyers have complete clarity on costs before production begins.

### 5. Production Planning and Reliable Lead Times

Reliable turnaround is vital in apparel manufacturing where collection launches and retail delivery windows cannot slip. A competent supplier communicates realistic lead times for sampling, printing, and bulk dispatch.

Discuss production schedules, batch consistency, and packing standards early to keep your supply chain predictable and stress-free.

## The Advantages of Digital Fabric Printing for Modern Brands

Digital textile printing has transformed how fashion labels, boutique creators, and interior designers source fabrics. Key advantages include:

- **Design Flexibility:** Complex motifs, photorealistic gradients, and unlimited colourways without rotary screen limitations.
- **Lower Initial Commitments:** Ideal for test capsules, seasonal designer drops, and made-to-order collections.
- **Fast Sampling:** Rapid prototype strikes allow garment makers to verify hand-feel, drape, and visual impact before bulk runs.
- **Colour Fastness & Detail:** Modern reactive and pigment inks deliver rich penetration and wash-resistant durability on compatible fabrics.

## Who Can Benefit from B2B Fabric Sourcing with SRI FABRIC?

SRI FABRIC partners with diverse B2B clients across India and internationally:

- **Garment Manufacturers:** Sourcing custom printed yardages and coordinating cuts for ethnic wear, Western ensembles, and resort wear.
- **Fashion Designers & Boutique Brands:** Seeking bespoke prints, premium Mulberry silks, viscose chinons, organzas, and georgettes.
- **Home & Interior Decorators:** Custom printed upholstery, drapery yardages, and decorative textiles.
- **Textile Wholesalers & Exporters:** Seeking steady production capacity, strict GSM consistency, and verified quality standards.

## How to Prepare Your Sourcing Enquiry

To help us provide the most accurate recommendation and quotation, prepare the following details:

1. **Fabric Type / Base Material:** (e.g., Pure Silk, Viscose Chinon, Organza, Crepe, Georgette, Cotton, Rayon)
2. **Intended Application:** (e.g., Saree, Kurta Set, Dress, Eveningwear, Furnishing)
3. **Print or Dyeing Requirement:** (Solid dyed, digital print, custom artwork, or mill design)
4. **Target Quantity & Delivery Timeline:** Required metres/yardage and project deadline
5. **Sample Requirement:** Whether you require swatch swatches or sample strike-offs prior to bulk order

## Frequently Asked Questions (FAQs)

**Q: Where is SRI FABRIC located in Surat?**
A: We are based in the heart of Surat's textile ecosystem in Gujarat, India. You can connect with our textile team directly via phone or WhatsApp at +91 9875198837.

**Q: Can I request fabric samples or strike-offs before placing a bulk order?**
A: Yes. We recommend sample evaluation for quality verification, print clarity, and hand-feel before committing to bulk production.

**Q: What fabrics are compatible with your digital printing?**
A: We work with a wide range of natural, viscose, and blended fabrics including Mulberry silk, chinon, organza, georgette, modal, and cotton.

**Q: Do you ship outside Surat and internationally?**
A: Yes, we ship across all Indian states and provide export logistics support for international textile buyers with complete documentation.

---

### Partner with SRI FABRIC for B2B Textile Sourcing in Surat

Connect with our sourcing specialists today to discuss your fabric requirements, request swatch samples, or obtain a project quotation.

**Contact & WhatsApp:** +91 9875198837  
**Email:** contact@srifabrics.com  
**Location:** Ring Road, Surat, Gujarat 395002, India`,
        featuredImageUrl: '/blog1.png',
        categoryId: bCatFabrics.id,
        categoryName: 'SOURCING GUIDE',
        author: 'SRI FABRIC Sourcing Team',
        tags: 'Surat Textile, B2B Wholesale, Digital Printing, Fabric Sourcing, Garment Manufacturing',
        seoTitle: 'B2B Fabric Wholesale in Surat: A Complete Guide for Textile Buyers | SRI FABRIC',
        seoDescription: 'Comprehensive guide for fashion labels, garment manufacturers, and textile buyers on sourcing B2B wholesale fabrics, digital printing, and sample approval in Surat.',
        featured: true,
        status: 'PUBLISHED',
      },
      {
        title: 'Digital Fabric Printing in Surat: From Creative Design to Finished Textile',
        slug: 'digital-fabric-printing-surat-creative-design-to-finished-textile',
        excerpt: 'Every memorable textile design begins with an idea. Discover the end-to-end digital printing workflow in Surat from design to finished fabric.',
        content: `Every memorable textile design begins with an idea. It might be a floral pattern for a fashion collection, a contemporary print for a clothing label, or customised artwork for an interior design project. Turning that idea into a finished textile requires the right combination of artwork preparation, fabric selection, printing technology and finishing.

For businesses searching for **digital fabric printing in Surat**, understanding this process helps make better decisions about design development, material suitability and bulk production.

SRI FABRIC specialises in digital fabric printing and textile design solutions for fashion, interiors and marketing-related applications. The company's service approach focuses on bringing creative requirements and practical textile production needs together.

## What Is Digital Fabric Printing?

Digital fabric printing is a method of transferring digital artwork onto compatible textile materials using specialised printing equipment and an appropriate ink system.

The process allows designs to be prepared digitally and reproduced on fabric. Depending on the equipment, fabric composition, ink technology and production setup, digital printing can support intricate patterns, multiple colours and customised artwork.

However, the final appearance and performance are not determined by the printer alone. Fabric selection, colour management, pretreatment where required, printing settings and finishing all contribute to the result.

This is why a textile printing project should begin with a clear understanding of the intended finished product.

## How Does the Digital Fabric Printing Process Work?

### Step 1: Artwork and Design Development

The first stage is preparing the design.

Artwork may include floral prints, abstract patterns, geometric designs, illustrations, brand graphics or custom repeat patterns developed for a particular collection.

Before printing, consider:

- The intended print size and pattern repeat.
- The required colour palette.
- The scale of motifs and decorative details.
- The fabric width and printable area.
- Whether the design must align across a continuous length of fabric.

High-resolution artwork and correct file preparation can help avoid problems during production.

For repeating patterns, the design should be checked carefully to ensure that the repeat appears intentional and consistent.

### Step 2: Fabric Selection

Not every fabric is suitable for every printing technology.

The textile composition, surface texture, weight (GSM) and drape all determine the choice of inks and printing method:

- **Natural & Semi-Natural Fabrics:** Mulberry silks, viscose, chinon, modal, cotton and organza yield rich colour depth and luxurious hand-feel when printed with reactive inks.
- **Synthetics & Blends:** Polyester crepes, georgettes, satins and chiffon perform exceptionally well with dye-sublimation and disperse printing, ensuring sharp saturation and wash durability.

At SRI FABRIC, we assist designers in selecting base fabrics that harmonize with both the artwork's visual style and the finished garment's intended drape.

### Step 3: Fabric Pre-Treatment & Preparation

Before ink application, fabrics must undergo meticulous preparation:

- **Scouring & Bleaching:** Purifying raw grey fabrics to remove natural oils, sizing agents and impurities.
- **Chemical Padding:** Padding the cloth with specialized coatings to optimize dye acceptance, sharpen edge definition, and prevent ink migration or bleeding during printing.

### Step 4: Digital Printing Execution

Once primed, the textile is fed through precision industrial digital textile printers:

- **Direct-to-Fabric (Reactive / Pigment Printing):** Ink droplets are micro-injected directly into the fiber core, ideal for natural luxury textiles.
- **Dye-Sublimation Transfer:** Prints on transfer paper are sublimated into synthetic fibers under regulated temperature and pressure.
- **Color Matching & Proofing:** Micro-calibrated printheads reproduce gradients, intricate filigrees and multi-tonal shades with continuous tone consistency.

### Step 5: Post-Processing & Fixation

Post-printing treatment seals the vibrant pigments permanently into the fibers:

- **High-Temperature Steaming (Ager):** Molecularly binds reactive dyes into natural yarn filaments.
- **Washing & Soaping:** Industrial tensionless washing ranges wash away unfixed dye residues, ensuring certified skin-safety and wash-fastness.
- **Stentering & Drying:** Straightening the grain lines and restoring fabric dimensions to specified width and GSM.

### Step 6: Finishing & Quality Inspection

- **Softening & Calendering:** Giving fabrics the desired hand-feel, whether silky-soft, crisp, or lustrous.
- **Zero-Defect Inspection:** Full-length roll inspection on illuminated audit tables to identify any banding, colour deviation, or weave flaws before packing.

## Why Choose Digital Fabric Printing Over Traditional Screen Printing?

1. **Unlimited Colours & Intricate Gradients:** No screen count restrictions—reproduce photographic visuals, subtle ombre fades and multi-tonal floral details effortlessly.
2. **Low Minimum Order Quantities (MOQs):** Perfect for boutique capsule drops, emerging designers and made-to-order collections without heavy inventory risk.
3. **Rapid Sampling & Quick Turnaround:** Strike-off approvals within 24 to 48 hours accelerate your garment launch cycles.
4. **Eco-Friendly Manufacturing:** Eliminates excessive water and dye waste, supporting cleaner, modern textile production.

## Key Applications of Digitally Printed Fabrics

- **Ethnic Wear & Couture:** Designer Sarees, Top + Dupatta ensembles, Anarkalis and Lehengas.
- **Contemporary Apparel:** Dresses, resort wear, tunics, silk scarves and shirts.
- **Interiors & Furnishings:** Bespoke drapery, upholstery, cushion covers and wall tapestries.
- **Corporate & Custom Merchandising:** Promotional fabrics, branded event textiles and scarves.

## Tips for Textile Buyers & Designers Sourcing in Surat

- **Provide High-Resolution Files:** Submit vector artwork or TIFF/PSD files at minimum 300 DPI in RGB mode with embedded colour profiles.
- **Confirm Fabric Drape & GSM Early:** Request sample swatches to evaluate the fabric's weight and drape for your garment silhouette.
- **Approve Strike-Offs Before Bulk Runs:** Verify colour saturation, motif scale and repeat alignment on the actual base textile before signing off on mass production.
- **Coordinate Order Planning & Timelines:** Communicate packaging, roll packing and freight delivery requirements with your supplier in advance.

## Frequently Asked Questions (FAQs)

**Q: What is the turnaround time for digital fabric printing at SRI FABRIC?**  
A: Sample strike-offs are typically processed within 24 to 48 hours. Bulk production timelines depend on yardage but generally range from 3 to 7 business days.

**Q: Can I print my own custom patterns and proprietary designs?**  
A: Absolutely. We maintain strict non-disclosure and intellectual property protection for designers, fashion houses and brands. Your artwork is never reused or shared.

**Q: Which fabric bases are available for digital printing?**  
A: We print on pure mulberry silk, viscose chinon, organza, crepe, georgette, modal, satin, combed cotton and custom poly-viscose blends.

**Q: Do you offer PAN-India shipping and international export?**  
A: Yes. SRI FABRIC ships across all Indian states and manages export freight documentation for buyers worldwide.

---

### Partner with SRI FABRIC for Digital Fabric Printing in Surat

Whether you are launching a bespoke fashion line, producing boutique ethnic wear, or sourcing commercial printed fabrics, SRI FABRIC is your trusted manufacturing partner in Surat.

**Contact & WhatsApp:** +91 9875198837  
**Email:** contact@srifabrics.com  
**Location:** Ring Road, Surat, Gujarat 395002, India`,
        featuredImageUrl: '/blog2.png',
        categoryId: bCatTrends.id,
        categoryName: 'DIGITAL PRINTING',
        author: 'SRI FABRIC Design & Production Team',
        tags: 'Digital Fabric Printing, Surat Textile, Custom Fabric, Textile Design, Fabric Printing Guide',
        seoTitle: 'Digital Fabric Printing in Surat: From Creative Design to Finished Textile | SRI FABRIC',
        seoDescription: 'Discover the full digital fabric printing process in Surat—from digital artwork and fabric selection to precision direct and sublimation printing.',
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
