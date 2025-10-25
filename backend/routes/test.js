const express = require('express');
const router = express.Router();

// Test QR scan endpoint
router.post('/scan', (req, res) => {
  try {
    const { qrData, faceImage, studentId } = req.body;
    
    // Log the received data
    console.log('Test QR Scan Request:', { 
      qrDataReceived: !!qrData,
      faceImageReceived: !!faceImage,
      studentId
    });
    
    // Parse the QR data
    let parsedQRData;
    try {
      parsedQRData = JSON.parse(qrData);
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid QR data format' 
      });
    }
    
    // Simulate successful scan
    return res.json({
      success: true,
      message: 'QR code scanned successfully',
      verified: true,
      faceScore: 95,
      attendance: {
        id: 'test-attendance-' + Date.now(),
        studentId: studentId,
        subject: parsedQRData.subject,
        room: parsedQRData.room,
        timestamp: new Date().toISOString(),
        status: 'present'
      }
    });
  } catch (error) {
    console.error('Test QR Scan Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
});

// Test face verification endpoint
router.post('/face-verify', (req, res) => {
  try {
    const { image, studentId } = req.body;
    
    // Log the received data
    console.log('Test Face Verification Request:', { 
      imageReceived: !!image,
      studentId
    });
    
    // Simulate successful verification
    return res.json({
      success: true,
      message: 'Face verified successfully',
      verified: true,
      faceScore: 92
    });
  } catch (error) {
    console.error('Test Face Verification Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
});

module.exports = router;