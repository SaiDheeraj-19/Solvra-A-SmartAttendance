const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testUpdateProfile() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Find a test user
    const user = await User.findOne({ email: 'emma.updated@demo.com' });
    if (!user) {
      console.log('❌ Test user not found');
      await mongoose.connection.close();
      return;
    }

    console.log('👤 Found user:', user.name);

    // Test data
    const updateData = {
      name: 'Emma Updated Again',
      email: 'emma.updated.again@demo.com',
      department: 'Electronics',
      year: 'Final Year',
      phone: '+1122334455'
    };

    console.log('📝 Updating profile with data:', updateData);

    // Directly call the update function (simulating what the controller does)
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (updatedUser) {
      console.log('✅ Profile updated successfully!');
      console.log('📝 Updated user data:', updatedUser);
    } else {
      console.log('❌ Profile update failed');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpdateProfile();