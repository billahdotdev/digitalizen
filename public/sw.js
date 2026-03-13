// ============================================================
// sw.js — Digitalizen 2026 Service Worker
// Strategy: Stale-While-Revalidate for Dhaka 4G/5G resilience
// ● Network-first for HTML (always fresh routes)
// ● Cache-first for static assets (CSS/JS/images)
// ● Background sync for API calls
// ● Offline fallback page
// Place this file in: /public/sw.js
// ============================================================

const CACHE_NAME = 'digitalizen-v2026.06';
const STATIC_CACHE = 'digitalizen-static-v2026.03';
const DYNAMIC_CACHE = 'digitalizen-dynamic-v2026.03';

// ─── Assets to pre-cache on install ──────────────────────
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/site.webmanifest',
  '/favicon.svg',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/marketing-og.jpg',
  '/logo.png',
  '/robots.txt',
  '/sitemap.xml',
  '/humans.txt',
];

// ─── Cache size limits ────────────────────────────────────
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 60,
};

// ─── Install: Pre-cache critical assets ──────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Digitalizen Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching critical assets');
        // Use addAll but don't fail install if an asset is missing
        return Promise.allSettled(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(err => console.warn(`[SW] Failed to cache ${url}:`, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: Clean old caches ──────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new Service Worker...');
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(name => !currentCaches.includes(name))
            .map(name => {
              console.log(`[SW] Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ─── Fetch: Route-based caching strategy ─────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (analytics, fonts CDN handled separately)
  if (url.origin !== self.location.origin) {
    // Allow Google Fonts to be cached
    if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
    }
    return;
  }

  // ── HTML Pages → Network-first (always fresh for SPA routes) ──
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // ── JS/CSS/Fonts → Cache-first with background update ──
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf)$/)
  ) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // ── Images → Cache-first, long TTL ──
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|avif|ico)$/)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── Everything else → Stale-While-Revalidate ──
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ═══════════════════════════════════════════════════════════
// STRATEGY IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════

/**
 * Network-first with offline fallback
 * Best for: HTML pages, API calls
 */
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetchWithTimeout(request, 4000);
    // Cache a copy of the response
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // Return offline fallback for navigation
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
      // Inline offline response if offline.html not cached
      return new Response(getOfflineHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    throw error;
  }
}

/**
 * Stale-While-Revalidate
 * Best for: Most assets — serve immediately from cache, update in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Start background fetch regardless of cache hit
  const networkFetch = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        trimCache(cacheName);
      }
      return networkResponse;
    })
    .catch(() => null);

  // Return cached immediately if available, otherwise wait for network
  return cachedResponse || networkFetch;
}

/**
 * Cache-first
 * Best for: Images, fonts — rarely change
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Cache-first network failure:', error);
    throw error;
  }
}

/**
 * Fetch with timeout (handles slow Dhaka connections)
 */
function fetchWithTimeout(request, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Network timeout')), timeout);
    fetch(request).then(
      response => { clearTimeout(timer); resolve(response); },
      error => { clearTimeout(timer); reject(error); }
    );
  });
}

/**
 * Trim cache to size limit
 */
async function trimCache(cacheName) {
  const limit = CACHE_LIMITS[cacheName];
  if (!limit) return;

  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > limit) {
    // Delete oldest entries (FIFO)
    await Promise.all(keys.slice(0, keys.length - limit).map(key => cache.delete(key)));
  }
}

/**
 * Inline offline fallback HTML
 */
function getOfflineHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline — Digitalizen</title>
  <style>
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #0a0f1e; color: #f1f5f9;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      min-height: 100vh; text-align: center; padding: 2rem;
    }
    h1 { font-size: 2rem; font-weight: 800; color: #3b82f6; margin-bottom: 1rem; }
    p { color: #94a3b8; max-width: 400px; line-height: 1.6; }
    a {
      display: inline-block; margin-top: 2rem;
      background: #3b82f6; color: white;
      padding: 0.75rem 2rem; border-radius: 10px;
      text-decoration: none; font-weight: 700;
    }
  </style>
</head>
<body>
  <h1>📡 You're Offline</h1>
  <p>No internet connection detected. Please check your connection and try again. Digitalizen — Dhaka's performance marketing agency.</p>
  <a href="/" onclick="location.reload()">Try Again</a>
</body>
</html>`;
}

// ─── Background Sync: Queue failed form submissions ──────
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Retrieve queued form data from IndexedDB and retry
  // Implementation depends on your contact form backend
  console.log('[SW] Background sync: contact-form-sync');
}

// ─── Push Notifications (optional) ───────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Digitalizen', {
      body: data.body || 'New update from Digitalizen',
      icon: '/apple-touch-icon.png',
      badge: '/favicon-32x32.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
