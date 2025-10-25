const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  center: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  radiusMeters: { type: Number, required: true, default: 500 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String
}, { timestamps: true });

module.exports = mongoose.model('Geofence', geofenceSchema);
