const mongoose = require('mongoose');

const sessionsSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qrToken: { type: String, required: true, unique: true },
  expiryTime: { type: Date, required: true },
  geoFence: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radius: { type: Number, required: true }
  },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
sessionsSchema.index({ classId: 1 });
sessionsSchema.index({ facultyId: 1 });
sessionsSchema.index({ status: 1 });

module.exports = mongoose.model('Session', sessionsSchema);