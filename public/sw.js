const CACHE_NAME = "digitalizen-v1.9"; // প্রতিবার নতুন build হলে version পরিবর্তন করুন
const urlsToCache = ["/", "/#/free-resources"];

// Install event
self.addEventListener("install", (event) => {
  self.skipWaiting(); // নতুন SW সাথে সাথে activate হবে
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // পুরোনো cache delete
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // cache hit হলে return করবে, না হলে network থেকে আনবে
      return (
        response ||
        fetch(event.request).then((res) => {
          // network থেকে আসা response cache করে রাখুন
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});
