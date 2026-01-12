var CACHE_NAME = "wedkarski-cache-v1";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./storage.js",
  "./app.js",
  "./views/home.js",
  "./views/trips.js",
  "./views/addTrip.js",
  "./views/tripDetails.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      var tasks = [];
      for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== CACHE_NAME) tasks.push(caches.delete(keys[i]));
      }
      return Promise.all(tasks);
    })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;

      return fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(req, copy);
        });
        return res;
      }).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});
