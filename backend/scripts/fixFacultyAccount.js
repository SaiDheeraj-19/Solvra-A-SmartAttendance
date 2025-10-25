const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function fixFacultyAccount() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB\n');

    // This script is for fixing faculty account roles in case they were incorrectly set
    // It will update the first faculty account found that doesn't have the correct role
    const facultyWithoutRole = await User.findOne({ 
      role: { $ne: 'faculty' },
      email: { $exists: true }
    });

    if (facultyWithoutRole) {
      console.log(`🔧 Found account with incorrect role: ${facultyWithoutRole.email}`);
      
      const result = await User.updateOne(
        { _id: facultyWithoutRole._id },
        { 
          $set: { 
            role: 'faculty'
          } 
        }
      );

      if (result.modifiedCount > 0) {
        console.log('✅ Successfully updated faculty account role\n');
        
        const updatedAccount = await User.findById(facultyWithoutRole._id);
        console.log('📋 Updated Account Details:');
        console.log('   Name:       ', updatedAccount.name);
        console.log('   Email:      ', updatedAccount.email);
        console.log('   Role:       ', updatedAccount.role);
        console.log('   Department: ', updatedAccount.department || 'N/A');
        console.log('   Active:     ', updatedAccount.isActive ? '✅ Yes' : '❌ No');
      }
    } else {
      console.log('✅ No faculty accounts found with incorrect roles\n');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixFacultyAccount();