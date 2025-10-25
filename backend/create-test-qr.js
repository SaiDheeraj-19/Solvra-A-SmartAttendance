const QRCode = require('qrcode');
const fs = require('fs');

async function createTestQR() {
  // Test QR data
  const qrData = {
    id: 'test-qr-' + Date.now(),
    facultyId: 'test-faculty-123',
    subject: 'Test Subject',
    room: 'A101',
    timestamp: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    type: 'attendance'
  };

  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Save as PNG file
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const outputPath = './test-qr-code.png';
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ Test QR Code Created Successfully!');
    console.log('📁 File saved: test-qr-code.png');
    console.log('📱 QR Data:', JSON.stringify(qrData, null, 2));
    console.log('');
    console.log('🔍 Testing Instructions:');
    console.log('1. Open test-qr-code.png in your file manager');
    console.log('2. Use your phone camera to scan the QR code');
    console.log('3. Or visit http://localhost:3000/test-qr for web testing');
    console.log('4. The QR code is valid for 15 minutes');
    
    return qrData;
  } catch (error) {
    console.error('❌ Error creating QR code:', error);
  }
}

createTestQR();
