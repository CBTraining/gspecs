import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const buildVersion = Date.now().toString();

const versionPlugin = () => ({
  name: 'generate-version-json',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && (req.url.startsWith('/version.json') || req.url.startsWith('/gspecs/version.json'))) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.end(JSON.stringify({ version: buildVersion, buildTime: new Date().toISOString() }, null, 2));
        return;
      }
      next();
    });
  },
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: JSON.stringify({ version: buildVersion, buildTime: new Date().toISOString() }, null, 2)
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion)
  },
  base: process.env.GITHUB_PAGES ? '/gspecs/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/papaparse/')) {
            return 'vendor-csv';
          }
        }
      }
    }
  }
})

