// Google Workbox encapsulates low-level APIs, like the Service Worker API and Cache Storage API, and exposes more developer-friendly interfaces
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// cache name, should be updated with any major change to the cached items
const appCache = 'actewagl-pwa-cache-v1';

// offline page
const offlineFallback = '/pwa/offline.html';

// a way to force a new service worker to install itself via the message event
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'skipWaiting') {
        self.skipWaiting();
    }
});

// add the offline page to cache on service worker install
self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(appCache)
        .then((cache) => cache.add(offlineFallback))
    );
});

// will handle checking at runtime to see if the current browser supports navigation preload, and if it does, it will automatically create an activate event handler to enable it
if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
}

// check to see if a page can be served, fallback to the offline page if not
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                const cache = await caches.open(appCache);
                const cachedResponse = await cache.match(offlineFallback);
                return cachedResponse;
            }
        })());
    }
});
