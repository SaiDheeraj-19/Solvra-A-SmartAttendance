const mongoose = require('mongoose');

const locationEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['enter', 'exit'], required: true },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number }
  }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  // Start-of-day in UTC for uniqueness; one doc per user per day
  date: { type: Date, required: true, index: true },
  status: { type: String, enum: ['present', 'absent'], default: 'absent' },
  checkInAt: { type: Date },
  checkOutAt: { type: Date },
  events: [locationEventSchema]
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

