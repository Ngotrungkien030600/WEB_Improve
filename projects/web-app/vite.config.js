import { defineConfig, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import legacyStripExport from './vite-plugin-legacy-strip-export.js';
import { legacyFileToRoute } from './src/utils/legacy-redirect.js';

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function legacyPageRedirect() {
  return {
    name: 'legacy-page-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url.startsWith('/pages/') && url.endsWith('.html')) {
          const route = legacyFileToRoute(url);
          if (route) {
            res.statusCode = 301;
            res.setHeader('Location', route);
            res.end();
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), legacyStripExport(), legacyPageRedirect()],
  resolve: {
    alias: {
      '@legacy': path.resolve(__dirname, '../web-en')
    }
  },
  server: {
    // Alias @legacy trỏ ra ngoài root (../web-en) — không khai báo thì dev server trả 403
    // và mọi trang import @legacy không tải được module. Vite so khớp bằng dấu '/'.
    fs: {
      allow: [toPosix(searchForWorkspaceRoot(process.cwd())), toPosix(path.resolve(__dirname, '..'))],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // No rewrite needed — /api/* goes as-is to backend
      },
      '/pages': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (reqPath) => reqPath,
      }
    }
    // NOTE: server.host intentionally NOT set — dev server listens localhost only (NFR2)
  }
});
