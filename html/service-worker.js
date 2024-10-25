// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
// The name of the cache your app uses.
const cacheName = 'actewagl-pwa-cache';
// The list of static files your app needs to start.
// Note the offline page in this list.
const cachedResources = [
    '/offline.html'
];

// install event
self.addEventListener('install', event => {
    // self.skipWaiting();
    async function preCacheResources() {
        // Open the app's cache.
        const cache = await caches.open(cacheName);
        // Cache all static resources.
        cache.addAll(cachedResources);
    }
    event.waitUntil(preCacheResources());
    console.info('install event');
});

// fetch event
self.addEventListener('fetch', event => {
    async function navigateOrDisplayOfflinePage() {
        try {
            // Try to load the page from the network.
            const networkResponse = await fetch(event.request);
            return networkResponse;
        } catch (error) {
            // The network call failed, the device is offline.
            const cache = await caches.open(cacheName);
            const cachedResponse = await cache.match('/offline.html');
            return cachedResponse;
        }
    }
    if (event.request.mode === 'navigate') {
        console.log(event.request.mode);
        event.respondWith(navigateOrDisplayOfflinePage());
    }
    console.info('fetch event');
});
