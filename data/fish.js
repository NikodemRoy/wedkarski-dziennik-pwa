function addFishToTrip(tripId, fish) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return true;

  if (!Array.isArray(trips[idx].fish)) trips[idx].fish = [];
  trips[idx].fish.unshift(fish);

  return saveTrips(trips);
}

function updateFish(tripId, fishId, patch) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return false;

  if (!Array.isArray(trips[idx].fish)) trips[idx].fish = [];

  var fish = trips[idx].fish;
  var f = null;

  for (var i = 0; i < fish.length; i++) {
    if (fish[i].id === fishId) f = fish[i];
  }

  if (!f) return false;

  if (patch.species !== undefined) f.species = patch.species;
  if (patch.length !== undefined) f.length = patch.length;
  if (patch.notes !== undefined) f.notes = patch.notes;
  if (patch.photo !== undefined) f.photo = patch.photo;

  return saveTrips(trips);
}

function deleteFish(tripId, fishId) {
  var trips = loadTrips();
  var idx = findTripIndexById(tripId, trips);
  if (idx === -1) return true;

  var fish = trips[idx].fish;
  if (!Array.isArray(fish)) fish = [];

  var next = [];
  for (var i = 0; i < fish.length; i++) {
    if (fish[i].id !== fishId) next.push(fish[i]);
  }

  trips[idx].fish = next;
  return saveTrips(trips);
}
