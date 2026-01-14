function viewEditFish(tripId, fishId) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);

  if (idx === -1) {
    return (
      "<h1>Edycja ryby</h1>" +
      "<div class=\"card\">" +
      "<p>Nie znaleziono wpisu.</p>" +
      "<p><a class=\"btn\" href=\"#trips\">Wróć</a></p>" +
      "</div>"
    );
  }

  var t = trips[idx];
  if (!Array.isArray(t.fish)) t.fish = [];

  var f = null;
  for (var i = 0; i < t.fish.length; i++) {
    if (t.fish[i].id === fishId) f = t.fish[i];
  }

  if (!f) {
    return (
      "<h1>Edycja ryby</h1>" +
      "<div class=\"card\">" +
      "<p>Nie znaleziono ryby.</p>" +
      "<p><a class=\"btn\" href=\"#trip/" + escapeText(tripId) + "\">Wróć</a></p>" +
      "</div>"
    );
  }

  var photoPreview = "<p class=\"small\">Brak zdjęcia.</p>";
  if (f.photo && String(f.photo).startsWith("data:image/")) {
    photoPreview = "<div class=\"fish-photo\"><img src=\"" + f.photo + "\" alt=\"Zdjęcie ryby\"></div>";
  }

  return (
    "<h1>Edycja ryby</h1>" +
    "<form id=\"editFishForm\" class=\"card\" data-trip-id=\"" + escapeText(tripId) + "\" data-fish-id=\"" + escapeText(fishId) + "\">" +
    "<div class=\"row\">" +
    "<label>Gatunek</label><br>" +
    "<input id=\"editFishSpecies\" type=\"text\" value=\"" + escapeText(f.species) + "\" required>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Długość (cm, opcjonalnie)</label><br>" +
    "<input id=\"editFishLength\" type=\"number\" min=\"0\" value=\"" + escapeText(f.length || "") + "\">" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Zdjęcie ryby</label><br>" +
    photoPreview +
    "<div class=\"row\">" +
    "<input id=\"editFishPhoto\" type=\"file\" accept=\"image/*\>" +
    "<div id=\"fishPhotoStatus\" class=\"small\"></div>" +
    "</div>" +
    "</div>" +
    "<div class=\"row\">" +
    "<label>Notatka (opcjonalnie)</label><br>" +
    "<textarea id=\"editFishNotes\" rows=\"3\">" + escapeText(f.notes || "") + "</textarea>" +
    "</div>" +
    "<div class=\"row actions\">" +
    "<button class=\"primary\" type=\"submit\">Zapisz</button>" +
    "<a class=\"btn\" href=\"#trip/" + escapeText(tripId) + "\">Anuluj</a>" +
    "</div>" +
    "</form>"
  );
}