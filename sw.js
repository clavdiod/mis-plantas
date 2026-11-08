// Siempre busca la versión nueva en internet; usa la copia guardada solo si no hay señal.
const C = "mis-plantas-v5";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, {cache: "no-store"})
      .then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
