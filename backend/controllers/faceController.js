const User = require('../models/User');
const FaceVerificationService = require('../services/faceVerificationService');

// Register face data for a student
exports.registerFace = async (req, res) => {
  try {
    const { faceImage } = req.body;
    
    if (!faceImage) {
      return res.status(400).json({ msg: 'Face image is required' });
    }

    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Generate face encoding
    const faceEncoding = FaceVerificationService.generateFaceEncoding(faceImage);
    
    // Update student with face data
    student.faceData = {
      encoding: faceEncoding,
      registeredAt: new Date(),
      lastVerified: null,
      verificationCount: 0
    };
    
    await student.save();

    res.json({
      success: true,
      message: 'Face data registered successfully',
      registeredAt: student.faceData.registeredAt
    });

  } catch (error) {
    console.error('Face registration error:', error);
    res.status(500).json({ msg: 'Error registering face data' });
  }
};

// Get face registration status
exports.getFaceStatus = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    res.json({
      hasRegisteredFace: !!student.faceData?.encoding,
      registeredAt: student.faceData?.registeredAt,
      lastVerified: student.faceData?.lastVerified,
      verificationCount: student.faceData?.verificationCount || 0,
      securitySettings: student.securitySettings
    });

  } catch (error) {
    console.error('Get face status error:', error);
    res.status(500).json({ msg: 'Error getting face status' });
  }
};

// Update security settings
exports.updateSecuritySettings = async (req, res) => {
  try {
    const { requireFaceVerification, allowProxyAttendance, maxVerificationAttempts } = req.body;
    
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Update security settings
    if (requireFaceVerification !== undefined) {
      student.securitySettings.requireFaceVerification = requireFaceVerification;
    }
    if (allowProxyAttendance !== undefined) {
      student.securitySettings.allowProxyAttendance = allowProxyAttendance;
    }
    if (maxVerificationAttempts !== undefined) {
      student.securitySettings.maxVerificationAttempts = maxVerificationAttempts;
    }

    await student.save();

    res.json({
      success: true,
      message: 'Security settings updated successfully',
      securitySettings: student.securitySettings
    });

  } catch (error) {
    console.error('Update security settings error:', error);
    res.status(500).json({ msg: 'Error updating security settings' });
  }
};

// Verify face during attendance
exports.verifyFace = async (req, res) => {
  try {
    const { faceImage } = req.body;
    
    if (!faceImage) {
      return res.status(400).json({ 
        verified: false,
        msg: 'Face image is required for verification' 
      });
    }

    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ 
        verified: false,
        msg: 'Student not found' 
      });
    }

    // Check if student has registered face
    if (!student.faceData || !student.faceData.encoding) {
      return res.status(400).json({ 
        verified: false,
        requiresRegistration: true,
        msg: 'Please register your face first before marking attendance',
        message: 'No registered face data found. Please complete face registration.'
      });
    }

    // Perform face verification
    const verificationResult = await FaceVerificationService.verifyStudentFace(
      req.user._id,
      faceImage
    );

    if (!verificationResult.verified) {
      return res.status(401).json({ 
        verified: false,
        score: verificationResult.score,
        confidence: verificationResult.confidence || 0,
        msg: verificationResult.reason,
        message: verificationResult.reason
      });
    }

    // Success
    res.json({
      verified: true,
      score: verificationResult.score,
      confidence: verificationResult.confidence,
      message: 'Face verified successfully',
      msg: 'Face verified successfully',
      studentId: student.studentId,
      studentName: student.name
    });

  } catch (error) {
    console.error('Face verification error:', error);
    res.status(500).json({ 
      verified: false,
      msg: 'Error during face verification',
      message: 'System error during face verification. Please try again.'
    });
  }
};
