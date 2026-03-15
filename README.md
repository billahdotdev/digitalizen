# Digitalizen — Production SPA

> **Performance Marketing Agency — Bangladesh**
> Stack: **Vite 6 · React 19 · Pure CSS · React Router v7 · Service Worker · PWA**
> Domain: [digitalizen.billah.dev](https://digitalizen.billah.dev)
> Author: [Masum Billah](https://billah.dev) · [@billahdotdev](https://x.com/billahdotdev)

---

## Project Structure

```
digitalizen/
│
├── index.html                    Vite HTML entry — meta, JSON-LD, pixels, loader
├── vite.config.js                Chunk splitting, cssCodeSplit, ES2022 target
├── eslint.config.js              ESLint 9 flat config
├── package.json                  React 19 · Vite 6 · React Router v7
├── package-lock.json             Lockfile — commit this
├── .gitignore
├── .nvmrc                        Node 22 LTS — read by GitHub Actions
├── wrangler.toml                 Meta CAPI Worker config
├── wrangler.tt-capi.toml         TikTok CAPI Worker config
├── _headers                      Cache-Control + security headers (root copy)
├── README.md
├── FIXES-APPLIED.md              Full audit log
│
├── src/                          ← All React source code lives here
│   ├── main.jsx                  React 19 createRoot entry
│   ├── App.jsx                   BrowserRouter + Routes + ErrorBoundary + StickyBar
│   ├── App.css                   App shell + 404 page styles
│   ├── index.css                 Design tokens, resets, shared utilities
│   │
│   ├── lib/
│   │   └── analytics.js          Unified track() → Meta Pixel + TikTok + GTM
│   │
│   ├── seo/
│   │   └── SEO.jsx               Per-route title/meta/JSON-LD injection
│   │
│   └── components/               15 components — each has .jsx + .css
│       ├── Nav.jsx / .css        Fixed nav, scroll-spy, mobile drawer
│       ├── Hero.jsx / .css       Above-fold hero, primary CTA
│       ├── Finder.jsx / .css     14-question package quiz (score-based)
│       ├── Packages.jsx / .css   3-tier pricing cards
│       ├── Process.jsx / .css    3-step modal process
│       ├── About.jsx / .css      Founder + values + screenshot carousel
│       ├── BookCall.jsx / .css   WhatsApp call booking form
│       ├── Resources.jsx / .css  Ebook download + newsletter
│       ├── Faq.jsx / .css        Accordion FAQ (8 questions)
│       ├── Contact.jsx / .css    Contact methods + inline form
│       ├── Gallery.jsx / .css    Full-screen proof gallery
│       ├── Footer.jsx / .css     Links + legal modals
│       ├── FreeResources.jsx     Standalone /free route
│       ├── FreeGift.jsx          Standalone /free-gift route
│       └── Access.jsx            Standalone /access client portal
│
├── api/                          Cloudflare Workers — NOT bundled by Vite
│   ├── capi.js                   Meta Conversions API proxy
│   └── tt-capi.js                TikTok Events API proxy
│
└── public/                       Copied verbatim into dist/ at build time
    ├── _headers                  1-year cache + security headers (CF Pages/Netlify)
    ├── _redirects                SPA fallback for CF Pages/Netlify
    ├── 404.html                  GitHub Pages SPA redirect script
    ├── offline.html              Service Worker offline fallback
    ├── manifest.json             PWA manifest
    ├── robots.txt                Crawl rules + AI crawler permissions
    ├── sitemap.xml               All public URLs with hreflang alternates
    ├── llms.txt                  AI entity data (ChatGPT, Claude, Perplexity)
    ├── humans.txt                E-E-A-T credits
    ├── sw.js                     Service Worker (cache strategies)
    ├── og-image.jpg              1200×630 social share image (replace placeholder)
    ├── apple-touch-icon.png      180×180 iOS bookmark icon
    ├── IMAGES-REQUIRED.md        Images needed before launch
    └── ebook/
        └── cover.jpg             Ebook cover (replace placeholder)
```

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/
npm run preview    # http://localhost:4173
npm run lint       # ESLint — must pass before deploy
```

**Requires Node 22** (set in `.nvmrc`).

---

## Before Going Live — Mandatory Checklist

```
[ ] Replace GTM-XXXXXXX in index.html (2 places)
[ ] Replace XXXXXXXXXXXXXXXXXX Meta Pixel ID in index.html
[ ] Replace XXXXXXXXXXXXXXXXXX TikTok Pixel ID in index.html
[ ] Add public/favicon.svg (referenced in index.html)
[ ] Replace public/og-image.jpg with real 1200×630 px image
[ ] Replace public/ebook/cover.jpg with real cover (400×560 px WebP)
[ ] Add public/ebook/onlineMonline.pdf (actual ebook)
[ ] Run wrangler secret put for all 4 CAPI secrets (see §CAPI section)
[ ] Enable GitHub Pages: Repo → Settings → Pages → Source: "GitHub Actions"
[ ] Set custom domain + DNS (see §Deploy section)
```

---

## Editing Components — What to Change Where

| What you want to change | File | What to edit |
|---|---|---|
| Hero headline / sub text | `src/components/Hero.jsx` | JSX text directly |
| WhatsApp number | `src/lib/analytics.js` | `WA_NUMBER` constant — single source of truth |
| Package names/prices | `src/components/Packages.jsx` | `plans` array at top of file |
| FAQ questions/answers | `src/components/Faq.jsx` | `faqs` array at top of file |
| Process steps | `src/components/Process.jsx` | `steps` array at top of file |
| Contact channels | `src/components/Contact.jsx` | `CHANNELS` array at top of file |
| Footer nav links | `src/components/Footer.jsx` | `navLinks` array |
| Footer social icons | `src/components/Footer.jsx` | `socials` array |
| Legal modal content | `src/components/Footer.jsx` | `LEGAL` object at top of file |
| Nav scroll links | `src/components/Nav.jsx` | `navLinks` array |
| Gallery projects | `src/components/Gallery.jsx` | `sites` array at top of file |
| Ebook download config | `src/components/Resources.jsx` | constants at top of file |
| Brand colours | `src/index.css` | `:root` CSS variables |
| Font | `index.html` Google Fonts URL + `src/index.css` `--font` variable |
| SEO title/description | `src/seo/SEO.jsx` | `PAGE_DEFAULTS` object per route |
| JSON-LD schemas | `index.html` | `<script type="application/ld+json">` blocks |
| GEO/AEO signals | `index.html` | `geo.*`, `ai-content-description` meta tags |

---

## Adding a New Page (Route)

**4 steps — all required.**

### Step 1 — Create component + CSS

```bash
touch src/components/Pricing.jsx src/components/Pricing.css
```

Minimal template (copy this exactly):

```jsx
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
      <Link to="/" className="back-link">← ফিরে যান</Link>
      <main id="main-content" className="container">
        <h1>প্রাইসিং</h1>
      </main>
    </div>
  )
}
```

### Step 2 — Register in src/App.jsx

```jsx
// Add with other lazy imports at top:
const Pricing = lazy(() => import('./components/Pricing'))

// Add inside <Routes>:
<Route path="/pricing" element={<Suspense fallback={null}><Pricing /></Suspense>} />
```

### Step 3 — Add SEO config in src/seo/SEO.jsx

Find `PAGE_DEFAULTS` and add:

```js
pricing: {
  title:         'Pricing — Digitalizen Digital Marketing Bangladesh',
  description:   'Transparent pricing for Meta Ads, Google Ads, SEO in Bangladesh.',
  keywords:      'digital marketing pricing Bangladesh, Meta Ads cost Dhaka',
  titleBn:       'মূল্য তালিকা — ডিজিটালাইজেন বাংলাদেশ',
  descriptionBn: 'মেটা অ্যাডস, গুগল অ্যাডস, SEO মূল্য তালিকা।',
  keywordsBn:    'ডিজিটাল মার্কেটিং মূল্য বাংলাদেশ',
  schemaType:    'webpage',   // 'webpage' | 'collection' | 'home'
  breadcrumbs: [
    { name: 'Home',    item: 'https://digitalizen.billah.dev/'        },
    { name: 'Pricing', item: 'https://digitalizen.billah.dev/pricing' },
  ],
  speakableSelectors: ['h1', 'h2'],
  // noindex: true   ← uncomment to hide from Google
},
```

### Step 4 — Add to public/sitemap.xml

```xml
<url>
  <loc>https://digitalizen.billah.dev/pricing</loc>
  <lastmod>2026-03-16</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  <xhtml:link rel="alternate" hreflang="en"        href="https://digitalizen.billah.dev/pricing" />
  <xhtml:link rel="alternate" hreflang="bn-BD"     href="https://digitalizen.billah.dev/pricing" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://digitalizen.billah.dev/pricing" />
</url>
```

---

## Adding a New Section (Home Page)

### Step 1 — Create files

```bash
touch src/components/Testimonials.jsx src/components/Testimonials.css
```

### Step 2 — Standard section template

```jsx
import { useEffect, useRef, useState } from 'react'
import './Testimonials.css'
import { track, pushEngagement } from '../lib/analytics.js'

export default function Testimonials() {
  const sectionRef   = useRef(null)
  const enterTimeRef = useRef(null)
  const firedRef     = useRef(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current     = true
        enterTimeRef.current = Date.now()
        setEntered(true)
        track('ViewContent', { content_name: 'Testimonials', content_category: 'Section' })
        io.unobserve(el)
      }
    }, { threshold: 0.2 })
    io.observe(el)
    const push  = () => pushEngagement('testimonials', enterTimeRef)
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
      id="testimonials"
      className={`testimonials-section${entered ? ' testimonials-section--entered' : ''}`}
      aria-label="ক্লায়েন্ট রিভিউ"
      ref={sectionRef}
    >
      <div className="container">
        <div className="row-header">
          <span className="section-num">০১০</span>
          <span className="section-title-right">রিভিউ</span>
        </div>
        <h2 className="testimonials-heading">ক্লায়েন্ট রিভিউ</h2>
      </div>
    </section>
  )
}
```

### Step 3 — Add to src/App.jsx

```jsx
// Lazy import:
const Testimonials = lazy(() => import('./components/Testimonials'))

// Inside <Suspense fallback={null}> in MainLayout, in scroll order:
<Gallery />
<Testimonials />   {/* ← insert at the position you want */}
```

### Step 4 — Optional nav link (src/components/Nav.jsx)

```js
{ label: 'রিভিউ', id: 'testimonials' }   // must match section id=""
```

---

## Removing a Component

```jsx
// 1. src/App.jsx — delete lazy import:
const Gallery = lazy(() => import('./components/Gallery'))

// 2. src/App.jsx — delete JSX:
<Gallery />

// 3. src/components/Nav.jsx — remove from navLinks if present

// Files (Gallery.jsx + Gallery.css) can stay — Vite tree-shakes them out.
// Or delete them if you're certain they won't be needed.
```

---

## Analytics & Tracking

### Architecture

```
User action
    │
    ▼
track(event, params) — src/lib/analytics.js
    ├── fbq()              Meta Pixel (browser)
    ├── ttq.track()        TikTok Pixel (browser)
    └── dataLayer.push()   GTM → GA4 + CAPI Workers (server-side)
                                      └── event_id deduplication
```

### Using track()

```js
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'

// Section view (fires once on viewport entry):
track('ViewContent', { content_name: 'Section Name', content_category: 'Section' })

// WhatsApp CTA click:
track('InitiateCheckout', { content_name: 'Hero CTA', currency: 'BDT', value: 0 })
window.open(`https://wa.me/${WA_NUMBER}?text=...`, '_blank')

// Form submit / lead:
track('Lead', { content_name: 'Book Call', currency: 'BDT', value: 0 })

// Download:
track('Purchase', { content_name: 'Ebook Downloaded', value: 0, currency: 'BDT' })

// Newsletter:
track('CompleteRegistration', { content_name: 'Newsletter Subscribed' })

// Time on section (call on visibilitychange + beforeunload):
pushEngagement('section-name', enterTimeRef)
```

### Changing the phone number

```js
// src/lib/analytics.js — line 20 — ONLY place to change:
export const WA_NUMBER = '8801711992558'
```

---

## SEO / AEO / GEO Signal Map

### Where each signal lives

| Signal | File | Edit when |
|--------|------|-----------|
| JSON-LD: Agency + Person + Services | `index.html` `<script type="application/ld+json">` | Services change |
| JSON-LD: FAQPage (Benglish Q&A) | `index.html` `buildFAQSchema()` | Add more Q&A |
| JSON-LD: WebPage + BreadcrumbList | `src/seo/SEO.jsx` `buildWebPageSchema()` | Per-route, auto |
| `<title>` + `<meta description>` | `src/seo/SEO.jsx` `PAGE_DEFAULTS` | Per-route content |
| Open Graph + Twitter cards | `src/seo/SEO.jsx` `applyAll()` | Auto from PAGE_DEFAULTS |
| `geo.region`, `geo.position`, ICBM | `index.html` lines ~59–62 | Office moves |
| GeoCoordinates JSON-LD | `index.html` `"geo"` in agency schema | Office moves |
| `ai-content-description` | `index.html` line ~46 | Services change |
| `ai-topic` | `src/seo/SEO.jsx` `applyAll()` | Topic keywords change |
| AI crawlers permission | `public/robots.txt` | Add new AI bots |
| AI entity data (plain text) | `public/llms.txt` | Services/pricing change |
| Canonical + hreflang | `src/seo/SEO.jsx` `applyAll()` | Auto per route |
| Sitemap | `public/sitemap.xml` | New page added |
| Identity links (AI entity graph) | `index.html` `<link rel="me">` | New social profiles |

### Updating for a new service

1. `index.html` → `OfferCatalog` → add new `Service` object
2. `index.html` → `ai-content-description` → append service name
3. `public/llms.txt` → `### Services` section → add service
4. `src/seo/SEO.jsx` → `PAGE_DEFAULTS.home.keywords` → add keyword

---

## CAPI Workers — Server-Side Tracking

### One-time setup (run locally once)

```bash
npm install -g wrangler
wrangler login

# Meta CAPI secrets
wrangler secret put META_PIXEL_ID
wrangler secret put CAPI_ACCESS_TOKEN

# TikTok CAPI secrets
wrangler secret put TT_PIXEL_ID     --config wrangler.tt-capi.toml
wrangler secret put TT_ACCESS_TOKEN --config wrangler.tt-capi.toml
```

Where to get tokens:
- **Meta:** Events Manager → Pixel → Settings → Conversions API → Generate token
- **TikTok:** TikTok Ads Manager → Assets → Events → Pixel → Settings → Generate token

### GTM Custom HTML tag (send to CAPI from GTM)

Create a Custom HTML tag in GTM, trigger: All Pages + custom `meta_*` events:

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
      event_name: ev.meta_event_name,
      event_id:   ev.meta_event_id,
      event_source_url: ev.meta_event_source_url,
      user_data: {
        client_user_agent: navigator.userAgent,
        fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1] || null,
        fbc: document.cookie.match(/_fbc=([^;]+)/)?.[1] || null,
      },
    }),
  });
})();
</script>
```

---

## Deploy — GitHub Actions

### How it works

```
git push origin main
    │
    ├─► deploy-github-pages.yml
    │     lint → build → verify dist/ → write CNAME → deploy
    │
    └─► deploy-workers.yml  (only when api/ changes)
          deploy Meta CAPI → deploy TikTok CAPI → smoke tests
```

### One-time GitHub setup

**1.** Repo → Settings → Pages → Source: **"GitHub Actions"** (not "Deploy from branch")

**2.** Custom domain: Settings → Pages → Custom domain → `digitalizen.billah.dev`

**3.** DNS at Cloudflare (DNS Only — grey cloud):
```
Type: CNAME | Name: digitalizen | Target: <yourusername>.github.io
```

**4.** Tick "Enforce HTTPS" after TLS cert provisions (~10 min)

**5.** Add GitHub Secrets (Repo → Settings → Secrets → Actions):

| Secret | Value |
|--------|-------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Profile → API Tokens → "Edit Cloudflare Workers" |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar |

### If deploy fails

| Error | Fix |
|-------|-----|
| "Pages source error" | Source must be "GitHub Actions" not "Deploy from branch" |
| "chunk-priority chunk missing" | `vite.config.js` manualChunks paths are wrong |
| "No JSON-LD schema" | `index.html` JSON-LD block was accidentally deleted |
| "ESLint error" | Run `npm run lint` locally and fix all errors first |
| "CLOUDFLARE_API_TOKEN not found" | Add the secret in Repo → Settings → Secrets |

---

## Service Worker & PWA

After each deploy, bump the cache version in `public/sw.js`:

```js
const CACHE_VERSION = 'dz-v4.05'  // ← increment each deploy
```

Without bumping, stale users may see old JS/CSS for up to 24 hours.

---

## Design Tokens (src/index.css)

```css
/* Colours */
--blue:       #1F4BFF   /* primary — CTAs, links */
--blue-dark:  #1438CC   /* hover */
--green:      #16A34A   /* success, WhatsApp */
--text:       #0B1220   /* body text */
--muted:      #4A5568   /* helper text */
--bg:         #F5F7FF   /* page background */
--border:     #E2E7F5   /* card borders */
--dark2:      #101828   /* footer background */

/* Layout */
--font:       'Noto Sans Bengali', sans-serif
--nav-h:      64px       /* nav height — also sets scroll-margin-top */
--max-w:      700px      /* max content width */
--radius:     12px       /* card radius */
--radius-sm:  8px        /* button radius */
```

---

## License

© 2026 Digitalizen. All rights reserved.
Built by [Masum Billah](https://billah.dev) · [@billahdotdev](https://x.com/billahdotdev)
