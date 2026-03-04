const CACHE_NAME = 'alefbet-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/alefbet.html',
  '/alefbet.css',
  '/about.html',
  '/contact.html',
  '/terms.html',
  '/privacy.html',
  '/subpage.css',
  '/manifest.json',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
  '/images/apple-touch-icon.png',
  '/images/favicon-32x32.png',
  '/images/favicon-16x16.png',
  '/en/',
  '/en/index.html',
  '/en/alefbet.html',
  '/en/about.html',
  '/en/contact.html',
  '/en/terms.html',
  '/en/privacy.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Google Fonts: network-first, cache fallback
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Same-origin: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
