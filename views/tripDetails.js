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

  var locText = "-";
  if (t.location && t.location.lat && t.location.lng) {
    locText = escapeText(t.location.lat) + ", " + escapeText(t.location.lng);
  }

  return (
    "<h1>Wpis</h1>" +
    "<p><strong>Łowisko:</strong> " + escapeText(t.lakeName) + "</p>" +
    "<p><strong>Data:</strong> " + escapeText(t.date) + "</p>" +
    "<p><strong>Lokalizacja:</strong> " + locText + "</p>" +
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
