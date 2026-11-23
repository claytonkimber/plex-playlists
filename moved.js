'use strict';
// Plex Playlists moved to https://quickplaylist.github.io/. This page removes
// what the old app left on this shared address: its sign-in and settings
// (localStorage keys that start with "pp."), its caches and its service
// worker. Other apps on this address are left alone.

const NEW_HOME = 'https://quickplaylist.github.io/';

// Keep a playlist shortcut working: the new app uses the same #/p/<server>/<playlist> links.
const go = document.getElementById('go');
if (/^#\/p\/[^/?#]+\/[^/?#]+$/.test(location.hash)) go.href = NEW_HOME + location.hash;

(async () => {
  let removed = 0;
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith('pp.')) { localStorage.removeItem(k); removed++; }
  } catch { /* storage blocked: nothing to remove */ }
  try {
    for (const k of await caches.keys()) if (/^plex-playlists-v\d+$/.test(k)) await caches.delete(k);
  } catch { /* no cache storage */ }
  try {
    const here = new URL('./', location.href).href;
    for (const r of await navigator.serviceWorker.getRegistrations()) if (r.scope === here) await r.unregister();
  } catch { /* no service workers */ }
  document.getElementById('status').textContent = removed
    ? 'The old sign-in and settings were removed from this browser.'
    : 'Nothing of the old app is left in this browser.';
})();
