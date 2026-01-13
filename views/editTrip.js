function viewEditTrip(id) {
  var trips = loadTrips();
  var idx = findTripIndexById(id, trips);

  if (idx === -1) {
    return (
      "<h1>Edycja wpisu</h1>" +
      "<p>Nie znaleziono wpisu.</p>" +
      "<p><a href=\"#trips\">Wróć</a></p>"
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

  var coverPreview = "<p>Brak zdjęcia.</p>";
  if (t.coverPhoto && String(t.coverPhoto).startsWith("data:image/")) {
    coverPreview = "<img src=\"" + t.coverPhoto + "\" alt=\"Zdjęcie tła\">";
  }

  return (
    "<h1>Edycja wpisu</h1>" +
    "<form id=\"editTripForm\" data-trip-id=\"" + escapeText(t.id) + "\">" +
    "<div class=\"row\">" +
    "<label>Nazwa łowiska</label><br>" +
    "<input id=\"editLakeName\" type=\"text\" value=\"" + escapeText(t.lakeName) + "\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Data</label><br>" +
    "<input id=\"editTripDate\" type=\"date\" value=\"" + escapeText(t.date) + "\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Lokalizacja</label><br>" +
    "<p>" + locText + "</p>" +
    "<button type=\"button\" data-action=\"get-location-edit\">Zaktualizuj lokalizację</button>" +
    "<input id=\"editTripLat\" type=\"hidden\" value=\"" + escapeText(lat) + "\">" +
    "<input id=\"editTripLng\" type=\"hidden\" value=\"" + escapeText(lng) + "\">" +
    "<div id=\"locStatus\"></div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Zdjęcie tła</label><br>" +
    coverPreview +
    "<div class=\"row\">" +
    "<input id=\"editTripCover\" type=\"file\" accept=\"image/*\" capture=\"environment\">" +
    "<div id=\"coverStatus\"></div>" +
    "</div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Notatki</label><br>" +
    "<textarea id=\"editTripNotes\" rows=\"4\">" + escapeText(notes) + "</textarea>" +
    "</div>" +
    "<div class=\"row\">" +
    "<button type=\"submit\">Zapisz</button>" +
    " " +
    "<a href=\"#trip/" + escapeText(t.id) + "\">Anuluj</a>" +
    "</div>" +
    "</form>"
  );
}
