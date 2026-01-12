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

  saveTrips(next);
}

function addFishToTrip(tripId, fish) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return;

  if (!Array.isArray(trips[idx].fish)) trips[idx].fish = [];
  trips[idx].fish.unshift(fish);

  saveTrips(trips);
}

function deleteFish(tripId, fishId) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return;

  var fish = trips[idx].fish;
  if (!Array.isArray(fish)) fish = [];

  var next = [];
  for (var i = 0; i < fish.length; i++) {
    if (fish[i].id !== fishId) next.push(fish[i]);
  }

  trips[idx].fish = next;
  saveTrips(trips);
}

function setLocationStatus(text) {
  var el = document.getElementById("locStatus");
  if (el) el.textContent = text;
}

function setCoverStatus(text) {
  var el = document.getElementById("coverStatus");
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
    deleteTripById(el.dataset.id);
    location.hash = "#trips";
    return;
  }

  if (el.dataset.action === "delete-fish") {
    deleteFish(el.dataset.tripId, el.dataset.fishId);
    render();
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
      saveTripObject({
        id: id,
        lakeName: lakeName,
        date: date,
        notes: notes,
        location: locationObj,
        coverPhoto: "",
        fish: []
      });
      location.hash = "#trip/" + id;
      return;
    }

    setCoverStatus("Wczytywanie zdjęcia...");

    readFileAsDataUrl(file, function (dataUrl) {
      saveTripObject({
        id: id,
        lakeName: lakeName,
        date: date,
        notes: notes,
        location: locationObj,
        coverPhoto: dataUrl,
        fish: []
      });
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

    if (!species) return;

    addFishToTrip(tripId, {
      id: makeId(),
      species: species,
      length: length,
      notes: notes2
    });

    render();
  }
}

function saveTripObject(trip) {
  var trips = loadTrips();
  trips.unshift(trip);
  saveTrips(trips);
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
