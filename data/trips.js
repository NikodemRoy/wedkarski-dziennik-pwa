function saveTripObject(trip) {
  const trips = loadTrips();
  trips.unshift(trip);
  return saveTrips(trips);
}

function deleteTripById(id) {
  const trips = loadTrips();
  const next = [];

  for (let i = 0; i < trips.length; i++) {
    if (trips[i].id !== id) next.push(trips[i]);
  }

  return saveTrips(next);
}

function updateTrip(id, patch) {
  const trips = loadTrips();
  const idx = findTripIndexById(id, trips);
  if (idx === -1) return false;

  const t = trips[idx];

  if (patch.lakeName !== undefined) t.lakeName = patch.lakeName;
  if (patch.date !== undefined) t.date = patch.date;
  if (patch.notes !== undefined) t.notes = patch.notes;
  if (patch.location !== undefined) t.location = patch.location;
  if (patch.coverPhoto !== undefined) t.coverPhoto = patch.coverPhoto;

  return saveTrips(trips);
}
