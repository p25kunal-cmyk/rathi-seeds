/**
 * sw.js — Service Worker for Rathi Seeds PWA
 *
 * Caches core app shell for offline use.
 * Uses a "cache-first, network-update" strategy.
 */

const CACHE_NAME = 'rathi-seeds-v2';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/bill-generator.js',
  '/js/excel-parser.js',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
];

const CDN_ASSETS = [
  'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js',
];

/* ============ INSTALL ============ */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache core assets (local files)
      const corePromise = cache.addAll(CORE_ASSETS);

      // Cache CDN assets individually (don't fail install if CDN is down)
      const cdnPromise = Promise.allSettled(
        CDN_ASSETS.map((url) =>
          fetch(url, { mode: 'cors' })
            .then((response) => {
              if (response.ok) {
                return cache.put(url, response);
              }
            })
            .catch(() => {
              console.warn('SW: Could not cache CDN asset:', url);
            })
        )
      );

      return Promise.all([corePromise, cdnPromise]);
    })
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

/* ============ ACTIVATE ============ */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Claim all open tabs immediately
  self.clients.claim();
});

/* ============ FETCH ============ */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version, but also fetch fresh copy in background
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed — cached version (if any) was already returned
        });

      return cachedResponse || fetchPromise;
    })
  );
});
