const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testProfileUpdate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Find a student user to test with
    const user = await User.findOne({ role: 'student' });
    
    if (!user) {
      console.log('❌ No student user found');
      await mongoose.connection.close();
      return;
    }

    console.log('👤 Found user:', user.name, user.email);

    // Test profile update data
    const updateData = {
      name: 'Updated Name',
      email: 'updated@example.com',
      department: 'Computer Science',
      year: '3rd Year',
      phone: '+1234567890'
    };

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      console.log('❌ User not found');
    } else {
      console.log('✅ Profile updated successfully:', updatedUser);
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testProfileUpdate();