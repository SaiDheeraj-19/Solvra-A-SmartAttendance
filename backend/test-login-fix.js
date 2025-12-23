const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with demo account...');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'hod@demo.com',
      password: 'hod123'
    });

    console.log('✅ Login successful!');
    console.log('Token received:', response.data.token.substring(0, 30) + '...');
    console.log('User:', response.data.user.name, '-', response.data.user.role);
    
  } catch (error) {
    console.error('❌ Login failed:', error.response ? error.response.data : error.message);
  }
}

testLogin();