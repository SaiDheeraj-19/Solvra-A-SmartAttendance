const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  status: { type: String, enum: ['present', 'absent', 'rejected'], default: 'absent' },
  timestamp: { type: Date, default: Date.now },
  geoLocation: {
    lat: Number,
    lng: Number
  },
  faceVerified: { type: Boolean, default: false },
  distanceFromCampus: Number
}, { timestamps: true });

// Index for efficient queries
attendanceSchema.index({ studentId: 1 });
attendanceSchema.index({ sessionId: 1 });
attendanceSchema.index({ classId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);