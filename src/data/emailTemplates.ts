export interface PromotionalProductItem {
  id: string;
  title: string;
  specs: string;
  description: string;
  imageUrl: string;
  badge?: string;
  aspectRatio?: string;
  linkUrl?: string;
}

export interface PromotionalCtaButton {
  id: string;
  text: string;
  url: string;
  style: 'primary-burgundy' | 'outline-gold' | 'whatsapp-green' | 'secondary-dark' | 'secondary-outline' | 'whatsapp';
  alignment?: 'left' | 'center' | 'right';
  enabled: boolean;
}

export interface PromotionalHighlightItem {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

export interface CuratedImageItem {
  id: string;
  title: string;
  url: string;
  category: string;
}

export interface PromotionalEmailContent {
  templateId?: string;
  templateName?: string;
  subject: string;
  preheader?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  heroAspectRatio?: '16:9' | '4:3' | '21:9' | '1:1' | '3:2';
  kicker?: string;
  headline: string;
  subheadline?: string;
  greeting?: string;
  introParagraph: string;
  productSectionTitle?: string;
  productSectionSubtitle?: string;
  products: PromotionalProductItem[];
  ctas: PromotionalCtaButton[];
  partnershipTitle?: string;
  partnershipHighlights: PromotionalHighlightItem[];
  closingStatement?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  showroomAddress?: string;
  brandSignature?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  preheader: string;
  thumbnail: string;
  htmlContent: string;
  content: PromotionalEmailContent;
}

export const CURATED_FABRIC_IMAGES: CuratedImageItem[] = [
  {
    id: 'img-1',
    title: 'Banarasi Katan Pure Silk',
    url: '/slides/hero-sarees-7.jpg',
    category: 'Pure Silk',
  },
  {
    id: 'img-2',
    title: 'Digital Print Floral Organza',
    url: '/slides/hero-fabrics-home.jpg',
    category: 'Organza',
  },
  {
    id: 'img-3',
    title: 'Viscose Georgette Yardage',
    url: '/slides/hero-fabrics-5.jpg',
    category: 'Georgette',
  },
  {
    id: 'img-4',
    title: 'Bridal Heritage Kadwa Brocade',
    url: '/slides/saree-heritage.jpg',
    category: 'Pure Silk',
  },
  {
    id: 'img-5',
    title: 'Combed Muslin Kurti Fabric Set',
    url: '/slides/hero-kurti-home.jpg',
    category: 'Unstitched Suits',
  },
  {
    id: 'img-6',
    title: 'Industrial High-DPI Textile Printing',
    url: '/printing1.png',
    category: 'Manufacturing',
  },
  {
    id: 'img-7',
    title: 'Precision Jet Dyeing & Processing',
    url: '/printing2.png',
    category: 'Manufacturing',
  },
  {
    id: 'img-8',
    title: 'Gold Zari Festive Drapes',
    url: '/slides/hero-desktop-21.jpg',
    category: 'Pure Silk',
  },
  {
    id: 'img-9',
    title: 'Surat Loom Weaving Production Floor',
    url: '/sri3.png',
    category: 'Mill Yardage',
  },
  {
    id: 'img-10',
    title: 'Metallic Shimmer Tissue Drape',
    url: '/slides/hero-fabrics-2.jpg',
    category: 'Organza',
  },
  {
    id: 'img-11',
    title: 'Multicolor Abstract Chinon Silk',
    url: '/slides/hero-fabrics-3.jpg',
    category: 'Georgette',
  },
  {
    id: 'img-12',
    title: 'Premium Raw Silk Yardages',
    url: '/slides/hero-fabrics-4.jpg',
    category: 'Mill Yardage',
  },
];

export function generatePromotionalEmailHtml(content: PromotionalEmailContent): string {
  const primaryCta = content.ctas?.find((c) => c.enabled) || {
    id: 'default-cta',
    text: 'Explore Catalogue',
    url: 'https://www.srifabric.com/catalogue',
    style: 'primary-burgundy' as const,
    alignment: 'center' as const,
    enabled: true,
  };

  const getCtaBgColor = (style: string) => {
    switch (style) {
      case 'whatsapp':
      case 'whatsapp-green':
        return '#25d366';
      case 'outline-gold':
      case 'secondary-outline':
        return '#ffffff';
      case 'secondary-dark':
        return '#1e050c';
      case 'primary-burgundy':
      default:
        return '#4a1122';
    }
  };

  const getCtaTextColor = (style: string) => {
    switch (style) {
      case 'outline-gold':
      case 'secondary-outline':
        return '#4a1122';
      default:
        return '#ffffff';
    }
  };

  const getCtaBorder = (style: string) => {
    switch (style) {
      case 'outline-gold':
        return '2px solid #dfb15b';
      case 'secondary-outline':
        return '1px solid #4a1122';
      case 'whatsapp':
      case 'whatsapp-green':
        return '1px solid #1ebc59';
      default:
        return '1px solid #dfb15b';
    }
  };

  const ctaButtonsHtml = (content.ctas || [])
    .filter((c) => c.enabled)
    .map(
      (c) => `
        <a href="${c.url || 'https://www.srifabric.com'}" style="display: inline-block; background-color: ${getCtaBgColor(c.style)}; color: ${getCtaTextColor(c.style)}; border: ${getCtaBorder(c.style)}; padding: 13px 30px; margin: 6px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          ${c.text} &rarr;
        </a>`
    )
    .join('');

  const productsHtml = (content.products || [])
    .map(
      (prod) => `
        <tr>
          <td style="padding: 12px 16px; vertical-align: top; border-bottom: 1px solid #ebdcc5;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td width="120" style="vertical-align: top; padding-right: 14px;">
                  <img src="${prod.imageUrl || '/slides/hero-fabrics-5.jpg'}" alt="${prod.title}" width="120" style="width: 120px; height: 120px; object-fit: cover; border-radius: 6px; display: block; border: 1px solid #ebdcc5;" />
                </td>
                <td style="vertical-align: top;">
                  ${prod.badge ? `<span style="display: inline-block; font-size: 10px; font-weight: bold; color: #dfb15b; background-color: #2b0813; padding: 2px 8px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">${prod.badge}</span>` : ''}
                  <h4 style="margin: 0 0 4px; font-size: 15px; font-family: Georgia, serif; color: #4a1122; font-weight: bold;">${prod.title}</h4>
                  <p style="margin: 0 0 6px; font-size: 12px; color: #786144; font-weight: 500;">${prod.specs || ''}</p>
                  <p style="margin: 0 0 10px; font-size: 12px; color: #555555; line-height: 1.5;">${prod.description || ''}</p>
                  <a href="${prod.linkUrl || 'https://www.srifabric.com/catalogue'}" style="font-size: 12px; color: #4a1122; font-weight: bold; text-decoration: underline;">View Fabric Details &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join('');

  const highlightsHtml = (content.partnershipHighlights || [])
    .map(
      (h) => `
        <td width="33.33%" style="padding: 8px; vertical-align: top;">
          <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 14px 10px; text-align: center; height: 100%;">
            <tr>
              <td>
                <span style="font-size: 18px; display: block; margin-bottom: 4px;">${h.icon || '✦'}</span>
                <strong style="display: block; font-size: 12px; color: #4a1122; font-family: Georgia, serif; margin-bottom: 4px;">${h.title}</strong>
                <span style="display: block; font-size: 11px; color: #666; line-height: 1.4;">${h.description}</span>
              </td>
            </tr>
          </table>
        </td>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  ${content.preheader ? `<div style="display: none; font-size: 1px; color: #f7f4ee; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${content.preheader}</div>` : ''}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Top Brand Header -->
          <tr>
            <td style="background-color: #4a1122; padding: 26px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #dfb15b; font-weight: 600; display: block; margin-bottom: 5px;">DIRECT SURAT MILL EXCLUSIVE</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.12em; text-transform: uppercase;">SRI FABRICS</h1>
              <span style="color: #f7eedf; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; display: block; margin-top: 4px; opacity: 0.9;">Ring Road • Surat • Gujarat</span>
            </td>
          </tr>

          ${
            content.heroImageUrl
              ? `<!-- Hero Banner -->
          <tr>
            <td style="padding: 0; background-color: #24060d;">
              <img src="${content.heroImageUrl}" alt="${content.heroImageAlt || 'Hero Banner'}" width="620" style="width: 100%; max-width: 620px; height: auto; display: block;" />
            </td>
          </tr>`
              : ''
          }

          <!-- Headline & Editorial Intro -->
          <tr>
            <td style="padding: 35px 30px 20px; text-align: center;">
              ${
                content.kicker
                  ? `<span style="display: inline-block; padding: 3px 12px; background: #faf4e6; color: #4a1122; border: 1px solid #dfb15b; font-size: 11px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 20px; margin-bottom: 14px;">${content.kicker}</span>`
                  : ''
              }
              <h2 style="margin: 0 0 12px; font-size: 25px; font-family: Georgia, serif; color: #4a1122; line-height: 1.3; font-weight: normal;">
                ${content.headline}
              </h2>
              ${
                content.subheadline
                  ? `<p style="margin: 0 0 14px; font-size: 15px; font-style: italic; color: #786144; font-family: Georgia, serif;">${content.subheadline}</p>`
                  : ''
              }
              ${
                content.greeting
                  ? `<p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #222; text-align: left;">${content.greeting}</p>`
                  : ''
              }
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555; text-align: left;">
                ${content.introParagraph}
              </p>
            </td>
          </tr>

          ${
            content.products && content.products.length > 0
              ? `<!-- Featured Products Grid -->
          <tr>
            <td style="padding: 10px 24px 20px;">
              ${
                content.productSectionTitle
                  ? `<div style="border-bottom: 2px solid #dfb15b; padding-bottom: 8px; margin-bottom: 14px;">
                      <h3 style="margin: 0; font-size: 17px; font-family: Georgia, serif; color: #4a1122; text-transform: uppercase; letter-spacing: 0.05em;">${content.productSectionTitle}</h3>
                      ${content.productSectionSubtitle ? `<p style="margin: 4px 0 0; font-size: 12px; color: #786144;">${content.productSectionSubtitle}</p>` : ''}
                    </div>`
                  : ''
              }
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px;">
                ${productsHtml}
              </table>
            </td>
          </tr>`
              : ''
          }

          ${
            content.partnershipHighlights && content.partnershipHighlights.length > 0
              ? `<!-- Partnership Highlights -->
          <tr>
            <td style="padding: 10px 20px 25px;">
              ${
                content.partnershipTitle
                  ? `<h4 style="margin: 0 0 12px; text-align: center; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em; color: #4a1122; font-weight: bold;">${content.partnershipTitle}</h4>`
                  : ''
              }
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  ${highlightsHtml}
                </tr>
              </table>
            </td>
          </tr>`
              : ''
          }

          <!-- Action Buttons / CTAs -->
          <tr>
            <td style="padding: 10px 30px 30px; text-align: center;">
              ${ctaButtonsHtml || `<a href="${primaryCta.url}" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.12em; border: 1px solid #dfb15b;">Explore Full Catalogue &rarr;</a>`}
              ${
                content.closingStatement
                  ? `<p style="margin: 16px auto 0; font-size: 12px; color: #666; max-width: 480px; line-height: 1.5;">${content.closingStatement}</p>`
                  : ''
              }
            </td>
          </tr>

          <!-- Direct Mill Contact Strip -->
          <tr>
            <td style="background-color: #faf7f2; padding: 22px 30px; border-top: 1px solid #ede3d1; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; font-weight: bold; color: #4a1122; text-transform: uppercase; letter-spacing: 0.08em;">
                Request Free Physical Swatches &amp; Price List
              </p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                Contact Mill Sales: <a href="tel:${content.contactPhone || '+919875198837'}" style="color: #4a1122; font-weight: bold; text-decoration: none;">${content.contactPhone || '+91 98751 98837'}</a> &bull; WhatsApp: <a href="https://wa.me/${(content.contactWhatsApp || '+919875198837').replace(/[^0-9]/g, '')}" style="color: #25d366; font-weight: bold; text-decoration: none;">Chat Direct</a>
              </p>
              ${content.showroomAddress ? `<p style="margin: 6px 0 0; font-size: 11px; color: #888;">${content.showroomAddress}</p>` : ''}
            </td>
          </tr>

          <!-- Footer & Unsubscribe -->
          <tr>
            <td style="background-color: #1e050c; padding: 25px 30px; text-align: center; color: #b8a99c; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 6px; font-weight: bold; color: #dfb15b; letter-spacing: 0.1em; text-transform: uppercase;">${content.brandSignature || 'SRI FABRICS SURAT'}</p>
              <p style="margin: 0 0 10px; color: #88786a;">Ring Road Textile Market, Surat, Gujarat, India &bull; Direct Mill Wholesale Supplier</p>
              <p style="margin: 0; color: #776655; font-size: 10px;">
                You are receiving this communication as a registered business client or subscriber of SRI FABRICS. 
                <br /><a href="{{unsubscribe_url}}" style="color: #dfb15b; text-decoration: underline;">Unsubscribe from promotional emails</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'collection-launch',
    name: 'New Fabric Collection Launch',
    category: 'Collections',
    description: 'Announce new seasonal weaves, bridal textiles, and royal designer fabrics directly to boutiques and garment brands.',
    subject: 'Introducing The Royal Heritage Collection 2026 – Direct from SRI Fabrics Surat Looms',
    preheader: 'Explore regal Banarasi katan silks, featherlight tissue drapes, and bespoke jacquards.',
    thumbnail: '/slides/hero-sarees-7.jpg',
    content: {
      templateId: 'collection-launch',
      templateName: 'New Fabric Collection Launch',
      subject: 'Introducing The Royal Heritage Collection 2026 – Direct from SRI Fabrics Surat Looms',
      preheader: 'Explore regal Banarasi katan silks, featherlight tissue drapes, and bespoke jacquards.',
      kicker: 'NEW 2026 CATALOGUE',
      headline: 'The Royal Heritage Weaves',
      subheadline: 'Crafted on high-speed electronic Jacquards in Surat',
      greeting: 'Dear Esteemed Partner,',
      introParagraph: 'We are proud to unveil our newest mill collection crafted on state-of-the-art electronic Jacquard and rapier looms in Surat. Engineered specifically for luxury pret labels, bridal couturiers, and garment manufacturers across India.',
      heroImageUrl: '/slides/hero-sarees-7.jpg',
      heroImageAlt: 'Royal Heritage Silk Collection',
      heroAspectRatio: '16:9',
      productSectionTitle: 'Featured Mill Weaves',
      productSectionSubtitle: 'Direct factory pricing with flexible MOQs starting at 50 metres',
      products: [
        {
          id: 'prod-1',
          title: 'Pure Banarasi Katan Silk',
          specs: '100% Mulberry Silk • 120 GSM • 44" Width',
          description: 'Intricate Kadwa gold zari floral jaal designed for bridal lehengas and royal sarees.',
          imageUrl: '/slides/hero-sarees-7.jpg',
          badge: 'Bestseller',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/sarees',
        },
        {
          id: 'prod-2',
          title: 'Featherlight Tissue Organza',
          specs: 'Metallic Shimmer Warp • 48 GSM • 46" Width',
          description: 'Ultra-crisp drape with subtle dual-tone metallic gleam. Ideal for dupattas & jackets.',
          imageUrl: '/slides/hero-fabrics-home.jpg',
          badge: 'Trending',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/fabrics',
        },
        {
          id: 'prod-3',
          title: 'Fluid Viscose Chinon Crepe',
          specs: 'High-Twist Rayon • 85 GSM • 44" Width',
          description: 'Lustrous, flowy fabric with superior dye-uptake for high-definition digital printing.',
          imageUrl: '/slides/hero-fabrics-5.jpg',
          badge: 'Ready Stock',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/fabrics',
        },
      ],
      ctas: [
        {
          id: 'cta-1',
          text: 'Explore Full Collection',
          url: 'https://www.srifabric.com/catalogue',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
        {
          id: 'cta-2',
          text: 'Chat on WhatsApp',
          url: 'https://wa.me/919875198837',
          style: 'whatsapp-green',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'The SRI Fabrics Direct-Mill Guarantee',
      partnershipHighlights: [
        {
          id: 'hl-1',
          icon: '✨',
          title: 'Direct Mill Rates',
          description: 'Zero middleman margins with authentic wholesale mill gate prices.',
        },
        {
          id: 'hl-2',
          icon: '🌿',
          title: 'OEKO-TEX Dyes',
          description: 'Certified skin-safe colorfast dyes with laboratory testing.',
        },
        {
          id: 'hl-3',
          icon: '🚀',
          title: '48h Dispatch',
          description: 'Express door delivery across all major Indian textile hubs.',
        },
      ],
      closingStatement: 'Ready Stock Available • Custom Weaving & Dyeing from 100m • Free Physical Swatch Kit for Qualified Boutiques',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
  {
    id: 'print-designs',
    name: 'New Digital Print Designs',
    category: 'Prints',
    description: 'Showcase industrial 2400 DPI Japanese & Italian digital printing capabilities, floral motifs, and contemporary abstractions.',
    subject: 'New Digital Fabric Prints: High-DPI Reactive Artistry on Chinon & Organza',
    preheader: 'Photo-realistic digital textile designs ready for your upcoming designer ensembles.',
    thumbnail: '/slides/hero-fabrics-home.jpg',
    content: {
      templateId: 'print-designs',
      templateName: 'New Digital Print Designs',
      subject: 'New Digital Fabric Prints: High-DPI Reactive Artistry on Chinon & Organza',
      preheader: 'Photo-realistic digital textile designs ready for your upcoming designer ensembles.',
      kicker: 'DIGITAL TEXTILE STUDIO',
      headline: 'High-Definition Digital Fabric Prints',
      subheadline: 'Multi-Color Reactive & Sublimation Technology on Silk, Organza & Chinon',
      greeting: 'Hello Fashion Creators,',
      introParagraph: 'Engineered with precision Japanese and Italian digital print heads, our latest print catalogue achieves vibrant gradient transitions, micro-fine detailing, and 100% colorfastness across pure Chinons, Organzas, and Georgettes.',
      heroImageUrl: '/slides/hero-fabrics-home.jpg',
      heroImageAlt: 'Digital Print Textile Collection',
      heroAspectRatio: '16:9',
      productSectionTitle: 'New Print Release Series',
      productSectionSubtitle: 'Choose from hundreds of ready digital designs or submit your own CAD patterns',
      products: [
        {
          id: 'prod-print-1',
          title: 'English Garden Floral on Organza',
          specs: '100% Pure Organza • 2400 DPI Print • 44" Width',
          description: 'Subtle pastel flora with photorealistic petal gradients and crisp micro-linework.',
          imageUrl: '/slides/hero-fabrics-home.jpg',
          badge: 'Series A',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/fabrics',
        },
        {
          id: 'prod-print-2',
          title: 'Abstract Ombré on Fluid Chinon',
          specs: 'Viscose Chinon • Wash-Durable Reactive • 46" Width',
          description: 'Two-tone dusk sunset gradients engineered for contemporary co-ord sets.',
          imageUrl: '/slides/hero-fabrics-3.jpg',
          badge: 'Series B',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/fabrics',
        },
      ],
      ctas: [
        {
          id: 'cta-print-1',
          text: 'View New Print Catalogue',
          url: 'https://www.srifabric.com/fabrics',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'Custom Printing Privileges',
      partnershipHighlights: [
        {
          id: 'hl-p1',
          icon: '🎨',
          title: 'Custom Repeat CAD',
          description: 'Submit your proprietary motifs with confidential non-disclosure guarantees.',
        },
        {
          id: 'hl-p2',
          icon: '📐',
          title: 'Low MOQ from 50m',
          description: 'Sample strike-offs dispatched in 3-5 days before full production run.',
        },
      ],
      closingStatement: 'Custom Repeat Patterns & Private Label Printing Available from 50m MOQ',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
  {
    id: 'promotional-offer',
    name: 'Wholesale Promotional Offer',
    category: 'Offers',
    description: 'Promote volume discounts, seasonal mill rebates, and bulk meter incentives for boutique buyers and apparel manufacturers.',
    subject: 'Exclusive Wholesale Mill Offer: Up to 18% Off Bulk Textile Yardages',
    preheader: 'Direct factory discounts on minimum 100+ metre orders for your seasonal production.',
    thumbnail: '/slides/hero-fabrics-5.jpg',
    content: {
      templateId: 'promotional-offer',
      templateName: 'Wholesale Promotional Offer',
      subject: 'Exclusive Wholesale Mill Offer: Up to 18% Off Bulk Textile Yardages',
      preheader: 'Direct factory discounts on minimum 100+ metre orders for your seasonal production.',
      kicker: 'SPECIAL MILL INCENTIVE',
      headline: 'Up to 18% Bulk Mill Rebate',
      subheadline: 'Exclusive Factory Volume Pricing for Boutique Chains & Apparel Brands',
      greeting: 'Valued Manufacturer & Wholesaler,',
      introParagraph: 'For wholesale orders placed this month, take advantage of our volume tier discounts directly from our Surat mill floor. Secure consistent dye-lot consistency and priority loom scheduling.',
      heroImageUrl: '/slides/hero-fabrics-5.jpg',
      heroImageAlt: 'Bulk Fabric Rolls',
      heroAspectRatio: '16:9',
      productSectionTitle: 'Eligible Fabric Categories',
      productSectionSubtitle: 'Discounts apply automatically across all standard lumps and rolls',
      products: [
        {
          id: 'prod-offer-1',
          title: 'Bulk Plain & Jacquard Silk Yardages',
          specs: '100 - 250 Metres: 8% Rebate | 250 - 500m: 12% Rebate',
          description: 'Certified 100% pure silk and rich blended yarns ready for couture tailoring.',
          imageUrl: '/slides/hero-fabrics-4.jpg',
          badge: 'Tier 1 & 2',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/fabrics',
        },
      ],
      ctas: [
        {
          id: 'cta-offer-1',
          text: 'Claim Wholesale Quotation',
          url: 'https://www.srifabric.com/contact',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'Wholesale Buyer Privileges',
      partnershipHighlights: [
        {
          id: 'hl-o1',
          icon: '🏷️',
          title: 'Direct Factory Tiers',
          description: 'Volume-indexed price slab structure transparently printed on invoices.',
        },
        {
          id: 'hl-o2',
          icon: '📦',
          title: 'Free Courier Swatches',
          description: 'Receive full touch-and-feel fabric sample swatches before ordering.',
        },
      ],
      closingStatement: 'Offer valid for orders confirmed through the SRI FABRIC B2B portal.',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
  {
    id: 'seasonal-wedding',
    name: 'Bridal & Festive Collections',
    category: 'Seasonal',
    description: 'Promote opulent zari brocades, bridal dola silks, and festive katan sarees for wedding season.',
    subject: 'Bridal & Festive Couture Weaves: Reserve Ready Stock for Wedding Season',
    preheader: 'Authentic Banarasi kadwa motifs, antique gold zari borders, and regal bridal drapes.',
    thumbnail: '/slides/saree-heritage.jpg',
    content: {
      templateId: 'seasonal-wedding',
      templateName: 'Bridal & Festive Collections',
      subject: 'Bridal & Festive Couture Weaves: Reserve Ready Stock for Wedding Season',
      preheader: 'Authentic Banarasi kadwa motifs, antique gold zari borders, and regal bridal drapes.',
      kicker: 'WEDDING & COUTURE SEASON',
      headline: 'Opulent Zari & Katan Silk Saree Yardages',
      subheadline: 'Heritage Indian Bridal Weaves for Boutiques & Couturiers',
      greeting: 'Dear Designer,',
      introParagraph: 'Every thread woven with certified metallic gold and silver zari. Crafted for boutique bridal lounges, couture ateliers, and premier ethnic retail chains across India and overseas.',
      heroImageUrl: '/slides/saree-heritage.jpg',
      heroImageAlt: 'Bridal Saree Weaves',
      heroAspectRatio: '16:9',
      productSectionTitle: 'Featured Festive Weaves',
      productSectionSubtitle: 'Dense zari borders with flawless reverse finishing',
      products: [
        {
          id: 'prod-wed-1',
          title: 'Royal Crimson Banarasi Katan Silk',
          specs: 'Certified Zari • 120 GSM • 5.5m + Blouse',
          description: 'Dense floral jaal with traditional meenakari accents and heavy pallu.',
          imageUrl: '/slides/saree-heritage.jpg',
          badge: 'Bridal Special',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/sarees',
        },
      ],
      ctas: [
        {
          id: 'cta-wed-1',
          text: 'Explore Bridal Saree Collection',
          url: 'https://www.srifabric.com/sarees',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'Bridal Sourcing Advantages',
      partnershipHighlights: [
        {
          id: 'hl-w1',
          icon: '👑',
          title: 'Certified Metallic Zari',
          description: 'Tested against tarnish and blackening with laboratory certificate.',
        },
        {
          id: 'hl-w2',
          icon: '🧵',
          title: 'Ready Cut Pieces',
          description: 'Full 6.3 metre sarees with matching running unstitched blouse piece.',
        },
      ],
      closingStatement: 'Reserve your bridal seasonal allocations today before holiday rush.',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
  {
    id: 'natural-weaves',
    name: 'Cotton, Muslin & Rayon Kurti Sets',
    category: 'Fabrics',
    description: 'Promote breathable organic cotton, featherlight muslin, and fluid viscose for casual and festive ethnic pret lines.',
    subject: 'Organic Muslin & Combed Cotton Kurti Sets: Direct Mill Yardages for Pret Labels',
    preheader: 'Pre-shrunk, skin-friendly textiles engineered for 2-piece and 3-piece co-ord ensembles.',
    thumbnail: '/slides/hero-kurti-home.jpg',
    content: {
      templateId: 'natural-weaves',
      templateName: 'Cotton, Muslin & Rayon Kurti Sets',
      subject: 'Organic Muslin & Combed Cotton Kurti Sets: Direct Mill Yardages for Pret Labels',
      preheader: 'Pre-shrunk, skin-friendly textiles engineered for 2-piece and 3-piece co-ord ensembles.',
      kicker: 'NATURAL WEAVES & ETHNIC PRET',
      headline: 'Soft Muslin, Rayon & Combed Cotton Suit Lengths',
      subheadline: 'Breathable, High-Dye Affinity Yardages for 2-Piece and 3-Piece Co-ords',
      greeting: 'Dear Apparel Manufacturer,',
      introParagraph: 'Engineered for daily comfort and luxury festive wear. Features high colorfastness, minimal shrinkage, and superior dye-affinity for hand block printing and embroidery.',
      heroImageUrl: '/slides/hero-kurti-home.jpg',
      heroImageAlt: 'Cotton & Muslin Kurti Sets',
      heroAspectRatio: '16:9',
      productSectionTitle: 'Kurti & Dupatta Combinations',
      productSectionSubtitle: 'Pre-matched tops and dupattas ready for retail cut-pack packaging',
      products: [
        {
          id: 'prod-nat-1',
          title: 'Mulberry Muslin Top + Kota Doria Dupatta',
          specs: '60s Combed Yarn • 2.5m Top + 2.4m Dupatta',
          description: 'Featherlight summer luxury with artisan border prints and matching tassels.',
          imageUrl: '/slides/hero-kurti-home.jpg',
          badge: 'Hot Seller',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/top-dupatta',
        },
      ],
      ctas: [
        {
          id: 'cta-nat-1',
          text: 'Explore Kurti Sets & Dupattas',
          url: 'https://www.srifabric.com/top-dupatta',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'Manufacturing Specifications',
      partnershipHighlights: [
        {
          id: 'hl-n1',
          icon: '🌿',
          title: 'Zero Shrinkage',
          description: 'Controlled pre-shrinking and heat-setting across all cotton yards.',
        },
        {
          id: 'hl-n2',
          icon: '✂️',
          title: 'Cut-to-Order Packs',
          description: 'Shipped in individually poly-packed sets ready for retail display.',
        },
      ],
      closingStatement: '15,000+ Metres Ready Stock Available for Immediate Factory Sourcing.',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
  {
    id: 'wholesale-enquiry',
    name: 'Wholesale & Bulk Sourcing Call',
    category: 'B2B',
    description: 'Invite new garment exporters, retail chains, and international buyers to source directly from Surat looms with customized GSM.',
    subject: 'Direct Mill Sourcing from Surat: 500,000+ Metres Monthly Weaving Capacity',
    preheader: 'Eliminate middleman margins and procure certified luxury textiles directly from our Surat looms.',
    thumbnail: '/printing1.png',
    content: {
      templateId: 'wholesale-enquiry',
      templateName: 'Wholesale & Bulk Sourcing Call',
      subject: 'Direct Mill Sourcing from Surat: 500,000+ Metres Monthly Weaving Capacity',
      preheader: 'Eliminate middleman margins and procure certified luxury textiles directly from our Surat looms.',
      kicker: 'MANUFACTURER DIRECT',
      headline: 'Partner Directly with India’s Premier Textile Mill',
      subheadline: 'Comprehensive Weaving, Dyeing, and Digital Printing Infrastructure',
      greeting: 'To The Sourcing Director,',
      introParagraph: 'Whether you produce high-volume ethnic pret lines or bespoke bridal couture, SRI FABRICS provides end-to-end weaving, jet dyeing, digital printing, and laboratory inspection under one roof.',
      heroImageUrl: '/printing1.png',
      heroImageAlt: 'Textile Printing Technology',
      heroAspectRatio: '16:9',
      productSectionTitle: 'Mill Infrastructure & Capabilities',
      productSectionSubtitle: 'High-speed electronic Jacquards, Sulzer rapier, and Japanese digital printers',
      products: [
        {
          id: 'prod-cap-1',
          title: 'Rapier & Water-Jet Looms',
          specs: '500,000+ Metres Monthly • Widths 44" to 58"',
          description: 'Precision tension control for high-density luxury silks, tissues, and crepes.',
          imageUrl: '/sri3.png',
          badge: 'Capacity',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/contact',
        },
      ],
      ctas: [
        {
          id: 'cta-b2b-1',
          text: 'Consult Our Textile Specialists',
          url: 'https://www.srifabric.com/contact',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'The SRI Fabrics Industrial Scale',
      partnershipHighlights: [
        {
          id: 'hl-b1',
          icon: '🏭',
          title: '500K Metres / Month',
          description: 'Massive volume capacity to meet tight festive retail order deadlines.',
        },
        {
          id: 'hl-b2',
          icon: '🧪',
          title: 'Lab Tested Quality',
          description: 'Stringent GSM, rub-fastness, and tear tests before roll packing.',
        },
      ],
      closingStatement: 'Visit our Surat weaving mills or request representative visit to your office.',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
  {
    id: 'festival-greetings',
    name: 'Festival Greetings & Seasonal Pre-Booking',
    category: 'Greetings',
    description: 'Send elegant festival wishes (Diwali, Eid, Festive Seasons) with holiday dispatch timelines and seasonal advance booking.',
    subject: 'Warm Festive Greetings from SRI FABRICS – Advance Booking & Holiday Schedules',
    preheader: 'Wishing your brand prosperity and timeless craftsmanship this festive season.',
    thumbnail: '/slides/hero-desktop-21.jpg',
    content: {
      templateId: 'festival-greetings',
      templateName: 'Festival Greetings & Seasonal Pre-Booking',
      subject: 'Warm Festive Greetings from SRI FABRICS – Advance Booking & Holiday Schedules',
      preheader: 'Wishing your brand prosperity and timeless craftsmanship this festive season.',
      kicker: 'FESTIVE GREETINGS',
      headline: 'Warm Festive Wishes & Prosperity',
      subheadline: 'From the Entire Loom Artisans & Staff at SRI FABRICS Surat',
      greeting: 'Respected Business Partner,',
      introParagraph: 'As festive retail demand surges across Indian and global fashion markets, we thank you for your continued trust in our looms. To ensure timely delivery before the holiday rush, our advance pre-booking is now open.',
      heroImageUrl: '/slides/hero-desktop-21.jpg',
      heroImageAlt: 'Festive Gold Saree',
      heroAspectRatio: '16:9',
      productSectionTitle: 'Priority Festive Bookings',
      productSectionSubtitle: 'Pre-order popular weaves to secure early dispatch allocations',
      products: [
        {
          id: 'prod-fest-1',
          title: 'Heritage Antique Zari Brocades',
          specs: 'Festive Delivery Guaranteed • Priority Loom Booking',
          description: 'Timeless floral and animal motifs woven with non-tarnish antique gold yarn.',
          imageUrl: '/slides/hero-desktop-21.jpg',
          badge: 'Pre-Booking',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/sarees',
        },
      ],
      ctas: [
        {
          id: 'cta-fest-1',
          text: 'Pre-Book Festive Collections',
          url: 'https://www.srifabric.com/sarees',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'Festive Logistics Schedule',
      partnershipHighlights: [
        {
          id: 'hl-f1',
          icon: '🚚',
          title: 'Express Air Cargo',
          description: 'Dedicated air freight contracts ensuring 24-48 hr hub deliveries.',
        },
        {
          id: 'hl-f2',
          icon: '📦',
          title: 'Batch Reservations',
          description: 'Hold selected lots with zero cancellation fees up to 14 days.',
        },
      ],
      closingStatement: 'May this festive season weave happiness, prosperity, and golden success for your business.',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
  {
    id: 'general-promotion',
    name: 'General Business & Brand Showcase',
    category: 'Branding',
    description: 'Comprehensive brand overview highlighting heritage craftsmanship, diverse weaves, and direct mill supply privileges.',
    subject: 'SRI FABRICS Surat: Fabrics Beyond Boundaries – Premium Mill Portfolio',
    preheader: 'Discover our complete range of certified luxury textiles for global garment creators.',
    thumbnail: '/sri3.png',
    content: {
      templateId: 'general-promotion',
      templateName: 'General Business & Brand Showcase',
      subject: 'SRI FABRICS Surat: Fabrics Beyond Boundaries – Premium Mill Portfolio',
      preheader: 'Discover our complete range of certified luxury textiles for global garment creators.',
      kicker: 'ESTABLISHED 2015',
      headline: 'Surat’s Premier Luxury Textile Partner',
      subheadline: 'Pure Mulberry Silks, Tissue Organzas & Combed Cotton Pret Sets',
      greeting: 'Dear Client,',
      introParagraph: 'From high-speed electronic Jacquards to artisan digital prints, SRI FABRICS supplies pure mulberry silks, tissue organzas, and combed cottons to couture designers and garment exporters across 14+ countries.',
      heroImageUrl: '/sri3.png',
      heroImageAlt: 'SRI Fabrics Factory',
      heroAspectRatio: '16:9',
      productSectionTitle: 'Catalogue Highlights',
      productSectionSubtitle: 'Over 60+ active weaves and unstitched collections in ready stock',
      products: [
        {
          id: 'prod-gen-1',
          title: 'Sarees, Fabric Yardages & Kurti Sets',
          specs: '67 Active Designs • Low MOQs • Fast Delivery',
          description: 'Browse our complete multi-category catalogue online with live stock inquiry.',
          imageUrl: '/slides/hero-sarees-7.jpg',
          badge: 'Full Range',
          aspectRatio: '4:3',
          linkUrl: 'https://www.srifabric.com/catalogue',
        },
      ],
      ctas: [
        {
          id: 'cta-gen-1',
          text: 'Explore Complete Catalogue',
          url: 'https://www.srifabric.com/catalogue',
          style: 'primary-burgundy',
          alignment: 'center',
          enabled: true,
        },
      ],
      partnershipTitle: 'Why Choose SRI FABRICS',
      partnershipHighlights: [
        {
          id: 'hl-g1',
          icon: '💎',
          title: 'Pure Craftsmanship',
          description: 'Weaving traditions blended with state-of-the-art European loom technology.',
        },
        {
          id: 'hl-g2',
          icon: '🤝',
          title: 'Dedicated Account Manager',
          description: 'Direct WhatsApp communication with factory managers for every order.',
        },
      ],
      closingStatement: 'Surat Ring Road Textile Market • Dispatching Pan-India & Globally',
      contactPhone: '+91 98751 98837',
      contactWhatsApp: '+91 98751 98837',
      showroomAddress: 'Ring Road Textile Market, Surat, Gujarat, India',
      brandSignature: 'SRI FABRICS SURAT',
    },
    htmlContent: '',
  },
];

// Populate htmlContent on all templates using generatePromotionalEmailHtml
EMAIL_TEMPLATES.forEach((tmpl) => {
  tmpl.htmlContent = generatePromotionalEmailHtml(tmpl.content);
});
