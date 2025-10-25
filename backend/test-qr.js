const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Generate a test QR code for testing purposes
async function generateTestQR() {
  try {
    // Test QR data
    const qrData = {
      id: 'test-qr-' + Date.now(),
      facultyId: 'test-faculty-123',
      subject: 'Test Subject',
      room: 'A101',
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      type: 'attendance'
    };

    // Convert to string
    const qrString = JSON.stringify(qrData);
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Save QR code as image
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const outputPath = path.join(__dirname, 'test-qr-code.png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ Test QR Code Generated Successfully!');
    console.log('📁 Saved to:', outputPath);
    console.log('📱 QR Data:', qrString);
    console.log('⏰ Expires at:', qrData.expiresAt);
    console.log('');
    console.log('🔍 To test:');
    console.log('1. Open the generated image: test-qr-code.png');
    console.log('2. Use your phone camera or QR scanner app');
    console.log('3. Or use the web app QR scanner');
    console.log('');
    console.log('📊 QR Code Details:');
    console.log('- ID:', qrData.id);
    console.log('- Faculty ID:', qrData.facultyId);
    console.log('- Subject:', qrData.subject);
    console.log('- Room:', qrData.room);
    console.log('- Valid for 15 minutes');
    
    return qrData;
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
  }
}

// Run the generator
generateTestQR();
