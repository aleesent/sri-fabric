import nodemailer from 'nodemailer';
import { db, isDatabaseConfigured } from '../db/index.ts';
import { siteSettings } from '../db/schema.ts';

export interface BrevoConfig {
  host: string;
  port: number;
  user: string;
  key: string;
  apiKey: string;
  fromEmail: string;
  fromName: string;
  adminEmail: string;
  isConfigured: boolean;
  hasApiKey: boolean;
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

  // 1. Brevo HTTPS API Key (Recommended for Render & Cloud PaaS where outbound SMTP ports 25/465/587 are blocked)
  const apiKey = (
    process.env.BREVO_API_KEY ||
    process.env.BREVO_KEY ||
    process.env.SENDINBLUE_API_KEY ||
    cachedDbSettings?.brevo_api_key ||
    ''
  ).trim();

  // 2. Brevo SMTP Host (Default: smtp-relay.brevo.com)
  const host =
    process.env.BREVO_SMTP_HOST ||
    process.env.SMTP_HOST ||
    cachedDbSettings?.brevo_smtp_host ||
    'smtp-relay.brevo.com';

  // 3. Port (Brevo supports 587, 2525, and 465. 2525 is Brevo's official cloud alternative port)
  const port = Number(
    process.env.BREVO_SMTP_PORT ||
    process.env.SMTP_PORT ||
    cachedDbSettings?.brevo_smtp_port ||
    587
  );

  // 4. SMTP User Login
  const user = (
    process.env.BREVO_SMTP_USER ||
    process.env.BREVO_USER ||
    process.env.BREVO_EMAIL ||
    process.env.SMTP_USER ||
    cachedDbSettings?.brevo_smtp_user ||
    ''
  ).trim();

  // 5. SMTP Key / Password (starts with xsmtpsib- or regular password)
  const smtpKey = (
    process.env.BREVO_SMTP_KEY ||
    process.env.BREVO_SMTP_PASSWORD ||
    process.env.BREVO_PASSWORD ||
    process.env.SMTP_PASSWORD ||
    process.env.SMTP_KEY ||
    cachedDbSettings?.brevo_smtp_key ||
    ''
  ).trim();

  const effectiveKey = apiKey || smtpKey;

  // 6. Verified Sender Email
  const fromEmail = (
    process.env.BREVO_FROM_EMAIL ||
    process.env.FROM_EMAIL ||
    cachedDbSettings?.brevo_from_email ||
    (user && user.includes('@') ? user : 'inquiry@srifabric.com')
  ).trim();

  // 7. Brand From Name
  const fromName = (
    process.env.BREVO_FROM_NAME ||
    process.env.FROM_NAME ||
    cachedDbSettings?.brevo_from_name ||
    'SRI FABRICS Surat'
  ).trim();

  // 8. Admin Notification Recipient Email
  const adminEmail = (
    process.env.BREVO_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    cachedDbSettings?.brevo_admin_email ||
    'as4820000@gmail.com'
  ).trim();

  const hasApiKey = Boolean(apiKey || (smtpKey && smtpKey.startsWith('xkeysib-')));
  const isConfigured = Boolean(apiKey || smtpKey || (user && smtpKey));

  return {
    host,
    port,
    user,
    key: effectiveKey,
    apiKey: apiKey || (smtpKey.startsWith('xkeysib-') ? smtpKey : ''),
    fromEmail,
    fromName,
    adminEmail,
    isConfigured,
    hasApiKey,
  };
}

// Helper to create Nodemailer transport with cloud timeout & SSL flexibility
export function createTransporter(config: BrevoConfig, customPort?: number) {
  const selectedPort = customPort || config.port;
  return nodemailer.createTransport({
    host: config.host,
    port: selectedPort,
    secure: selectedPort === 465,
    auth: {
      user: config.user,
      pass: config.key,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
  });
}

export interface DispatchEmailOptions {
  to: string | { email: string; name?: string }[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
}

export interface DispatchEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  method?: string;
  diagnostic?: any;
}

/**
 * Universal Dual-Pipeline Mail Dispatcher:
 * 1. Tries Brevo v3 HTTPS REST API (port 443) first.
 *    -> Never blocked by Render, Cloud Run, or any PaaS host firewall.
 * 2. Falls back automatically to Brevo SMTP Relay.
 *    -> Tries Port 587; if firewalled/timed out, tries Brevo's cloud alternative Port 2525 and Port 465.
 */
export async function dispatchEmail(options: DispatchEmailOptions): Promise<DispatchEmailResult> {
  const config = await getBrevoConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      error: 'Brevo credentials not configured. Please set BREVO_API_KEY or BREVO_SMTP_KEY in environment variables or Site Settings.',
    };
  }

  const recipients = Array.isArray(options.to)
    ? options.to
    : [{ email: options.to.trim(), name: options.to.trim() }];

  const effectiveFromName = options.fromName?.trim() || config.fromName;
  const effectiveFromEmail = options.fromEmail?.trim() || config.fromEmail;
  const apiKeyCandidate = config.apiKey || config.key;

  // -------------------------------------------------------------
  // STRATEGY 1: Brevo v3 HTTPS REST API (Port 443 - Render Safe)
  // -------------------------------------------------------------
  if (apiKeyCandidate) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'api-key': apiKeyCandidate,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: effectiveFromName, email: effectiveFromEmail },
          to: recipients.map((r) => ({ email: r.email, name: r.name || r.email })),
          subject: options.subject,
          htmlContent: options.html,
          ...(options.text ? { textContent: options.text } : {}),
          ...(options.replyTo ? { replyTo: { email: options.replyTo } } : {}),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.messageId) {
        return {
          success: true,
          messageId: data.messageId,
          method: 'Brevo HTTPS REST API (Render Safe)',
        };
      }

      // If Brevo API returned 400 (e.g. sender email unverified), capture actionable error
      if (response.status === 400) {
        const errorMsg = data.message || data.code || 'Sender email not authorized in Brevo';
        console.warn(`[Brevo API 400]: ${errorMsg}`);
        // If sender verification error, don't fail silently
        if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('sender')) {
          return {
            success: false,
            error: `Brevo Sender Error: ${errorMsg}. Please ensure '${effectiveFromEmail}' is an authorized sender in your Brevo Dashboard > Senders & IP.`,
            diagnostic: data,
          };
        }
      }

      // If status 401, the key might be purely an SMTP key (xsmtpsib-...) rather than an API key
      console.warn(`[Brevo REST API]: HTTP ${response.status} (${JSON.stringify(data)}). Falling back to direct SMTP relay...`);
    } catch (httpErr: any) {
      console.warn(`[Brevo REST API Network Note]: ${httpErr?.message || httpErr}. Falling back to direct SMTP relay...`);
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 2: Multi-Port SMTP Relay (Ports 587, 2525, 465)
  // -------------------------------------------------------------
  if (!config.user || !config.key) {
    return {
      success: false,
      error: 'Brevo SMTP login credentials (BREVO_SMTP_USER and BREVO_SMTP_KEY) or Brevo API Key (BREVO_API_KEY) are required.',
    };
  }

  // Try configured port first, then Brevo cloud port 2525, then 465
  const portsToAttempt = Array.from(new Set([config.port, 2525, 465, 587]));
  let lastSmtpError: any = null;

  for (const port of portsToAttempt) {
    try {
      const transporter = createTransporter(config, port);
      const toAddresses = recipients.map((r) => (r.name ? `"${r.name}" <${r.email}>` : r.email)).join(', ');

      const info = await transporter.sendMail({
        from: `"${effectiveFromName}" <${effectiveFromEmail}>`,
        to: toAddresses,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      });

      return {
        success: true,
        messageId: info.messageId,
        method: `Brevo SMTP Relay (Port ${port})`,
        diagnostic: { response: info.response, port },
      };
    } catch (err: any) {
      lastSmtpError = err;
      const isConnectionIssue =
        err?.code === 'ETIMEDOUT' ||
        err?.code === 'ECONNREFUSED' ||
        err?.code === 'ESOCKETTIMEDOUT' ||
        err?.code === 'EHOSTUNREACH' ||
        err?.message?.includes('timeout') ||
        err?.message?.includes('Connection closed');

      console.warn(`[Brevo SMTP Port ${port} Failed]: ${err?.message || err}`);

      // If it wasn't a connection/firewall issue (e.g. auth rejected), no need to try other ports
      if (!isConnectionIssue) {
        break;
      }
    }
  }

  const isRenderFirewallError =
    lastSmtpError?.code === 'ETIMEDOUT' ||
    lastSmtpError?.code === 'ECONNREFUSED' ||
    lastSmtpError?.message?.includes('timeout') ||
    lastSmtpError?.message?.includes('Connection closed');

  const errorMessage = isRenderFirewallError
    ? `Mailing blocked by host firewall: Outbound SMTP ports (587, 2525, 465) timed out on Render. Solution: Add your Brevo API Key (starts with xkeysib-...) in Admin Settings > Site Settings or Render Environment Variables (BREVO_API_KEY). Brevo HTTPS REST API operates over port 443 and bypasses cloud firewall restrictions completely.`
    : (lastSmtpError?.message || 'SMTP delivery failure');

  return {
    success: false,
    error: errorMessage,
    diagnostic: lastSmtpError,
  };
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
    console.warn(`[Brevo] Skipped admin email notification: Brevo credentials not set. Enquiry ${data.enquiryNumber} recorded in database.`);
    return { success: false, error: 'Brevo credentials not configured' };
  }

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
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">SRI FABRIC</h1>
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
                A new B2B buyer requirement has been submitted on <strong>www.srifabric.com</strong>.
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
                    <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(data.name)}%2C%20thank%20you%20for%20your%20enquiry%20${encodeURIComponent(data.enquiryNumber)}%20with%20SRI%20FABRIC%20Surat." 
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
              <p style="margin: 0 0 4px;">SRI FABRIC • Ring Road Textile Market, Surat, Gujarat • +91 98751 98837</p>
              <p style="margin: 0; color: #aaa;">This notification was dispatched via Brevo Engine.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const result = await dispatchEmail({
    to: config.adminEmail,
    subject: `[SRI FABRIC] New B2B Enquiry: ${data.enquiryNumber} - ${data.name} (${data.companyName || 'Wholesale Buyer'})`,
    html,
    replyTo: data.businessEmail,
  });

  if (result.success) {
    console.log(`[Brevo Engine] Admin notification sent for ${data.enquiryNumber} via ${result.method}. MessageID: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } else {
    console.error(`[Brevo Engine Error] Failed to send admin notification for ${data.enquiryNumber}:`, result.error);
    return { success: false, error: result.error };
  }
}

export async function sendEnquiryCustomerConfirmation(data: EnquiryEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!data.businessEmail || !data.businessEmail.includes('@') || data.businessEmail.endsWith('@srifabrics.com') || data.businessEmail.endsWith('@srifabric.com')) {
    return { success: false, error: 'No customer email provided' };
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your SRI FABRIC Enquiry: ${data.enquiryNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #292929;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f4ee; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e8dec8;">
          
          <tr>
            <td style="background-color: #4a1122; padding: 25px 30px; text-align: center; border-bottom: 3px solid #dfb15b;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-family: Georgia, serif; letter-spacing: 0.15em; text-transform: uppercase;">SRI FABRIC</h1>
              <p style="color: #dfb15b; margin: 4px 0 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">Direct Mill Luxury Textiles • Surat</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 15px; font-size: 15px; color: #222;">
                Dear <strong>${data.name}</strong>,
              </p>
              <p style="color: #555; font-size: 13px; line-height: 1.6; margin: 0 0 20px;">
                Thank you for your enquiry with <strong>SRI FABRIC</strong>. Your requirement has been registered with reference code:
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
                    <a href="https://wa.me/919875198837?text=Hello%20SRI%20FABRIC%2C%20following%20up%20on%20my%20enquiry%20${encodeURIComponent(data.enquiryNumber)}" 
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
              <p style="margin: 0 0 4px;">SRI FABRIC • Surat Textile Hub, Gujarat, India</p>
              <p style="margin: 0;"><a href="https://www.srifabric.com" style="color: #4a1122; text-decoration: none;">www.srifabric.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const result = await dispatchEmail({
    to: data.businessEmail,
    subject: `Enquiry Received [${data.enquiryNumber}] – SRI FABRIC Surat`,
    html,
  });

  return result;
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

  const result = await dispatchEmail({
    to: config.adminEmail,
    subject: `[SRI FABRIC Contact] ${data.subject} – from ${data.name}`,
    html,
    replyTo: data.email,
  });

  return result;
}

export async function sendNewsletterWelcome(subscriberEmail: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f8f6f2; padding: 25px;">
  <div style="max-width: 580px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; border: 1px solid #e0d8c8;">
    <h2 style="color: #4a1122; margin-top: 0; font-family: Georgia, serif;">Welcome to SRI FABRIC Surat</h2>
    <p style="color: #555; font-size: 14px; line-height: 1.6;">
      Thank you for subscribing to our mill updates. You will be the first to receive seasonal catalogue previews, fresh digital printing yardage collections, and wholesale textile announcements directly from our Surat looms.
    </p>
    <div style="margin: 25px 0;">
      <a href="https://www.srifabric.com/fabrics" style="background: #4a1122; color: #f7eedf; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; display: inline-block;">
        Explore Fabric Yardages
      </a>
    </div>
    <p style="color: #888; font-size: 11px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
      SRI FABRIC • Ring Road Textile Market, Surat, Gujarat • +91 98751 98837 • <a href="https://www.srifabric.com" style="color: #4a1122;">www.srifabric.com</a>
    </p>
  </div>
</body>
</html>
`;

  const result = await dispatchEmail({
    to: subscriberEmail,
    subject: `Welcome to SRI FABRIC Surat – Direct Mill Textiles & Wholesale Yardages`,
    html,
  });

  return result;
}

export async function sendTestEmail(recipientEmail?: string): Promise<{ success: boolean; message?: string; details?: any }> {
  const config = await getBrevoConfig();
  const to = recipientEmail || config.adminEmail;

  if (!config.isConfigured) {
    return {
      success: false,
      message: 'Brevo credentials are not configured. Please set BREVO_API_KEY (recommended for Render: xkeysib-...) or BREVO_SMTP_KEY in environment variables or Site Settings.',
      details: {
        config: {
          host: config.host,
          port: config.port,
          hasApiKey: config.hasApiKey,
          fromEmail: config.fromEmail,
          adminEmail: config.adminEmail,
        },
      },
    };
  }

  const testHtml = `
    <div style="font-family: sans-serif; padding: 25px; background: #faf7f2; color: #222; border-radius: 8px; border: 1px solid #e0d8c8;">
      <h2 style="color: #4a1122; margin-top: 0;">Brevo Delivery Engine Successfully Connected!</h2>
      <p>This test email confirms that your Brevo integration is active, deliverable, and operational.</p>
      <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd; margin: 15px 0;">
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8;">
          <li><strong>From Sender:</strong> "${config.fromName}" &lt;${config.fromEmail}&gt;</li>
          <li><strong>Recipient:</strong> ${to}</li>
          <li><strong>Brevo API Key Active:</strong> ${config.hasApiKey ? 'YES (Bypasses Render firewall blocks via port 443 HTTPS)' : 'NO (Using SMTP relay fallback)'}</li>
          <li><strong>Host &amp; Port:</strong> ${config.host}:${config.port}</li>
          <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
        </ul>
      </div>
      <p style="color: #777; font-size: 12px; margin-bottom: 0;">SRI FABRIC Surat • Automated Delivery Diagnostics</p>
    </div>
  `;

  const result = await dispatchEmail({
    to,
    subject: `[SRI FABRIC] Brevo Delivery Test - ${new Date().toLocaleTimeString()}`,
    html: testHtml,
  });

  if (result.success) {
    return {
      success: true,
      message: `Test email sent successfully to ${to} via ${result.method}.`,
      details: result,
    };
  } else {
    return {
      success: false,
      message: result.error || 'Failed to dispatch test email',
      details: result.diagnostic,
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
    console.warn('[Brevo] Note: Brevo credentials not configured. Simulating promotional campaign dispatch.');
    return {
      total: uniqueRecipients.length,
      delivered: uniqueRecipients.length,
      failed: 0,
      successfulRecipients: uniqueRecipients,
      failedRecipients: [],
      errorLog: 'Simulated dispatch (Brevo credentials not yet set in environment/settings)',
    };
  }

  const successfulRecipients: string[] = [];
  const failedRecipients: { email: string; reason: string }[] = [];

  // Individual sends with rate-limiting delay ensuring no recipient sees other recipients' addresses
  for (let i = 0; i < uniqueRecipients.length; i++) {
    const recipient = uniqueRecipients[i];
    const unsubUrl = `https://www.srifabric.com/unsubscribe?email=${encodeURIComponent(recipient)}`;

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
      const result = await dispatchEmail({
        to: recipient,
        subject: payload.subject,
        html: personalizedHtml,
        fromName,
        fromEmail,
      });

      if (result.success) {
        successfulRecipients.push(recipient);
        console.log(`[Brevo Campaign] Dispatched to ${recipient} (${i + 1}/${uniqueRecipients.length}) via ${result.method}`);
      } else {
        throw new Error(result.error || 'Delivery failed');
      }
    } catch (err: any) {
      console.error(`[Brevo Campaign Error] Failed sending to ${recipient}:`, err?.message || err);
      failedRecipients.push({ email: recipient, reason: err?.message || 'Delivery failure' });
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
