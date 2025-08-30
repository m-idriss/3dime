/* =========================
   Enhanced Service Worker with Intelligent Caching
   ========================= */

const CACHE_NAME = '3dime-v2';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/assets/styles-enhanced.css',
  '/assets/js/main.js',
  '/assets/js/config.js',
  '/assets/js/content.js',
  '/assets/js/language.js',
  '/assets/js/ui.js',
  '/assets/js/badges.js',
  '/assets/js/heatmap.js',
  '/assets/js/fallbacks.js',
  '/assets/manifest.json',
  '/assets/logo.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon.png',
  '/i18n/en.json',
  '/i18n/fr.json',
  '/favicon.ico'
];

// Network-first resources (always fresh when online)
const NETWORK_FIRST = [
  '/i18n/',
  'api.github.com'
];

// Cache-first resources (static assets)
const CACHE_FIRST = [
  '/assets/',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

/* =========================
   Install Event - Cache Critical Assets
   ========================= */
self.addEventListener('install', (event) => {
  console.log('SW: Installing and caching critical assets');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log('SW: Critical assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(error => {
        console.error('SW: Failed to cache assets:', error);
      })
  );
});

/* =========================
   Activate Event - Clean Old Caches
   ========================= */
self.addEventListener('activate', (event) => {
  console.log('SW: Activating and cleaning old caches');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('SW: Cache cleanup complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

/* =========================
   Fetch Event - Intelligent Caching Strategy
   ========================= */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Determine caching strategy based on URL patterns
  if (isNetworkFirst(url.href)) {
    event.respondWith(networkFirst(request));
  } else if (isCacheFirst(url.href)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

/* =========================
   Caching Strategy Functions
   ========================= */

function isNetworkFirst(url) {
  return NETWORK_FIRST.some(pattern => url.includes(pattern));
}

function isCacheFirst(url) {
  return CACHE_FIRST.some(pattern => url.includes(pattern));
}

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline fallback for critical resources
    return createOfflineResponse(request);
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('SW: Failed to fetch asset:', request.url);
    return createOfflineResponse(request);
  }
}

// Stale-while-revalidate strategy (for general content)
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    console.log('SW: Network failed for:', request.url);
    return cachedResponse || createOfflineResponse(request);
  });
  
  return cachedResponse || fetchPromise;
}

// Create appropriate offline responses
function createOfflineResponse(request) {
  const url = new URL(request.url);
  
  if (request.destination === 'document') {
    return new Response(
      `<!DOCTYPE html>
      <html><head><title>Offline - 3dime</title></head>
      <body><h1>You're offline</h1>
      <p>Please check your internet connection and try again.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
  
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy="0.3em" font-family="sans-serif" font-size="14" fill="#999">Image offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  return new Response('Resource not available offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}