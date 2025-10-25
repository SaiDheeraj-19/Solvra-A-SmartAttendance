const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  period: { type: Number, required: true, min: 1, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  room: { type: String, required: true },
  batch: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true }
}, { timestamps: true });

// Index for efficient queries
timetableSchema.index({ day: 1, period: 1 });
timetableSchema.index({ faculty: 1 });
timetableSchema.index({ batch: 1 });
timetableSchema.index({ department: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
