const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: function() {
    // Password is required only if no OAuth provider is used
    return !this.oauthProvider;
  }},
  role: { type: String, enum: ['student', 'faculty', 'hod', 'dean'], default: 'student' },
  studentId: { type: String, unique: true, sparse: true },
  department: String,
  year: String,
  phone: String,
  isActive: { type: Boolean, default: true },
  // OAuth data
  oauthProvider: { type: String, enum: ['google', 'apple', null], default: null },
  oauthId: { type: String, sparse: true },
  oauthProfile: { type: Object },
  // Face verification data
  faceData: {
    encoding: String, // Base64 encoded face encoding
    registeredAt: Date,
    lastVerified: Date,
    verificationCount: { type: Number, default: 0 }
  },
  // Security settings
  securitySettings: {
    requireFaceVerification: { type: Boolean, default: true },
    allowProxyAttendance: { type: Boolean, default: false },
    maxVerificationAttempts: { type: Number, default: 3 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
