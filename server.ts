import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/api.ts';
import { generateRobotsTxt, generateSitemapXml } from './src/server/sitemapGenerator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable reverse proxy trust (Render / Cloudflare / Nginx load balancers)
app.set('trust proxy', 1);

// 1. Enterprise GZIP & Deflate Compression (Reduces HTML, JS, CSS payloads by up to 70%)
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  })
);

// 2. Canonical HTTPS & Host Normalization Middleware
// Enforces one single canonical domain (https://www.srifabric.com) across all devices and browsers
app.use((req, res, next) => {
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString().toLowerCase();
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').toString().toLowerCase();
  const isLocal =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('0.0.0.0') ||
    host.includes('run.app'); // Allow dev & staging Cloud Run previews without redirect loop

  if (!isLocal) {
    const isApex = host === 'srifabric.com' || host === 'srifabrics.com';
    const isNonWww = host.startsWith('srifabric.') || host.startsWith('srifabrics.');
    const isHttp = proto === 'http';

    if (isHttp || isApex || isNonWww) {
      return res.redirect(301, `https://www.srifabric.com${req.originalUrl || req.url}`);
    }
  }

  next();
});

// 3. Enterprise Cybersecurity & TLS Headers
app.use((_req, res, next) => {
  // Enforce HSTS for 1 year with includeSubDomains & preload to eliminate SSL protocol downgrade errors
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Mount API router with strict no-cache to safeguard real-time inquiries, leads & admin data
app.use(
  '/api',
  (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  },
  apiRouter
);

// 5. Technical SEO: Serve dynamic robots.txt and sitemap.xml
app.get('/robots.txt', (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.srifabric.com';
  const baseUrl = `${protocol}://${host}`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(generateRobotsTxt(baseUrl));
});

app.get('/sitemap.xml', async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.srifabric.com';
  const baseUrl = `${protocol}://${host}`;
  try {
    const xml = await generateSitemapXml(baseUrl);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err: any) {
    res.status(500).send('<!-- Error generating sitemap -->');
  }
});

// 6. Production High-Speed Static Caching
// Hashed Vite production assets (/assets/*.js, /assets/*.css) are immutable
app.use(
  '/assets',
  express.static(path.join(__dirname, 'dist', 'assets'), {
    maxAge: '365d',
    immutable: true,
  })
);

// Static media and public files with 1-day caching + revalidation
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    },
  })
);

app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    },
  })
);

// SPA Fallback with immediate revalidation for index.html
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const portNumber = Number(PORT) || 3000;
app.listen(portNumber, '0.0.0.0', () => {
  console.log(`SRI Fabrics full-stack server running on http://0.0.0.0:${portNumber}`);
});
