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

function findTripById(id) {
  var trips = loadTrips();
  for (var i = 0; i < trips.length; i++) {
    if (trips[i].id === id) return trips[i];
  }
  return null;
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
      "<a href=\"#trip/" + escapeText(t.id) + "\">" +
      "<strong>" + escapeText(t.lakeName) + "</strong>" +
      " (" + escapeText(t.date) + ")" +
      "</a>" +
      " " +
      "<button data-action=\"delete-trip\" data-id=\"" + escapeText(t.id) + "\">Usuń</button>" +
      "</li>";
  }

  html += "</ul>";
  html += "<p><a href=\"#add-trip\">Dodaj kolejny wpis</a></p>";

  return html;
}

function viewTripDetails(id) {
  var t = findTripById(id);

  if (!t) {
    return (
      "<h1>Wpis</h1>" +
      "<p>Nie znaleziono wpisu.</p>" +
      "<p><a href=\"#trips\">Wróć</a></p>"
    );
  }

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
    "</p>"
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

function handleClick(e) {
  var el = e.target;
  if (!el || !el.dataset) return;

  if (el.dataset.action === "delete-trip") {
    deleteTripById(el.dataset.id);

    var route = getRoute();
    var tripId = getTripIdFromRoute(route);
    if (tripId) location.hash = "#trips";
    else render();
  }
}

function handleSubmit(e) {
  if (!e.target || e.target.id !== "addTripForm") return;

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
    notes: notes
  });

  saveTrips(trips);
  location.hash = "#trip/" + id;
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
