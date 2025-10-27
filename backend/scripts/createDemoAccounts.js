const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// Demo accounts data
const demoAccounts = [
  // STUDENT ACCOUNTS
  {
    name: 'John Student',
    email: 'student@demo.com',
    password: 'student123',
    role: 'student',
    studentId: 'STU001',
    department: 'Computer Science',
    year: '3',
    phone: '+1234567890'
  },
  {
    name: 'Emma Student',
    email: 'student2@demo.com',
    password: 'student123',
    role: 'student',
    studentId: 'STU002',
    department: 'Computer Science',
    year: '2',
    phone: '+1234567891'
  },
  
  // FACULTY ACCOUNTS
  {
    name: 'Dr. Sarah Johnson',
    email: 'faculty@demo.com',
    password: 'faculty123',
    role: 'faculty',
    studentId: 'FAC001',
    department: 'Computer Science',
    phone: '+1234567892'
  },
  {
    name: 'Prof. Michael Brown',
    email: 'faculty2@demo.com',
    password: 'faculty123',
    role: 'faculty',
    studentId: 'FAC002',
    department: 'Information Technology',
    phone: '+1234567893'
  },
  {
    name: 'Dr. Lisa Martinez',
    email: 'faculty3@demo.com',
    password: 'faculty123',
    role: 'faculty',
    studentId: 'FAC003',
    department: 'Electronics',
    phone: '+1234567894'
  },
  
  // HEAD OF DEPARTMENT (HOD) ACCOUNTS
  {
    name: 'Dr. Robert Wilson',
    email: 'hod@demo.com',
    password: 'hod123',
    role: 'admin',
    studentId: 'HOD001',
    department: 'Computer Science',
    phone: '+1234567895'
  },
  {
    name: 'Dr. Jennifer Davis',
    email: 'hod2@demo.com',
    password: 'hod123',
    role: 'admin',
    studentId: 'HOD002',
    department: 'Information Technology',
    phone: '+1234567896'
  },
  
  // DEAN ACCOUNTS
  {
    name: 'Dr. William Anderson',
    email: 'dean@demo.com',
    password: 'dean123',
    role: 'admin',
    studentId: 'DEAN001',
    department: 'Engineering',
    phone: '+1234567897'
  },
  {
    name: 'Dr. Patricia Taylor',
    email: 'dean2@demo.com',
    password: 'dean123',
    role: 'admin',
    studentId: 'DEAN002',
    department: 'Sciences',
    phone: '+1234567898'
  }
];

async function createDemoAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const account of demoAccounts) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: account.email });
        if (existingUser) {
          console.log(`⚠️  Skipped: ${account.email} (already exists)`);
          skipped++;
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(account.password, 10);

        // Create user
        await User.create({
          name: account.name,
          email: account.email,
          passwordHash: hashedPassword,
          role: account.role,
          studentId: account.studentId,
          department: account.department,
          year: account.year,
          phone: account.phone,
          isActive: true
        });

        console.log(`✅ Created: ${account.role.toUpperCase().padEnd(8)} - ${account.email.padEnd(25)} | Name: ${account.name}`);
        created++;
      } catch (err) {
        console.error(`❌ Error creating ${account.email}:`, err.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully created: ${created} accounts`);
    console.log(`⚠️  Skipped (existing):  ${skipped} accounts`);
    console.log(`❌ Errors:              ${errors} accounts`);
    console.log('='.repeat(80));

    if (created > 0) {
      console.log('\n🎉 Demo accounts created successfully!\n');
      
      console.log('📋 LOGIN CREDENTIALS:\n');
      
      console.log('👨‍🎓 STUDENT ACCOUNTS:');
      console.log('  Email: student@demo.com      | Password: student123');
      console.log('  Email: student2@demo.com     | Password: student123\n');
      
      console.log('👨‍🏫 FACULTY ACCOUNTS:');
      console.log('  Email: faculty@demo.com      | Password: faculty123');
      console.log('  Email: faculty2@demo.com     | Password: faculty123');
      console.log('  Email: faculty3@demo.com     | Password: faculty123\n');
      
      console.log('👔 HEAD OF DEPARTMENT (HOD):');
      console.log('  Email: hod@demo.com          | Password: hod123');
      console.log('  Email: hod2@demo.com         | Password: hod123\n');
      
      console.log('🎓 DEAN ACCOUNTS:');
      console.log('  Email: dean@demo.com         | Password: dean123');
      console.log('  Email: dean2@demo.com        | Password: dean123\n');
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
createDemoAccounts();
