import nodemailer from 'nodemailer';
import { db, isDatabaseConfigured } from '../db/index.ts';
import { siteSettings } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface BrevoConfig {
  host: string;
  port: number;
  user: string;
  key: string;
  fromEmail: string;
  fromName: string;
  adminEmail: string;
  isConfigured: boolean;
}

// In-memory cache for dynamic DB site settings
let cachedDbSettings: Record<string, string> | null = null;
let lastSettingsFetch = 0;

export async function getBrevoConfig(): Promise<BrevoConfig> {
  // Check if DB settings should be refreshed (cache for 60s)
  if (isDatabaseConfigured() && (!cachedDbSettings || Date.now() - lastSettingsFetch > 60000)) {
    try {
      const rows = await db.select().from(siteSettings);
      const map: Record<string, string> = {};
      rows.forEach((r) => {
        if (r.key && r.value) map[r.key] = r.value;
      });
      cachedDbSettings = map;
      lastSettingsFetch = Date.now();
    } catch {
      // Ignore DB fetch failure and fallback to env
    }
  }

  const host =
    process.env.BREVO_SMTP_HOST ||
    cachedDbSettings?.brevo_smtp_host ||
    'smtp-relay.brevo.com';

  const port = Number(
    process.env.BREVO_SMTP_PORT ||
    cachedDbSettings?.brevo_smtp_port ||
    587
  );

  const user =
    process.env.BREVO_SMTP_USER ||
    process.env.BREVO_USER ||
    cachedDbSettings?.brevo_smtp_user ||
    '';

  const key =
    process.env.BREVO_SMTP_KEY ||
    process.env.BREVO_SMTP_PASSWORD ||
    process.env.BREVO_API_KEY ||
    cachedDbSettings?.brevo_smtp_key ||
    '';

  const fromEmail =
    process.env.BREVO_FROM_EMAIL ||
    cachedDbSettings?.brevo_from_email ||
    (user && user.includes('@') ? user : 'inquiry@srifabrics.com');

  const fromName =
    process.env.BREVO_FROM_NAME ||
    cachedDbSettings?.brevo_from_name ||
    'SRI FABRICS Surat';

  const adminEmail =
    process.env.BREVO_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    cachedDbSettings?.brevo_admin_email ||
    'as4820000@gmail.com';

  const isConfigured = Boolean(user && key);

  return {
    host,
    port,
    user,
    key,
    fromEmail,
    fromName,
    adminEmail,
    isConfigured,
  };
}

export function createTransporter(config: BrevoConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.key,
    },
    connectionTimeout: 12000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

// ==========================================
// EMAIL SENDING METHODS
// ==========================================

export interface EnquiryEmailData {
  enquiryNumber: string;
  name: string;
  companyName?: string | null;
  businessEmail: string;
  phone: string;
  country?: string | null;
  city?: string | null;
  fabricOrCollection?: string | null;
  requiredQuantity?: string | null;
  application?: string | null;
  message?: string | null;
  sampleRequired?: boolean;
}

export async function sendEnquiryNotification(data: EnquiryEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = await getBrevoConfig();

  if (!config.isConfigured) {
    console.warn(`[Brevo SMTP] Skipped admin email notification: BREVO_SMTP_USER or BREVO_SMTP_KEY not set. Enquiry ${data.enquiryNumber} recorded in database.`);
    return { success: false, error: 'Brevo SMTP credentials not configured' };
  }

  const transporter = createTransporter(config);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New B2B Enquiry: ${data.enquiryNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292929;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e8dec8;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #4a1122; padding: 25px 30px; text-align: left; border-bottom: 3px solid #dfb15b;">
              <table role="presentation" width="100%">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">SRI FABRICS</h1>
                    <p style="color: #dfb15b; margin: 4px 0 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">Direct Mill B2B Lead Alert</p>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background: rgba(223, 177, 91, 0.2); color: #f7eedf; border: 1px solid #dfb15b; padding: 4px 10px; font-size: 12px; font-weight: bold; border-radius: 4px; font-family: monospace;">
                      ${data.enquiryNumber}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 10px; color: #4a1122; font-size: 18px; font-family: Georgia, serif;">
                New Wholesale Enquiry Received
              </h2>
              <p style="color: #666; font-size: 13px; line-height: 1.5; margin: 0 0 25px;">
                A new B2B buyer requirement has been submitted on <strong>srifabrics.com</strong>.
              </p>

              <!-- Buyer Details Table -->
              <table role="presentation" width="100%" style="background-color: #faf7f2; border: 1px solid #ede4d1; border-radius: 6px; margin-bottom: 25px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1; width: 35%;">Buyer Name</td>
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: bold; color: #222; border-bottom: 1px solid #ede4d1;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1;">Company / Brand</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222; border-bottom: 1px solid #ede4d1;">${data.companyName || 'Independent Fashion Buyer'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1;">Phone / Mobile</td>
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: bold; color: #4a1122; border-bottom: 1px solid #ede4d1;">
                    <a href="tel:${data.phone}" style="color: #4a1122; text-decoration: none;">${data.phone}</a>
                    <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="margin-left: 10px; display: inline-block; background: #25d366; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px; text-decoration: none;">WhatsApp</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1;">Business Email</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222; border-bottom: 1px solid #ede4d1;">
                    <a href="mailto:${data.businessEmail}" style="color: #4a1122;">${data.businessEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1;">Location</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222; border-bottom: 1px solid #ede4d1;">${[data.city, data.country].filter(Boolean).join(', ') || 'India'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1;">Fabric / Weave</td>
                  <td style="padding: 10px 14px; font-size: 13px; font-weight: bold; color: #222; border-bottom: 1px solid #ede4d1;">${data.fabricOrCollection || 'General Wholesale Inquiry'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1;">Quantity Required</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222; border-bottom: 1px solid #ede4d1;">${data.requiredQuantity || '100+ Metres'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144; border-bottom: 1px solid #ede4d1;">Sample Swatch Needed</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222; border-bottom: 1px solid #ede4d1;">
                    ${data.sampleRequired ? '<span style="color: #047857; font-weight: bold;">✓ YES (Sample Swatches Requested)</span>' : 'No'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; font-size: 12px; color: #786144;">Application / End Use</td>
                  <td style="padding: 10px 14px; font-size: 13px; color: #222;">${data.application || 'Couture / Ethnic Garments'}</td>
                </tr>
              </table>

              <!-- Customer Message Box -->
              <div style="background: #ffffff; border-left: 3px solid #4a1122; padding: 15px; margin-bottom: 25px; border-radius: 0 4px 4px 0; border-top: 1px solid #ede4d1; border-right: 1px solid #ede4d1; border-bottom: 1px solid #ede4d1;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #786144; margin-bottom: 6px; font-weight: bold;">Buyer Message / Notes</div>
                <div style="font-size: 13px; line-height: 1.6; color: #333; white-space: pre-wrap;">${data.message || 'No additional notes provided.'}</div>
              </div>

              <!-- Quick Action Button -->
              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(data.name)}%2C%20thank%20you%20for%20your%20enquiry%20${encodeURIComponent(data.enquiryNumber)}%20with%20SRI%20FABRICS%20Surat." 
                       style="display: inline-block; background-color: #4a1122; color: #f7eedf; padding: 12px 25px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid #dfb15b;">
                      Reply via WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf7f2; padding: 20px 30px; text-align: center; border-top: 1px solid #ede4d1; font-size: 11px; color: #888;">
              <p style="margin: 0 0 4px;">SRI FABRICS • Ring Road Textile Market, Surat, Gujarat • +91 98751 98837</p>
              <p style="margin: 0; color: #aaa;">This notification was dispatched via Brevo SMTP Relay.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: config.adminEmail,
      subject: `[SRI FABRICS] New B2B Enquiry: ${data.enquiryNumber} - ${data.name} (${data.companyName || 'Wholesale Buyer'})`,
      html,
      replyTo: data.businessEmail,
    });
    console.log(`[Brevo SMTP] Admin notification sent for ${data.enquiryNumber}. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Brevo SMTP Error] Failed to send admin notification for ${data.enquiryNumber}:`, error.message || error);
    return { success: false, error: error.message };
  }
}

export async function sendEnquiryCustomerConfirmation(data: EnquiryEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Only send if the customer provided a genuine looking email address
  if (!data.businessEmail || !data.businessEmail.includes('@') || data.businessEmail.endsWith('@srifabrics.com')) {
    return { success: false, error: 'No customer email provided' };
  }

  const config = await getBrevoConfig();
  if (!config.isConfigured) return { success: false, error: 'Brevo SMTP not configured' };

  const transporter = createTransporter(config);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your SRI FABRICS Enquiry: ${data.enquiryNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292929;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e8dec8;">
          
          <tr>
            <td style="background-color: #4a1122; padding: 25px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-family: Georgia, serif; letter-spacing: 0.15em; text-transform: uppercase;">SRI FABRICS</h1>
              <p style="color: #dfb15b; margin: 4px 0 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">Direct Mill Luxury Textiles • Surat</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 15px; font-size: 15px; color: #222;">
                Dear <strong>${data.name}</strong>,
              </p>
              <p style="color: #555; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
                Thank you for your enquiry with <strong>SRI FABRICS</strong>. Your requirement has been registered with reference code:
              </p>

              <div style="background-color: #faf7f2; border: 1px solid #dfb15b; border-radius: 6px; padding: 16px; text-align: center; margin-bottom: 25px;">
                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #786144; margin-bottom: 4px;">Enquiry Reference</span>
                <span style="font-size: 20px; font-family: monospace; font-weight: bold; color: #4a1122; letter-spacing: 0.1em;">${data.enquiryNumber}</span>
              </div>

              <p style="color: #555; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
                Our textile engineering and sampling team in Surat is reviewing your requested specifications (${data.fabricOrCollection || 'Wholesale fabric'}). A dedicated specialist will reach out to you via WhatsApp / Phone shortly with wholesale pricing, shade availability, and dispatch schedules.
              </p>

              <div style="background-color: #faf7f2; border-radius: 6px; padding: 15px; margin-bottom: 25px; font-size: 12px; color: #555;">
                <strong style="color: #4a1122; display: block; margin-bottom: 6px;">Need Instant Mill Assistance?</strong>
                Reach us directly at <a href="tel:+919875198837" style="color: #4a1122; font-weight: bold;">+91 98751 98837</a> or chat directly with our Surat mill desk on WhatsApp.
              </div>

              <table role="presentation" width="100%">
                <tr>
                  <td align="center">
                    <a href="https://wa.me/919875198837?text=Hello%20SRI%20FABRICS%2C%20following%20up%20on%20my%20enquiry%20${encodeURIComponent(data.enquiryNumber)}" 
                       style="display: inline-block; background-color: #25d366; color: white; padding: 12px 24px; border-radius: 4px; font-size: 13px; font-weight: bold; text-decoration: none;">
                      Chat with Mill Desk on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #faf7f2; padding: 20px 30px; text-align: center; border-top: 1px solid #ede4d1; font-size: 11px; color: #888;">
              <p style="margin: 0 0 4px;">SRI FABRICS • Surat Textile Hub, Gujarat, India</p>
              <p style="margin: 0;"><a href="https://srifabrics.com" style="color: #4a1122; text-decoration: none;">srifabrics.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: data.businessEmail,
      subject: `Enquiry Received [${data.enquiryNumber}] – SRI FABRICS Surat`,
      html,
    });
    console.log(`[Brevo SMTP] Customer confirmation sent to ${data.businessEmail}. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Brevo SMTP Error] Failed to send customer confirmation to ${data.businessEmail}:`, error.message || error);
    return { success: false, error: error.message };
  }
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  country?: string | null;
  subject: string;
  message: string;
}

export async function sendContactNotification(data: ContactEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = await getBrevoConfig();
  if (!config.isConfigured) return { success: false, error: 'Brevo SMTP not configured' };

  const transporter = createTransporter(config);

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f8f6f2; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 6px; padding: 25px; border: 1px solid #e0d8c8;">
    <h2 style="color: #4a1122; margin-top: 0;">New Contact Form Message</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
    <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
    <p><strong>Message:</strong></p>
    <div style="background: #faf7f2; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${data.message}</div>
  </div>
</body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: config.adminEmail,
      subject: `[SRI FABRICS Contact] ${data.subject} – from ${data.name}`,
      html,
      replyTo: data.email,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Brevo SMTP Contact Error]:', error.message || error);
    return { success: false, error: error.message };
  }
}

export async function sendNewsletterWelcome(subscriberEmail: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = await getBrevoConfig();
  if (!config.isConfigured) return { success: false, error: 'Brevo SMTP not configured' };

  const transporter = createTransporter(config);

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f8f6f2; padding: 25px;">
  <div style="max-width: 580px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; border: 1px solid #e0d8c8;">
    <h2 style="color: #4a1122; margin-top: 0; font-family: Georgia, serif;">Welcome to SRI FABRICS Surat</h2>
    <p style="color: #555; font-size: 14px; line-height: 1.6;">
      Thank you for subscribing to our mill updates. You will be the first to receive seasonal catalogue previews, fresh digital printing yardage collections, and wholesale textile announcements directly from our Surat looms.
    </p>
    <div style="margin: 25px 0;">
      <a href="https://srifabrics.com/fabrics" style="background: #4a1122; color: #f7eedf; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase;">
        Explore Fabric Yardages
      </a>
    </div>
    <p style="color: #888; font-size: 11px; margin-top: 30px; border-top: 1px solid #eee; pt: 15px;">
      SRI FABRICS • Ring Road Textile Market, Surat, Gujarat • +91 98751 98837
    </p>
  </div>
</body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: subscriberEmail,
      subject: 'Welcome to SRI FABRICS – Direct Mill Textile Updates',
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Brevo SMTP Newsletter Error]:', error.message || error);
    return { success: false, error: error.message };
  }
}

export async function sendTestEmail(recipientEmail?: string): Promise<{ success: boolean; message?: string; details?: any }> {
  const config = await getBrevoConfig();
  const to = recipientEmail || config.adminEmail;

  if (!config.isConfigured) {
    return {
      success: false,
      message: 'Brevo SMTP credentials are not configured. Please set BREVO_SMTP_USER and BREVO_SMTP_KEY in environment variables or via Site Settings.',
      details: { config: { host: config.host, port: config.port, user: config.user, fromEmail: config.fromEmail, adminEmail: config.adminEmail } },
    };
  }

  const transporter = createTransporter(config);

  try {
    // 1. Verify connection
    await transporter.verify();

    // 2. Dispatch test message
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject: `[SRI FABRICS] Brevo SMTP Relay Test - ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #faf7f2; color: #222;">
          <h2 style="color: #4a1122;">Brevo SMTP Relay Successfully Connected!</h2>
          <p>This test email confirms that your Brevo SMTP relay configuration is active and deliverable.</p>
          <ul>
            <li><strong>Host:</strong> ${config.host}</li>
            <li><strong>Port:</strong> ${config.port}</li>
            <li><strong>From Sender:</strong> "${config.fromName}" &lt;${config.fromEmail}&gt;</li>
            <li><strong>Target Recipient:</strong> ${to}</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
          </ul>
          <p style="color: #777; font-size: 12px;">SRI FABRICS • Automated Delivery Diagnostics</p>
        </div>
      `,
    });

    return {
      success: true,
      message: `Test email sent successfully to ${to} via Brevo SMTP relay.`,
      details: { messageId: info.messageId, response: info.response },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'SMTP connection failed',
      details: error,
    };
  }
}

// ==========================================
// BULK PROMOTIONAL CAMPAIGN SENDER
// ==========================================

export interface PromotionalCampaignPayload {
  title: string;
  subject: string;
  preheader?: string;
  senderName?: string;
  senderEmail?: string;
  htmlContent: string;
  recipients: string[];
}

export interface CampaignSendResult {
  total: number;
  delivered: number;
  failed: number;
  successfulRecipients: string[];
  failedRecipients: { email: string; reason: string }[];
  errorLog?: string;
}

export async function sendPromotionalCampaign(payload: PromotionalCampaignPayload): Promise<CampaignSendResult> {
  const config = await getBrevoConfig();

  // Basic RFC email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rawList = Array.isArray(payload.recipients) ? payload.recipients : [];

  // Clean and deduplicate recipient emails
  const uniqueRecipients = Array.from(
    new Set(
      rawList
        .map((e) => (typeof e === 'string' ? e.trim().toLowerCase() : ''))
        .filter((e) => e.length > 0 && emailRegex.test(e))
    )
  );

  if (uniqueRecipients.length === 0) {
    return {
      total: 0,
      delivered: 0,
      failed: 0,
      successfulRecipients: [],
      failedRecipients: [],
      errorLog: 'No valid recipient email addresses provided.',
    };
  }

  const fromName = payload.senderName?.trim() || config.fromName;
  const fromEmail = payload.senderEmail?.trim() || config.fromEmail;

  if (!config.isConfigured) {
    console.warn('[Brevo SMTP] Note: Brevo credentials not configured. Simulating promotional campaign dispatch.');
    return {
      total: uniqueRecipients.length,
      delivered: uniqueRecipients.length,
      failed: 0,
      successfulRecipients: uniqueRecipients,
      failedRecipients: [],
      errorLog: 'Simulated dispatch (Brevo credentials not yet set in environment/settings)',
    };
  }

  const transporter = createTransporter(config);
  const successfulRecipients: string[] = [];
  const failedRecipients: { email: string; reason: string }[] = [];

  // Individual sends with rate-limiting delay ensuring no recipient sees other recipients' addresses
  for (let i = 0; i < uniqueRecipients.length; i++) {
    const recipient = uniqueRecipients[i];
    const unsubUrl = `https://srifabrics.com/unsubscribe?email=${encodeURIComponent(recipient)}`;

    // Inject personalized preheader and unsubscribe link
    let personalizedHtml = payload.htmlContent;
    if (payload.preheader) {
      personalizedHtml = `
        <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
          ${payload.preheader}
        </div>
        ${personalizedHtml}
      `;
    }
    personalizedHtml = personalizedHtml
      .replace(/{{email}}/g, recipient)
      .replace(/{{unsubscribe_url}}/g, unsubUrl);

    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: recipient,
        subject: payload.subject,
        html: personalizedHtml,
      });
      successfulRecipients.push(recipient);
      console.log(`[Brevo Campaign] Dispatched to ${recipient} (${i + 1}/${uniqueRecipients.length})`);
    } catch (err: any) {
      console.error(`[Brevo Campaign Error] Failed sending to ${recipient}:`, err?.message || err);
      failedRecipients.push({ email: recipient, reason: err?.message || 'SMTP delivery failure' });
    }

    // Small delay between sends (100ms) to ensure smooth rate limits
    if (i < uniqueRecipients.length - 1) {
      await new Promise((res) => setTimeout(res, 100));
    }
  }

  return {
    total: uniqueRecipients.length,
    delivered: successfulRecipients.length,
    failed: failedRecipients.length,
    successfulRecipients,
    failedRecipients,
    errorLog: failedRecipients.length > 0 ? failedRecipients.map((f) => `${f.email}: ${f.reason}`).join('; ') : undefined,
  };
}

