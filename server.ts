import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount full API router
app.use('/api', apiRouter);

// Serve static assets from public and dist in production with cache headers
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));
app.use(express.static(path.join(__dirname, 'dist'), { maxAge: '1d' }));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const portNumber = Number(PORT) || 3000;
app.listen(portNumber, '0.0.0.0', () => {
  console.log(`SRI Fabrics full-stack server running on http://0.0.0.0:${portNumber}`);
});
