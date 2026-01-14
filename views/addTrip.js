function viewAddTrip() {
  var today = new Date().toISOString().slice(0, 10);

  return (
    "<h1>Nowy wpis</h1>" +
    "<form id=\"addTripForm\" class=\"card\">" +
    "<div class=\"grid-2\">" +
    "<div class=\"row\">" +
    "<label>Nazwa łowiska</label><br>" +
    "<input id=\"lakeName\" type=\"text\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Data</label><br>" +
    "<input id=\"tripDate\" type=\"date\" value=\"" + today + "\" required>" +
    "</div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Lokalizacja</label><br>" +
    "<div class=\"actions\">" +
    "<button class=\"secondary\" type=\"button\" data-action=\"get-location\">Pobierz lokalizację</button>" +
    "<span id=\"locStatus\" class=\"small\"></span>" +
    "</div>" +
    "<input id=\"tripLat\" type=\"hidden\" value=\"\">" +
    "<input id=\"tripLng\" type=\"hidden\" value=\"\">" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Zdjęcie tła (opcjonalnie)</label><br>" +
    "<input id=\"tripCover\" type=\"file\" accept=\"image/*\">" +
    "<div id=\"coverStatus\" class=\"small\"></div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Notatki</label><br>" +
    "<textarea id=\"tripNotes\" rows=\"4\"></textarea>" +
    "</div>" +
    "<div class=\"row actions\">" +
    "<button class=\"primary\" type=\"submit\">Zapisz</button>" +
    "<a class=\"btn\" href=\"#trips\">Anuluj</a>" +
    "</div>" +
    "</form>"
  );
}