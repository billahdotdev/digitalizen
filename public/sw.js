/* ═══════════════════════════════════════════════════════
   sw.js — Digitalizen Service Worker
   ─────────────────────────────────────────────────────
   Strategy:
   • App shell (index.html + core assets) → Cache First
     (instant load on repeat visits, even on 4G dips)
   • JS/CSS chunks → Stale-While-Revalidate
     (serve cached version immediately, update in bg)
   • Fonts → Cache First with long TTL (1 year)
   • Images → Cache First with 30-day TTL
   • API / tracking calls → Network Only (never cache)

   This ensures Digitalizen loads in < 1s on Dhaka 4G
   for returning users regardless of network instability.
═══════════════════════════════════════════════════════ */

const CACHE_VERSION  = 'dz-v4.05'   /* ← bumped: added manifest + apple-touch-icon */
const STATIC_CACHE   = `${CACHE_VERSION}-static`
const RUNTIME_CACHE  = `${CACHE_VERSION}-runtime`
const FONT_CACHE     = `${CACHE_VERSION}-fonts`
const IMAGE_CACHE    = `${CACHE_VERSION}-images`

/* ── App shell — pre-cached on install ── */
const APP_SHELL = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/apple-touch-icon.png',
]

/* ── Never-cache patterns ── */
const BYPASS_PATTERNS = [
  /googletagmanager\.com/,
  /google-analytics\.com/,
  /facebook\.com\/tr/,
  /connect\.facebook\.net/,
  /analytics\.tiktok\.com/,
  /wa\.me/,
  /api\.anthropic\.com/,
]

const shouldBypass = (url) =>
  BYPASS_PATTERNS.some(p => p.test(url))

/* ════ INSTALL ════════════════════════════════════════ */
self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
  )
})

/* ════ ACTIVATE — prune old caches ══════════════════ */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => !k.startsWith(CACHE_VERSION))
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

/* ════ FETCH ═════════════════════════════════════════ */
self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = request.url

  /* Skip non-GET and bypassed origins */
  if (request.method !== 'GET' || shouldBypass(url)) return

  const reqUrl  = new URL(url)
  const isLocal = reqUrl.origin === self.location.origin

  /* ── Google Fonts — Cache First (1 year) ── */
  if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
    e.respondWith(cacheFirst(url, FONT_CACHE, 365 * 24 * 60 * 60))
    return
  }

  /* ── Local images (/assets/*.webp|avif|jpg|png|svg) — Cache First 30d ── */
  if (isLocal && /\.(webp|avif|jpg|jpeg|png|svg|gif|ico)(\?.*)?$/.test(reqUrl.pathname)) {
    e.respondWith(cacheFirst(url, IMAGE_CACHE, 30 * 24 * 60 * 60))
    return
  }

  /* ── Unsplash / remote images (About gallery) — Cache First 7d ── */
  if (url.includes('unsplash.com') || url.includes('avatars.githubusercontent.com')) {
    e.respondWith(cacheFirst(url, IMAGE_CACHE, 7 * 24 * 60 * 60))
    return
  }

  /* ── Local JS / CSS chunks — Stale-While-Revalidate ── */
  if (isLocal && /\.(js|css)(\?.*)?$/.test(reqUrl.pathname)) {
    e.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE))
    return
  }

  /* ── App shell (HTML navigation) — Network First with fallback ── */
  if (isLocal && request.mode === 'navigate') {
    e.respondWith(networkFirstWithFallback(request))
    return
  }

  /* ── Everything else — Network Only ── */
})

/* ════ HELPERS ═══════════════════════════════════════ */

async function cacheFirst(url, cacheName, maxAgeSeconds) {
  const cache    = await caches.open(cacheName)
  const cached   = await cache.match(url)
  if (cached) {
    const age = getAgeSeconds(cached)
    if (age < maxAgeSeconds) return cached
  }
  try {
    const fresh = await fetch(url)
    if (fresh.ok) cache.put(url, fresh.clone())
    return fresh
  } catch {
    if (cached) return cached
    return new Response('Offline', { status: 503 })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache    = await caches.open(cacheName)
  const cached   = await cache.match(request)

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone())
    return response
  }).catch(() => null)

  return cached || fetchPromise || new Response('Offline', { status: 503 })
}

async function networkFirstWithFallback(request) {
  const cache = await caches.open(STATIC_CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh.ok) cache.put(request, fresh.clone())
    return fresh
  } catch {
    const cached = await cache.match('/index.html')
    return cached || new Response('Offline', { status: 503 })
  }
}

function getAgeSeconds(response) {
  const dateHeader = response.headers.get('date')
  if (!dateHeader) return Infinity
  return (Date.now() - new Date(dateHeader).getTime()) / 1000
}
