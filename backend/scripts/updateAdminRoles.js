const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('../models/User');

async function updateAdminRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Update all HOD and Dean accounts to admin
    const result = await User.updateMany(
      { role: { $in: ['hod', 'dean'] } },
      { $set: { role: 'admin' } }
    );

    console.log(`\n📊 Updated ${result.modifiedCount} accounts from HOD/Dean to Admin`);

    // Display the updated accounts
    if (result.modifiedCount > 0) {
      const updatedAccounts = await User.find({ role: 'admin' });
      console.log('\n📋 Updated Admin Accounts:');
      updatedAccounts.forEach(account => {
        console.log(`   - ${account.name} (${account.email})`);
      });
    }

    console.log('\n🎉 Admin role update completed successfully!\n');

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
updateAdminRoles();