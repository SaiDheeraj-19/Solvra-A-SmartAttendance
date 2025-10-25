const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  qrCodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'QRCode', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, unique: true },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  status: { 
    type: String, 
    enum: ['active', 'completed', 'expired', 'suspicious'], 
    default: 'active' 
  },
  verificationData: {
    faceMatchScore: Number,
    faceVerified: { type: Boolean, default: false },
    locationVerified: { type: Boolean, default: false },
    deviceFingerprint: String,
    ipAddress: String,
    userAgent: String
  },
  securityFlags: [{
    type: { type: String, enum: ['multiple_devices', 'unusual_location', 'face_mismatch', 'rapid_scanning'] },
    description: String,
    timestamp: { type: Date, default: Date.now }
  }],
  attempts: [{
    timestamp: { type: Date, default: Date.now },
    faceMatchScore: Number,
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    },
    deviceInfo: String
  }]
}, { timestamps: true });

// Index for efficient queries
attendanceSessionSchema.index({ qrCodeId: 1, student: 1 });
attendanceSessionSchema.index({ status: 1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
