const CACHE_NAME = "wedkarski-cache-v12";

const ASSETS = [
  "",
  "index.html",
  "styles.css",
  "storage.js",
  "app.js",
  "manifest.webmanifest",
  "utils/helper.js",
  "utils/images.js",
  "utils/location.js",
  "data/trips.js",
  "data/fish.js",
  "views/home.js",
  "views/trips.js",
  "views/addTrip.js",
  "views/tripDetails.js",
  "views/editTrip.js",
  "views/editFish.js",
  "icons/android/android-launchericon-192-192.png",
  "icons/android/android-launchericon-512-512.png",
  "icons/android/android-launchericon-96-96.png"
];

function u(path) {
  return new URL(path, self.registration.scope).toString();
}

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.add(u("index.html")).then(function () {
        return Promise.all(
          ASSETS.map(function (p) {
            return cache.add(u(p)).catch(function () {});
          })
        );
      });
    })
  );
  self.skipWaiting();
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

function isNavigation(req) {
  return req.mode === "navigate";
}

self.addEventListener("fetch", function (e) {
  const req = e.request;

  if (req.method !== "GET") return;

  if (isNavigation(req)) {
    e.respondWith(
      fetch(req)
      .then(function (res) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(u("index.html"), copy).catch(function () {});
        });
        return res;
      })
      .catch(function () {
        return caches.match(u("index.html"));
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;

      return fetch(req)
        .then(function (res) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(req, copy).catch(function () {});
          });
          return res;
        })
        .catch(function () {
          return new Response("", {
            status: 504,
            statusText: "Offline"
          });
        });
    })
  );
});