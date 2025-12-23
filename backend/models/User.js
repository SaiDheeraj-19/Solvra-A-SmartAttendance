const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  studentId: { type: String, unique: true, sparse: true },
  department: String,
  subjects: [{ type: mongoose.Schema.Types.ObjectId }], // Array of class IDs
  faceRegistered: { type: Boolean, default: false },
  faceData: {
    encoding: String,
    registeredAt: Date,
    lastVerified: Date,
    verificationCount: { type: Number, default: 0 }
  },
  securitySettings: {
    allowProxyAttendance: { type: Boolean, default: false },
    requireFaceVerification: { type: Boolean, default: true },
    maxVerificationAttempts: { type: Number, default: 3 }
  },
  year: String,
  phone: String,
  profilePicture: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);