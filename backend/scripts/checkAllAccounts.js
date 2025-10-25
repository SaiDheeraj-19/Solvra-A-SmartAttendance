const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkAllAccounts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    const allUsers = await User.find({}).select('name email role isActive');
    
    console.log('📋 ALL ACCOUNTS IN DATABASE:');
    console.log('================================================================');
    
    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.role.toUpperCase().padEnd(8)} - ${user.name}`);
      console.log(`   Email:      ${user.email}`);
      console.log(`   Active:     ${user.isActive ? '✅ Yes' : '❌ No'}`);
    });
    
    console.log('\n' + '================================================================');
    console.log(`✅ Total accounts: ${allUsers.length}\n`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAllAccounts();