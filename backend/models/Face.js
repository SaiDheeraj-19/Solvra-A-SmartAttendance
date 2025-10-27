const mongoose = require('mongoose');

const facesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  embedding: [{ type: Number }], // Array of numbers representing face embedding
  imageURL: { type: String },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin ID
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
facesSchema.index({ userId: 1 });

module.exports = mongoose.model('Faces', facesSchema);