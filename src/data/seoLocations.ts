export interface LocationSEOData {
  slug: string;
  name: string;
  state: string;
  country: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subheading: string;
  marketContext: string;
  keyProducts: string[];
  logistics: {
    dispatchTime: string;
    transitTime: string;
    primaryCarriers: string;
    sampleAvailability: string;
    moq: string;
  };
  whyChooseUs: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const SEO_LOCATIONS: Record<string, LocationSEOData> = {
  surat: {
    slug: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    country: 'India',
    metaTitle: 'Fabric Wholesale Surat | Best B2B Fabric Wholesaler in Surat',
    metaDescription: 'Leading B2B fabric wholesaler & textile manufacturer in Surat. Direct mill sourcing for pure silks, sarees, chinon, organza & custom digital printing.',
    h1: 'Fabric Wholesale in Surat – Direct Mill B2B Textile Sourcing',
    subheading: 'India\'s premier textile capital: Sourcing ready-stock yardages, designer sarees, and custom digital fabric printing directly from Surat looms.',
    marketContext: 'Surat is the undisputed epicentre of India\'s textile trade, accounting for over 40% of the nation\'s synthetic and art-silk fabric production. Operating from the prominent Ring Road textile corridor, SRI FABRIC delivers mill-direct pricing, continuous quality control, and zero-intermediary supply to fashion brands, apparel manufacturers, and wholesale stockists.',
    keyProducts: [
      'Wholesale Sarees (Dola Silk, Banarasi Katan, Organza & Tissue)',
      'Luxury Plain & Jacquard Weaves (Pure Chinon, Georgette, Chanderi)',
      'Digital Printed Fabrics for Kurti Sets & Ethnic Ensembles',
      'Designer Base Fabrics for Embroiderers & Couture Houses',
      'Ready Stock Yardages and Custom Made-to-Order Dyeing',
    ],
    logistics: {
      dispatchTime: 'Same-day or next-day dispatch for ready stock',
      transitTime: 'Local Surat pickup / same-day delivery across Surat textile markets',
      primaryCarriers: 'Direct mill dispatch, Ring Road transport offices & courier partners',
      sampleAvailability: 'Physical fabric swatch folders & laboratory lab-dips available in 24-48 hours',
      moq: '50 metres per shade for solid dyed; ready saree sets available in catalogue bundles',
    },
    whyChooseUs: [
      {
        title: 'Direct Mill Floor Manufacturing',
        description: 'Modern high-speed rapier and electronic Jacquard looms guarantee flawless warp tension, uniform GSM, and zero pilling.',
      },
      {
        title: 'Central Ring Road Presence',
        description: 'Centrally located within Surat\'s primary textile market for swift inspections, sample handovers, and in-person shade matching.',
      },
      {
        title: 'In-House High-Speed Digital Printing',
        description: 'OEKO-TEX certified reactive and pigment inks providing rich colour penetration and sharp motif clarity on silk, modal, and cotton bases.',
      },
      {
        title: 'Transparent Wholesale Quotations',
        description: 'Clear, itemised B2B rate cards with no hidden packaging or handling markups.',
      },
    ],
    faqs: [
      {
        question: 'Where can I buy wholesale fabrics directly in Surat?',
        answer: 'You can source directly from SRI FABRIC at Ring Road Textile Market, Surat. We supply ready stock yardages and bespoke manufacturing directly to wholesalers, retailers, boutiques, and garment exporters.',
      },
      {
        question: 'What is the minimum order quantity (MOQ) for fabric wholesale in Surat?',
        answer: 'Our standard MOQ starts at just 50 metres per shade for custom-dyed fabrics, while ready-stock catalog collections and sarees can be ordered in starter trade bundles.',
      },
      {
        question: 'Can I visit SRI FABRIC in Surat to inspect fabric quality?',
        answer: 'Yes, wholesale buyers and designers are welcome to visit our Surat studio and mill facility to inspect weaves, drape, and digital printing capabilities. Call +91 9875198837 to schedule an advisory visit.',
      },
      {
        question: 'Do you offer custom digital fabric printing for fashion labels in Surat?',
        answer: 'Yes, we specialize in high-precision digital textile printing with custom artwork, repeatable motifs, and strike-off swatch approvals before bulk yardage runs.',
      },
    ],
  },

  gujarat: {
    slug: 'gujarat',
    name: 'Gujarat',
    state: 'Gujarat',
    country: 'India',
    metaTitle: 'Textile Wholesale Suppliers in Gujarat | B2B Fabric Manufacturer',
    metaDescription: 'Premier textile wholesale supplier in Gujarat. Direct mill source for wholesale fabrics, sarees, and digital printing across Ahmedabad, Rajkot & Vadodara.',
    h1: 'Textile Wholesale Suppliers in Gujarat – Direct B2B Mill Hub',
    subheading: 'Powering Gujarat\'s retail apparel and garment manufacturing chains with premium silk, chinon, organza, and artisanal saree textiles.',
    marketContext: 'Gujarat boasts India\'s most comprehensive textile supply ecosystem, from cotton ginning in Saurashtra to world-class weaving and digital printing in Surat. SRI FABRIC serves as the premier B2B sourcing partner for retail textile emporiums, design studios, and garment makers across Ahmedabad, Vadodara, Rajkot, Surat, and Gandhinagar.',
    keyProducts: [
      'Wholesale Silk & Viscose Base Fabrics',
      'Artisanal Bridal & Festive Sarees in Bulk',
      'Digital Printed Kurti Lengths & 3-Piece Co-ords',
      'Dyed Organza, Muslin & Cotton Cambrics',
      'Export-Grade Jacquard Brocades',
    ],
    logistics: {
      dispatchTime: '24 hours for catalogued ready stock',
      transitTime: '1 to 2 business days across all Gujarat districts',
      primaryCarriers: 'Gujarat dedicated freight networks, V-Trans, ARC, and express couriers',
      sampleAvailability: 'Sample swatch books dispatched to any Gujarat city within 24 hours',
      moq: 'Flexible B2B tiers starting at 50m per colourway',
    },
    whyChooseUs: [
      {
        title: 'Intra-State Supply Speed',
        description: 'Next-day road transit across major Gujarat commercial centres ensures zero inventory downtime for apparel brands.',
      },
      {
        title: 'Certified Textile Standards',
        description: 'AZO-free eco-friendly reactive dyes with verified colorfastness and wash durability.',
      },
      {
        title: 'Consistent Repeat Batches',
        description: 'Precise spectrophotometer shade matching ensures seasonal re-orders match previous production runs exactly.',
      },
      {
        title: 'Dedicated Gujarat Client Advisory',
        description: 'Regional account managers offering on-demand fabric consultations via phone, video, and physical swatch dispatch.',
      },
    ],
    faqs: [
      {
        question: 'How fast can fabrics be delivered across Gujarat from Surat?',
        answer: 'Orders for ready stock are typically dispatched the same day and delivered within 24 to 48 hours across Ahmedabad, Vadodara, Rajkot, and all major Gujarat textile centres.',
      },
      {
        question: 'Do you provide sample swatch books to businesses in Gujarat?',
        answer: 'Yes, we dispatch complete swatch folders containing physical fabric swatches with feel, drape, and GSM specifications directly to your business address.',
      },
      {
        question: 'What types of sarees are available for wholesale in Gujarat?',
        answer: 'We supply Dola silk, Banarasi katan, tissue organza, georgette, and embroidered festive sarees with authentic zari borders tailored for retail emporiums.',
      },
    ],
  },

  ahmedabad: {
    slug: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    metaTitle: 'B2B Fabric Suppliers in Ahmedabad | Wholesale Textile Supply',
    metaDescription: 'Trusted B2B fabric supplier for Ahmedabad garment manufacturers, retailers & boutiques. Premium silk, digital prints, cottons & wholesale sarees.',
    h1: 'B2B Fabric Suppliers in Ahmedabad – Direct Surat Mill Supply',
    subheading: 'Connecting Ahmedabad\'s thriving garment manufacturing clusters with Surat\'s advanced weaving and digital printing facilities.',
    marketContext: 'Known as the Manchester of the East, Ahmedabad is a global apparel manufacturing powerhouse with massive demand for high-tensile base fabrics, printed yardages, and luxury saree lengths. SRI FABRIC provides Ahmedabad\'s garment manufacturers, boutique chains, and New Cloth Market wholesalers with rapid overnight freight and mill-direct prices.',
    keyProducts: [
      'Digital Printed Viscose, Modal & Cotton Yardages',
      'Wholesale Saree Collections for Retail Chains',
      'Kurti & Tunic Fabric Bundles with Matching Dupattas',
      'Pure Mulberry Silk & Chinon for Couture Labels',
      'Unstitched Ethnic Suit Lengths',
    ],
    logistics: {
      dispatchTime: 'Dispatched within 24 hours of order confirmation',
      transitTime: 'Overnight delivery (12 to 18 hours) to Ahmedabad warehouses',
      primaryCarriers: 'Surat-Ahmedabad express freight corridors and dedicated parcel vans',
      sampleAvailability: 'Courier swatch folders delivered overnight to Ahmedabad offices',
      moq: '50m per shade / print for fabric rolls; multi-piece sets for sarees',
    },
    whyChooseUs: [
      {
        title: 'Overnight Surat-to-Ahmedabad Transit',
        description: 'Daily dedicated freight transit connects our Surat mill to New Cloth Market, Maskati Market, and Narol industrial hubs.',
      },
      {
        title: 'Garment Manufacturer Grade Quality',
        description: 'Uniform width, zero skew, and strict thread inspection optimized for automated cutting tables.',
      },
      {
        title: 'Bespoke Digital Print Development',
        description: 'Collaborate with our in-house textile designers for proprietary print collections tailored to your brand identity.',
      },
    ],
    faqs: [
      {
        question: 'Can Ahmedabad garment makers get overnight fabric delivery from Surat?',
        answer: 'Yes. Due to the high-frequency Surat-Ahmedabad transport corridor, ready stock dispatched in the evening reaches Ahmedabad early the next morning.',
      },
      {
        question: 'Do you supply fabric for ethnic kurti and palazzo manufacturers in Ahmedabad?',
        answer: 'Yes, we supply coordinated prints, combed cotton, viscose chinon, and fluid rayon fabrics engineered specifically for multi-piece ethnic wear lines.',
      },
    ],
  },

  mumbai: {
    slug: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    metaTitle: 'Wholesale Fabric Suppliers in Mumbai | B2B Textiles from Surat',
    metaDescription: 'Direct mill wholesale fabric supplier for Mumbai fashion houses, designers & retailers. Premium pure silks, chinon, georgettes & bridal sarees.',
    h1: 'Wholesale Fabric Suppliers in Mumbai – Luxury Mill Textiles',
    subheading: 'Direct mill textile sourcing for Mumbai\'s premier couture designers, Bollywood stylists, bridal emporiums, and Kalbadevi wholesalers.',
    marketContext: 'Mumbai is India\'s fashion and commercial capital, where leading couturiers, export houses, and retail powerhouses demand the highest standard of fabric drape, sheen, and craftsmanship. SRI FABRIC supplies Mumbai\'s elite fashion ecosystem—from Santacruz and Bandra ateliers to Mangaldas Market and Kalbadevi wholesale traders—with direct mill access and fast road/rail logistics.',
    keyProducts: [
      'Pure Mulberry Silk & Heavy GSM Chinons for Haute Couture',
      'Glass Organzas & Tissue Weaves with Kadwa Zari Brocade',
      'Digital Floral & Abstract Prints for Resort and Pret Labels',
      'Bridal Banarasi & Dola Silk Sarees in Curated Colorways',
      'OEKO-TEX Certified Dyeing with Bespoke Lab Dips',
    ],
    logistics: {
      dispatchTime: 'Same day for ready stock; 3-5 days for custom dyed lots',
      transitTime: '12-24 hours via dedicated Western Railway / NH48 road express to Mumbai',
      primaryCarriers: 'Overnight cargo express, SafeXpress, V-Trans to Kalbadevi/Bhiwandi/Santacruz',
      sampleAvailability: 'Physical sample swatches delivered to Mumbai studios in 24 hours',
      moq: '50 metres per shade; sample swatches available prior to production',
    },
    whyChooseUs: [
      {
        title: 'Couture-Grade Hand Feel',
        description: 'Engineered with fine filament warps, natural mulberry lustre, and zero chemical harshness for luxury apparel.',
      },
      {
        title: 'Rapid 12-Hour Logistics to Mumbai',
        description: 'The short distance between Surat and Mumbai allows unprecedented turnarounds for urgent production schedules and fashion week deadlines.',
      },
      {
        title: 'Complete Privacy & Exclusive Prints',
        description: 'Non-disclosure protection for custom designer prints, ensuring your signature patterns remain strictly confidential.',
      },
    ],
    faqs: [
      {
        question: 'How quickly can fabric orders reach Mumbai from your Surat mill?',
        answer: 'Orders ship via express road or rail transport and typically arrive in Mumbai within 12 to 24 hours of dispatch.',
      },
      {
        question: 'Do you supply to boutiques in Bandra, Juhu, and South Mumbai?',
        answer: 'Yes, we partner with leading independent boutiques, pret designers, and bridal couturiers across Mumbai with swatch books and flexible wholesale order sizes.',
      },
    ],
  },

  delhi: {
    slug: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    metaTitle: 'B2B Textile Suppliers in Delhi NCR | Wholesale Fabric & Sarees',
    metaDescription: 'Trusted B2B textile supplier for Delhi NCR garment manufacturers, Chandni Chowk wholesalers & boutiques. Silk, printed fabrics, sarees & custom dyes.',
    h1: 'B2B Textile Suppliers in Delhi NCR – Direct Mill Wholesale',
    subheading: 'Supplying Chandni Chowk, Gandhi Nagar, Shahpur Jat, and Noida garment exporters with reliable bulk fabrics and bridal collections.',
    marketContext: 'Delhi NCR is northern India\'s premier apparel manufacturing and wholesale distribution hub. From Chandni Chowk\'s bridal heritage markets to the industrial garment export clusters of Okhla, Noida, and Gurugram, businesses rely on SRI FABRIC for dependable yardage volume, exact lab-dip approvals, and competitive mill rates.',
    keyProducts: [
      'Heavy Bridal Silk & Banarasi Sarees for North Indian Weddings',
      'Fluid Crepes, Georgettes & Chiffons for Export Apparel',
      'Custom Digital Printed Muslin, Cotton & Rayon Ensembles',
      'Top + Dupatta Coordinated Sets for Retail Brands',
      'Raw & Dyed Base Fabrics for Zari & Zardozi Handwork',
    ],
    logistics: {
      dispatchTime: '24 to 48 hours for verified ready inventory',
      transitTime: '2 to 3 days via express road freight / overnight air cargo option',
      primaryCarriers: 'GATI, TCI Express, BlueDart Cargo & direct Chandni Chowk transport lines',
      sampleAvailability: 'Courier swatch packs delivered to Delhi NCR addresses in 48 hours',
      moq: '50 metres per shade for custom yardages; bundle lots for sarees',
    },
    whyChooseUs: [
      {
        title: 'Bridal & Ethnic Expertise',
        description: 'Designs aligned with North Indian festive and wedding palettes, featuring authentic metallic zari and kadwa weave motifs.',
      },
      {
        title: 'Bulk Export Capacity',
        description: 'Monthly production exceeding 500,000 metres ensures massive orders for international export houses are fulfilled on schedule.',
      },
      {
        title: 'Dedicated Quality Inspection',
        description: 'Every roll is 100% inspected for GSM consistency, warp integrity, and zero dye streaks before packing.',
      },
    ],
    faqs: [
      {
        question: 'Do you supply Chandni Chowk and Gandhi Nagar wholesalers in Delhi?',
        answer: 'Yes, we work closely with wholesale fabric dealers, saree distributors, and garment manufacturers across Chandni Chowk, Gandhi Nagar, and Karol Bagh.',
      },
      {
        question: 'Can export houses in Noida and Gurugram request test certificates?',
        answer: 'Yes, we provide OEKO-TEX compliance documentation, colorfastness test results, and detailed technical specifications with export shipments.',
      },
    ],
  },

  jaipur: {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    metaTitle: 'Wholesale Fabric Suppliers in Jaipur | B2B Ethnic Wear Textiles',
    metaDescription: 'Direct mill wholesale fabric supplier for Jaipur garment manufacturers & boutiques. Premium cotton, muslin, chinon, georgette & digital prints.',
    h1: 'Wholesale Fabric Suppliers in Jaipur – Premium Ethnic Wear Bases',
    subheading: 'Partnering with Jaipur\'s artisanal fashion brands, kurti manufacturers, and boutique creators with pure natural and silk blend textiles.',
    marketContext: 'Jaipur is globally recognized for its vibrant ethnic wear aesthetics, block-printing heritage, and booming kurti manufacturing sector in Sitapura, Mansarovar, and Sanganer. SRI FABRIC supplies high-grade combed cottons, pure muslins, viscose chinons, and silk bases optimized for both traditional artisanal embellishment and modern digital printing.',
    keyProducts: [
      'Pure Combed Cotton & Cambric 60s/60s Bases',
      'Featherlight Organic Muslin & Chanderi Yardages',
      'Fluid Viscose Chinon for Twirl Anarkalis & Festive Kurtis',
      'Royal Dola & Georgette Saree Collections',
      'Custom Digital Prints with Vibrant Heritage Colorways',
    ],
    logistics: {
      dispatchTime: '24 hours for in-stock catalog products',
      transitTime: '36 to 48 hours via Western transport corridors to Jaipur',
      primaryCarriers: 'Dedicated Rajasthan transport lines, Om Logistics, V-Trans',
      sampleAvailability: 'Sample swatch booklets sent directly to Sitapura / Sanganer studios',
      moq: '50m per shade / print; flexible wholesale starter quantities',
    },
    whyChooseUs: [
      {
        title: 'Soft Hand-Feel for Kurti Sets',
        description: 'Pre-shrunk, skin-friendly textiles engineered for maximum breathability and superior stitch tensile strength.',
      },
      {
        title: 'Synergy with Artisanal Prints',
        description: 'Our plain dyed base fabrics are tested and optimized for hand-block printing, gota-patti embroidery, and digital printing.',
      },
      {
        title: 'Fast Dispatch to Rajasthan',
        description: 'Direct highway connectivity between Surat and Jaipur ensures minimal transit delays for fast-moving retail capsules.',
      },
    ],
    faqs: [
      {
        question: 'Do you supply base fabrics suitable for kurti manufacturers in Jaipur?',
        answer: 'Yes, our combed cotton cambrics, organic muslins, and viscose chinons are specially engineered for 2-piece and 3-piece kurti sets with high dye uptake and wash resilience.',
      },
      {
        question: 'Can Jaipur boutique owners order sample swatches before buying rolls?',
        answer: 'Yes, we courier physical swatch folders containing feelers, shade cards, and specifications directly to your studio in Jaipur.',
      },
    ],
  },

  bengaluru: {
    slug: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    metaTitle: 'Fabric Wholesale Suppliers in Bengaluru | B2B Textiles Surat',
    metaDescription: 'Leading wholesale fabric supplier for Bengaluru garment manufacturers, fashion tech brands & boutiques. Pure silks, digital prints & wholesale sarees.',
    h1: 'Fabric Wholesale Suppliers in Bengaluru – High-Tech Mill Supply',
    subheading: 'Supplying Bengaluru\'s fashion innovators, D2C apparel brands, apparel export factories, and silk retailers directly from Surat looms.',
    marketContext: 'Bengaluru combines South India\'s rich silk textile heritage with India\'s most dynamic D2C fashion tech and garment export ecosystem (Peenya, Bommanahalli, Commercial Street, Chickpet). SRI FABRIC empowers Bengaluru apparel brands with mill-direct volume, fast digital prototype strikes, and certified pure silk and viscose yardages.',
    keyProducts: [
      'Pure Mulberry Silk & Raw Silk Bases for South Indian Couture',
      'Lightweight Organza & Tissue Fabrics for Contemporary Silhouettes',
      'Digital Printed Rayon & Modal for Fast-Moving D2C Collections',
      'Premium Unstitched Salwar Suit & Kurti Sets',
      'Bespoke Pantone Shade Dyeing with 72-Hour Lab Dips',
    ],
    logistics: {
      dispatchTime: 'Dispatched within 24-48 hours',
      transitTime: '2 to 3 days via express South India road cargo / air freight',
      primaryCarriers: 'VRL Logistics, SafeXpress, BlueDart Air Cargo to Bengaluru',
      sampleAvailability: 'Express swatch dispatch to Indiranagar, Koramangala & Peenya offices',
      moq: '50 metres per shade; sample swatches provided for verification',
    },
    whyChooseUs: [
      {
        title: 'D2C Agility & Low MOQs',
        description: 'We understand modern D2C brand requirements: launch small test drops with 50m minimums and scale to 10,000m upon validation.',
      },
      {
        title: 'Strict Quality Specifications',
        description: 'Precise GSM, width, shrinkage control, and colorfastness data sheets provided for enterprise production managers.',
      },
      {
        title: 'Comprehensive Saree Wholesaling',
        description: 'Curated traditional and fusion saree collections tailored for South Indian festive and wedding retail demand.',
      },
    ],
    faqs: [
      {
        question: 'Do you supply D2C fashion brands and startups in Bengaluru?',
        answer: 'Yes, we specialize in supporting emerging and established D2C clothing brands with rapid sampling, flexible batch sizes, and quick scaling from 50 metres to 20,000 metres.',
      },
      {
        question: 'How are fabric shipments transported to Bengaluru from Surat?',
        answer: 'We utilize premium express road carriers such as VRL Logistics and SafeXpress for bulk consignments (2-3 days), and air cargo for urgent sample yardages (24-36 hours).',
      },
    ],
  },

  india: {
    slug: 'india',
    name: 'Pan-India',
    state: 'India',
    country: 'India',
    metaTitle: 'B2B Textile Wholesale Suppliers in India | SRI FABRIC Surat',
    metaDescription: 'India\'s trusted B2B textile manufacturer & fabric wholesale supplier based in Surat. Supplying retailers, manufacturers & exporters nationwide.',
    h1: 'B2B Textile Wholesale Suppliers in India – National Direct Mill Supply',
    subheading: 'Connecting India\'s garment manufacturers, retail chains, bridal emporiums, and wholesale traders with Surat\'s finest mill production.',
    marketContext: 'As India\'s textile industry expands across domestic consumption and global exports, B2B buyers across 28 states require a trustworthy, technologically advanced mill partner. Based in Surat, Gujarat, SRI FABRIC delivers consistent quality, competitive mill-direct pricing, and comprehensive logistics to over 350+ commercial cities across India.',
    keyProducts: [
      'Wholesale Silk, Viscose, Modal & Cotton Base Fabrics',
      'Designer Saree Collections for Indian Weddings & Festivals',
      'Custom Digital Textile Printing with Endless Motif Variations',
      'Pre-Dyed Plain Yardages with Strict Pantone Matching',
      'Coordinated Top + Dupatta Ethnic Ensembles',
    ],
    logistics: {
      dispatchTime: '24-48 hours from our Surat central warehouse',
      transitTime: '2 to 4 business days depending on destination state',
      primaryCarriers: 'All Tier-1 national freight carriers, Indian Railways cargo, and express air couriers',
      sampleAvailability: 'Nationwide sample swatch book courier service with tracking',
      moq: '50m per shade / print; flexible wholesale bundles for retailers',
    },
    whyChooseUs: [
      {
        title: 'Pan-India Supply Reliability',
        description: 'Delivering to tier-1, tier-2, and tier-3 commercial hubs with reliable tracking and insured transit.',
      },
      {
        title: '500,000+ Metres Monthly Mill Capacity',
        description: 'State-of-the-art European rapier and electronic Jacquard looms guarantee uninterrupted bulk supply.',
      },
      {
        title: 'Full Export & Domestic Compliance',
        description: 'GST-compliant invoicing, OEKO-TEX certified dyestuffs, and full documentation for retail audit requirements.',
      },
      {
        title: 'Seamless Digital Ordering & Support',
        description: 'Instant WhatsApp advisory, transparent pricing, and dedicated relationship managers for recurring wholesale orders.',
      },
    ],
    faqs: [
      {
        question: 'How can businesses across India order wholesale fabric from SRI FABRIC?',
        answer: 'You can explore our online catalogue, request a swatch folder, or connect directly with our sales team via WhatsApp (+91 9875198837) or email (info@srifabrics.com) for instant quotations.',
      },
      {
        question: 'Do you deliver to tier-2 and tier-3 cities across India?',
        answer: 'Yes, through our network of national logistics partners, we deliver to over 3,000 pincodes across all Indian states and Union Territories.',
      },
      {
        question: 'What payment and credit terms are available for bulk buyers in India?',
        answer: 'We accept RTGS, NEFT, UPI, and bank transfers with structured milestone payments for custom production runs. Contact our finance desk for recurring buyer terms.',
      },
    ],
  },
};
