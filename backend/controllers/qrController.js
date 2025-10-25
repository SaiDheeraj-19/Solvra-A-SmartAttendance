const QRCode = require('../models/QRCode');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const User = require('../models/User');
const QRCodeLib = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const FaceVerificationService = require('../services/faceVerificationService');
const { isInsideCampus } = require('../utils/geo');

function startOfDayUTC(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

exports.generateQR = async (req, res) => {
  try {
    const { type = 'attendance', location, maxUsage = 100 } = req.body;
    
    const code = uuidv4();
    const qrData = {
      code,
      type,
      location,
      createdBy: req.user._id,
      maxUsage
    };

    const qrRecord = await QRCode.create(qrData);
    
    // Generate QR code image with proper error handling
    try {
      const qrContent = JSON.stringify({
        id: qrRecord._id.toString(),
        code,
        type,
        location
      });
      
      console.log('QR content:', qrContent);
      
      const qrImage = await QRCodeLib.toDataURL(qrContent);
      
      res.json({
        id: qrRecord._id,
        code,
        qrImage,
        expiresAt: qrRecord.expiresAt
      });
    } catch (qrError) {
      console.error('QR generation error:', qrError);
      res.status(500).json({ msg: 'Error generating QR code image', error: qrError.message });
    }
  } catch (e) {
    console.error('QR record creation error:', e);
    res.status(500).json({ msg: 'Error generating QR code', error: e.message });
  }
};

exports.scanQR = async (req, res) => {
  try {
    const { qrData, faceImage, lat, lng, accuracy, deviceFingerprint, userAgent } = req.body;
    
    if (!qrData || !faceImage) {
      return res.status(400).json({ msg: 'QR data and face image required' });
    }

    const parsedData = JSON.parse(qrData);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(parsedData.id)) {
      return res.status(400).json({ msg: 'Invalid QR code format' });
    }
    
    const qrRecord = await QRCode.findOne({ 
      _id: new mongoose.Types.ObjectId(parsedData.id), 
      active: true
    });

    if (!qrRecord) {
      return res.status(404).json({ msg: 'Invalid or expired QR code' });
    }

    if (qrRecord.usageCount >= qrRecord.maxUsage) {
      return res.status(403).json({ msg: 'QR code usage limit exceeded' });
    }

    // Validate location coordinates are provided
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ 
        msg: 'Location coordinates required for attendance verification',
        requiresLocation: true
      });
    }

    // Convert string coordinates to numbers if needed
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        msg: 'Invalid location coordinates',
        requiresLocation: true
      });
    }

    // Verify student is inside campus geofence
    if (!isInsideCampus({ lat: latitude, lng: longitude })) {
      return res.status(403).json({ 
        msg: 'You are not inside the campus boundary. Please scan the QR code from within the campus premises.',
        outsideCampus: true,
        currentLocation: { lat: latitude, lng: longitude }
      });
    }

    // Get student information
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Check if face verification is required
    let faceVerification = { verified: true, score: 1.0 };
    if (student.securitySettings?.requireFaceVerification) {
      // Perform face verification
      faceVerification = await FaceVerificationService.verifyStudentFace(
        req.user._id, 
        faceImage
      );

      if (!faceVerification.verified) {
        // Log failed verification attempt
        await logVerificationAttempt(req.user._id, qrRecord._id, {
          faceMatchScore: faceVerification.score,
          reason: faceVerification.reason,
          location: { latitude: lat, longitude: lng, accuracy },
          deviceFingerprint,
          userAgent
        });

        return res.status(401).json({ 
          msg: `Face verification failed: ${faceVerification.reason}`,
          verificationScore: faceVerification.score,
          requiresRegistration: !student.faceData?.encoding
        });
      }

      // Check for suspicious activity
      const suspiciousCheck = await FaceVerificationService.checkSuspiciousActivity(
        req.user._id,
        { qrCodeId: qrRecord._id, location: { lat, lng } }
      );

      if (suspiciousCheck.suspicious) {
        await logSecurityFlag(req.user._id, qrRecord._id, {
          type: 'suspicious_activity',
          description: suspiciousCheck.reason,
          severity: suspiciousCheck.severity
        });

        return res.status(403).json({ 
          msg: `Security alert: ${suspiciousCheck.reason}`,
          requiresManualVerification: true
        });
      }
    }

    // Create or update attendance session
    const sessionId = uuidv4();
    let attendanceSession = await AttendanceSession.findOne({
      student: req.user._id,
      qrCodeId: qrRecord._id,
      status: 'active'
    });

    if (!attendanceSession) {
      attendanceSession = await AttendanceSession.create({
        qrCodeId: qrRecord._id,
        student: req.user._id,
        sessionId,
        verificationData: {
          faceMatchScore: faceVerification.score,
          faceVerified: faceVerification.verified,
          locationVerified: true,
          insideCampus: true,
          deviceFingerprint,
          ipAddress: req.ip,
          userAgent
        },
        attempts: [{
          faceMatchScore: faceVerification.score,
          location: { latitude: lat, longitude: lng, accuracy },
          deviceInfo: userAgent
        }]
      });
    } else {
      // Update existing session
      attendanceSession.attempts.push({
        faceMatchScore: faceVerification.score,
        location: { latitude: lat, longitude: lng, accuracy },
        deviceInfo: userAgent
      });
      await attendanceSession.save();
    }

    // Mark attendance based on QR type
    const date = startOfDayUTC();
    let attendanceRecord;

    if (qrRecord.type === 'checkin' || qrRecord.type === 'attendance') {
      const update = {
        $setOnInsert: { user: req.user._id, date },
        $set: { status: 'present', checkInAt: new Date() },
        $push: { 
          events: { 
            type: 'enter', 
            location: qrRecord.location,
            method: 'qr_face_verification',
            faceVerified: faceVerification.verified,
            faceScore: faceVerification.score,
            sessionId: attendanceSession.sessionId,
            timestamp: new Date()
          } 
        }
      };

      attendanceRecord = await Attendance.findOneAndUpdate(
        { user: req.user._id, date },
        update,
        { upsert: true, new: true }
      );
    }

    if (qrRecord.type === 'checkout') {
      attendanceRecord = await Attendance.findOne({ user: req.user._id, date });
      if (attendanceRecord) {
        attendanceRecord.status = 'absent';
        attendanceRecord.checkOutAt = new Date();
        attendanceRecord.events.push({
          type: 'exit',
          location: qrRecord.location,
          method: 'qr_face_verification',
          faceVerified: faceVerification.verified,
          faceScore: faceVerification.score,
          sessionId: attendanceSession.sessionId,
          timestamp: new Date()
        });
        await attendanceRecord.save();

        // Mark session as completed
        attendanceSession.status = 'completed';
        attendanceSession.endTime = new Date();
        await attendanceSession.save();

        // Emit real-time notification for faculty
        req.app.get('io').to('faculty').emit('student_exit', {
          studentName: req.user.name,
          studentId: req.user.studentId,
          timestamp: new Date(),
          location: qrRecord.location,
          verificationScore: faceVerification.score
        });
      }
    }

    // Update QR usage count
    qrRecord.usageCount += 1;
    await qrRecord.save();

    res.json({
      success: true,
      attendance: attendanceRecord,
      message: `Successfully ${qrRecord.type === 'checkout' ? 'checked out' : 'checked in'}`,
      verificationData: {
        faceVerified: faceVerification.verified,
        faceScore: faceVerification.score,
        sessionId: attendanceSession.sessionId
      }
    });

  } catch (e) {
    console.error('Error processing QR scan:', e);
    res.status(500).json({ msg: 'Error processing QR scan' });
  }
};

exports.getActiveQRs = async (req, res) => {
  try {
    const qrs = await QRCode.find({ 
      active: true,
      createdBy: req.user._id 
    }).sort({ createdAt: -1 });
    
    res.json(qrs);
  } catch (e) {
    res.status(500).json({ msg: 'Error fetching QR codes' });
  }
};

// Helper function to log verification attempts
async function logVerificationAttempt(studentId, qrCodeId, attemptData) {
  try {
    await AttendanceSession.create({
      qrCodeId,
      student: studentId,
      sessionId: uuidv4(),
      status: 'suspicious',
      verificationData: {
        faceMatchScore: attemptData.faceMatchScore,
        faceVerified: false,
        locationVerified: true,
        deviceFingerprint: attemptData.deviceFingerprint,
        userAgent: attemptData.userAgent
      },
      securityFlags: [{
        type: 'face_mismatch',
        description: attemptData.reason
      }],
      attempts: [attemptData]
    });
  } catch (error) {
    console.error('Error logging verification attempt:', error);
  }
}

// Helper function to log security flags
async function logSecurityFlag(studentId, qrCodeId, flagData) {
  try {
    await AttendanceSession.create({
      qrCodeId,
      student: studentId,
      sessionId: uuidv4(),
      status: 'suspicious',
      securityFlags: [flagData]
    });
  } catch (error) {
    console.error('Error logging security flag:', error);
  }
}

// Basic face verification function (replace with proper face recognition in production)
async function verifyFace(faceImage, userId) {
  // This is a placeholder - in production, you would:
  // 1. Extract face features from the image
  // 2. Compare with stored face features for the user
  // 3. Return true if match confidence is above threshold
  
  // For now, we'll just check if an image was provided
  return faceImage && faceImage.length > 0;
}

exports.verifyFace = verifyFace;
