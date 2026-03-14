# Digitalizen — Production SPA

> **Performance Marketing Agency Website**  
> Stack: Vite 6 · React 19 · Pure CSS · React Router v7 · PWA  
> Domain: [digitalizen.billah.dev](https://digitalizen.billah.dev)

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Quick Start](#2-quick-start)
3. [Adding a New Component (Section)](#3-adding-a-new-component-section)
4. [Adding a New Route (Unique URL)](#4-adding-a-new-route-unique-url)
5. [Connecting a Component to the Nav](#5-connecting-a-component-to-the-nav)
6. [Analytics — Tracking New Sections](#6-analytics--tracking-new-sections)
7. [SEO — Adding Meta for New Routes](#7-seo--adding-meta-for-new-routes)
8. [Build & Deploy](#8-build--deploy)
9. [Cloudflare Workers — CAPI Setup](#9-cloudflare-workers--capi-setup)
10. [PWA — Icons Checklist](#10-pwa--icons-checklist)
11. [Audit Summary — What Was Fixed](#11-audit-summary--what-was-fixed)
12. [Tech Decisions & 2026 Best Practices](#12-tech-decisions--2026-best-practices)

---

## 1. Project Structure

```
digitalizen/
├── index.html                  ← Vite entry point (stays at root)
├── vite.config.js              ← Vite 6 config (chunk splitting, aliases)
├── package.json                ← React 19, Vite 6, React Router v7
├── eslint.config.js            ← ESLint v9 flat config
├── wrangler.toml               ← Cloudflare Workers (CAPI deployment)
├── .gitignore
├── .nvmrc                      ← Node 22 LTS
├── .env.example                ← Copy to .env.local, fill secrets
│
├── api/                        ← Server-side Workers (NOT bundled by Vite)
│   ├── capi.js                 ← Meta Conversions API proxy
│   └── tt-capi.js              ← TikTok Events API proxy
│
├── public/                     ← Static files copied as-is to dist/
│   ├── _redirects              ← Netlify/Cloudflare Pages SPA routing
│   ├── _headers                ← Security + cache headers
│   ├── favicon.svg
│   ├── site.webmanifest        ← PWA manifest
│   ├── sw.js                   ← Service Worker (offline support)
│   ├── robots.txt              ← AI + SEO crawler rules
│   ├── sitemap.xml
│   ├── 404.html                ← Static 404 fallback
│   ├── offline.html            ← SW offline fallback
│   └── humans.txt
│
└── src/                        ← All React source code
    ├── main.jsx                ← React 19 createRoot entry
    ├── App.jsx                 ← Router, layouts, ErrorBoundary
    ├── App.css                 ← App-shell styles
    ├── index.css               ← Global design tokens + resets
    ├── analytics.js            ← Unified tracking (Meta/TikTok/GA4)
    ├── SEO.jsx                 ← Per-route meta + JSON-LD injection
    └── components/
        ├── Nav.jsx + Nav.css
        ├── Hero.jsx + Hero.css
        ├── Finder.jsx + Finder.css
        ├── Packages.jsx + Packages.css
        ├── Process.jsx + Process.css
        ├── About.jsx + About.css
        ├── BookCall.jsx + BookCall.css
        ├── Resources.jsx + Resources.css
        ├── Faq.jsx + Faq.css
        ├── Contact.jsx + Contact.css
        ├── Gallery.jsx + Gallery.css
        ├── Footer.jsx + Footer.css
        ├── InstallButton.jsx + InstallButton.css
        ├── FreeResources.jsx + FreeResources.css
        └── Access.jsx + Access.css
```

---

## 2. Quick Start

### Prerequisites
- Node.js **22** LTS (`nvm use` will pick it up from `.nvmrc`)
- npm 10+

### Install & Run

```bash
# 1. Clone / unzip the project
cd digitalizen

# 2. Install dependencies
npm install

# 3. Start dev server (http://localhost:5173)
npm run dev

# 4. Build for production
npm run build

# 5. Preview the production build locally
npm run preview

# 6. Lint
npm run lint
```

### First-time Setup Checklist

- [ ] Replace `GTM-XXXXXXX` in `index.html` with your real GTM ID
- [ ] Replace `XXXXXXXXXXXXXXXXXX` Meta Pixel ID in `index.html`
- [ ] Replace `XXXXXXXXXXXXXXXXXX` TikTok Pixel ID in `index.html`
- [ ] Update `WA_NUMBER` in `src/analytics.js` if phone changes
- [ ] Add real PWA icons to `public/icons/` (see §10)
- [ ] Update `SITE.url` in `src/SEO.jsx` if domain changes

---

## 3. Adding a New Component (Section)

A "component" here means a new **section on the main page** (like Hero, About, etc.).

### Step 1 — Create the files

```bash
touch src/components/MySection.jsx
touch src/components/MySection.css
```

### Step 2 — Write the component

```jsx
// src/components/MySection.jsx
import { useEffect, useRef } from 'react'
import { track, pushEngagement } from '../analytics.js'
import './MySection.css'

export default function MySection() {
  const firedRef    = useRef(false)
  const enterTimeRef = useRef(null)

  // Fire ViewContent when section enters viewport
  useEffect(() => {
    const el = document.getElementById('my-section')
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current = true
        enterTimeRef.current = Date.now()
        track('ViewContent', { content_name: 'My Section', content_category: 'Section' })
        io.unobserve(el)
      }
    }, { threshold: 0.2 })
    io.observe(el)

    const pushEng = () => pushEngagement('my-section', enterTimeRef)
    document.addEventListener('visibilitychange', pushEng)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', pushEng)
      window.removeEventListener('beforeunload', pushEng)
    }
  }, [])

  return (
    <section id="my-section" className="my-section">
      <div className="container">
        <span className="section-label">নতুন সেকশন</span>
        <h2>My New Section</h2>
        <p>Content goes here.</p>
      </div>
    </section>
  )
}
```

### Step 3 — Write the CSS

```css
/* src/components/MySection.css */
.my-section {
  padding: 72px 0;
  background: var(--bg);
}
```

### Step 4 — Add to App.jsx MainLayout

Open `src/App.jsx`, find the `MainLayout` function, and add your import and component:

```jsx
// At the top with other imports:
import MySection from './components/MySection'

// Inside MainLayout's return, between existing sections:
function MainLayout() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <Finder />
        {/* ... existing sections ... */}
        <MySection />   {/* ← Add here */}
        <Footer />
      </main>
    </>
  )
}
```

### Step 5 — Add scroll-spy ID to Nav

Open `src/components/Nav.jsx` and add `'my-section'` to the `NAV_SECTION_IDS` array:

```jsx
const NAV_SECTION_IDS = ['home', 'finder', 'packages', 'process', 'about', 'contact', 'my-section']
```

---

## 4. Adding a New Route (Unique URL)

A "route" means a **separate URL** like `/pricing`, `/blog`, `/case-studies`. These get their own page, not a section on the home page.

### Step 1 — Create the page component

```bash
touch src/components/Pricing.jsx
touch src/components/Pricing.css
```

```jsx
// src/components/Pricing.jsx
import { useEffect } from 'react'
import SEO from '../SEO'
import Nav from './Nav'
import Footer from './Footer'
import { track } from '../analytics.js'
import './Pricing.css'

export default function Pricing() {
  useEffect(() => {
    window.__removeLoader?.()
    track('ViewContent', { content_name: 'Pricing Page', content_category: 'Page' })
  }, [])

  return (
    <div className="page">
      <SEO page="pricing" />   {/* ← See §7 to add this */}
      <Nav />
      <main id="main-content" className="pricing">
        <div className="container">
          <h1>Pricing</h1>
          {/* Page content */}
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

### Step 2 — Register the route in App.jsx

```jsx
// src/App.jsx

// 1. Import the new page:
import Pricing from './components/Pricing'

// 2. Add the Route inside <Routes>:
<Routes>
  <Route path="/"         element={<MainLayout />} />
  <Route path="/free"     element={<FreeResources />} />
  <Route path="/access"   element={<Access />} />
  <Route path="/gallery"  element={<Gallery />} />
  <Route path="/pricing"  element={<Pricing />} />  {/* ← NEW */}
  <Route path="*"         element={<NotFound />} />
</Routes>
```

### Step 3 — Add SEO config (see §7)

### Step 4 — Add to Nav (see §5)

### Step 5 — Add to sitemap

Open `public/sitemap.xml` and add a new `<url>` entry:

```xml
<url>
  <loc>https://digitalizen.billah.dev/#/pricing</loc>
  <lastmod>2026-01-01</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

> **Note on HashRouter URLs:** Because this SPA uses `HashRouter`, all routes are `/#/route-name` (e.g. `https://digitalizen.billah.dev/#/pricing`). This means any static host works with zero server config. If you switch to `BrowserRouter` later, you'll need server rewrites (the `_redirects` file handles this for Netlify/Cloudflare Pages).

---

## 5. Connecting a Component to the Nav

The Nav has two types of links:

### Type A — Scroll-spy link (scrolls to a section on the home page)

Open `src/components/Nav.jsx` and add to the `navLinks` array:

```jsx
const navLinks = [
  { label: 'প্যাকেজ ফাইন্ডার', id: 'finder'    },
  { label: 'প্রক্রিয়া',        id: 'process'   },
  { label: 'প্যাকেজ',          id: 'packages'  },
  // ... existing links ...
  { label: 'প্রাইসিং',         id: 'my-section' },  // ← NEW scroll link
]
```

Also add the ID to `NAV_SECTION_IDS` so scroll-spy highlights it:

```jsx
const NAV_SECTION_IDS = ['home', 'finder', 'packages', 'process', 'about', 'contact', 'my-section']
```

### Type B — Router link (navigates to a unique URL)

```jsx
// Inside the Nav drawer JSX, after the navLinks.map():
<Link
  to="/pricing"
  className="nav__drawer-link"
  onClick={() => setOpen(false)}
  role="menuitem"
>
  প্রাইসিং
</Link>
```

---

## 6. Analytics — Tracking New Sections

Every new component/route should fire analytics. Import from `src/analytics.js`:

```jsx
import { track, pushEngagement, WA_NUMBER } from '../analytics.js'

// Fire on section view (in IntersectionObserver):
track('ViewContent', {
  content_name:     'My Section',
  content_category: 'Section',
})

// Fire on CTA click:
track('InitiateCheckout', {
  content_name:     'My CTA Button',
  content_category: 'CTA',
  currency:         'BDT',
  value:            0,
})

// Fire on lead/form submit:
track('Lead', {
  content_name:     'Contact Form',
  content_category: 'Form',
})

// Fire time-on-section on page leave:
const enterTimeRef = useRef(null)
pushEngagement('my-section', enterTimeRef, { extra_data: 'value' })
```

The `track()` function fires **Meta Pixel + TikTok Pixel + GTM dataLayer** in one call with automatic event ID generation for CAPI deduplication.

---

## 7. SEO — Adding Meta for New Routes

Open `src/SEO.jsx` and add a new entry to `PAGE_DEFAULTS`:

```jsx
const PAGE_DEFAULTS = {
  home:    { /* ... existing */ },
  free:    { /* ... existing */ },
  gallery: { /* ... existing */ },
  access:  { /* ... existing */ },

  // ── New page ──────────────────────────────────────────
  pricing: {
    title:         'Pricing — Digitalizen Digital Marketing Bangladesh',
    description:   'Transparent pricing for Meta Ads, Google Ads, SEO services in Bangladesh. No hidden fees.',
    keywords:      'digital marketing pricing Bangladesh, Meta Ads cost BD, SEO pricing Dhaka',
    titleBn:       'প্রাইসিং — ডিজিটালাইজেন',
    descriptionBn: 'মেটা অ্যাডস, গুগল অ্যাডস, এসইও সার্ভিসের স্বচ্ছ মূল্য।',
    keywordsBn:    'ডিজিটাল মার্কেটিং মূল্য বাংলাদেশ',
    schemaType:    'webpage',
    breadcrumbs: [
      { name: 'Home',    item: 'https://digitalizen.billah.dev/'          },
      { name: 'Pricing', item: 'https://digitalizen.billah.dev/#/pricing' },
    ],
    speakableSelectors: ['h1', 'h2'],
  },
}
```

Then use it in the component:

```jsx
<SEO page="pricing" />
```

---

## 8. Build & Deploy

### Build

```bash
npm run build
# Output → dist/
```

### Cloudflare Pages (Recommended — free, global CDN, closest to BD)

```bash
# Via CLI:
npx wrangler pages deploy dist --project-name=digitalizen

# Or connect GitHub repo in Cloudflare dashboard:
# Build command: npm run build
# Output dir:    dist
```

### Netlify

```bash
# Via CLI:
npx netlify deploy --prod --dir=dist

# Or drag-drop dist/ to app.netlify.com
```

The `public/_redirects` and `public/_headers` files handle SPA routing and security headers automatically on both platforms.

### GitHub Pages

Because the project uses `HashRouter`, GitHub Pages works with **zero configuration**:

```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

### Nginx (self-hosted VPS)

```nginx
server {
    listen 80;
    server_name digitalizen.billah.dev;
    root /var/www/digitalizen/dist;
    index index.html;

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache hashed assets forever
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

---

## 9. Cloudflare Workers — CAPI Setup

The `api/` folder contains server-side proxies that forward pixel events to Meta and TikTok, bypassing ad blockers and iOS tracking restrictions.

### Deploy

```bash
# 1. Install Wrangler globally
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Set secrets (NEVER in wrangler.toml or git)
wrangler secret put META_PIXEL_ID       # Your Meta Pixel ID
wrangler secret put CAPI_ACCESS_TOKEN   # From Meta Events Manager → Settings → CAPI
wrangler secret put TT_PIXEL_ID         # Your TikTok Pixel ID
wrangler secret put TT_ACCESS_TOKEN     # From TikTok Events Manager

# 4. Deploy
wrangler deploy --config wrangler.toml
```

### Connect to GTM

In Google Tag Manager:
1. Create a **Custom HTML Tag** that fires on all pages
2. In the tag, use the Fetch API to POST to `https://capi.digitalizen.billah.dev`
3. Include `event_name`, `event_id`, and `user_data` from the dataLayer push
4. Trigger: All Pages

This ensures every `track()` call from the frontend also fires server-side for maximum match rate.

---

## 10. PWA — Icons Checklist

The `site.webmanifest` references icons in `/public/icons/`. Generate them from your logo:

| File | Size |
|------|------|
| `public/icons/icon-72x72.png`   | 72×72   |
| `public/icons/icon-96x96.png`   | 96×96   |
| `public/icons/icon-128x128.png` | 128×128 |
| `public/icons/icon-144x144.png` | 144×144 |
| `public/icons/icon-152x152.png` | 152×152 |
| `public/icons/icon-192x192.png` | 192×192 (maskable) |
| `public/icons/icon-384x384.png` | 384×384 |
| `public/icons/icon-512x512.png` | 512×512 (maskable) |
| `public/apple-touch-icon.png`   | 180×180 |
| `public/marketing-og.jpg`       | 1200×630 (OG image) |

Use [realfavicongenerator.net](https://realfavicongenerator.net) or [maskable.app](https://maskable.app) for maskable icons.

---

## 11. Audit Summary — What Was Fixed

| Issue | Fix Applied |
|-------|-------------|
| `vite_config.js` wrong filename | Renamed to `vite.config.js` |
| `package.json` had CRA `"homepage"` field | Removed |
| React 18 + Vite 4 (outdated) | Upgraded to React 19 + Vite 6 |
| `react-feather` dependency unused | Removed |
| `eslint` used old `.eslintrc` format | Replaced with ESLint v9 flat config (`eslint.config.js`) |
| `InstallButton` imported but missing | Created `src/components/InstallButton.jsx + .css` |
| `App.css` was empty | Written with app-shell utilities + ErrorBoundary styles |
| `site.webmanifest` missing | Created `public/site.webmanifest` |
| `favicon.svg` missing | Created `public/favicon.svg` |
| No `ErrorBoundary` in App | Added class-based `ErrorBoundary` wrapping `<HashRouter>` |
| `SEO.jsx` not connected to routes | Added `<SEO page="home" />` to `MainLayout` |
| All files at project root | Reorganised into `src/` + `src/components/` |
| No `_redirects` / `_headers` | Created `public/_redirects` + `public/_headers` |
| No `.gitignore` | Created |
| No `.nvmrc` | Created (Node 22) |
| No `.env.example` | Created |
| No `wrangler.toml` | Created for CAPI Workers deployment |
| No `README.md` | This file |

### Files REMOVED (were redundant/misplaced)

- `vite_config.js` → replaced by `vite.config.js`
- Root-level `*.jsx` / `*.css` component files → moved to `src/components/`

---

## 12. Tech Decisions & 2026 Best Practices

### Why HashRouter?

`HashRouter` (`/#/route`) works on **every static host** with zero server configuration — GitHub Pages, Cloudflare Pages, Netlify, a plain S3 bucket. The `_redirects` file handles Netlify/CF Pages for `BrowserRouter` if you ever need clean URLs.

### Why Pure CSS (no Tailwind/CSS Modules)?

- Zero build-time overhead for CSS
- Design tokens via CSS custom properties (`var(--blue)`, `var(--font)`) are natively cascadable
- Co-located `.css` files with components keeps concerns clear
- No class-name collision risk (component-scoped by file convention)
- `index.css` is the single source of truth for the design system

### Why React 19?

React 19 ships the **compiler** (automatic memoization), native `use()` hook for async, and improved Suspense. Upgrading from 18 is a drop-in for this codebase — no API changes required.

### Why Vite 6?

- Environment API for cleaner multi-target builds
- Faster cold starts with improved module graph
- Native CSS layers support
- ES2022 target matches 2026 browser baseline (95%+ global support)

### Why no TypeScript?

The codebase uses Bengali content and quick iteration velocity typical of agency sites. TypeScript adds value at scale; for this SPA, PropTypes are disabled in ESLint intentionally (`'react/prop-types': 'off'`). Add TypeScript by renaming `.jsx` → `.tsx` and installing `typescript` if/when needed.

### Analytics Architecture

```
User action
  └─► analytics.js track()
        ├─► window.fbq()        → Meta Pixel (browser)
        ├─► window.ttq.track()  → TikTok Pixel (browser)
        └─► window.dataLayer    → GTM
              ├─► GA4 tag
              ├─► Meta CAPI tag  → api/capi.js (Cloudflare Worker)
              └─► TikTok EAPI   → api/tt-capi.js (Cloudflare Worker)
```

Shared `event_id` between browser pixel and server CAPI call enables Meta/TikTok to **deduplicate** — you get the accuracy of server-side without double-counting.

---

## License

© 2026 Digitalizen. All rights reserved.  
Built by [Masum Billah](https://billah.dev) · [@billahdotdev](https://x.com/billahdotdev)

---

## 13. GitHub Actions — CI/CD

Two workflows are included — **both are active**:

| Workflow file | What it does | Triggers on |
|---|---|---|
| `deploy-github-pages.yml` | Lint → Build → Deploy SPA to GitHub Pages | Every push to `main` |
| `deploy-workers.yml` | Deploy Meta + TikTok CAPI Workers to Cloudflare | Push to `main` that changes `api/**` or `wrangler.toml` |

---

### Pipeline — what happens on every `git push origin main`

```
push to main
  │
  ├─► deploy-github-pages.yml
  │     ├─ npm ci          (clean install from lockfile)
  │     ├─ npm run lint    (blocks deploy on any ESLint error)
  │     ├─ npm run build   (Vite → dist/)
  │     ├─ echo "digitalizen.billah.dev" > dist/CNAME
  │     └─ deploy dist/ → GitHub Pages
  │
  └─► deploy-workers.yml  (only if api/ files changed)
        ├─ wrangler deploy api/capi.js
        ├─ wrangler deploy api/tt-capi.js
        └─ curl smoke-tests (confirms Workers are reachable)
```

---

### One-time Setup

#### Step 1 — Enable GitHub Pages

```
GitHub repo → Settings → Pages → Source: "GitHub Actions"
```

> ⚠️ Source must be **"GitHub Actions"**, not "Deploy from a branch". If it says "Deploy from a branch", change it first or the deploy job will fail.

#### Step 2 — Custom domain

```
Settings → Pages → Custom domain → digitalizen.billah.dev → Save
```

Add this DNS record at your registrar (or Cloudflare DNS — set to **DNS only**, grey cloud):

```
Type : CNAME
Name : digitalizen          ← or @ if deploying to root domain
Value: <your-username>.github.io
TTL  : Auto
```

GitHub auto-provisions a Let's Encrypt TLS certificate once DNS propagates (~5–10 min).  
Then tick **"Enforce HTTPS"** in the Pages settings.

The workflow writes `dist/CNAME` on every build so your custom domain is never lost after a fresh `dist/` wipe.

#### Step 3 — Add GitHub Secrets for Workers

Go to: **Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value | Where to get it |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Your API token | Cloudflare → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template |
| `CLOUDFLARE_ACCOUNT_ID` | Your Account ID | Cloudflare dashboard → right sidebar |

#### Step 4 — Set Worker pixel secrets (one-time, local CLI)

These are the sensitive pixel IDs and access tokens. They go **into Cloudflare directly**, not into GitHub Secrets — Cloudflare encrypts and injects them at runtime.

Run these commands **once** from your local machine:

```bash
# Install Wrangler if not already installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Meta CAPI secrets
wrangler secret put META_PIXEL_ID       --name digitalizen-capi
wrangler secret put CAPI_ACCESS_TOKEN   --name digitalizen-capi

# TikTok CAPI secrets
wrangler secret put TT_PIXEL_ID         --name digitalizen-tt-capi
wrangler secret put TT_ACCESS_TOKEN     --name digitalizen-tt-capi
```

Each command prompts you to paste the value. The value is stored encrypted in Cloudflare and **never appears in any log or file**.

After this, the GitHub Actions workflow only deploys the Worker *code* — the secrets are already there.

---

### Verifying a deploy

**GitHub Pages:**
- Go to repo → Actions → "Deploy → GitHub Pages" → click the latest run
- Green ✅ = live. Click the environment URL shown in the deploy job to open the site.

**Workers:**
- Go to repo → Actions → "Deploy → Cloudflare Workers (CAPI)"
- The smoke-test step confirms both Worker endpoints are reachable with a real HTTP response

**Cloudflare dashboard:**
- Workers & Pages → digitalizen-capi → Deployments → shows every deploy with timestamp

---

### Recommended branch strategy

```
main        → auto-deploys to production on every push
dev         → local testing, no auto-deploy
feature/*   → open PR → review → merge to main → auto-deploy
```

Protect `main`: **Repo → Settings → Branches → Add rule → Require PR before merging**  
This makes GitHub Actions your deploy gate — nothing reaches production without passing lint + build.

---

### Troubleshooting

| Symptom | Fix |
|---|---|
| `pages` source error on deploy | Settings → Pages → Source must be "GitHub Actions" |
| Custom domain reverts to `*.github.io` | Check `dist/CNAME` is being written by the build step |
| Workers deploy fails: "missing token" | Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets |
| Workers deploy succeeds but pixel not firing | Run `wrangler secret put META_PIXEL_ID --name digitalizen-capi` locally |
| Smoke-test exits 000 | Worker URL is wrong — confirm `capi.digitalizen.billah.dev` DNS is set |
| Lint blocks the deploy | Run `npm run lint` locally and fix all errors before pushing |
