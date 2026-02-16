// Fire Inspection App - Service Worker
// Version 1.0.0
// Provides offline support and caching for PWA functionality

const CACHE_NAME = 'fire-inspection-v1';
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
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached version and update cache in background
                    fetch(request).then(networkResponse => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, networkResponse);
                            });
                        }
                    }).catch(() => {
                        // Network failed, cached version is already being returned
                    });
                    return cachedResponse;
                }
                
                // Not in cache - fetch from network and cache it
                return fetch(request).then(networkResponse => {
                    // Only cache successful responses
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                        return networkResponse;
                    }
                    
                    // Cache CDN resources (CSS, JS libraries)
                    if (request.url.includes('cdn.') || 
                        request.url.includes('unpkg.com') ||
                        request.url.includes('jsdelivr')) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, responseToCache);
                        });
                    }
                    
                    return networkResponse;
                }).catch(() => {
                    // Network request failed and not in cache
                    // Return a basic offline page if available
                    return new Response('Offline - Please check your connection', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                });
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
