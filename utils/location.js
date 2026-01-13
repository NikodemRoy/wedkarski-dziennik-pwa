function fillLocationInputs(latId, lngId, lat, lng) {
  var latEl = document.getElementById(latId);
  var lngEl = document.getElementById(lngId);
  if (latEl) latEl.value = lat;
  if (lngEl) lngEl.value = lng;
}

function getLocationToInputs(latId, lngId) {
  if (!navigator.geolocation) {
    setTextById("locStatus", "Brak geolokalizacji w przeglądarce.");
    return;
  }

  setTextById("locStatus", "Pobieranie...");

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      var lat = String(pos.coords.latitude);
      var lng = String(pos.coords.longitude);
      fillLocationInputs(latId, lngId, lat, lng);
      setTextById("locStatus", "Zapisano lokalizację.");
    },
    function () {
      setTextById("locStatus", "Nie udało się pobrać lokalizacji.");
    }
  );
}
