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
    target:    'es2022',
    outDir:    'dist',
    sourcemap: false,
    minify:    'esbuild',

    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',

        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router')
          ) return 'vendor-react'

          if (id.includes('node_modules/lucide-react'))
            return 'vendor-icons'

          if (id.includes('node_modules/react-calendly'))
            return 'vendor-calendly'
        },
      },
    },

    chunkSizeWarningLimit: 500,
  },

  server:  { port: 5173, open: false, cors: true },
  preview: { port: 4173 },
})
