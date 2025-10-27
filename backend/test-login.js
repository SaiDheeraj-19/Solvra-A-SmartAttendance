const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Test user credentials
    const email = 'student@demo.com';
    const password = 'student123';

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ User found:', user.name);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log('✅ Password matches');
    } else {
      console.log('❌ Password does not match');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLogin();