const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: Number, required: true },
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
classSchema.index({ facultyId: 1 });
classSchema.index({ department: 1, semester: 1 });

module.exports = mongoose.model('Class', classSchema);