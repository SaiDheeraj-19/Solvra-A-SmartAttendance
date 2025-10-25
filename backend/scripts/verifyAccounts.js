const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function verifyAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB\n');

    // Find all faculty accounts
    const facultyAccounts = await User.find({ 
      role: { $in: ['faculty', 'hod', 'dean'] } 
    }).select('name email role department isActive');

    console.log('📋 FACULTY ACCOUNTS IN DATABASE:\n');
    console.log('='.repeat(80));
    
    if (facultyAccounts.length === 0) {
      console.log('❌ No faculty accounts found in database!');
      console.log('\n💡 Create faculty accounts through the admin panel or API.\n');
    } else {
      facultyAccounts.forEach((account, index) => {
        console.log(`\n${index + 1}. ${account.role.toUpperCase().padEnd(10)} - ${account.name}`);
        console.log(`   Email:      ${account.email}`);
        console.log(`   Department: ${account.department || 'N/A'}`);
        console.log(`   Active:     ${account.isActive ? '✅ Yes' : '❌ No'}`);
      });
      console.log('\n' + '='.repeat(80));
      console.log(`\n✅ Total faculty accounts: ${facultyAccounts.length}\n`);
    }

    // Check for any existing accounts (without referencing specific demo accounts)
    const anyAccount = await User.findOne({});
    
    if (!anyAccount) {
      console.log('\n💡 No user accounts found in the database.');
      console.log('   Create accounts through the registration portal or admin panel.\n');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyAccounts();