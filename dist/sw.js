const CACHE_NAME = 'gspecs-pwa-cache-v1';

// URLs that should never be served from SW cache (always network-only)
const NETWORK_ONLY_PATTERNS = [
  /\/version\.json/,
  /google-analytics\.com/,
  /googletagmanager\.com/
];

self.addEventListener('install', (event) => {
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Delete any outdated caches that don't match the current cache
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and chrome-extension schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Network-only for version.json and analytics
  if (NETWORK_ONLY_PATTERNS.some((pattern) => pattern.test(url.href))) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Network-First for Navigation (HTML) and CSV data
  // Guarantees the web app updates on every load/refresh automatically
  const isNavigation = request.mode === 'navigate' || request.destination === 'document';
  const isDataFile = url.pathname.endsWith('.csv') || url.pathname.endsWith('.tsv');

  if (isNavigation || isDataFile) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline, fall back to cached version
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            if (isNavigation) return caches.match('./') || caches.match('/index.html');
            return new Response('Offline', { status: 503, statusText: 'Offline' });
          });
        })
    );
    return;
  }

  // Stale-While-Revalidate for static assets (hashed JS, CSS, images, fonts)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
