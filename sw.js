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

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        ASSETS.map(function (url) {
          return cache.add(url).catch(function () {});
        })
      );
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    Promise.all([
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.map(function (k) {
            if (k !== CACHE_NAME) return caches.delete(k);
          })
        );
      }),
      self.clients.claim()
    ])
  );
});
