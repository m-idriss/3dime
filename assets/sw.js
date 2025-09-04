/* ==============================================
   3DIME - Service Worker for PWA Functionality
   
   Provides offline capabilities and caching strategies
   for the 3dime personal social hub website.
   
   @module sw
   @version 1.0
   @author Idriss Mohamady
   @since 2024
   ============================================== */

const CACHE_NAME = '3dime-v1.0';
const OFFLINE_URL = '/';

// Files to cache for offline functionality
const CACHE_FILES = [
  '/',
  '/index.html',
  '/assets/styles-enhanced.css',
  '/assets/js/main.js',
  '/assets/js/config.js',
  '/assets/js/content.js',
  '/assets/js/ui.js',
  '/assets/js/fallbacks.js',
  '/assets/logo.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/structured-data.jsonld'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching essential files');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('SW: Installed successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW: Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If network fails and no cache, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', event => {
  console.log('SW: Background sync triggered');
  // Handle background sync tasks here if needed
});

// Push notification handler (for future use)
self.addEventListener('push', event => {
  console.log('SW: Push message received');
  // Handle push notifications here if needed
});