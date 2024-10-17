// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
// The name of the cache your app uses.
const CACHE_NAME = "my-app-cache";
// The list of static files your app needs to start.
// Note the offline page in this list.
const PRE_CACHED_RESOURCES = ["/offline"];

// Listen to the `install` event.
self.addEventListener("install", event => {
    self.skipWaiting();
    async function preCacheResources() {
        // Open the app's cache.
        const cache = await caches.open(CACHE_NAME);
        // Cache all static resources.
        cache.addAll(PRE_CACHED_RESOURCES);
    }
    event.waitUntil(preCacheResources());
    console.log('install event');
});

self.addEventListener("fetch", event => {
    async function navigateOrDisplayOfflinePage() {
        try {
            // Try to load the page from the network.
            const networkResponse = await fetch(event.request);
            return networkResponse;
        } catch (error) {
            // The network call failed, the device is offline.
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match("/offline");
            return cachedResponse;
        }
    }
    console.log('fetch event');
    console.log(event);

    // Only call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === 'navigate' || event.request.mode === 'cors') {
        console.log('navigate');
        event.respondWith(navigateOrDisplayOfflinePage());
    }
});
