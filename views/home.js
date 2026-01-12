function viewHome() {
  var trips = loadTrips();
  return (
    "<h1>Start</h1>" +
    "<p>Ilość wpisów: " + trips.length + "</p>" +
    "<p><a href=\"#add-trip\">Dodaj wpis</a></p>" +
    "<p><a href=\"#trips\">Zobacz wpisy</a></p>"
  );
}
