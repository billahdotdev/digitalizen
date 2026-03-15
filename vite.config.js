import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* ═══════════════════════════════════════════════════════════
   Digitalizen — Vite 6 Config  (2026)
   ───────────────────────────────────────────────────────────
   Folder layout:
     index.html              ← Vite entry point (project root)
     src/
       main.jsx              ← React root
       App.jsx / App.css
       index.css             ← global tokens + resets
       lib/analytics.js      ← tracking utility
       seo/SEO.jsx           ← structured data + meta
       components/           ← 15 section components (jsx + css)
     public/                 ← copied verbatim to dist/ root
     api/                    ← Cloudflare Workers (not bundled)

   Perf:
   • React.lazy() + Suspense in App.jsx → split below-fold JS
   • manualChunks → vendor JS cached independently
   • ES2022 target → no legacy polyfills, modern BD Android
   • No source maps in prod → smaller deploy
   • cssCodeSplit: true → per-component CSS lazy-loads with JS
═══════════════════════════════════════════════════════════ */

export default defineConfig({
  plugins: [react()],

  root:      '.',
  publicDir: 'public',

  resolve: {
    alias: { '@': '/src' },
  },

  base: '/',

  build: {
    target:       'es2022',
    outDir:       'dist',
    sourcemap:    false,
    minify:       'esbuild',
    cssCodeSplit: true,       // ← lazy CSS loads with its lazy JS chunk

    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        manualChunks(id) {
          /* ── Vendor: React core — cached for months ── */
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router')
          ) return 'vendor-react'

          /* ── Vendor: icons — tree-shaken but still isolated ── */
          if (id.includes('node_modules/lucide-react'))
            return 'vendor-icons'

          /* ── Vendor: Calendly widget — heavy, load only in BookCall ── */
          if (id.includes('node_modules/react-calendly'))
            return 'vendor-calendly'

          /*
           * Group above-fold critical sections into one chunk
           * so the first paint depends on FEWER sequential fetches.
           * Finder + Footer are the most important below-fold items.
           */
          if (
            id.includes('/components/Finder') ||
            id.includes('/components/Footer')
          ) return 'chunk-priority'

          /*
           * Group middle sections — loaded after first paint
           */
          if (
            id.includes('/components/Packages') ||
            id.includes('/components/Process') ||
            id.includes('/components/About')
          ) return 'chunk-mid'

          /*
           * Group lower sections — loaded last
           */
          if (
            id.includes('/components/BookCall') ||
            id.includes('/components/Resources') ||
            id.includes('/components/Faq') ||
            id.includes('/components/Contact') ||
            id.includes('/components/Gallery')
          ) return 'chunk-lower'
        },
      },
    },

    chunkSizeWarningLimit: 500,
  },

  server:  { port: 5173, open: false, cors: true },
  preview: { port: 4173 },
})
