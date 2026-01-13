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

function setTextById(id, text) {
  var el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getRoute() {
  return location.hash || "#home";
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
