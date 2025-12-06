const CACHE_VERSION = "recipes-pwa-v1";
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;
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

// Network-first for API (search/detail)
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cache = await caches.open(RUNTIME);
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

// Stale-while-revalidate for images/categories
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
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

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(PRECACHE);
        return cache.match(OFFLINE_URL);
      })
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.destination === "image" || url.pathname.includes("categories.php")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

