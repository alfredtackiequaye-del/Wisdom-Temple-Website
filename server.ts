import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  const app = express();
  // App must always run on port 3000 as control plane and nginx proxy to 3000
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    // Handle /admin and /admin/*
    app.get(['/admin', '/admin/*', '/admin/index.html'], (_req, res) => {
      const adminPath = path.resolve(distPath, 'admin/index.html');
      res.sendFile(adminPath, (err) => {
        if (err) {
          res.sendFile(path.resolve(distPath, 'index.html'));
        }
      });
    });

    // Fallback all other routes to index.html
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wisdom Temple server running on http://0.0.0.0:${PORT} [${isProd ? 'production' : 'development'}]`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
