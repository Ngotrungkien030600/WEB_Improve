import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@legacy': path.resolve(__dirname, '../web-en')
    }
  },
  server: {
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
