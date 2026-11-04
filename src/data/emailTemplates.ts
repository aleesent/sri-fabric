export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  preheader: string;
  thumbnail: string;
  htmlContent: string;
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
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Collection Launch - SRI FABRICS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Top Header -->
          <tr>
            <td style="background-color: #4a1122; padding: 28px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #dfb15b; font-weight: 600; display: block; margin-bottom: 6px;">DIRECT MILL EXCLUSIVE PREVIEW</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.12em; text-transform: uppercase;">SRI FABRICS</h1>
              <span style="color: #f7eedf; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-top: 4px; opacity: 0.85;">Surat Textile Hub • Gujarat</span>
            </td>
          </tr>

          <!-- Hero Banner Image -->
          <tr>
            <td style="padding: 0; background-color: #24060d;">
              <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80" alt="Royal Heritage Collection" width="620" style="width: 100%; max-width: 620px; height: auto; display: block;" />
            </td>
          </tr>

          <!-- Headline & Editorial Intro -->
          <tr>
            <td style="padding: 35px 30px 20px; text-align: center;">
              <span style="display: inline-block; padding: 3px 12px; background: #faf4e6; color: #4a1122; border: 1px solid #dfb15b; font-size: 11px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 20px; margin-bottom: 15px;">
                NEW 2026 CATALOGUE
              </span>
              <h2 style="margin: 0 0 14px; font-size: 26px; font-family: Georgia, serif; color: #4a1122; line-height: 1.25; font-weight: normal;">
                The Royal Heritage Weaves
              </h2>
              <p style="margin: 0; font-size: 14px; line-height: 1.65; color: #555555; max-width: 500px; margin: 0 auto;">
                We are proud to unveil our newest mill collection crafted on state-of-the-art electronic Jacquard and rapier looms in Surat. Engineered specifically for luxury pret labels, bridal couturiers, and garment manufacturers.
              </p>
            </td>
          </tr>

          <!-- 3-Column Highlights Grid -->
          <tr>
            <td style="padding: 10px 20px 25px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- Card 1 -->
                  <td width="33.33%" style="padding: 8px; vertical-align: top;">
                    <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; text-align: center; padding: 15px 10px;">
                      <tr>
                        <td>
                          <div style="font-size: 18px; margin-bottom: 6px;">✨</div>
                          <h4 style="margin: 0 0 5px; font-size: 13px; color: #4a1122; font-family: Georgia, serif; font-weight: bold;">Pure Katan Silk</h4>
                          <p style="margin: 0; font-size: 11px; color: #777; line-height: 1.4;">Zari Kadwa brocading for royal bridal lehengas.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <!-- Card 2 -->
                  <td width="33.33%" style="padding: 8px; vertical-align: top;">
                    <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; text-align: center; padding: 15px 10px;">
                      <tr>
                        <td>
                          <div style="font-size: 18px; margin-bottom: 6px;">🌿</div>
                          <h4 style="margin: 0 0 5px; font-size: 13px; color: #4a1122; font-family: Georgia, serif; font-weight: bold;">Tissue Organza</h4>
                          <p style="margin: 0; font-size: 11px; color: #777; line-height: 1.4;">Featherlight 45 GSM with metallic shimmer warp.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <!-- Card 3 -->
                  <td width="33.33%" style="padding: 8px; vertical-align: top;">
                    <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; text-align: center; padding: 15px 10px;">
                      <tr>
                        <td>
                          <div style="font-size: 18px; margin-bottom: 6px;">👑</div>
                          <h4 style="margin: 0 0 5px; font-size: 13px; color: #4a1122; font-family: Georgia, serif; font-weight: bold;">Fluid Chinon</h4>
                          <p style="margin: 0; font-size: 11px; color: #777; line-height: 1.4;">Lustrous drape for anarkalis, kurtis & dupattas.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td style="padding: 10px 30px 35px; text-align: center;">
              <a href="https://srifabrics.com/fabrics" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.12em; border: 1px solid #dfb15b; box-shadow: 0 2px 8px rgba(74,17,34,0.3);">
                Explore Full Collection &rarr;
              </a>
              <div style="margin-top: 12px;">
                <span style="font-size: 11px; color: #888;">Ready Stock Available &bull; Flexible MOQs &bull; Express Dispatch</span>
              </div>
            </td>
          </tr>

          <!-- Direct Mill Contact Strip -->
          <tr>
            <td style="background-color: #faf7f2; padding: 22px 30px; border-top: 1px solid #ede3d1; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; font-weight: bold; color: #4a1122; text-transform: uppercase; letter-spacing: 0.08em;">
                Request Free Physical Swatches & Price List
              </p>
              <p style="margin: 0; font-size: 12px; color: #666;">
                Contact Mill Sales: <a href="tel:+919875198837" style="color: #4a1122; font-weight: bold; text-decoration: none;">+91 98751 98837</a> &bull; WhatsApp: <a href="https://wa.me/919875198837" style="color: #25d366; font-weight: bold; text-decoration: none;">Chat Direct</a>
              </p>
            </td>
          </tr>

          <!-- Footer & Unsubscribe -->
          <tr>
            <td style="background-color: #1e050c; padding: 25px 30px; text-align: center; color: #b8a99c; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 6px; font-weight: bold; color: #dfb15b; letter-spacing: 0.1em; text-transform: uppercase;">SRI FABRICS SURAT</p>
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
</html>`
  },
  {
    id: 'print-designs',
    name: 'New Digital Print Designs',
    category: 'Prints',
    description: 'Showcase industrial 2400 DPI Japanese & Italian digital printing capabilities, floral motifs, and contemporary abstractions.',
    subject: 'New Digital Fabric Prints: High-DPI Reactive Artistry on Chinon & Organza',
    preheader: 'Photo-realistic digital textile designs ready for your upcoming designer ensembles.',
    thumbnail: '/slides/hero-fabrics-home.jpg',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Digital Print Designs - SRI FABRICS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #2b0813; padding: 26px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #dfb15b; font-weight: 600; display: block; margin-bottom: 5px;">PRINTED TEXTILE STUDIO</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.12em; text-transform: uppercase;">SRI FABRICS</h1>
            </td>
          </tr>

          <!-- Visual Showcase -->
          <tr>
            <td style="padding: 30px 30px 15px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 25px; font-family: Georgia, serif; color: #4a1122; font-weight: normal;">
                High-Definition Digital Fabric Prints
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #555555;">
                Engineered with multi-color reactive and sublimation heads, our latest print catalogue achieves vibrant gradient transitions, micro-fine detailing, and 100% colorfastness across pure Chinons, Organzas, and Georgettes.
              </p>
            </td>
          </tr>

          <!-- 2x2 Feature Showcase -->
          <tr>
            <td style="padding: 0 20px 25px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="padding: 8px;">
                    <div style="background: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 18px 15px; text-align: left;">
                      <span style="font-size: 11px; font-weight: bold; color: #dfb15b; text-transform: uppercase;">SERIES A</span>
                      <h4 style="margin: 4px 0 6px; font-size: 14px; color: #4a1122; font-family: Georgia, serif;">Botanical &amp; Floral Prints</h4>
                      <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.5;">Vibrant English florals and heritage mughal paisleys on sheer organza.</p>
                    </div>
                  </td>
                  <td width="50%" style="padding: 8px;">
                    <div style="background: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 18px 15px; text-align: left;">
                      <span style="font-size: 11px; font-weight: bold; color: #dfb15b; text-transform: uppercase;">SERIES B</span>
                      <h4 style="margin: 4px 0 6px; font-size: 14px; color: #4a1122; font-family: Georgia, serif;">Ombré &amp; Abstract Crepes</h4>
                      <p style="margin: 0; font-size: 12px; color: #666; line-height: 1.5;">Smooth two-tone shade gradients with wash-durable reactive dyes.</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Block -->
          <tr>
            <td style="background-color: #faf7f2; padding: 25px 30px; text-align: center; border-top: 1px solid #ede3d1; border-bottom: 1px solid #ede3d1;">
              <p style="margin: 0 0 15px; font-size: 13px; color: #4a1122; font-weight: 600;">Custom Repeat Patterns &amp; Private Label Printing Available from 50m MOQ</p>
              <a href="https://srifabrics.com/fabrics" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 13px 30px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b;">
                View New Print Catalogue &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e050c; padding: 25px 30px; text-align: center; color: #b8a99c; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 6px; font-weight: bold; color: #dfb15b;">SRI FABRICS SURAT</p>
              <p style="margin: 0 0 10px; color: #88786a;">Ring Road Textile Market, Surat, Gujarat • +91 98751 98837</p>
              <p style="margin: 0; color: #776655; font-size: 10px;">
                <a href="{{unsubscribe_url}}" style="color: #dfb15b; text-decoration: underline;">Unsubscribe</a> from promotional updates.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'promotional-offer',
    name: 'Wholesale Promotional Offer',
    category: 'Offers',
    description: 'Promote volume discounts, seasonal mill rebates, and bulk meter incentives for boutique buyers and apparel manufacturers.',
    subject: 'Exclusive Wholesale Mill Offer: Up to 18% Off Bulk Textile Yardages',
    preheader: 'Direct factory discounts on minimum 100+ metre orders for your seasonal production.',
    thumbnail: '/slides/hero-fabrics-5.jpg',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wholesale Promotional Offer - SRI FABRICS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #4a1122; padding: 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #dfb15b; font-weight: 600; display: block; margin-bottom: 6px;">SPECIAL MILL INCENTIVE</span>
              <h1 style="color: #ffffff; margin: 0 0 10px; font-size: 28px; font-family: Georgia, serif;">UP TO 18% BULK REBATE</h1>
              <p style="margin: 0; color: #f7eedf; font-size: 13px; opacity: 0.9;">On All Pure Silks, Organzas, Chinons &amp; Kurti Sets</p>
            </td>
          </tr>

          <!-- Offer Details -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="margin: 0 0 10px; font-size: 18px; color: #4a1122; font-family: Georgia, serif; text-align: center;">Direct Loom Sourcing Advantage</h3>
              <p style="margin: 0 0 25px; font-size: 13px; line-height: 1.6; color: #555; text-align: center;">
                For orders confirmed this month, take advantage of our volume tier discounts directly from our Surat mill floor:
              </p>

              <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #4a1122; border-bottom: 1px solid #ebdcc5;">100 to 250 Metres</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #047857; text-align: right; border-bottom: 1px solid #ebdcc5;">8% Mill Discount</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #4a1122; border-bottom: 1px solid #ebdcc5;">250 to 500 Metres</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #047857; text-align: right; border-bottom: 1px solid #ebdcc5;">12% Mill Discount</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #4a1122;">500+ Metres / Custom Weaves</td>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: bold; color: #047857; text-align: right;">18% Mill Discount + Free Courier Swatch Kit</td>
                </tr>
              </table>

              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://srifabrics.com/contact" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b;">
                      Claim Wholesale Quotation &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e050c; padding: 20px 30px; text-align: center; color: #88786a; font-size: 11px;">
              <p style="margin: 0 0 6px; color: #dfb15b; font-weight: bold;">SRI FABRICS SURAT</p>
              <p style="margin: 0; font-size: 10px;">
                <a href="{{unsubscribe_url}}" style="color: #dfb15b; text-decoration: underline;">Unsubscribe</a> from promotional emails.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'seasonal-wedding',
    name: 'Bridal & Festive Collections',
    category: 'Seasonal',
    description: 'Promote opulent zari brocades, bridal dola silks, and festive katan sarees for wedding season.',
    subject: 'Bridal & Festive Couture Weaves: Reserve Ready Stock for Wedding Season',
    preheader: 'Authentic Banarasi kadwa motifs, antique gold zari borders, and regal bridal drapes.',
    thumbnail: '/slides/saree-heritage.jpg',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bridal & Festive Weaves - SRI FABRICS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          
          <tr>
            <td style="background-color: #4a1122; padding: 28px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #dfb15b; font-weight: 600; display: block; margin-bottom: 5px;">WEDDING &amp; COUTURE SEASON</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.12em; text-transform: uppercase;">SRI FABRICS</h1>
              <p style="color: #dfb15b; margin: 4px 0 0; font-size: 12px; font-style: italic;">Heritage Indian Bridal Weaves</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 25px; font-family: Georgia, serif; color: #4a1122; font-weight: normal;">
                Opulent Zari &amp; Katan Silk Saree Yardages
              </h2>
              <p style="margin: 0 0 25px; font-size: 14px; line-height: 1.6; color: #555;">
                Every thread woven with certified metallic gold and silver zari. Crafted for boutique bridal lounges, couture ateliers, and premier ethnic retail chains across India and overseas.
              </p>

              <div style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 20px; text-align: left; margin-bottom: 25px;">
                <h4 style="margin: 0 0 10px; font-size: 14px; color: #4a1122; font-family: Georgia, serif; font-weight: bold;">Featured Festive Weaves:</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #444; line-height: 1.8;">
                  <li><strong>Banarasi Katan Silk:</strong> 120 GSM dense warp with intricate jaal &amp; kadwa motifs.</li>
                  <li><strong>Regal Dola Silk:</strong> Butter-soft touch with subtle antique shimmer finish.</li>
                  <li><strong>Tissue Silk &amp; Organza:</strong> Ultra-crisp, featherlight borders for destination weddings.</li>
                </ul>
              </div>

              <a href="https://srifabrics.com/sarees" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b;">
                Explore Bridal Saree Collection &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="background-color: #1e050c; padding: 20px 30px; text-align: center; color: #88786a; font-size: 11px;">
              <p style="margin: 0 0 6px; color: #dfb15b; font-weight: bold;">SRI FABRICS • SURAT</p>
              <p style="margin: 0; font-size: 10px;"><a href="{{unsubscribe_url}}" style="color: #dfb15b; text-decoration: underline;">Unsubscribe</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'natural-weaves',
    name: 'Cotton, Muslin & Rayon Kurti Sets',
    category: 'Fabrics',
    description: 'Promote breathable organic cotton, featherlight muslin, and fluid viscose for casual and festive ethnic pret lines.',
    subject: 'Organic Muslin & Combed Cotton Kurti Sets: Direct Mill Yardages for Pret Labels',
    preheader: 'Pre-shrunk, skin-friendly textiles engineered for 2-piece and 3-piece co-ord ensembles.',
    thumbnail: '/slides/hero-kurti-home.jpg',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotton, Muslin &amp; Kurti Sets - SRI FABRICS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce;">
          
          <tr>
            <td style="background-color: #2b0813; padding: 26px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #dfb15b; font-weight: 600; display: block; margin-bottom: 5px;">NATURAL WEAVES &amp; ETHNIC PRET</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.12em; text-transform: uppercase;">SRI FABRICS</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 24px; font-family: Georgia, serif; color: #4a1122;">
                Soft Muslin, Rayon &amp; Combed Cotton Suit Lengths
              </h2>
              <p style="margin: 0 0 25px; font-size: 14px; line-height: 1.6; color: #555;">
                Engineered for daily comfort and luxury festive wear. Features high colorfastness, minimal shrinkage, and superior dye-affinity for hand block printing and embroidery.
              </p>

              <div style="text-align: left; background: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 18px 20px; margin-bottom: 25px; font-size: 13px; line-height: 1.7; color: #333;">
                <p style="margin: 0 0 6px;"><strong>✓ Width Options:</strong> 44, 48 &amp; 58 inches running meterage</p>
                <p style="margin: 0 0 6px;"><strong>✓ Ready Stock:</strong> 15,000+ metres in unbleached white &amp; custom dyed shades</p>
                <p style="margin: 0;"><strong>✓ Packaging:</strong> Lumps, rolls, and cut-pack suit lengths ready for garment stitching</p>
              </div>

              <a href="https://srifabrics.com/top-dupatta" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 13px 32px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b;">
                Explore Kurti Sets &amp; Dupattas &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="background-color: #1e050c; padding: 20px; text-align: center; color: #88786a; font-size: 11px;">
              <p style="margin: 0 0 5px; color: #dfb15b;">SRI FABRICS SURAT</p>
              <p style="margin: 0; font-size: 10px;"><a href="{{unsubscribe_url}}" style="color: #dfb15b;">Unsubscribe</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'wholesale-enquiry',
    name: 'Wholesale & Bulk Sourcing Call',
    category: 'B2B',
    description: 'Invite new garment exporters, retail chains, and international buyers to source directly from Surat looms with customized GSM.',
    subject: 'Direct Mill Sourcing from Surat: 500,000+ Metres Monthly Weaving Capacity',
    preheader: 'Eliminate middleman margins and procure certified luxury textiles directly from our Surat looms.',
    thumbnail: '/printing1.png',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wholesale B2B Sourcing - SRI FABRICS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce;">
          
          <tr>
            <td style="background-color: #4a1122; padding: 28px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #dfb15b; font-weight: 600; display: block; margin-bottom: 5px;">MANUFACTURER DIRECT</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.12em; text-transform: uppercase;">SRI FABRICS</h1>
              <span style="color: #dfb15b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em;">Surat Weaving Mills • Established 2015</span>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; text-align: left;">
              <h2 style="margin: 0 0 14px; font-size: 22px; font-family: Georgia, serif; color: #4a1122;">
                Partner Directly with India's Premier Textile Mill
              </h2>
              <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.65; color: #555;">
                Whether you produce high-volume ethnic pret lines or bespoke bridal couture, SRI FABRICS provides end-to-end weaving, jet dyeing, digital printing, and laboratory inspection under one roof.
              </p>

              <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; margin-bottom: 25px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ebdcc5;">Monthly Capacity</td>
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: bold; color: #222; border-bottom: 1px solid #ebdcc5;">500,000+ Running Metres</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ebdcc5;">Looms Deployed</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222; border-bottom: 1px solid #ebdcc5;">High-Speed Rapier, Water-Jet &amp; Electronic Jacquard</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ebdcc5;">Dye Standards</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222; border-bottom: 1px solid #ebdcc5;">AZO-Free &bull; OEKO-TEX Certified Reactive Dyes</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144;">Logistics</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222;">24-48 hr dispatch to Mumbai, Delhi, Jaipur &amp; Global Air Cargo</td>
                </tr>
              </table>

              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://srifabrics.com/contact" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b;">
                      Consult Our Textile Specialists &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #1e050c; padding: 20px; text-align: center; color: #88786a; font-size: 11px;">
              <p style="margin: 0 0 5px; color: #dfb15b;">SRI FABRICS SURAT</p>
              <p style="margin: 0; font-size: 10px;"><a href="{{unsubscribe_url}}" style="color: #dfb15b;">Unsubscribe</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'festival-greetings',
    name: 'Festival Greetings & Seasonal Pre-Booking',
    category: 'Greetings',
    description: 'Send elegant festival wishes (Diwali, Eid, Festive Seasons) with holiday dispatch timelines and seasonal advance booking.',
    subject: 'Warm Festive Greetings from SRI FABRICS – Advance Booking & Holiday Schedules',
    preheader: 'Wishing your brand prosperity and timeless craftsmanship this festive season.',
    thumbnail: '/slides/hero-desktop-21.jpg',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Festive Greetings - SRI FABRICS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #dfb15b; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #4a1122 0%, #2b0813 100%); padding: 35px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <span style="font-size: 24px; display: block; margin-bottom: 8px;">✨ ❖ ✨</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">WARM FESTIVE WISHES</h1>
              <p style="color: #dfb15b; margin: 6px 0 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">From The Entire SRI FABRICS Family</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 35px 30px; text-align: center;">
              <p style="margin: 0 0 15px; font-size: 16px; font-family: Georgia, serif; color: #4a1122;">
                May this festive season weave happiness, prosperity, and golden success for your business.
              </p>
              <p style="margin: 0 0 25px; font-size: 13px; line-height: 1.7; color: #555; max-width: 480px; margin: 0 auto 25px;">
                As festive retail demand surges across Indian and global fashion markets, we thank you for your continued trust in our looms. To ensure timely delivery before the holiday rush, our dispatch schedules and advance pre-booking are now open.
              </p>

              <div style="background-color: #faf7f2; border: 1px dashed #dfb15b; border-radius: 6px; padding: 18px; margin-bottom: 25px; font-size: 12px; color: #4a1122; font-weight: 500;">
                Festive Advance Orders Dispatched via Express Air &amp; Dedicated Road Logistics
              </div>

              <a href="https://srifabrics.com/sarees" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b;">
                Pre-Book Festive Collections &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="background-color: #1e050c; padding: 20px; text-align: center; color: #88786a; font-size: 11px;">
              <p style="margin: 0 0 5px; color: #dfb15b;">SRI FABRICS SURAT</p>
              <p style="margin: 0; font-size: 10px;"><a href="{{unsubscribe_url}}" style="color: #dfb15b;">Unsubscribe</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'general-promotion',
    name: 'General Business & Brand Showcase',
    category: 'Branding',
    description: 'Comprehensive brand overview highlighting heritage craftsmanship, diverse weaves, and direct mill supply privileges.',
    subject: 'SRI FABRICS Surat: Fabrics Beyond Boundaries – Premium Mill Portfolio',
    preheader: 'Discover our complete range of certified luxury textiles for global garment creators.',
    thumbnail: '/sri3.png',
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SRI FABRICS Brand Portfolio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222222;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 25px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5dcce;">
          
          <tr>
            <td style="background-color: #4a1122; padding: 28px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.15em; text-transform: uppercase;">SRI FABRICS</h1>
              <p style="color: #dfb15b; margin: 4px 0 0; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;">Fabrics For A Brighter Tomorrow</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px; text-align: center;">
              <h2 style="margin: 0 0 14px; font-size: 24px; font-family: Georgia, serif; color: #4a1122;">
                Surat's Trusted Luxury Textile Partner
              </h2>
              <p style="margin: 0 0 25px; font-size: 13.5px; line-height: 1.65; color: #555;">
                From high-speed Jacquards to artisan digital prints, SRI FABRICS supplies pure mulberry silks, tissue organzas, and combed cottons to couture designers and garment exporters across 14+ countries.
              </p>

              <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ebdcc5; border-radius: 6px; padding: 15px; margin-bottom: 25px;">
                <tr>
                  <td width="33.33%" style="text-align: center; padding: 10px;">
                    <div style="font-size: 20px; font-weight: bold; color: #4a1122; font-family: Georgia, serif;">500K+</div>
                    <div style="font-size: 11px; color: #777; text-transform: uppercase; margin-top: 4px;">Metres Monthly</div>
                  </td>
                  <td width="33.33%" style="text-align: center; padding: 10px; border-left: 1px solid #ebdcc5; border-right: 1px solid #ebdcc5;">
                    <div style="font-size: 20px; font-weight: bold; color: #4a1122; font-family: Georgia, serif;">100%</div>
                    <div style="font-size: 11px; color: #777; text-transform: uppercase; margin-top: 4px;">Quality Tested</div>
                  </td>
                  <td width="33.33%" style="text-align: center; padding: 10px;">
                    <div style="font-size: 20px; font-weight: bold; color: #4a1122; font-family: Georgia, serif;">100m</div>
                    <div style="font-size: 11px; color: #777; text-transform: uppercase; margin-top: 4px;">Flexible MOQs</div>
                  </td>
                </tr>
              </table>

              <a href="https://srifabrics.com/fabrics" style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 14px 34px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #dfb15b;">
                Explore Complete Catalogue &rarr;
              </a>
            </td>
          </tr>

          <tr>
            <td style="background-color: #1e050c; padding: 20px; text-align: center; color: #88786a; font-size: 11px;">
              <p style="margin: 0 0 5px; color: #dfb15b;">SRI FABRICS SURAT</p>
              <p style="margin: 0; font-size: 10px;"><a href="{{unsubscribe_url}}" style="color: #dfb15b;">Unsubscribe</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
];
