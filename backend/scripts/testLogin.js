const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    
    // Test student login
    const studentEmail = 'student@demo.com';
    const studentPassword = 'student123';
    
    console.log(`🔍 Testing login for: ${studentEmail}`);
    
    const user = await User.findOne({ email: studentEmail });
    if (!user) {
      console.log('❌ User not found in database');
      await mongoose.connection.close();
      return;
    }
    
    console.log(`✅ User found: ${user.name}`);
    console.log(`🔐 Stored password hash: ${user.password.substring(0, 20)}...`);
    
    const match = await bcrypt.compare(studentPassword, user.password);
    console.log(`🔑 Password match: ${match ? '✅ Yes' : '❌ No'}`);
    
    if (match) {
      console.log('🎉 Login would be successful!');
    } else {
      console.log('💥 Login would fail - incorrect password');
    }
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();