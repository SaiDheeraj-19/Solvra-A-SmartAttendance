const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  geoFence: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radius: { type: Number, required: true }
  },
  qrExpiryMinutes: { type: Number, default: 5 },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
settingsSchema.index({ adminId: 1 });

module.exports = mongoose.model('Settings', settingsSchema);