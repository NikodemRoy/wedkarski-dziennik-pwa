function saveTripObject(trip) {
  var trips = loadTrips();
  trips.unshift(trip);
  return saveTrips(trips);
}

function deleteTripById(id) {
  var trips = loadTrips();
  var next = [];

  for (var i = 0; i < trips.length; i++) {
    if (trips[i].id !== id) next.push(trips[i]);
  }

  return saveTrips(next);
}

function updateTrip(id, patch) {
  var trips = loadTrips();
  var idx = findTripIndexById(id, trips);
  if (idx === -1) return false;

  var t = trips[idx];

  if (patch.lakeName !== undefined) t.lakeName = patch.lakeName;
  if (patch.date !== undefined) t.date = patch.date;
  if (patch.notes !== undefined) t.notes = patch.notes;
  if (patch.location !== undefined) t.location = patch.location;
  if (patch.coverPhoto !== undefined) t.coverPhoto = patch.coverPhoto;

  return saveTrips(trips);
}
