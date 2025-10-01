// SERVICE WORKER DISABLED FOR DEVELOPMENT
// This was causing aggressive caching and preventing hot-reload during development

// Install event - immediately skip waiting and unregister
self.addEventListener('install', (event) => {
  console.log('🚫 [ServiceWorker] DISABLED - Skipping installation');
  self.skipWaiting();
});

// Activate event - DELETE ALL CACHES and unregister
self.addEventListener('activate', (event) => {
  console.log('🧹 [ServiceWorker] DISABLED - Clearing all caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('🗑️ [ServiceWorker] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ [ServiceWorker] All caches cleared');
      // Unregister this service worker
      return self.registration.unregister();
    })
  );
  self.clients.claim();
});

// Fetch event - DISABLED - No caching, always fetch from network
self.addEventListener('fetch', (event) => {
  // Do nothing - let all requests go directly to network
  console.log('🌐 [ServiceWorker] DISABLED - Passing through to network:', event.request.url);
  return;
});

// ALL OTHER SERVICE WORKER FEATURES DISABLED
console.log('🚫 [ServiceWorker] All caching and offline features disabled for development');