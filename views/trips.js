function viewTrips() {
  const trips = loadTrips();
  let html = "<h1>Wpisy</h1>";

  if (trips.length === 0) {
    return (
      html +
      "<div class=\"card\">" +
      "<p>Brak wpisów.</p>" +
      "<p><a class=\"btn btn-primary\" href=\"#add-trip\">Dodaj pierwszy wpis</a></p>" +
      "</div>"
    );
  }

  html += "<ul class=\"list\">";

  for (let i = 0; i < trips.length; i++) {
    const t = trips[i];
    html +=
      "<li>" +
      "<div class=\"item-top\">" +
      "<div>" +
      "<div class=\"item-title\">" + escapeText(t.lakeName) + "</div>" +
      "<div class=\"item-sub\">" + escapeText(t.date) + "</div>" +
      "</div>" +
      "<div class=\"actions\">" +
      "<button class=\"secondary\" data-action=\"open-trip\" data-id=\"" + escapeText(t.id) + "\">Otwórz</button>" +
      "<button class=\"danger\" data-action=\"delete-trip\" data-id=\"" + escapeText(t.id) + "\">Usuń</button>" +
      "</div>" +
      "</div>" +
      "</li>";
  }

  html += "</ul>";
  html += "<p><a class=\"btn btn-primary\" href=\"#add-trip\">Dodaj kolejny wpis</a></p>";

  return html;
}