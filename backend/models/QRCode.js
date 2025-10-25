const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  type: { type: String, enum: ['attendance', 'checkin', 'checkout'], required: true },
  location: { 
    name: String,
    lat: Number,
    lng: Number
  },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date, default: Date.now, expires: 60 }, // 1 minute expiry
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usageCount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('QRCode', qrCodeSchema);
