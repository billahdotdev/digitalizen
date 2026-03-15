# Digitalizen — Production SPA

> **Performance Marketing Agency Website**
> Stack: Vite 6 · React 19 · Pure CSS · React Router v7 (BrowserRouter) · Service Worker
> Domain: [digitalizen.billah.dev](https://digitalizen.billah.dev)
> Author: [Masum Billah](https://billah.dev) · [@billahdotdev](https://x.com/billahdotdev)

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Quick Start](#2-quick-start)
3. [First-time Setup Checklist](#3-first-time-setup-checklist)
4. [Adding a New Route](#4-adding-a-new-route-page-with-its-own-url)
5. [Adding a New Section](#5-adding-a-new-section-on-the-home-page)
6. [SEO — Adding Meta for a New Route](#6-seo--adding-meta-for-a-new-route)
7. [Sitemap — Registering a New URL](#7-sitemap--registering-a-new-url)
8. [Analytics — Tracking Events](#8-analytics--tracking-events)
9. [Nav — Adding Links](#9-nav--adding-links)
10. [Build and Deploy](#10-build-and-deploy)
11. [GitHub Actions CI/CD](#11-github-actions-cicd)
12. [Cloudflare Workers — CAPI Setup](#12-cloudflare-workers--capi-setup)
13. [Required Images Checklist](#13-required-images-checklist)
14. [Tech Decisions and 2026 Best Practices](#14-tech-decisions-and-2026-best-practices)

---

## 1. Project Structure

```
digitalizen/
├── index.html                    ← Vite entry (must stay at root)
├── vite.config.js                ← Chunk splitting, aliases, publicDir
├── package.json                  ← React 19, Vite 6, React Router v7
├── eslint.config.js              ← ESLint v9 flat config
├── wrangler.toml                 ← Cloudflare Workers deployment
├── .gitignore
├── .nvmrc                        ← Node 22 LTS
├── .env.example                  ← Copy to .env.local and fill secrets
│
├── public/                       ← Copied verbatim to dist/ at build time
│   ├── _headers                  ← Security + cache headers (CF Pages / Netlify)
│   ├── _redirects                ← SPA fallback (CF Pages / Netlify)
│   ├── 404.html                  ← GitHub Pages SPA redirect script
│   ├── offline.html              ← Service Worker offline fallback
│   ├── favicon.svg
│   ├── robots.txt                ← SEO + AI crawler rules
│   ├── sitemap.xml               ← All public URLs with hreflang
│   ├── llms.txt                  ← AI entity data (ChatGPT, Claude, Perplexity)
│   ├── humans.txt                ← E-E-A-T credits
│   ├── sw.js                     ← Service Worker (Cache-First)
│   └── IMAGES-REQUIRED.md        ← Images to add before going live
│
├── src/
│   ├── main.jsx                  ← React 19 createRoot entry
│   ├── App.jsx                   ← BrowserRouter + Routes + ErrorBoundary
│   ├── App.css                   ← App shell styles
│   ├── index.css                 ← Global design tokens + resets
│   ├── lib/
│   │   └── analytics.js          ← Unified: Meta Pixel + TikTok + GTM
│   ├── seo/
│   │   └── SEO.jsx               ← Per-route meta + JSON-LD injection
│   └── components/               ← 15 components, each .jsx + .css
│       ├── Nav           Hero     Finder      Packages     Process
│       ├── About         BookCall Resources   Faq          Contact
│       ├── Gallery       Footer   FreeResources FreeGift   Access
│
├── api/
│   ├── capi.js                   ← Meta CAPI Cloudflare Worker
│   └── tt-capi.js                ← TikTok CAPI Cloudflare Worker
│
└── .github/workflows/
    ├── deploy-github-pages.yml   ← Lint → Build → SEO check → Deploy
    └── deploy-workers.yml        ← Deploy CAPI Workers on api/ changes
```

---

## 2. Quick Start

```bash
cd digitalizen
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # http://localhost:4173
npm run lint
```

---

## 3. First-time Setup Checklist

- [ ] Replace `GTM-XXXXXXX` in `index.html` (2 places: script tag + noscript iframe)
- [ ] Replace `XXXXXXXXXXXXXXXXXX` Meta Pixel ID in `index.html` (fbq init + noscript img)
- [ ] Replace `XXXXXXXXXXXXXXXXXX` TikTok Pixel ID in `index.html` (ttq.load)
- [ ] Update `WA_NUMBER` in `src/lib/analytics.js` if phone number changes
- [ ] Update `SITE.url` in `src/seo/SEO.jsx` if domain changes
- [ ] Add `public/og-image.jpg` (1200x630px) — social share image
- [ ] Add `public/apple-touch-icon.png` (180x180px) — iPhone bookmark icon
- [ ] Enable GitHub Pages (see section 11)
- [ ] Set Cloudflare Worker secrets (see section 12)

---

## 4. Adding a New Route (Page with its own URL)

**4 steps. Do not skip steps 3 and 4.**

### Step 1 — Create the files

```bash
touch src/components/Pricing.jsx
touch src/components/Pricing.css
```

Minimal component template:

```jsx
// src/components/Pricing.jsx
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Pricing.css'
import SEO from '../seo/SEO'
import { track, pushEngagement } from '../lib/analytics.js'

export default function Pricing() {
  const enterTimeRef = useRef(null)

  useEffect(() => {
    window.__removeLoader?.()
    enterTimeRef.current = Date.now()
    track('ViewContent', { content_name: 'Pricing Page', content_category: 'Page' })

    const push  = () => pushEngagement('pricing', enterTimeRef)
    const onVis = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', push)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', push)
    }
  }, [])

  return (
    <div className="pricing-page">
      <SEO page="pricing" />
      <div className="pricing-topbar">
        <Link to="/" className="pricing-back">← ফিরে যান</Link>
      </div>
      <main id="main-content" className="container">
        <h1>Pricing</h1>
      </main>
    </div>
  )
}
```

### Step 2 — Register in App.jsx

```jsx
// Add lazy import (top of file, with other lazy imports):
const Pricing = lazy(() => import('./components/Pricing'))

// Add route inside <Routes>:
<Route path="/pricing" element={<Suspense fallback={null}><Pricing /></Suspense>} />
```

Always wrap new routes in `<Suspense fallback={null}>`.

### Step 3 — Add SEO config in src/seo/SEO.jsx

Without this: Google shows homepage title on your new page.

Open `src/seo/SEO.jsx`, find `PAGE_DEFAULTS`, add:

```jsx
pricing: {
  title:         'Pricing — Digitalizen Digital Marketing Bangladesh',
  description:   'Transparent pricing for Meta Ads, Google Ads, SEO in Bangladesh.',
  keywords:      'digital marketing pricing Bangladesh, Meta Ads cost BD',
  titleBn:       'প্রাইসিং — ডিজিটালাইজেন',
  descriptionBn: 'মেটা অ্যাডস, গুগল অ্যাডস, SEO-এর স্বচ্ছ মূল্য।',
  keywordsBn:    'ডিজিটাল মার্কেটিং মূল্য বাংলাদেশ',
  schemaType:    'webpage',
  breadcrumbs: [
    { name: 'Home',    item: 'https://digitalizen.billah.dev/'        },
    { name: 'Pricing', item: 'https://digitalizen.billah.dev/pricing' },
  ],
  speakableSelectors: ['h1', 'h2'],
  // noindex: true    ← uncomment to hide from Google (e.g. /access)
},
```

schemaType values:
- `'webpage'`    — standard page
- `'collection'` — listing/gallery page
- `'home'`       — homepage only

### Step 4 — Add to public/sitemap.xml

Without this: Google takes days or weeks to discover the new page.

Add before `</urlset>`:

```xml
<url>
  <loc>https://digitalizen.billah.dev/pricing</loc>
  <lastmod>2026-03-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  <xhtml:link rel="alternate" hreflang="en"        href="https://digitalizen.billah.dev/pricing" />
  <xhtml:link rel="alternate" hreflang="bn-BD"     href="https://digitalizen.billah.dev/pricing" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://digitalizen.billah.dev/pricing" />
</url>
```

Priority guide: `1.0` homepage · `0.8` high-value · `0.7` standard · never add noindex pages.

---

## 5. Adding a New Section (on the Home Page)

A section renders inside MainLayout — it scrolls on the homepage, not a separate URL.

### Step 1 — Create files

```bash
touch src/components/MySection.jsx
touch src/components/MySection.css
```

### Step 2 — Minimal component

```jsx
import { useEffect, useRef, useState } from 'react'
import './MySection.css'
import { track, pushEngagement } from '../lib/analytics.js'

export default function MySection() {
  const sectionRef   = useRef(null)
  const enterTimeRef = useRef(null)
  const firedRef     = useRef(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current = true
        enterTimeRef.current = Date.now()
        setEntered(true)
        track('ViewContent', { content_name: 'My Section', content_category: 'Section' })
        io.unobserve(el)
      }
    }, { threshold: 0.2 })
    io.observe(el)
    const push  = () => pushEngagement('my-section', enterTimeRef)
    const onVis = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', push)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', push)
    }
  }, [])

  return (
    <section
      id="my-section"
      className={`my-section${entered ? ' my-section--entered' : ''}`}
      ref={sectionRef}
    >
      <div className="container">
        <div className="row-header">
          <span className="section-num">০১০</span>
          <span className="section-title-right">নতুন সেকশন</span>
        </div>
        <h2>Heading</h2>
      </div>
    </section>
  )
}
```

### Step 3 — Add to App.jsx MainLayout

```jsx
// Lazy import:
const MySection = lazy(() => import('./components/MySection'))

// Inside MainLayout <main>:
<Suspense fallback={null}>
  <Finder />
  <Packages />
  <MySection />   {/* add in order you want it */}
  ...
</Suspense>
```

### Step 4 — Nav scroll link (optional)

```jsx
// In src/components/Nav.jsx navLinks array:
{ label: 'নতুন সেকশন', id: 'my-section' }  // id must match section id=""
```

---

## 6. SEO — Adding Meta for a New Route

Open `src/seo/SEO.jsx` → `PAGE_DEFAULTS` → add entry:

```jsx
'page-key': {
  title:         'English Title — Digitalizen Bangladesh',
  description:   'English meta description. 150-160 characters.',
  keywords:      'keyword1 Bangladesh, keyword2 Dhaka',
  titleBn:       'বাংলা শিরোনাম',
  descriptionBn: 'বাংলা বিবরণ।',
  keywordsBn:    'বাংলা কীওয়ার্ড',
  schemaType:    'webpage',
  breadcrumbs: [
    { name: 'Home',     item: 'https://digitalizen.billah.dev/'          },
    { name: 'pageName', item: 'https://digitalizen.billah.dev/page-path' },
  ],
  speakableSelectors: ['h1', 'h2'],
},
```

Use in the component:

```jsx
import SEO from '../seo/SEO'
// Inside return:
<SEO page="page-key" />
```

---

## 7. Sitemap — Registering a New URL

Add to `public/sitemap.xml` before `</urlset>`:

```xml
<url>
  <loc>https://digitalizen.billah.dev/your-page</loc>
  <lastmod>2026-03-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  <xhtml:link rel="alternate" hreflang="en"        href="https://digitalizen.billah.dev/your-page" />
  <xhtml:link rel="alternate" hreflang="bn-BD"     href="https://digitalizen.billah.dev/your-page" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://digitalizen.billah.dev/your-page" />
</url>
```

Rules:
- Update `lastmod` when you change a page
- Never add noindex pages (e.g. /access is excluded)
- Always include all three xhtml:link alternates

After deploying, submit to Google Search Console:
`https://digitalizen.billah.dev/sitemap.xml`

---

## 8. Analytics — Tracking Events

```jsx
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'

// Section enters viewport:
track('ViewContent', { content_name: 'Section', content_category: 'Section' })

// CTA click:
track('InitiateCheckout', { content_name: 'CTA', content_category: 'CTA', currency: 'BDT', value: 0 })

// Form submit:
track('Lead', { content_name: 'Form', content_category: 'Form', currency: 'BDT', value: 0 })

// WhatsApp click:
track('Contact', { content_name: 'WhatsApp', content_category: 'Contact' })
window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('message')}`, '_blank')

// Time-on-section:
const enterTimeRef = useRef(null)
enterTimeRef.current = Date.now()           // on enter
pushEngagement('section-name', enterTimeRef) // on leave
```

`track()` fires Meta Pixel + TikTok Pixel + GTM dataLayer in one call.
Shared `event_id` enables CAPI deduplication — no double-counting.

---

## 9. Nav — Adding Links

### Scroll link (home page section)

```jsx
// src/components/Nav.jsx — navLinks array:
{ label: 'নতুন সেকশন', id: 'my-section' }  // must match section id=""
```

### Router link (separate URL)

```jsx
import { Link } from 'react-router-dom'

// Inside Nav drawer JSX:
<Link to="/pricing" className="nav__drawer-link" onClick={() => setOpen(false)} role="menuitem">
  প্রাইসিং
</Link>
```

---

## 10. Build and Deploy

```bash
npm run build   # → dist/
```

### GitHub Pages (via CI/CD — recommended)
Push to main. See section 11.

### Cloudflare Pages
```bash
npx wrangler pages deploy dist --project-name=digitalizen
# Or connect GitHub repo in Cloudflare dashboard
# Build command: npm run build | Output: dist
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Nginx (VPS)
```nginx
location / { try_files $uri $uri/ /index.html; }
location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
```

---

## 11. GitHub Actions CI/CD

### Pipeline

```
git push origin main
  ├─► deploy-github-pages.yml
  │     ├─ npm ci
  │     ├─ npm run lint          (blocks on error)
  │     ├─ npm run build
  │     ├─ SEO checks            (robots.txt, sitemap, JSON-LD, CSP, llms.txt)
  │     ├─ echo domain > dist/CNAME
  │     └─ deploy → GitHub Pages
  │
  └─► deploy-workers.yml (only if api/ changed)
        ├─ wrangler deploy api/capi.js
        ├─ wrangler deploy api/tt-capi.js
        ├─ sleep 8
        └─ smoke tests
```

### One-time Setup

**Step 1** — Enable Pages source:
`Repo → Settings → Pages → Source: "GitHub Actions"`

**Step 2** — Custom domain + DNS:
```
Settings → Pages → Custom domain → digitalizen.billah.dev

DNS (Cloudflare — DNS Only, grey cloud):
  Type: CNAME | Name: digitalizen | Target: <username>.github.io
```

Then tick "Enforce HTTPS" after cert provisions (~10 min).

**Step 3** — Add GitHub Secrets:
`Repo → Settings → Secrets → Actions`

| Secret | Where to get |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → "Edit Cloudflare Workers" |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar |

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Deploy fails "pages source error" | Source must be "GitHub Actions" not "Deploy from branch" |
| Custom domain reverts | Check dist/CNAME is written in build step |
| Workers fail "missing token" | Add CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID to secrets |
| SEO check fails | Check public/ has robots.txt, sitemap.xml, llms.txt |
| Lint blocks deploy | Run `npm run lint` locally, fix all errors |

---

## 12. Cloudflare Workers — CAPI Setup

Server-side event proxies. Bypass ad blockers and iOS ITP for maximum CAPI match rate.

### One-time secret setup

```bash
npm install -g wrangler
wrangler login

# Meta CAPI
wrangler secret put META_PIXEL_ID       --name digitalizen-capi
wrangler secret put CAPI_ACCESS_TOKEN   --name digitalizen-capi

# TikTok CAPI
wrangler secret put TT_PIXEL_ID         --name digitalizen-tt-capi
wrangler secret put TT_ACCESS_TOKEN     --name digitalizen-tt-capi
```

Where to find tokens:
- Meta: Events Manager → Pixel → Settings → Conversions API → Generate Access Token
- TikTok: Events Manager → Pixel → Settings → Generate Access Token

### GTM Custom HTML Tag

```html
<script>
(function() {
  var dl = window.dataLayer || [];
  var ev = {};
  for (var i = dl.length - 1; i >= 0; i--) {
    if (dl[i].meta_event_name) { ev = dl[i]; break; }
  }
  if (!ev.meta_event_name) return;
  fetch('https://capi.digitalizen.billah.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name:       ev.meta_event_name,
      event_id:         ev.meta_event_id,
      event_source_url: ev.meta_event_source_url,
    }),
  });
})();
</script>
```

---

## 13. Required Images Checklist

| File | Size | Used by |
|------|------|---------|
| `public/og-image.jpg` | 1200x630px, JPG, <200KB | Facebook, WhatsApp, LinkedIn previews |
| `public/apple-touch-icon.png` | 180x180px, PNG, solid bg | iPhone Safari bookmark icon |

og-image guide: blue background (#1F4BFF) + Digitalizen logo + Bengali tagline. Make in Canva.
Icons: use [realfavicongenerator.net](https://realfavicongenerator.net).

---

## 14. Tech Decisions and 2026 Best Practices

### BrowserRouter vs HashRouter

BrowserRouter gives clean URLs: `/access` not `/#/access`.
GitHub Pages needs a two-part workaround:
1. `public/404.html` captures the URL → stores in sessionStorage → redirects to `/`
2. `index.html` script reads sessionStorage → `history.replaceState` restores the URL before React mounts

Cloudflare Pages and Netlify handle this via `public/_redirects` automatically.

### Pure CSS

No Tailwind, no CSS Modules. Design tokens via `var(--blue)`, `var(--font)` etc. in `index.css`.
Each component owns its `.css` file. Zero build overhead. Zero class collisions.

### React.lazy + Suspense

Nav and Hero load eagerly. All 12 below-fold components are lazy chunks.
Result: first paint is fast, below-fold JS is deferred and split into separate cached files.

### Analytics architecture

```
track() call
  ├─ Meta Pixel (browser)     → fbq()
  ├─ TikTok Pixel (browser)   → ttq.track()
  └─ GTM dataLayer            → GA4 + CAPI Workers (server-side)
```

Shared event_id between browser and server = deduplication. Server-side = bypass ad blockers.

### SEO/GEO/AEO layers

```
index.html static JSON-LD    → Google indexes before JS runs
src/seo/SEO.jsx              → Per-route title/meta/schema updated on navigation
public/llms.txt              → Clean markdown for ChatGPT, Claude, Perplexity citations
public/robots.txt            → AI crawlers explicitly permitted
```

---

## License

2026 Digitalizen. All rights reserved.
Built by [Masum Billah](https://billah.dev) · [@billahdotdev](https://x.com/billahdotdev)
