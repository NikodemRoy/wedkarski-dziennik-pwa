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

function viewHome() {
  var trips = loadTrips();
  return (
    "<h1>Start</h1>" +
    "<p>Wpisów: " + trips.length + "</p>" +
    "<p><a href=\"#add-trip\">Dodaj wpis</a></p>" +
    "<p><a href=\"#trips\">Zobacz wpisy</a></p>"
  );
}

function viewTrips() {
  var trips = loadTrips();
  var html = "<h1>Wpisy</h1>";

  if (trips.length === 0) {
    return html +
      "<p>Brak wpisów.</p>" +
      "<p><a href=\"#add-trip\">Dodaj pierwszy wpis</a></p>";
  }

  html += "<ul>";

  for (var i = 0; i < trips.length; i++) {
    var t = trips[i];
    html +=
      "<li>" +
      "<strong>" + escapeText(t.lakeName) + "</strong>" +
      " (" + escapeText(t.date) + ")" +
      " " +
      "<button data-action=\"open-trip\" data-id=\"" + escapeText(t.id) + "\">Otwórz</button>" +
      " " +
      "<button data-action=\"delete-trip\" data-id=\"" + escapeText(t.id) + "\">Usuń</button>" +
      "</li>";
  }

  html += "</ul>";
  html += "<p><a href=\"#add-trip\">Dodaj kolejny wpis</a></p>";

  return html;
}

function fishListHtml(tripId, fish) {
  if (!fish || fish.length === 0) return "<p>Brak ryb.</p>";

  var html = "<ul>";
  for (var i = 0; i < fish.length; i++) {
    var f = fish[i];
    var len = f.length ? " (" + escapeText(f.length) + " cm)" : "";

    html +=
      "<li>" +
      "<strong>" + escapeText(f.species) + "</strong>" +
      len +
      (f.notes ? " - " + escapeText(f.notes) : "") +
      " " +
      "<button data-action=\"delete-fish\" data-trip-id=\"" + escapeText(tripId) + "\" data-fish-id=\"" + escapeText(f.id) + "\">Usuń</button>" +
      "</li>";
  }
  html += "</ul>";
  return html;
}

function viewTripDetails(id) {
  var trips = loadTrips();
  var idx = findTripIndexById(id, trips);

  if (idx === -1) {
    return (
      "<h1>Wpis</h1>" +
      "<p>Nie znaleziono wpisu.</p>" +
      "<p><a href=\"#trips\">Wróć</a></p>"
    );
  }

  var t = trips[idx];
  if (!Array.isArray(t.fish)) t.fish = [];

  var notes = t.notes ? escapeText(t.notes).replaceAll("\n", "<br>") : "";

  return (
    "<h1>Wpis</h1>" +
    "<p><strong>Łowisko:</strong> " + escapeText(t.lakeName) + "</p>" +
    "<p><strong>Data:</strong> " + escapeText(t.date) + "</p>" +
    "<p><strong>Notatki:</strong><br>" + (notes || "-") + "</p>" +
    "<p>" +
    "<button data-action=\"delete-trip\" data-id=\"" + escapeText(t.id) + "\">Usuń wpis</button>" +
    " " +
    "<a href=\"#trips\">Wróć do listy</a>" +
    "</p>" +
    "<hr>" +
    "<h2>Ryby</h2>" +
    fishListHtml(t.id, t.fish) +
    "<h3>Dodaj rybę</h3>" +
    "<form id=\"addFishForm\" data-trip-id=\"" + escapeText(t.id) + "\">" +
    "<div class=\"row\">" +
    "<label>Gatunek</label><br>" +
    "<input id=\"fishSpecies\" type=\"text\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Długość (cm, opcjonalnie)</label><br>" +
    "<input id=\"fishLength\" type=\"number\" min=\"0\">" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Notatka (opcjonalnie)</label><br>" +
    "<textarea id=\"fishNotes\" rows=\"3\"></textarea>" +
    "</div>" +
    "<div class=\"row\">" +
    "<button type=\"submit\">Dodaj</button>" +
    "</div>" +
    "</form>"
  );
}

function viewAddTrip() {
  var today = new Date().toISOString().slice(0, 10);

  return (
    "<h1>Nowy wpis</h1>" +
    "<form id=\"addTripForm\">" +
    "<div class=\"row\">" +
    "<label>Nazwa łowiska</label><br>" +
    "<input id=\"lakeName\" type=\"text\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Data</label><br>" +
    "<input id=\"tripDate\" type=\"date\" value=\"" + today + "\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Notatki</label><br>" +
    "<textarea id=\"tripNotes\" rows=\"4\"></textarea>" +
    "</div>" +
    "<div class=\"row\">" +
    "<button type=\"submit\">Zapisz</button>" +
    " " +
    "<a href=\"#trips\">Anuluj</a>" +
    "</div>" +
    "</form>"
  );
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

function handleClick(e) {
  var el = e.target;
  if (!el || !el.dataset) return;

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

    if (!lakeName) return;

    var trips = loadTrips();
    var id = makeId();

    trips.unshift({
      id: id,
      lakeName: lakeName,
      date: date,
      notes: notes,
      fish: []
    });

    saveTrips(trips);
    location.hash = "#trip/" + id;
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
