const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

async function testAPIProfileUpdate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Test user credentials (using demo account)
    const email = 'student2@demo.com';
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
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log('❌ Password does not match');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ Password matches');

    // Generate JWT token (simulate login)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random-change-this-in-production',
      { expiresIn: '7d' }
    );

    console.log('✅ JWT token generated');

    // Test profile update data
    const updateData = {
      name: 'Emma Updated',
      email: 'emma.updated@demo.com',
      department: 'Information Technology',
      year: '4th Year',
      phone: '+9876543210'
    };

    console.log('📝 Updating profile with data:', updateData);

    // Simulate the updateProfile controller function
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      console.log('❌ User not found during update');
    } else {
      console.log('✅ Profile updated successfully:', updatedUser);
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPIProfileUpdate();