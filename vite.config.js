import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* ═══════════════════════════════════════════════════════
   Digitalizen — Vite 6 Production Config
   ─────────────────────────────────────────────────────
   Key strategies:
   • Manual chunk splitting — vendor libs in separate chunks
     (framer-motion, lucide-react, react-router) so the
     app JS chunk stays tiny and re-uses cached vendor JS.
   • Asset fingerprinting for long-lived cache headers.
   • esbuild minification (default) with target ES2022
     for modern Bangladeshi mid-range Android devices.
   • Source maps off in production (smaller deploy).
   • base: '/' for custom domain hosting.
═══════════════════════════════════════════════════════ */
export default defineConfig({
  plugins: [react()],

  /* Root-level index.html stays at project root */
  root: '.',

  /* All source files live in src/ */
  resolve: {
    alias: { '@': '/src' },
  },

  base: '/',

  build: {
    target:    'es2022',
    outDir:    'dist',
    sourcemap: false,
    minify:    'esbuild',

    rollupOptions: {
      output: {
        /* ── Asset file naming — content-hashed for immutable caching ── */
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        /* ── Manual chunk splitting ── */
        manualChunks(id) {
          /* Core React + Router — tiny, rarely changes */
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          /* Animation library — large, cache separately */
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer'
          }
          /* Icons — medium, cache separately */
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          /* Calendly widget — load separately */
          if (id.includes('node_modules/react-calendly')) {
            return 'vendor-calendly'
          }
        },
      },
    },

    /* Warn on chunks > 500 KB */
    chunkSizeWarningLimit: 500,
  },

  /* ── Dev server ── */
  server: {
    port:  5173,
    open:  false,
    cors:  true,
  },

  /* ── Preview (post-build) ── */
  preview: {
    port: 4173,
  },
})
