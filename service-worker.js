// Fire Inspection App - Service Worker
// Version 1.1.0
// Provides offline support and caching for PWA functionality

const CACHE_NAME = 'fire-inspection-v5';
const STATIC_CACHE = [
    '/',
    '/index.html',
    // CDN resources will be cached at runtime
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_CACHE);
            })
            .then(() => self.skipWaiting()) // Activate immediately
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control immediately
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip Firebase and external API calls - always use network
    if (request.url.includes('firebaseapp.com') || 
        request.url.includes('googleapis.com') ||
        request.url.includes('firestore') ||
        request.url.includes('firebase')) {
        return;
    }
    
    // CRITICAL: HTML navigation requests must ALWAYS be network-first.
    // Stale-while-revalidate on HTML causes iOS devices to show old/broken cached versions.
    const isHTMLRequest = request.mode === 'navigate' ||
        request.destination === 'document' ||
        request.url.endsWith('/') ||
        request.url.endsWith('/index.html');

    if (isHTMLRequest) {
        // Network-first for HTML: always try network, fall back to cache only if offline
        event.respondWith(
            fetch(request)
                .then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // For non-HTML assets (CDN scripts, images etc): stale-while-revalidate
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Kick off background refresh
                const fetchPromise = fetch(request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => cache.put(request, networkResponse.clone()));
                    }
                    return networkResponse;
                }).catch(() => null);

                if (cachedResponse) {
                    return cachedResponse;
                }

                // Not in cache — wait for network
                return fetchPromise.then(response => response || new Response('Offline', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({ 'Content-Type': 'text/plain' })
                }));
            })
    );
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // Clear cache on demand
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                console.log('[Service Worker] All caches cleared');
            })
        );
    }
});
