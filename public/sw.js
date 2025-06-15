const CACHE_NAME = "puzzle-game-v1";
const STATIC_CACHE_NAME = "puzzle-game-static-v1";

// Assets that can be cached for longer periods
// Excluding puzzle 1 assets as they need to be fresh
const urlsToCache = [
  "/puzzle2",
  "/assets/puzzles/puzzle_2/1.png",
  "/assets/puzzles/puzzle_2/2.png",
  "/assets/puzzles/puzzle_2/3.png",
  "/assets/puzzles/puzzle_2/4.png",
  "/assets/puzzles/puzzle_2/5.png",
  "/assets/puzzles/puzzle_2/6.png",
  "/assets/puzzles/puzzle_2/7.png",
  "/assets/puzzles/puzzle_2/8.png",
  "/assets/puzzles/puzzle_2/9.png",
  "/assets/puzzles/puzzle_2/10.png",
  "/assets/puzzles/puzzle_2/11.png",
  "/assets/puzzles/puzzle_2/12.png",
  "/assets/puzzles/puzzle_2/13.png",
  "/assets/puzzles/puzzle_2/14.png",
  "/assets/puzzles/puzzle_2/15.png",
  "/assets/puzzles/puzzle_2/16.png",
];

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

  // Never cache puzzle 1 assets
  if (url.pathname.includes("puzzle_1") || url.pathname === "/puzzle") {
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
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
