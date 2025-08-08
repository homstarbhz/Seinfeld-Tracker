const CACHE_NAME = 'seinfeld-tracker-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        if(event.request.method === 'GET'){
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resp.clone()).catch(()=>{});
          });
        }
        return resp;
      }).catch(err => {
        return caches.match('./index.html');
      });
    })
  );
});