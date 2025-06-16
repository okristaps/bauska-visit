const CACHE_NAME = "puzzle-game-v1";
const STATIC_CACHE_NAME = "puzzle-game-static-v1";

// Assets that can be cached for longer periods
const urlsToCache = [];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache puzzle assets
  if (url.pathname.includes("puzzles/puzzle_") || url.pathname.includes("/puzzle")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For CSS, JS, and other critical files, always go to network first
  if (url.pathname.endsWith(".css") || url.pathname.endsWith(".js") || url.pathname.includes("_next/static")) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  } else {
    // For other resources, try cache first
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  // Immediately claim clients to ensure the new service worker takes over
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});
