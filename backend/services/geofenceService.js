const Geofence = require('../models/Geofence');
const defaultGeofence = require('../config/geofence');

// In-memory cached geofence (starts from config/geofence.js)
let cached = {
  center: defaultGeofence.center,
  radiusMeters: defaultGeofence.radiusMeters,
  source: 'config'
};

async function loadFromDb() {
  try {
    const doc = await Geofence.findOne().sort({ updatedAt: -1 }).lean();
    if (doc && doc.center && typeof doc.radiusMeters === 'number') {
      cached = { center: doc.center, radiusMeters: doc.radiusMeters, source: 'db', id: doc._id };
      console.log('Loaded geofence from DB:', cached);
    } else {
      console.log('No geofence in DB, using default config geofence');
    }
  } catch (e) {
    console.error('Error loading geofence from DB, using default:', e.message);
  }
}

function getGeofence() {
  return cached;
}

// Update/create geofence in DB and refresh cache
async function updateGeofence({ center, radiusMeters, updatedBy, note }) {
  if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
    throw new Error('Invalid center coordinates');
  }
  if (typeof radiusMeters !== 'number' || radiusMeters <= 0) {
    throw new Error('Invalid radiusMeters');
  }

  const doc = await Geofence.create({ center, radiusMeters, updatedBy, note });
  cached = { center: doc.center, radiusMeters: doc.radiusMeters, source: 'db', id: doc._id };
  return doc;
}

// Update existing geofence in DB and refresh cache
async function updateExistingGeofence(id, { center, radiusMeters, updatedBy, note }) {
  if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
    throw new Error('Invalid center coordinates');
  }
  if (typeof radiusMeters !== 'number' || radiusMeters <= 0) {
    throw new Error('Invalid radiusMeters');
  }

  const doc = await Geofence.findByIdAndUpdate(
    id, 
    { center, radiusMeters, updatedBy, note },
    { new: true, runValidators: true }
  );
  
  if (doc) {
    cached = { center: doc.center, radiusMeters: doc.radiusMeters, source: 'db', id: doc._id };
  }
  return doc;
}

module.exports = { loadFromDb, getGeofence, updateGeofence, updateExistingGeofence };