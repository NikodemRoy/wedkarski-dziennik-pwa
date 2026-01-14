function viewHome() {
  var trips = loadTrips();

  return (
    "<h1>Start</h1>" +
    "<div class=\"card\">" +
    "<p><strong>Ilość wpisów:</strong> " + trips.length + "</p>" +
    "<div class=\"actions\">" +
    "<a class=\"btn btn-primary\" href=\"#add-trip\">Dodaj wpis</a>" +
    "<a class=\"btn btn-secondary\" href=\"#trips\">Zobacz wpisy</a>" +
    "</div>" +
    "</div>"
  );
}
