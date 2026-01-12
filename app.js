var app = document.getElementById("app");

function getRoute() {
  return location.hash || "#home";
}

function makeId() {
  return String(Date.now());
}

function escapeText(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getTripIdFromRoute(route) {
  if (!route.startsWith("#trip/")) return null;
  var id = route.slice(6);
  if (!id) return null;
  return id;
}

function findTripIndexById(id, trips) {
  for (var i = 0; i < trips.length; i++) {
    if (trips[i].id === id) return i;
  }
  return -1;
}

function deleteTripById(id) {
  var trips = loadTrips();
  var next = [];

  for (var i = 0; i < trips.length; i++) {
    if (trips[i].id !== id) next.push(trips[i]);
  }

  return saveTrips(next);
}

function addFishToTrip(tripId, fish) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return true;

  if (!Array.isArray(trips[idx].fish)) trips[idx].fish = [];
  trips[idx].fish.unshift(fish);

  return saveTrips(trips);
}

function deleteFish(tripId, fishId) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return true;

  var fish = trips[idx].fish;
  if (!Array.isArray(fish)) fish = [];

  var next = [];
  for (var i = 0; i < fish.length; i++) {
    if (fish[i].id !== fishId) next.push(fish[i]);
  }

  trips[idx].fish = next;
  return saveTrips(trips);
}

function setLocationStatus(text) {
  var el = document.getElementById("locStatus");
  if (el) el.textContent = text;
}

function setCoverStatus(text) {
  var el = document.getElementById("coverStatus");
  if (el) el.textContent = text;
}

function setFishPhotoStatus(text) {
  var el = document.getElementById("fishPhotoStatus");
  if (el) el.textContent = text;
}

function fillLocation(lat, lng) {
  var latEl = document.getElementById("tripLat");
  var lngEl = document.getElementById("tripLng");
  if (latEl) latEl.value = lat;
  if (lngEl) lngEl.value = lng;
}

function getLocation() {
  if (!navigator.geolocation) {
    setLocationStatus("Brak geolokalizacji w przeglądarce.");
    return;
  }

  setLocationStatus("Pobieranie...");

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var lat = String(pos.coords.latitude);
      var lng = String(pos.coords.longitude);
      fillLocation(lat, lng);
      setLocationStatus("Zapisano lokalizację.");
    },
    function () {
      setLocationStatus("Nie udało się pobrać lokalizacji.");
    }
  );
}

function readFileAsDataUrl(file, cb) {
  var reader = new FileReader();
  reader.onload = function () {
    cb(String(reader.result || ""));
  };
  reader.onerror = function () {
    cb("");
  };
  reader.readAsDataURL(file);
}

function compressImageDataUrl(dataUrl, maxSize, quality, cb) {
  var img = new Image();

  img.onload = function () {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;

    if (!w || !h) {
      cb("");
      return;
    }

    var scale = 1;
    if (w > h && w > maxSize) scale = maxSize / w;
    if (h >= w && h > maxSize) scale = maxSize / h;

    var nw = Math.max(1, Math.round(w * scale));
    var nh = Math.max(1, Math.round(h * scale));

    var canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, nw, nh);

    var out = "";
    try {
      out = canvas.toDataURL("image/jpeg", quality);
    } catch (e) {
      out = "";
    }

    cb(out);
  };

  img.onerror = function () {
    cb("");
  };

  img.src = dataUrl;
}

function fileToCompressedDataUrl(file, maxSize, quality, cb) {
  readFileAsDataUrl(file, function (dataUrl) {
    if (!dataUrl || !String(dataUrl).startsWith("data:image/")) {
      cb("");
      return;
    }
    compressImageDataUrl(dataUrl, maxSize, quality, function (out) {
      cb(out);
    });
  });
}

function saveTripObject(trip) {
  var trips = loadTrips();
  trips.unshift(trip);
  return saveTrips(trips);
}

function handleClick(e) {
  var el = e.target;
  if (!el || !el.dataset) return;

  if (el.dataset.action === "get-location") {
    getLocation();
    return;
  }

  if (el.dataset.action === "open-trip") {
    location.hash = "#trip/" + el.dataset.id;
    return;
  }

  if (el.dataset.action === "delete-trip") {
    var ok = deleteTripById(el.dataset.id);
    if (ok) location.hash = "#trips";
    return;
  }

  if (el.dataset.action === "delete-fish") {
    var ok2 = deleteFish(el.dataset.tripId, el.dataset.fishId);
    if (ok2) render();
    return;
  }
}

function handleSubmit(e) {
  if (!e.target) return;

  if (e.target.id === "addTripForm") {
    e.preventDefault();

    var lakeName = document.getElementById("lakeName").value.trim();
    var date = document.getElementById("tripDate").value;
    var notes = document.getElementById("tripNotes").value.trim();
    var lat = document.getElementById("tripLat").value.trim();
    var lng = document.getElementById("tripLng").value.trim();
    var fileEl = document.getElementById("tripCover");

    if (!lakeName) return;

    var locationObj = null;
    if (lat && lng) locationObj = { lat: lat, lng: lng };

    var id = makeId();

    var file = fileEl && fileEl.files && fileEl.files[0] ? fileEl.files[0] : null;
    if (!file) {
      var ok = saveTripObject({
        id: id,
        lakeName: lakeName,
        date: date,
        notes: notes,
        location: locationObj,
        coverPhoto: "",
        fish: []
      });

      if (!ok) {
        setCoverStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + id;
      return;
    }

    setCoverStatus("Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file, 900, 0.7, function (dataUrl) {
      if (!dataUrl) {
        setCoverStatus("Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok2 = saveTripObject({
        id: id,
        lakeName: lakeName,
        date: date,
        notes: notes,
        location: locationObj,
        coverPhoto: dataUrl,
        fish: []
      });

      if (!ok2) {
        setCoverStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + id;
    });

    return;
  }

  if (e.target.id === "addFishForm") {
    e.preventDefault();

    var tripId = e.target.dataset.tripId;
    var species = document.getElementById("fishSpecies").value.trim();
    var length = document.getElementById("fishLength").value.trim();
    var notes2 = document.getElementById("fishNotes").value.trim();
    var photoEl = document.getElementById("fishPhoto");

    if (!species) return;

    var file = photoEl && photoEl.files && photoEl.files[0] ? photoEl.files[0] : null;
    if (!file) {
      var ok3 = addFishToTrip(tripId, {
        id: makeId(),
        species: species,
        length: length,
        notes: notes2,
        photo: ""
      });

      if (!ok3) {
        setFishPhotoStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      render();
      return;
    }

    setFishPhotoStatus("Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file, 700, 0.65, function (dataUrl) {
      if (!dataUrl) {
        setFishPhotoStatus("Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok4 = addFishToTrip(tripId, {
        id: makeId(),
        species: species,
        length: length,
        notes: notes2,
        photo: dataUrl
      });

      if (!ok4) {
        setFishPhotoStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      render();
    });
  }
}

function render() {
  var route = getRoute();
  var tripId = getTripIdFromRoute(route);

  if (tripId) app.innerHTML = viewTripDetails(tripId);
  else if (route === "#home") app.innerHTML = viewHome();
  else if (route === "#trips") app.innerHTML = viewTrips();
  else if (route === "#add-trip") app.innerHTML = viewAddTrip();
  else location.hash = "#home";
}

window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);
window.addEventListener("hashchange", render);
window.addEventListener("load", render);
