function fishListHtml(tripId, fish) {
  if (!fish || fish.length === 0) return "<div class=\"card\"><p>Brak ryb.</p></div>";

  var html = "<ul class=\"list\">";
  for (var i = 0; i < fish.length; i++) {
    var f = fish[i];
    var len = f.length ? " (" + escapeText(f.length) + " cm)" : "";
    var img = "<div class=\"fish-photo\"></div>";

    if (f.photo && String(f.photo).startsWith("data:image/")) {
      img = "<div class=\"fish-photo\"><img src=\"" + f.photo + "\" alt=\"Ryba\" data-action=\"zoom-photo\"></div>";
    }

    html +=
      "<li>" +
      "<div class=\"fish-row\">" +
      img +
      "<div>" +
      "<div class=\"item-title\">" + escapeText(f.species) + len + "</div>" +
      "<div class=\"item-sub\">" + (f.notes ? escapeText(f.notes) : "") + "</div>" +
      "<div class=\"actions\" style=\"margin-top:8px;\">" +
      "<button class=\"secondary\" data-action=\"edit-fish\" data-trip-id=\"" + escapeText(tripId) + "\" data-fish-id=\"" + escapeText(f.id) + "\">Edytuj</button>" +
      "<button class=\"danger\" data-action=\"delete-fish\" data-trip-id=\"" + escapeText(tripId) + "\" data-fish-id=\"" + escapeText(f.id) + "\">Usuń</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
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
      "<div class=\"card\">" +
      "<p>Nie znaleziono wpisu.</p>" +
      "<p><a class=\"btn\" href=\"#trips\">Wróć</a></p>" +
      "</div>"
    );
  }

  var t = trips[idx];
  if (!Array.isArray(t.fish)) t.fish = [];

  var notes = t.notes ? escapeText(t.notes).replaceAll("\n", "<br>") : "";

  var locText = "Brak";
  var mapLink = "";

  if (t.location && t.location.lat && t.location.lng) {
    locText = "Zapisana";
    var q = encodeURIComponent(String(t.location.lat) + "," + String(t.location.lng));
    mapLink = " <a class=\"btn\" href=\"https://www.google.com/maps?q=" + q + "\" target=\"_blank\">Otwórz w mapach</a>";
  }

  var coverHtml = "";
  if (t.coverPhoto && String(t.coverPhoto).startsWith("data:image/")) {
    coverHtml =
      "<div class=\"row\">" +
      "<div class=\"photo\"><img src=\"" + t.coverPhoto + "\" alt=\"Zdjęcie tła\"></div>" +
      "</div>";
  }

  return (
    "<h1>Wpis</h1>" +
    coverHtml +
    "<div class=\"card\">" +
    "<p><strong>Łowisko:</strong> " + escapeText(t.lakeName) + "</p>" +
    "<p><strong>Data:</strong> " + escapeText(t.date) + "</p>" +
    "<p><strong>Lokalizacja:</strong> " + locText + "</p>" +
    (mapLink ? "<div class=\"actions\">" + mapLink + "</div>" : "") +
    "<p><strong>Notatki:</strong><br>" + (notes || "-") + "</p>" +
    "<div class=\"actions\">" +
    "<button class=\"secondary\" data-action=\"edit-trip\" data-id=\"" + escapeText(t.id) + "\">Edytuj wpis</button>" +
    "<button class=\"danger\" data-action=\"delete-trip\" data-id=\"" + escapeText(t.id) + "\">Usuń wpis</button>" +
    "<a class=\"btn\" href=\"#trips\">Wróć do listy</a>" +
    "</div>" +
    "</div>" +
    "<hr>" +
    "<h2>Ryby</h2>" +
    fishListHtml(t.id, t.fish) +
    "<h3>Dodaj rybę</h3>" +
    "<form id=\"addFishForm\" class=\"card\" data-trip-id=\"" + escapeText(t.id) + "\">" +
    "<div class=\"row\">" +
    "<label>Gatunek</label><br>" +
    "<input id=\"fishSpecies\" type=\"text\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Długość (cm, opcjonalnie)</label><br>" +
    "<input id=\"fishLength\" type=\"number\" min=\"0\">" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Zdjęcie ryby (opcjonalnie)</label><br>" +
    "<input id=\"fishPhoto\" type=\"file\" accept=\"image/*\">" +
    "<div id=\"fishPhotoStatus\" class=\"small\"></div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Notatka (opcjonalnie)</label><br>" +
    "<textarea id=\"fishNotes\" rows=\"3\"></textarea>" +
    "</div>" +
    "<div class=\"row actions\">" +
    "<button class=\"primary\" type=\"submit\">Dodaj</button>" +
    "</div>" +
    "</form>"
  );
}