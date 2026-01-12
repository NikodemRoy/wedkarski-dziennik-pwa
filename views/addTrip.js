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
