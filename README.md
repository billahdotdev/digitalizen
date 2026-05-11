# Digitalizen — `/bot` Landing Page Build

> Vite + React 18 + Pure CSS. Glassmorphism · sharp geometry · `#060d1a` + `#50C878`.

## What's in this build

```
src/
├── App.jsx                         (★ modified — adds /bot route)
├── app.css                         (★ extended — appends .bl-* landing styles)
├── main.jsx
├── components/
│   ├── BotLanding.jsx              (✨ NEW — Meta-ad destination)
│   ├── Nav · Hero · Services · Process · Works · ChatBot · SpeedTest
│   ├── Packages · FAQ · Contact · Footer · WhatsAppFloat · Icons
└── utils/
    └── tracking.js                 (★ extended — Bot landing event helpers)

public/
└── 404.html                        (✨ NEW — GitHub Pages SPA fallback)

index.html                          (★ rewritten — Pixel + GA4 + SPA restore)
```

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev /bot     # /bot route works in dev (SPA)
npm run build        # → dist/
npm run preview      # serves dist/
```

## Routes

| URL | Renders | Used for |
|---|---|---|
| `/`     | Full marketing site (current setup) | Organic, branded traffic |
| `/bot`  | BotLanding (single-purpose ad page)  | Meta ads → live AI bot demo |

Routing is path-based via `window.location.pathname` — **no router lib added**.
Add a new route by editing `pathToView()` in `src/App.jsx`.

## Before going live with ads — checklist

### 1. Replace `YOUR_PIXEL_ID` (×4 in `index.html`)
- Path: `business.facebook.com` → Events Manager → Pixels → copy ID
- Spots: `fbq('init', ...)`, plus `<noscript>` fallback

### 2. Replace `G-XXXXXXXXXX` (×3 in `index.html`)
- Path: `analytics.google.com` → Admin → Data Streams → Web → Measurement ID

### 3. Generate `og-image.jpg` (1200×630, < 100 KB)
- Place at `public/og-image.jpg` so Facebook ad previews look sharp.

### 4. Confirm WhatsApp number in `BotLanding.jsx`
- Currently: `8801311773040` (live AI bot — Meta Cloud API). Change if you swap numbers.

### 5. GitHub Pages SPA setup
- Repo → Settings → Pages → Source: GitHub Actions (or "Deploy from branch" if your workflow targets it).
- Add custom domain. With `public/404.html`, deep links to `/bot` survive a hard refresh.

## Meta ad tracking — what fires from `/bot`

| Pixel event       | When                                          | Source label                           |
|-------------------|------------------------------------------------|------------------------------------------|
| `PageView`        | Page load (auto, from Pixel init)              | —                                        |
| `ViewContent`     | BotLanding component mounts                    | content_ids: `bot_landing`               |
| `Lead`            | Any "Try the bot" WhatsApp click               | source: `hero_primary` / `how_section` / `final_try` |
| `InitiateCheckout`| "Get this bot for my business" click           | source: `final_inquiry`, value: 15000 BDT |

Every Pixel event includes a unique `event_id` — drop in CAPI later and
deduplication works automatically.

## Design tokens you can riff on

```
--bg          #060d1a        Page background
--surface     #0d1b2e        Card surface
--surface-2   #112035        Elevated surface
--accent      #50C878        Emerald accent
--accent-soft rgba(80,200,120,.08)   Tinted bg
--glass       rgba(6,13,26,.78)       Nav/topbar
--mono        JetBrains Mono
--sans        Inter + Noto Sans Bengali
--r           0px            Sharp everywhere
```

## Edit landing copy

All landing strings live at the top of `src/components/BotLanding.jsx`:

```js
const CAPABILITIES = [...]   // What the bot does (6 chips)
const HOW          = [...]   // 3-step demo flow
const USE_CASES    = [...]   // Industry-specific proofs
const PRICING_HIGHLIGHTS = [...] // Tease before final CTA
```

No CSS edits needed — just the data arrays.
