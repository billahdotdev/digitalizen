# Digitalizen — SPA

Vite. React. Pure CSS. No runtime CSS-in-JS. No motion library. No icon font.
Mobile first. Lighthouse 100 target. Two routes, one shared design system.

```bash
npm install       # one time
npm run dev       # local at http://localhost:5173
npm run build     # production output in dist/
npm run preview   # serve dist/ for a smoke test
```

## Routes

| Path   | Purpose                                            |
|--------|----------------------------------------------------|
| `/`    | Main marketing site (10 sections, single page).    |
| `/bot` | Meta ad landing page. Demo-first conversion flow.  |

Routing is `window.location.pathname` with `popstate` and the View Transitions
API. Zero router dependency. Deep links work on GitHub Pages via the SPA
fallback in `public/404.html`.

## Phone numbers — single source of truth

Every outbound contact link reads from `src/utils/contact.js`. Two constants,
two purposes, no drift:

```js
WA.GENERAL = '8801711992558'   // consultancy, audit, contact form, nav, footer
WA.BOT     = '8801311773040'   // AI moderator demo, every "Bot Try" button
```

If those numbers change, edit `contact.js`. Every component re-routes.

## CSS — sliced for sanity

`src/App.css` is a single `@import` ladder. Vite bundles to one stylesheet
at build time (`cssCodeSplit: false`), so production is still one request.
Open the module that owns the thing you want to change:

```
src/styles/
├── tokens.css         design tokens, reset, motion, keyframes
├── buttons.css        every button variant (primary, ghost, pulse, live-preview)
├── nav.css            sticky nav + mobile drawer + WhatsApp float
├── sections.css       section shell, hero, services, process, works
├── chatbot-speed.css  chatbot section, speed test card
├── packages-faq.css   pricing tiers, bot try button, FAQ accordion
├── contact-footer.css contact form, footer, legal modal
├── bot-landing.css    everything under /bot
└── responsive.css     mobile-first ladder (last for cascade priority)
```

## Live Preview links

Each portfolio piece has a sharp-corner Live Preview button. Targets live in
`src/utils/contact.js`:

```js
export const PROJECT_LINKS = {
  dhakateez: 'https://github.com/digitalizen-bd/dhakateez',
  auora:     'https://github.com/digitalizen-bd/auora',
  garmentik: 'https://github.com/digitalizen-bd/garmentik',
  resto:     'https://github.com/digitalizen-bd/resto',
};
```

Swap these with the live deployed URLs once each project ships. The button
tracks via `trackLivePreview(projectName)` in `src/utils/tracking.js`.

## Analytics

`src/utils/tracking.js` is the brain. Meta Pixel and GA4 share `event_id`s
so server-side CAPI can dedupe. Replace the `GTM_ID` and `FB_PIXEL_ID`
placeholders in `index.html` before going live. The Pixel script and GA gtag
tag both load `defer` so they never block render.

## Deploy

GitHub Actions workflow lives at `.github/workflows/deploy.yml`. It builds,
copies `dist/` to a `gh-pages` branch, and ships. The `public/404.html` is a
SPA fallback so deep links survive a hard refresh.

## Constraints worth remembering

- **Sharp corners.** `--r: 0px` in `tokens.css`. Do not soften.
- **No emoji.** All icons are inline SVG in `Icons.jsx`. Add a new one there.
- **No dashes in copy.** Use middots (`·`) or commas. Identifiers and URLs unaffected.
- **Mobile first.** Base styles are phone. `responsive.css` upgrades upward.
- **One stylesheet.** Do not turn on `cssCodeSplit` unless you measure a gain.

That is the whole project. Edit a file, refresh, ship.
