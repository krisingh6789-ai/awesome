const ROOT = new URL('./', self.location.href).pathname;
const PREFIX = 'abhyas-' + ROOT.replace(/\W/g, '_') + '-';
const CACHE = PREFIX + '7fb4a95a18';
// Replaced by Vite with this deployment's fully qualified app asset paths.
const BUILD_ASSETS = ["/awesome/assets/curriculum-Thf-6b7t.js","/awesome/assets/dm-sans-latin-ext-wght-normal-BOFOeGcA.woff2","/awesome/assets/dm-sans-latin-wght-normal-Xz1IZZA0.woff2","/awesome/assets/index-C6cSB_eJ.css","/awesome/assets/index-DXka9P9O.js","/awesome/assets/manrope-cyrillic-wght-normal-Dvxsihut.woff2","/awesome/assets/manrope-greek-wght-normal-DL7QRZyv.woff2","/awesome/assets/manrope-latin-ext-wght-normal-Ch3YOpNY.woff2","/awesome/assets/manrope-latin-wght-normal-DHIcAJRg.woff2","/awesome/assets/manrope-vietnamese-wght-normal-usUDDRr7.woff2","/awesome/assets/noto-sans-devanagari-devanagari-wght-normal-DWI_L5Cu.woff2","/awesome/assets/noto-sans-devanagari-latin-ext-wght-normal-CLkupaxV.woff2","/awesome/assets/noto-sans-devanagari-latin-wght-normal-Bxfr4UJH.woff2","/awesome/assets/vendor-ScHDSkcc.js","/awesome/assets/vendor-xrib2C25.css"];
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
