const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint for QR scanning
app.post('/api/test/scan', (req, res) => {
  try {
    const { qrData, faceImage, studentId } = req.body;
    
    console.log('🔍 QR Scan Test Request:');
    console.log('- QR Data:', qrData);
    console.log('- Student ID:', studentId);
    console.log('- Face Image Length:', faceImage ? faceImage.length : 'No image');
    
    // Simulate QR validation
    const qrInfo = JSON.parse(qrData);
    const now = new Date();
    const expiresAt = new Date(qrInfo.expiresAt);
    
    if (now > expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'QR code has expired',
        qrInfo
      });
    }
    
    // Simulate face verification (in real app, this would use ML model)
    const faceScore = Math.random() * 100; // Random score for testing
    const faceVerified = faceScore > 70; // 70% threshold
    
    console.log('🎭 Face Verification:');
    console.log('- Face Score:', faceScore.toFixed(2) + '%');
    console.log('- Verified:', faceVerified ? '✅ YES' : '❌ NO');
    
    if (!faceVerified) {
      return res.status(400).json({
        success: false,
        message: 'Face verification failed',
        faceScore: faceScore.toFixed(2)
      });
    }
    
    // Simulate attendance marking
    const attendanceRecord = {
      studentId,
      qrId: qrInfo.id,
      facultyId: qrInfo.facultyId,
      subject: qrInfo.subject,
      room: qrInfo.room,
      timestamp: new Date().toISOString(),
      faceScore: faceScore.toFixed(2),
      verified: true
    };
    
    console.log('✅ Attendance Marked Successfully!');
    console.log('📊 Record:', attendanceRecord);
    
    res.json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: attendanceRecord
    });
    
  } catch (error) {
    console.error('❌ QR Scan Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during QR scan',
      error: error.message
    });
  }
});

// Test endpoint for face verification
app.post('/api/test/face-verify', (req, res) => {
  try {
    const { image, studentId } = req.body;
    
    console.log('🎭 Face Verification Test:');
    console.log('- Student ID:', studentId);
    console.log('- Image Length:', image ? image.length : 'No image');
    
    // Simulate face verification
    const faceScore = Math.random() * 100;
    const faceVerified = faceScore > 70;
    
    res.json({
      success: true,
      verified: faceVerified,
      faceScore: faceScore.toFixed(2),
      message: faceVerified ? 'Face verified successfully' : 'Face verification failed'
    });
    
  } catch (error) {
    console.error('❌ Face Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during face verification',
      error: error.message
    });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log('🧪 Test Server Running on port', PORT);
  console.log('📡 Test Endpoints:');
  console.log('- POST /api/test/scan - Test QR scanning');
  console.log('- POST /api/test/face-verify - Test face verification');
  console.log('');
  console.log('🔍 Test the QR code with:');
  console.log('curl -X POST http://localhost:5002/api/test/scan \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"qrData":"YOUR_QR_DATA","faceImage":"base64_image","studentId":"test-student"}\'');
});
