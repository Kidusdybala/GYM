// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('gym-app-v1').then((cache) => {
      return cache.addAll([
        '/',
        // add all your videos here
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
