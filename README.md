# Digitalizen

Vite + React single-page site. Zero-runtime CSS, hand-rolled path router, mobile-first.

## Run

```bash
npm install
npm run dev      # local dev
npm run build    # production build → dist/
npm run preview  # serve the build
```

Routes: `/` (main site) · `/bot` (Meta-ad landing). Deep links survive on static hosts via `public/404.html`.

## What changed in this pass

Brand palette, copy, routing and component logic are untouched. The work was a
**width + alignment refactor** of `src/App.css`, from a scattered desktop-first
set of breakpoints to one consistent **mobile-first ladder**:

| Step | Width | Behaviour |
|------|-------|-----------|
| base | `< 600px`  | every grid single-column · hamburger nav · full-width CTAs |
| sm   | `≥ 600px`  | 2-up content grids · inline hero CTAs · ROI / footer columns |
| lg   | `≥ 1000px` | full desktop · 4-up process · 3-up pricing · inline nav |

Tokens `--bp-sm` / `--bp-lg` document the two lines. Because **every** section
reflows on the same two widths, nothing drifts out of rhythm between
breakpoints anymore.

Specific fixes:

- Pricing cards no longer collapse into a lopsided "2 + 1 centred" block in the
  tablet range — they go cleanly 1-up → 3-up and share equal height with their
  CTAs aligned.
- Process, Works, Services and ROI now switch columns at the same points
  instead of at `540 / 768 / 900 / 1024` independently.
- Container width (`--max-w` 1140px, centred `.section-inner`) is applied
  uniformly; no horizontal overflow at any width.
- Image paths fixed: assets now live in `public/images/` under the names the
  components request, and the three mislabelled JPEGs were re-encoded as real
  WebP (≈40% smaller). Manifest icon / OG names aligned too.

## Layout primitives

- `.section > .section-inner` — the one centred container. Wrap new sections in it.
- Grid column counts live **only** in the responsive ladder near the bottom of
  `App.css`. Add a new grid there and it inherits the same rhythm for free.
