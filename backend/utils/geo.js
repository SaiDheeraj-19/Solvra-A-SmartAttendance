const geofenceService = require('../services/geofenceService');

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

// Haversine distance in meters
function haversineDistanceMeters(a, b) {
  const R = 6371000; // meters
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function isInsideCampus({ lat, lng }) {
  // Check if coordinates are valid numbers
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    console.error('Invalid coordinates:', { lat, lng });
    return false;
  }
  
  // Use cached geofence from service (falls back to config if no DB entry)
  const gf = geofenceService.getGeofence();
  if (!gf || !gf.center) {
    console.error('No geofence configuration available');
    return false;
  }

  const distance = haversineDistanceMeters({ lat, lng }, gf.center);
  const inside = distance <= gf.radiusMeters;
  
  console.log(`Distance from campus center (${gf.source}): ${distance.toFixed(2)}m, Radius: ${gf.radiusMeters}m, Inside: ${inside}`);
  return inside;
}

module.exports = { haversineDistanceMeters, isInsideCampus };