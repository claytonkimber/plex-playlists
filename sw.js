// The old Plex Playlists service worker updates to this one, which removes
// the old caches and then itself, so the old app stops loading from cache.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (/^plex-playlists-v\d+$/.test(k)) await caches.delete(k);
    await self.registration.unregister();
  })());
});
