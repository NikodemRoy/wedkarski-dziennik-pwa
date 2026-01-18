function fillLocationInputs(latId, lngId, lat, lng) {
  const latEl = document.getElementById(latId);
  const lngEl = document.getElementById(lngId);
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
      const lat = String(pos.coords.latitude);
      const lng = String(pos.coords.longitude);
      fillLocationInputs(latId, lngId, lat, lng);
      setTextById("locStatus", "Zapisano lokalizację.");
    },
    function () {
      setTextById("locStatus", "Nie udało się pobrać lokalizacji.");
    }
  );
}
