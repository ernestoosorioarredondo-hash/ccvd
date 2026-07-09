// Service Worker CCVD — estrategia network-first con respaldo en caché
// (siempre intenta traer la versión nueva; sin internet usa la guardada)
const CACHE = 'ccvd-v4';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Solo interceptar recursos del mismo origen. Las imágenes externas (logos y fotos
  // hotlinkeadas desde valenzueladelarze.cl) deben ir directo al navegador para conservar
  // su referrer; si el SW las re-fetchea, el WordPress bloquea el hotlink y no cargan.
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r.ok && new URL(e.request.url).origin === location.origin) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      })
      .catch(() =>
        caches.match(e.request, { ignoreSearch: true })
          .then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : Promise.reject('offline')))
      )
  );
});
