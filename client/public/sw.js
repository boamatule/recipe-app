const CACHE_VERSION = "recipes-pwa-v3";
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = ["/", "/index.html", OFFLINE_URL, "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!key.startsWith(CACHE_VERSION)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

async function networkFirst(request, cacheName = RUNTIME) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

async function staleWhileRevalidate(request, cacheName = RUNTIME) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || networkPromise;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache images (including cross-origin meal thumbnails) for offline viewing
  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          const cache = await caches.open(PRECACHE);
          cache.put(request, response.clone());
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(PRECACHE);
          const offline = await cache.match(OFFLINE_URL);
          if (offline) return offline;
          return cache.match("/index.html");
        })
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.destination === "script" || request.destination === "style" || url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  if (request.destination === "image" || url.pathname.includes("categories.php")) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }
});

