const CACHE_NAME = 'kaarigar-v1';
const URLS_TO_CACHE = [
  '/kaarigar/',
  '/kaarigar/index.html',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});

// Push notifications
self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'KaariGar', {
      body: data.body || 'Aapke liye ek nayi booking request hai!',
      icon: '/kaarigar/icon.svg',
      badge: '/kaarigar/icon.svg',
      data: data,
      actions: [
        { action: 'view', title: 'Dekho' },
        { action: 'dismiss', title: 'Baad Mein' }
      ]
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/kaarigar/'));
});
