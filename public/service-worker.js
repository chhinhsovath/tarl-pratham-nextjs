const CACHE_NAME = 'tarl-pratham-v1';
const OFFLINE_CACHE = 'tarl-offline-v1';
const DATA_CACHE = 'tarl-data-v1';

// Core files to cache for offline functionality
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API routes that can work offline
const OFFLINE_API_ROUTES = [
  '/api/pilot-schools',
  '/api/users/profile',
  '/api/students'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(STATIC_CACHE_URLS);
    }).catch((err) => {
      console.error('[ServiceWorker] Pre-caching failed:', err);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && 
                   cacheName !== DATA_CACHE && 
                   cacheName !== OFFLINE_CACHE;
          })
          .map((cacheName) => {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          // Cache successful API responses
          if (response.status === 200) {
            caches.open(DATA_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          
          return response;
        })
        .catch(() => {
          // Try to serve from cache when offline
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            
            // Return offline data for specific routes
            if (OFFLINE_API_ROUTES.some(route => url.pathname.includes(route))) {
              return new Response(
                JSON.stringify({ 
                  offline: true, 
                  message: 'Offline data', 
                  data: [] 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' },
                  status: 200
                }
              );
            }
            
            return new Response(
              JSON.stringify({ error: 'Offline' }),
              { 
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            );
          });
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/offline').then((response) => {
            return response || caches.match('/');
          });
        })
    );
    return;
  }

  // Handle other requests (CSS, JS, images)
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle background sync for offline data submission
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-assessments') {
    event.waitUntil(syncAssessments());
  }
});

// Sync offline assessments when back online
async function syncAssessments() {
  try {
    const cache = await caches.open('offline-assessments');
    const requests = await cache.keys();
    
    const promises = requests.map(async (request) => {
      const response = await cache.match(request);
      const data = await response.json();
      
      // Retry the original request
      const result = await fetch(request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (result.ok) {
        // Remove from cache after successful sync
        await cache.delete(request);
      }
      
      return result;
    });
    
    await Promise.all(promises);
    
    // Notify clients about successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        message: 'Assessments synced successfully'
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('TaRL Pratham', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});