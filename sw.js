/* SendIt Fishing AU — service worker (offline-first, self-contained, no CDN)
   - App shell (HTML/JS/manifest) is fully self-hosted → cache-first works offline.
   - HTML navigations are network-first so deployed updates ship immediately.
   - Live API data (Open-Meteo / MET Norway / Nominatim) is NEVER cached on purpose;
     the app does its own per-location localStorage caching and labels it honestly.
   Bump CACHE on every release; activate purges all older caches. */
const CACHE = 'sendit-v3-6';
const SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const LIVE_HOSTS = [
  'open-meteo.com', 'marine-api.open-meteo.com', 'geocoding-api.open-meteo.com',
  'api.met.no', 'nominatim.openstreetmap.org'
];

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Live data: network-first, fall back to cache only if offline (never serve stale on purpose).
  if (LIVE_HOSTS.some(h => url.hostname.includes(h))) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // HTML / navigations: network-first (instant code updates) → cache → index fallback.
  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html') ||
    url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(() => {}); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // Same-origin shell assets: cache-first.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(() => {}); return res;
    }).catch(() => caches.match('./index.html')))
  );
});
