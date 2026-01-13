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

function getEditTripIdFromRoute(route) {
  if (!route.startsWith("#edit-trip/")) return null;
  var id = route.slice(11);
  if (!id) return null;
  return id;
}

function getEditFishFromRoute(route) {
  if (!route.startsWith("#edit-fish/")) return null;
  var rest = route.slice(11);
  if (!rest) return null;
  var parts = rest.split("/");
  if (parts.length !== 2) return null;
  return { tripId: parts[0], fishId: parts[1] };
}

function findTripIndexById(id, trips) {
  for (var i = 0; i < trips.length; i++) {
    if (trips[i].id === id) return i;
  }
  return -1;
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

function fillLocationInputs(latId, lngId, lat, lng) {
  var latEl = document.getElementById(latId);
  var lngEl = document.getElementById(lngId);
  if (latEl) latEl.value = lat;
  if (lngEl) lngEl.value = lng;
}

function getLocationToInputs(latId, lngId) {
  if (!navigator.geolocation) {
    setLocationStatus("Brak geolokalizacji w przeglądarce.");
    return;
  }

  setLocationStatus("Pobieranie...");

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var lat = String(pos.coords.latitude);
      var lng = String(pos.coords.longitude);
      fillLocationInputs(latId, lngId, lat, lng);
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

function deleteTripById(id) {
  var trips = loadTrips();
  var next = [];

  for (var i = 0; i < trips.length; i++) {
    if (trips[i].id !== id) next.push(trips[i]);
  }

  return saveTrips(next);
}

function saveTripObject(trip) {
  var trips = loadTrips();
  trips.unshift(trip);
  return saveTrips(trips);
}

function updateTrip(id, patch) {
  var trips = loadTrips();
  var idx = findTripIndexById(id, trips);
  if (idx === -1) return false;

  var t = trips[idx];

  if (patch.lakeName !== undefined) t.lakeName = patch.lakeName;
  if (patch.date !== undefined) t.date = patch.date;
  if (patch.notes !== undefined) t.notes = patch.notes;
  if (patch.location !== undefined) t.location = patch.location;
  if (patch.coverPhoto !== undefined) t.coverPhoto = patch.coverPhoto;

  return saveTrips(trips);
}

function addFishToTrip(tripId, fish) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return true;

  if (!Array.isArray(trips[idx].fish)) trips[idx].fish = [];
  trips[idx].fish.unshift(fish);

  return saveTrips(trips);
}

function updateFish(tripId, fishId, patch) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return false;

  if (!Array.isArray(trips[idx].fish)) trips[idx].fish = [];

  var fish = trips[idx].fish;
  var f = null;

  for (var i = 0; i < fish.length; i++) {
    if (fish[i].id === fishId) f = fish[i];
  }

  if (!f) return false;

  if (patch.species !== undefined) f.species = patch.species;
  if (patch.length !== undefined) f.length = patch.length;
  if (patch.notes !== undefined) f.notes = patch.notes;
  if (patch.photo !== undefined) f.photo = patch.photo;

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

function handleClick(e) {
  var el = e.target;
  if (!el || !el.dataset) return;

  if (el.dataset.action === "get-location") {
    getLocationToInputs("tripLat", "tripLng");
    return;
  }

  if (el.dataset.action === "get-location-edit") {
    getLocationToInputs("editTripLat", "editTripLng");
    return;
  }

  if (el.dataset.action === "open-trip") {
    location.hash = "#trip/" + el.dataset.id;
    return;
  }

  if (el.dataset.action === "edit-trip") {
    location.hash = "#edit-trip/" + el.dataset.id;
    return;
  }

  if (el.dataset.action === "edit-fish") {
    location.hash = "#edit-fish/" + el.dataset.tripId + "/" + el.dataset.fishId;
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

  if (e.target.id === "editTripForm") {
    e.preventDefault();

    var tripId = e.target.dataset.tripId;
    var lakeName2 = document.getElementById("editLakeName").value.trim();
    var date2 = document.getElementById("editTripDate").value;
    var notes3 = document.getElementById("editTripNotes").value.trim();
    var lat2 = document.getElementById("editTripLat").value.trim();
    var lng2 = document.getElementById("editTripLng").value.trim();
    var fileEl2 = document.getElementById("editTripCover");

    if (!lakeName2) return;

    var locationObj2 = null;
    if (lat2 && lng2) locationObj2 = { lat: lat2, lng: lng2 };

    var file2 = fileEl2 && fileEl2.files && fileEl2.files[0] ? fileEl2.files[0] : null;

    if (!file2) {
      var ok3 = updateTrip(tripId, {
        lakeName: lakeName2,
        date: date2,
        notes: notes3,
        location: locationObj2
      });

      if (!ok3) {
        setCoverStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId;
      return;
    }

    setCoverStatus("Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file2, 900, 0.7, function (dataUrl2) {
      if (!dataUrl2) {
        setCoverStatus("Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok4 = updateTrip(tripId, {
        lakeName: lakeName2,
        date: date2,
        notes: notes3,
        location: locationObj2,
        coverPhoto: dataUrl2
      });

      if (!ok4) {
        setCoverStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId;
    });

    return;
  }

  if (e.target.id === "addFishForm") {
    e.preventDefault();

    var tripId2 = e.target.dataset.tripId;
    var species = document.getElementById("fishSpecies").value.trim();
    var length = document.getElementById("fishLength").value.trim();
    var notes2 = document.getElementById("fishNotes").value.trim();
    var photoEl = document.getElementById("fishPhoto");

    if (!species) return;

    var file = photoEl && photoEl.files && photoEl.files[0] ? photoEl.files[0] : null;

    if (!file) {
      var ok5 = addFishToTrip(tripId2, {
        id: makeId(),
        species: species,
        length: length,
        notes: notes2,
        photo: ""
      });

      if (!ok5) {
        setFishPhotoStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      render();
      return;
    }

    setFishPhotoStatus("Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file, 700, 0.65, function (dataUrl3) {
      if (!dataUrl3) {
        setFishPhotoStatus("Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok6 = addFishToTrip(tripId2, {
        id: makeId(),
        species: species,
        length: length,
        notes: notes2,
        photo: dataUrl3
      });

      if (!ok6) {
        setFishPhotoStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      render();
    });

    return;
  }

  if (e.target.id === "editFishForm") {
    e.preventDefault();

    var tripId3 = e.target.dataset.tripId;
    var fishId = e.target.dataset.fishId;

    var species2 = document.getElementById("editFishSpecies").value.trim();
    var length2 = document.getElementById("editFishLength").value.trim();
    var notes4 = document.getElementById("editFishNotes").value.trim();
    var photoEl2 = document.getElementById("editFishPhoto");

    if (!species2) return;

    var file3 = photoEl2 && photoEl2.files && photoEl2.files[0] ? photoEl2.files[0] : null;

    if (!file3) {
      var ok7 = updateFish(tripId3, fishId, {
        species: species2,
        length: length2,
        notes: notes4
      });

      if (!ok7) {
        setFishPhotoStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId3;
      return;
    }

    setFishPhotoStatus("Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file3, 700, 0.65, function (dataUrl4) {
      if (!dataUrl4) {
        setFishPhotoStatus("Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok8 = updateFish(tripId3, fishId, {
        species: species2,
        length: length2,
        notes: notes4,
        photo: dataUrl4
      });

      if (!ok8) {
        setFishPhotoStatus("Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId3;
    });
  }
}

function render() {
  var route = getRoute();

  var editTripId = getEditTripIdFromRoute(route);
  if (editTripId) {
    app.innerHTML = viewEditTrip(editTripId);
    return;
  }

  var ef = getEditFishFromRoute(route);
  if (ef) {
    app.innerHTML = viewEditFish(ef.tripId, ef.fishId);
    return;
  }

  var tripId = getTripIdFromRoute(route);
  if (tripId) {
    app.innerHTML = viewTripDetails(tripId);
    return;
  }

  if (route === "#home") app.innerHTML = viewHome();
  else if (route === "#trips") app.innerHTML = viewTrips();
  else if (route === "#add-trip") app.innerHTML = viewAddTrip();
  else location.hash = "#home";
}

window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);
window.addEventListener("hashchange", render);
window.addEventListener("load", render);
