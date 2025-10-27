const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('../models/User');

async function checkAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('name email role studentId department');
    
    console.log('\n📋 All User Accounts:');
    console.log('====================');
    users.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Student ID: ${user.studentId || 'N/A'}`);
      console.log(`Department: ${user.department || 'N/A'}`);
      console.log('---');
    });

    // Count users by role
    const roleCounts = {};
    users.forEach(user => {
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
    });

    console.log('\n📊 Role Distribution:');
    console.log('====================');
    for (const [role, count] of Object.entries(roleCounts)) {
      console.log(`${role}: ${count}`);
    }

    console.log('\n✅ Account check completed!\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal Error:', error);
    process.exit(1);
  }
}

// Run the script
checkAccounts();