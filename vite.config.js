// ============================================================
// vite.config.js — Digitalizen 2026 Production Build
// Optimized for: SSG shell, WebP/AVIF compression, code splitting
// GitHub Pages CI/CD compatible
// ============================================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],

  // ─── Base URL for GitHub Pages ───────────────────────────
  base: '/',

  // ─── Path Aliases ────────────────────────────────────────
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },

  // ─── Dev Server ──────────────────────────────────────────
  server: {
    port: 3000,
    open: true,
    // SPA fallback for BrowserRouter in dev
    historyApiFallback: true,
  },

  // ─── Preview Server ──────────────────────────────────────
  preview: {
    port: 4173,
  },

  // ─── Build Optimizations ─────────────────────────────────
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable in prod to save bytes
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,       // Strip console.log in prod
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
      },
    },

    // ─── Asset inlining threshold (4KB) ──────────────────
    assetsInlineLimit: 4096,

    // ─── Rollup Advanced Chunking ────────────────────────
    rollupOptions: {
      output: {
        // Chunk naming strategy for long-term caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop();
          if (/png|jpe?g|svg|gif|webp|avif|ico/.test(ext)) {
            return 'assets/img/[name]-[hash][extname]';
          }
          if (/woff2?|ttf|eot/.test(ext)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },

        // ── Manual Chunks: vendor splitting for caching ──
        manualChunks: {
          // React core — never changes, long-term cache
          'vendor-react': ['react', 'react-dom'],
          // Router — separate chunk
          'vendor-router': ['react-router-dom'],
          // Animation — heavy, lazy-loadable
          'vendor-motion': ['framer-motion'],
          // Icons
          'vendor-icons': ['lucide-react', 'react-feather'],
          // Calendly widget — only needed on BookCall
          'vendor-calendly': ['react-calendly'],
        },
      },
    },

    // ─── Target modern browsers (Dhaka 4G/5G users) ─────
    // Most users on Chrome Mobile — target ES2020
    target: ['es2020', 'chrome80', 'firefox78', 'safari14'],

    // ─── CSS Code Splitting ───────────────────────────────
    cssCodeSplit: true,

    // ─── Chunk size warning limit ─────────────────────────
    chunkSizeWarningLimit: 600,
  },

  // ─── CSS Preprocessor Config ─────────────────────────────
  css: {
    devSourcemap: true,
  },

  // ─── Dependency Pre-Bundling ──────────────────────────────
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
    ],
    exclude: ['react-calendly'], // Lazy-load only on BookCall page
  },

  // ─── Define Global Constants ──────────────────────────────
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});

// ─────────────────────────────────────────────────────────────────
// POST-BUILD NOTE: After `npm run build`, run this to auto-generate
// sitemap + compress images (add to package.json scripts):
//   "postbuild": "node scripts/generate-sitemap.js"
// ─────────────────────────────────────────────────────────────────
