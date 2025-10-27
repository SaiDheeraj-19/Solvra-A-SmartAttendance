const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// Test account patterns to remove
const testPatterns = [
  // Email patterns
  'test@',
  'demo@',
  '@example.com',
  'temp@',
  'temporary@',
  
  // Name patterns
  'test',
  'demo',
  'temp',
  'temporary',
  
  // Specific test accounts
  'haiohs@gmail.com',
  'marks-linty-1f@icloud.com',
  'king075hksv@gmail.com',
  '123@gmail.com'
];

// Test account names to remove
const testNames = [
  'Test User',
  'Test Admin',
  'Test Registration User',
  'Test Student',
  'Test Faculty',
  'Demo User',
  'Demo Admin',
  'Demo Student',
  'Demo Faculty'
];

async function removeTestAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Find all users
    const allUsers = await User.find({});
    console.log(`📋 Found ${allUsers.length} total accounts`);

    let deleted = 0;
    let errors = 0;
    let skipped = 0;

    for (const user of allUsers) {
      try {
        let shouldDelete = false;
        
        // Check email patterns
        for (const pattern of testPatterns) {
          if (user.email.toLowerCase().includes(pattern.toLowerCase())) {
            shouldDelete = true;
            break;
          }
        }
        
        // Check name patterns if email patterns didn't match
        if (!shouldDelete) {
          for (const pattern of testPatterns) {
            if (user.name.toLowerCase().includes(pattern.toLowerCase())) {
              shouldDelete = true;
              break;
            }
          }
        }
        
        // Check specific names if other patterns didn't match
        if (!shouldDelete) {
          for (const testName of testNames) {
            if (user.name.toLowerCase() === testName.toLowerCase()) {
              shouldDelete = true;
              break;
            }
          }
        }
        
        // Special case for faculty demo account
        if (!shouldDelete && user.email === 'facultycse@demo.com') {
          shouldDelete = true;
        }
        
        if (shouldDelete) {
          // Delete user
          await User.deleteOne({ _id: user._id });
          console.log(`✅ Deleted: ${user.name} (${user.email})`);
          deleted++;
        } else {
          console.log(`ℹ️  Skipped: ${user.name} (${user.email})`);
          skipped++;
        }
      } catch (err) {
        console.error(`❌ Error processing ${user.email}:`, err.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully deleted: ${deleted} accounts`);
    console.log(`ℹ️  Skipped:             ${skipped} accounts`);
    console.log(`❌ Errors:              ${errors} accounts`);
    console.log('='.repeat(80));

    if (deleted > 0) {
      console.log('\n🎉 Test accounts removed successfully!\n');
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
removeTestAccounts();
