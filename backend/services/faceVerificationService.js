const crypto = require('crypto');

// Simple face verification service (in production, use proper ML models like Face-api.js or AWS Rekognition)
class FaceVerificationService {
  
  // Generate a face encoding from image data (simplified version)
  static generateFaceEncoding(imageData) {
    // In production, this would use a proper face recognition library
    // For now, we'll create a hash-based encoding for demo purposes
    const hash = crypto.createHash('sha256');
    hash.update(imageData);
    return hash.digest('base64');
  }

  // Compare two face encodings
  static compareFaces(encoding1, encoding2, threshold = 0.6) {
    // In production, this would calculate cosine similarity or euclidean distance
    // For demo, we'll use a simple similarity check
    if (!encoding1 || !encoding2) return 0;
    
    // Simple similarity calculation (in production, use proper face comparison)
    const similarity = this.calculateSimilarity(encoding1, encoding2);
    return {
      score: similarity,
      match: similarity >= threshold,
      confidence: Math.min(similarity * 100, 100)
    };
  }

  // Calculate similarity between two encodings (simplified)
  static calculateSimilarity(encoding1, encoding2) {
    // Convert base64 to buffer for comparison
    const buf1 = Buffer.from(encoding1, 'base64');
    const buf2 = Buffer.from(encoding2, 'base64');
    
    // Calculate hamming distance (simplified)
    let matches = 0;
    const minLength = Math.min(buf1.length, buf2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (buf1[i] === buf2[i]) matches++;
    }
    
    return matches / minLength;
  }

  // Verify face against registered data
  static async verifyStudentFace(studentId, capturedImageData) {
    try {
      // In production, fetch from database
      const User = require('../models/User');
      const student = await User.findById(studentId);
      
      if (!student || !student.faceData || !student.faceData.encoding) {
        return {
          verified: false,
          reason: 'No registered face data found',
          score: 0
        };
      }

      // Generate encoding from captured image
      const capturedEncoding = this.generateFaceEncoding(capturedImageData);
      
      // Compare with registered face
      const comparison = this.compareFaces(
        student.faceData.encoding, 
        capturedEncoding, 
        0.7 // Higher threshold for security
      );

      // Update verification count
      if (comparison.match) {
        student.faceData.lastVerified = new Date();
        student.faceData.verificationCount += 1;
        await student.save();
      }

      return {
        verified: comparison.match,
        score: comparison.score,
        confidence: comparison.confidence,
        reason: comparison.match ? 'Face verified successfully' : 'Face does not match registered data'
      };

    } catch (error) {
      console.error('Face verification error:', error);
      return {
        verified: false,
        reason: 'Verification system error',
        score: 0
      };
    }
  }

  // Check for suspicious activity
  static async checkSuspiciousActivity(studentId, sessionData) {
    const AttendanceSession = require('../models/AttendanceSession');
    
    try {
      // Check for multiple active sessions
      const activeSessions = await AttendanceSession.countDocuments({
        student: studentId,
        status: 'active',
        startTime: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
      });

      if (activeSessions > 1) {
        return {
          suspicious: true,
          reason: 'Multiple active sessions detected',
          severity: 'high'
        };
      }

      // Check for rapid scanning attempts
      const recentAttempts = await AttendanceSession.countDocuments({
        student: studentId,
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
      });

      if (recentAttempts > 3) {
        return {
          suspicious: true,
          reason: 'Too many scanning attempts',
          severity: 'medium'
        };
      }

      return { suspicious: false };

    } catch (error) {
      console.error('Suspicious activity check error:', error);
      return { suspicious: false };
    }
  }
}

module.exports = FaceVerificationService;
