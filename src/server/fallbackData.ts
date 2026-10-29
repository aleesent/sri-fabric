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
    author: 'SRI FABRIC Sourcing Team',
    categoryName: 'SOURCING GUIDE',
    featuredImageUrl: '/blog1.png',
    featured: true,
    publishDate: new Date().toISOString(),
    status: 'PUBLISHED',
    tags: 'Surat Textile, B2B Wholesale, Digital Printing, Fabric Sourcing, Garment Manufacturing',
  },
  {
    id: 2,
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
    author: 'SRI FABRIC Design & Production Team',
    categoryName: 'DIGITAL PRINTING',
    featuredImageUrl: '/blog2.png',
    featured: true,
    publishDate: new Date().toISOString(),
    status: 'PUBLISHED',
    tags: 'Digital Fabric Printing, Surat Textile, Custom Fabric, Textile Design, Fabric Printing Guide',
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
