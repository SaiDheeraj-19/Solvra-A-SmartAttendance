const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  assessmentType: { type: String, enum: ['midterm', 'final', 'assignment'], required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
marksSchema.index({ studentId: 1 });
marksSchema.index({ classId: 1 });
marksSchema.index({ assessmentType: 1 });

module.exports = mongoose.model('Marks', marksSchema);
