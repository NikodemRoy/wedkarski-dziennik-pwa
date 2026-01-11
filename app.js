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
      "<button data-action=\"delete-trip\" data-id=\"" + escapeText(t.id) + "\">Usuń</button>" +
      "</li>";
  }

  html += "</ul>";
  html += "<p><a href=\"#add-trip\">Dodaj kolejny wpis</a></p>";

  return html;
}

function viewAddTrip() {
  var today = new Date().toISOString().slice(0, 10);

  return (
    "<h1>Nowy wpis</h1>" 

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
    render();
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
  trips.unshift({
    id: makeId(),
    lakeName: lakeName,
    date: date,
    notes: notes
  });

  saveTrips(trips);
  location.hash = "#trips";
}

function render() {
  var route = getRoute();

  if (route === "#home") app.innerHTML = viewHome();
  else if (route === "#trips") app.innerHTML = viewTrips();
  else if (route === "#add-trip") app.innerHTML = viewAddTrip();
  else location.hash = "#home";
}

window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);
window.addEventListener("hashchange", render);
window.addEventListener("load", render);
