var CACHE_NAME = "wedkarski-cache-v4";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./storage.js",
  "./app.js",
  "./manifest.webmanifest",
  "./utils/helper.js",
  "./utils/images.js",
  "./utils/location.js",
  "./data/trips.js",
  "./data/fish.js",
  "./views/home.js",
  "./views/trips.js",
  "./views/addTrip.js",
  "./views/tripDetails.js",
  "./views/editTrip.js",
  "./views/editFish.js",
  "./icons/android/android-launchericon-192-192.png",
  "./icons/android/android-launchericon-512-512.png",
  "./icons/android/android-launchericon-96-96.png"
];

self.addEventListener("fetch", function (e) {
  var req = e.request;

  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put("./index.html", copy).catch(function () {});
          });
          return res;
        })
        .catch(function () {
          return caches.match("./index.html");
        })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;

      return fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, copy).catch(function () {});
          });
          return res;
        })
        .catch(function () {
          return cached;
        });
    })
  );
});
