const axios = require('axios');

async function testAdminFaceAPI() {
  try {
    // Login as admin (HOD) to get JWT token
    console.log('Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'hod@demo.com',
      password: 'hod123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful!');
    console.log('Token:', token.substring(0, 30) + '...');

    // Test getting all students face status
    console.log('\nFetching all students face status...');
    const studentsResponse = await axios.get('http://localhost:5001/api/admin/face/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Students face status fetched successfully!');
    console.log('Number of students:', studentsResponse.data.length);
    console.log('First student:', JSON.stringify(studentsResponse.data[0], null, 2));

    // If there are students with face data, we could test deletion
    // But since this is a fresh setup, no students will have face data yet
    
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

testAdminFaceAPI();