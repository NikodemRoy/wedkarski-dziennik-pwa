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
      "<button data-action=\"open-trip\" data-id=\"" + escapeText(t.id) + "\">Otwórz</button>" +
      " " +
      "<button data-action=\"delete-trip\" data-id=\"" + escapeText(t.id) + "\">Usuń</button>" +
      "</li>";
  }

  html += "</ul>";
  html += "<p><a href=\"#add-trip\">Dodaj kolejny wpis</a></p>";

  return html;
}
