// Connect.a: cache the app shell so it opens instantly and offline. Data and API calls are never cached here.
var V = 'connecta-shell-25464288';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icons/apple-touch-icon.png', './icons/icon-192.png', './icons/icon-512.png', './icons/wordmark.png'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); })); })); self.clients.claim(); });
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;            // API calls go straight to the network
  e.respondWith(fetch(e.request).then(function(r){      // network first, so updates arrive on the next open
    var copy = r.clone(); caches.open(V).then(function(c){ c.put(e.request, copy); }); return r;
  }).catch(function(){ return caches.match(e.request).then(function(m){ return m || caches.match('./index.html'); }); }));
});
