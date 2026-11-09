// Connect.a: cache the app shell so it opens instantly and offline. Data and API calls are never cached here.
var V = 'connecta-shell-c9fb4010e2';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png', './icons/wordmark.png'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); })); })); self.clients.claim(); });
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;            // API calls go straight to the network
  if (/version\.txt$/.test(u.pathname)) return;        // the update check must always reach the server
  // network first, past the browser's HTTP cache too (GitHub Pages says max-age=600), so updates arrive on the next open
  var req = e.request.mode === 'navigate' ? new Request(u.href, { cache: 'no-cache', credentials: 'same-origin' }) : e.request;
  e.respondWith(fetch(req).then(function(r){
    var copy = r.clone(); caches.open(V).then(function(c){ c.put(e.request, copy); }); return r;
  }).catch(function(){ return caches.match(e.request).then(function(m){ return m || caches.match('./index.html'); }); }));
});
