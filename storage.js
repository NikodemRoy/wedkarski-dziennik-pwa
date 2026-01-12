var STORAGE_KEY = "wedkarski_trip_v1";

function loadTrips() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    var data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
    return [];
  } catch (e) {
    return [];
  }
}

function saveTrips(trips) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return true;
  } catch (e) {
    return false;
  }
}
