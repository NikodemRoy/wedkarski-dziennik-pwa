var app = document.getElementById("app");
var netClosed = false;

function handleClick(e) {
  var el = e.target;
  if (!el || !el.dataset) return;

  if (el.dataset.action === "get-location") {
    getLocationToInputs("tripLat", "tripLng");
    return;
  }

  if (el.dataset.action === "get-location-edit") {
    getLocationToInputs("editTripLat", "editTripLng");
    return;
  }

  if (el.dataset.action === "open-trip") {
    location.hash = "#trip/" + el.dataset.id;
    return;
  }

  if (el.dataset.action === "edit-trip") {
    location.hash = "#edit-trip/" + el.dataset.id;
    return;
  }

  if (el.dataset.action === "edit-fish") {
    location.hash = "#edit-fish/" + el.dataset.tripId + "/" + el.dataset.fishId;
    return;
  }

  if (el.dataset.action === "delete-trip") {
    var sure = confirm("Usunąć wpis?");
    if (!sure) return;

    var ok = deleteTripById(el.dataset.id);
    if (ok) location.hash = "#trips";
    return;
  }

  if (el.dataset.action === "delete-fish") {
    var sure2 = confirm("Usunąć rybę?");
    if (!sure2) return;

    var ok2 = deleteFish(el.dataset.tripId, el.dataset.fishId);
    if (ok2) render();
    return;
  }

  if (el.dataset.action === "zoom-photo") {
    showImageOverlay(el.src);
    return;
  }
}

function handleSubmit(e) {
  if (!e.target) return;

  if (e.target.id === "addTripForm") {
    e.preventDefault();

    var lakeName = document.getElementById("lakeName").value.trim();
    var date = document.getElementById("tripDate").value;
    var notes = document.getElementById("tripNotes").value.trim();
    var latRaw = document.getElementById("tripLat").value.trim();
    var lngRaw = document.getElementById("tripLng").value.trim();
    var fileEl = document.getElementById("tripCover");

    if (!lakeName) return;

    var locationObj = null;
    if (latRaw && lngRaw) {
      var lat = parseFloat(latRaw);
      var lng = parseFloat(lngRaw);
      if (!isNaN(lat) && !isNaN(lng)) locationObj = {
        lat: lat,
        lng: lng
      };
    }

    var id = makeId();
    var file = fileEl && fileEl.files && fileEl.files[0] ? fileEl.files[0] : null;

    if (!file) {
      var ok = saveTripObject({
        id: id,
        lakeName: lakeName,
        date: date,
        notes: notes,
        location: locationObj,
        coverPhoto: "",
        fish: []
      });

      if (!ok) {
        setTextById("coverStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + id;
      return;
    }

    setTextById("coverStatus", "Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file, 900, 0.7, function (dataUrl) {
      if (!dataUrl) {
        setTextById("coverStatus", "Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok2 = saveTripObject({
        id: id,
        lakeName: lakeName,
        date: date,
        notes: notes,
        location: locationObj,
        coverPhoto: dataUrl,
        fish: []
      });

      if (!ok2) {
        setTextById("coverStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + id;
    });

    return;
  }

  if (e.target.id === "editTripForm") {
    e.preventDefault();

    var tripId = e.target.dataset.tripId;
    var lakeName2 = document.getElementById("editLakeName").value.trim();
    var date2 = document.getElementById("editTripDate").value;
    var notes2 = document.getElementById("editTripNotes").value.trim();
    var latRaw2 = document.getElementById("editTripLat").value.trim();
    var lngRaw2 = document.getElementById("editTripLng").value.trim();
    var fileEl2 = document.getElementById("editTripCover");

    if (!lakeName2) return;

    var locationObj2 = null;
    if (latRaw2 && lngRaw2) {
      var lat2 = parseFloat(latRaw2);
      var lng2 = parseFloat(lngRaw2);
      if (!isNaN(lat2) && !isNaN(lng2)) locationObj2 = {
        lat: lat2,
        lng: lng2
      };
    }

    var file2 = fileEl2 && fileEl2.files && fileEl2.files[0] ? fileEl2.files[0] : null;

    if (!file2) {
      var ok3 = updateTrip(tripId, {
        lakeName: lakeName2,
        date: date2,
        notes: notes2,
        location: locationObj2
      });

      if (!ok3) {
        setTextById("coverStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId;
      return;
    }

    setTextById("coverStatus", "Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file2, 900, 0.7, function (dataUrl2) {
      if (!dataUrl2) {
        setTextById("coverStatus", "Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok4 = updateTrip(tripId, {
        lakeName: lakeName2,
        date: date2,
        notes: notes2,
        location: locationObj2,
        coverPhoto: dataUrl2
      });

      if (!ok4) {
        setTextById("coverStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId;
    });

    return;
  }

  if (e.target.id === "addFishForm") {
    e.preventDefault();

    var tripId2 = e.target.dataset.tripId;
    var species = document.getElementById("fishSpecies").value.trim();
    var lengthRaw = document.getElementById("fishLength").value.trim();
    var notes3 = document.getElementById("fishNotes").value.trim();
    var photoEl = document.getElementById("fishPhoto");

    var length = null;
    if (lengthRaw) {
      var n = parseFloat(lengthRaw);
      if (!isNaN(n)) length = n;
    }

    if (!species) return;

    var file3 = photoEl && photoEl.files && photoEl.files[0] ? photoEl.files[0] : null;

    if (!file3) {
      var ok5 = addFishToTrip(tripId2, {
        id: makeId(),
        species: species,
        length: length,
        notes: notes3,
        photo: ""
      });

      if (!ok5) {
        setTextById("fishPhotoStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      render();
      return;
    }

    setTextById("fishPhotoStatus", "Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file3, 700, 0.65, function (dataUrl3) {
      if (!dataUrl3) {
        setTextById("fishPhotoStatus", "Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok6 = addFishToTrip(tripId2, {
        id: makeId(),
        species: species,
        length: length,
        notes: notes3,
        photo: dataUrl3
      });

      if (!ok6) {
        setTextById("fishPhotoStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      render();
    });

    return;
  }

  if (e.target.id === "editFishForm") {
    e.preventDefault();

    var tripId3 = e.target.dataset.tripId;
    var fishId = e.target.dataset.fishId;

    var species2 = document.getElementById("editFishSpecies").value.trim();
    var lengthRaw2 = document.getElementById("editFishLength").value.trim();
    var notes4 = document.getElementById("editFishNotes").value.trim();
    var photoEl2 = document.getElementById("editFishPhoto");

    var length2 = null;
    if (lengthRaw2) {
      var n2 = parseFloat(lengthRaw2);
      if (!isNaN(n2)) length2 = n2;
    }

    if (!species2) return;

    var file4 = photoEl2 && photoEl2.files && photoEl2.files[0] ? photoEl2.files[0] : null;

    if (!file4) {
      var ok7 = updateFish(tripId3, fishId, {
        species: species2,
        length: length2,
        notes: notes4
      });

      if (!ok7) {
        setTextById("fishPhotoStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId3;
      return;
    }

    setTextById("fishPhotoStatus", "Wczytywanie zdjęcia...");

    fileToCompressedDataUrl(file4, 700, 0.65, function (dataUrl4) {
      if (!dataUrl4) {
        setTextById("fishPhotoStatus", "Nie udało się wczytać zdjęcia.");
        return;
      }

      var ok8 = updateFish(tripId3, fishId, {
        species: species2,
        length: length2,
        notes: notes4,
        photo: dataUrl4
      });

      if (!ok8) {
        setTextById("fishPhotoStatus", "Brak miejsca w pamięci (localStorage).");
        return;
      }

      location.hash = "#trip/" + tripId3;
    });
  }
}

function render() {
  var route = getRoute();

  var editTripId = getEditTripIdFromRoute(route);
  if (editTripId) {
    app.innerHTML = viewEditTrip(editTripId);
    return;
  }

  var ef = getEditFishFromRoute(route);
  if (ef) {
    app.innerHTML = viewEditFish(ef.tripId, ef.fishId);
    return;
  }

  var tripId = getTripIdFromRoute(route);
  if (tripId) {
    app.innerHTML = viewTripDetails(tripId);
    return;
  }

  if (route === "#home") app.innerHTML = viewHome();
  else if (route === "#trips") app.innerHTML = viewTrips();
  else if (route === "#add-trip") app.innerHTML = viewAddTrip();
  else location.hash = "#home";
}

window.addEventListener("click", handleClick);
window.addEventListener("submit", handleSubmit);
window.addEventListener("hashchange", render);
window.addEventListener("load", render);

function hideToast() {
  var t = document.getElementById("netToast");
  if (t) t.style.display = "none";
}

function showToast() {
  var t = document.getElementById("netToast");
  if (t) t.style.display = "";
}

function updateNetBanner() {
  var text = document.getElementById("netText");
  if (!text) return;

  if (navigator.onLine) {
    netClosed = false;
    hideToast();
    return;
  }

  if (netClosed) {
    hideToast();
    return;
  }

  text.textContent = "TRYB OFFLINE";
  showToast();
}

window.addEventListener("online", updateNetBanner);
window.addEventListener("offline", updateNetBanner);

window.addEventListener("load", function () {
  var btn = document.getElementById("netClose");
  if (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      netClosed = true;
      hideToast();
    });
  }
  updateNetBanner();
});

function showImageOverlay(src) {
  var overlay = document.createElement("div");
  overlay.className = "img-overlay";

  var img = document.createElement("img");
  img.src = src;

  overlay.appendChild(img);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function () {
    overlay.remove();
  });
}