const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// Demo account emails to remove
const demoEmails = [
  'student@demo.com',
  'student2@demo.com',
  'faculty@demo.com',
  'faculty2@demo.com',
  'faculty3@demo.com',
  'hod@demo.com',
  'hod2@demo.com',
  'dean@demo.com',
  'dean2@demo.com'
];

async function removeDemoAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    let deleted = 0;
    let errors = 0;

    for (const email of demoEmails) {
      try {
        // Check if user exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          // Delete user
          await User.deleteOne({ email: email });
          console.log(`✅ Deleted: ${email}`);
          deleted++;
        } else {
          console.log(`⚠️  Not found: ${email} (skipped)`);
        }
      } catch (err) {
        console.error(`❌ Error deleting ${email}:`, err.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully deleted: ${deleted} accounts`);
    console.log(`❌ Errors:              ${errors} accounts`);
    console.log('='.repeat(80));

    if (deleted > 0) {
      console.log('\n🎉 Demo accounts removed successfully!\n');
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
removeDemoAccounts();
