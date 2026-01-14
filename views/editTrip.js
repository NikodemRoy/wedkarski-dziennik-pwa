function viewEditTrip(id) {
  var trips = loadTrips();
  var idx = findTripIndexById(id, trips);

  if (idx === -1) {
    return (
      "<h1>Edycja wpisu</h1>" +
      "<div class=\"card\">" +
      "<p>Nie znaleziono wpisu.</p>" +
      "<p><a class=\"btn\" href=\"#trips\">Wróć</a></p>" +
      "</div>"
    );
  }

  var t = trips[idx];
  var notes = t.notes ? t.notes : "";

  var lat = "";
  var lng = "";
  var locText = "Brak";

  if (t.location && t.location.lat && t.location.lng) {
    lat = String(t.location.lat);
    lng = String(t.location.lng);
    locText = "Zapisana";
  }

  var coverPreview = "<p class=\"small\">Brak zdjęcia.</p>";
  if (t.coverPhoto && String(t.coverPhoto).startsWith("data:image/")) {
    coverPreview = "<div class=\"photo\"><img src=\"" + t.coverPhoto + "\" alt=\"Zdjęcie tła\"></div>";
  }

  return (
    "<h1>Edycja wpisu</h1>" +
    "<form id=\"editTripForm\" class=\"card\" data-trip-id=\"" + escapeText(t.id) + "\">" +
    "<div class=\"grid-2\">" +
    "<div class=\"row\">" +
    "<label>Nazwa łowiska</label><br>" +
    "<input id=\"editLakeName\" type=\"text\" value=\"" + escapeText(t.lakeName) + "\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Data</label><br>" +
    "<input id=\"editTripDate\" type=\"date\" value=\"" + escapeText(t.date) + "\" required>" +
    "</div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Lokalizacja</label><br>" +
    "<p class=\"small\">" + locText + "</p>" +
    "<div class=\"actions\">" +
    "<button class=\"secondary\" type=\"button\" data-action=\"get-location-edit\">Zaktualizuj lokalizację</button>" +
    "<span id=\"locStatus\" class=\"small\"></span>" +
    "</div>" +
    "<input id=\"editTripLat\" type=\"hidden\" value=\"" + escapeText(lat) + "\">" +
    "<input id=\"editTripLng\" type=\"hidden\" value=\"" + escapeText(lng) + "\">" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Zdjęcie tła</label><br>" +
    coverPreview +
    "<div class=\"row\">" +
    "<input id=\"editTripCover\" type=\"file\" accept=\"image/*\">" +
    "<div id=\"coverStatus\" class=\"small\"></div>" +
    "</div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Notatki</label><br>" +
    "<textarea id=\"editTripNotes\" rows=\"4\">" + escapeText(notes) + "</textarea>" +
    "</div>" +
    "<div class=\"row actions\">" +
    "<button class=\"primary\" type=\"submit\">Zapisz</button>" +
    "<a class=\"btn\" href=\"#trip/" + escapeText(t.id) + "\">Anuluj</a>" +
    "</div>" +
    "</form>"
  );
}