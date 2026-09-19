const ROOT = new URL('./', self.location.href).pathname;
const PREFIX = 'abhyas-' + ROOT.replace(/\W/g, '_') + '-';
const CACHE = PREFIX + 'build-v1';
// Replaced by Vite with this deployment's fully qualified app asset paths.
const BUILD_ASSETS = [];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([
    ROOT, ROOT + 'icon.svg', ROOT + 'icon-192.png', ROOT + 'icon-512.png',
    ROOT + 'manifest.webmanifest', ...BUILD_ASSETS
  ])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(ROOT)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(() => caches.match(event.request).then(response => response || (
    event.request.mode === 'navigate' ? caches.match(ROOT) : Response.error()
  ))));
});
