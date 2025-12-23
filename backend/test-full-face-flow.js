const axios = require('axios');
const bcrypt = require('bcryptjs');

async function testFullFaceFlow() {
  try {
    console.log('=== Testing Full Face Registration and Admin Deletion Flow ===\n');
    
    // Step 1: Login as student
    console.log('1. Logging in as student...');
    const studentLoginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'student@demo.com',
      password: 'student123'
    });

    const studentToken = studentLoginResponse.data.token;
    console.log('✅ Student login successful!\n');

    // Step 2: Register face data for student
    console.log('2. Registering face data for student...');
    // Using a base64 encoded sample image data (simulated)
    const fakeFaceImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
    
    const registerResponse = await axios.post('http://localhost:5001/api/face/register', {
      faceImage: fakeFaceImageData
    }, {
      headers: {
        'Authorization': `Bearer ${studentToken}`
      }
    });

    console.log('✅ Face registration successful!');
    console.log('Registration response:', registerResponse.data.message, '\n');

    // Step 3: Login as admin
    console.log('3. Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'hod@demo.com',
      password: 'hod123'
    });

    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful!\n');

    // Step 4: Check student face status (should show registered now)
    console.log('4. Checking student face status...');
    const studentsResponse = await axios.get('http://localhost:5001/api/admin/face/students', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const studentWithFace = studentsResponse.data.find(s => s.hasRegisteredFace);
    console.log('✅ Students with face data found:', studentWithFace ? 1 : 0);
    if (studentWithFace) {
      console.log('Student with face data:', studentWithFace.name, '-', studentWithFace.studentId, '\n');
    }

    // Step 5: Delete face data using admin endpoint
    console.log('5. Deleting face data for student...');
    const deleteResponse = await axios.delete(`http://localhost:5001/api/admin/face/delete/${studentWithFace._id}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    console.log('✅ Face data deletion successful!');
    console.log('Deletion response:', deleteResponse.data.message, '\n');

    // Step 6: Verify deletion by checking status again
    console.log('6. Verifying deletion...');
    const finalStudentsResponse = await axios.get('http://localhost:5001/api/admin/face/students', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const studentAfterDeletion = finalStudentsResponse.data.find(s => s._id === studentWithFace._id);
    console.log('✅ Final verification complete!');
    console.log('Student face registration status after deletion:', studentAfterDeletion.hasRegisteredFace ? 'Still registered' : 'Successfully deleted');

    console.log('\n=== Test completed successfully! ===');

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

testFullFaceFlow();