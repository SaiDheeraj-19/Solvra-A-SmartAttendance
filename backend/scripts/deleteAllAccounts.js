const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('../models/User');

async function deleteAllAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Find all users first to show what will be deleted
    const allUsers = await User.find({});
    console.log(`\n📋 Found ${allUsers.length} accounts to delete:`);
    console.log('='.repeat(80));
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.role.toUpperCase().padEnd(8)} - ${user.name} (${user.email})`);
    });
    
    console.log('='.repeat(80));

    if (allUsers.length === 0) {
      console.log('ℹ️  No accounts found to delete.');
      await mongoose.connection.close();
      return;
    }

    // Delete all users
    const result = await User.deleteMany({});
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 DELETION SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully deleted: ${result.deletedCount} accounts`);
    console.log('='.repeat(80));

    if (result.deletedCount > 0) {
      console.log('\n🎉 All accounts deleted successfully!\n');
    }

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
deleteAllAccounts();
