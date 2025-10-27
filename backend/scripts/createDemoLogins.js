const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Demo accounts data
const demoAccounts = [
  // Student accounts
  {
    name: 'John Smith',
    email: 'john.student@demo.com',
    password: 'student123',
    studentId: 'STU2024001',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    phone: '+1234567890',
    isActive: true
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.student@demo.com',
    password: 'student123',
    studentId: 'STU2024002',
    role: 'student',
    department: 'Information Technology',
    year: '2nd Year',
    phone: '+1234567891',
    isActive: true
  },
  {
    name: 'Mike Wilson',
    email: 'mike.student@demo.com',
    password: 'student123',
    studentId: 'STU2024003',
    role: 'student',
    department: 'Electronics',
    year: '4th Year',
    phone: '+1234567892',
    isActive: true
  },
  {
    name: 'Emily Davis',
    email: 'emily.student@demo.com',
    password: 'student123',
    studentId: 'STU2024004',
    role: 'student',
    department: 'Mechanical Engineering',
    year: '1st Year',
    phone: '+1234567893',
    isActive: true
  },
  
  // Faculty accounts
  {
    name: 'Dr. Robert Brown',
    email: 'robert.faculty@demo.com',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Science',
    phone: '+1234567894',
    isActive: true
  },
  {
    name: 'Prof. Lisa Anderson',
    email: 'lisa.faculty@demo.com',
    password: 'faculty123',
    role: 'faculty',
    department: 'Information Technology',
    phone: '+1234567895',
    isActive: true
  },
  {
    name: 'Dr. James Miller',
    email: 'james.faculty@demo.com',
    password: 'faculty123',
    role: 'faculty',
    department: 'Electronics',
    phone: '+1234567896',
    isActive: true
  },
  {
    name: 'Prof. Maria Garcia',
    email: 'maria.faculty@demo.com',
    password: 'faculty123',
    role: 'faculty',
    department: 'Mechanical Engineering',
    phone: '+1234567897',
    isActive: true
  },
  
  // Admin accounts (using 'hod' and 'dean' roles)
  {
    name: 'Admin Smith',
    email: 'admin.smith@demo.com',
    password: 'admin123',
    role: 'hod',
    department: 'Administration',
    phone: '+1234567898',
    isActive: true
  },
  {
    name: 'Super Admin',
    email: 'super.admin@demo.com',
    password: 'admin123',
    role: 'dean',
    department: 'Administration',
    phone: '+1234567899',
    isActive: true
  },
  {
    name: 'System Admin',
    email: 'system.admin@demo.com',
    password: 'admin123',
    role: 'hod',
    department: 'IT Administration',
    phone: '+1234567800',
    isActive: true
  },
  {
    name: 'Campus Admin',
    email: 'campus.admin@demo.com',
    password: 'admin123',
    role: 'dean',
    department: 'Campus Administration',
    phone: '+1234567801',
    isActive: true
  }
];

async function createDemoAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    let created = 0;
    let errors = 0;
    let skipped = 0;

    for (const accountData of demoAccounts) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: accountData.email });
        if (existingUser) {
          console.log(`⚠️  Account already exists: ${accountData.email} (skipped)`);
          skipped++;
          continue;
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(accountData.password, saltRounds);

        // Create user
        const user = new User({
          name: accountData.name,
          email: accountData.email,
          password: hashedPassword,
          role: accountData.role,
          department: accountData.department,
          phone: accountData.phone,
          isActive: accountData.isActive,
          ...(accountData.studentId && { studentId: accountData.studentId }),
          ...(accountData.year && { year: accountData.year })
        });

        await user.save();
        console.log(`✅ Created: ${accountData.name} (${accountData.email}) - ${accountData.role}`);
        created++;
      } catch (err) {
        console.error(`❌ Error creating ${accountData.email}:`, err.message);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 CREATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Successfully created: ${created} accounts`);
    console.log(`ℹ️  Skipped:             ${skipped} accounts`);
    console.log(`❌ Errors:              ${errors} accounts`);
    console.log('='.repeat(80));

    if (created > 0) {
      console.log('\n🎉 Demo accounts created successfully!\n');
      
      // Display login credentials
      console.log('🔑 DEMO LOGIN CREDENTIALS:');
      console.log('='.repeat(80));
      
      console.log('\n📚 STUDENT ACCOUNTS:');
      demoAccounts.filter(acc => acc.role === 'student').forEach(acc => {
        console.log(`   Email: ${acc.email}`);
        console.log(`   Password: ${acc.password}`);
        console.log(`   Student ID: ${acc.studentId}`);
        console.log(`   Department: ${acc.department}`);
        console.log('   ---');
      });
      
      console.log('\n👨‍🏫 FACULTY ACCOUNTS:');
      demoAccounts.filter(acc => acc.role === 'faculty').forEach(acc => {
        console.log(`   Email: ${acc.email}`);
        console.log(`   Password: ${acc.password}`);
        console.log(`   Department: ${acc.department}`);
        console.log('   ---');
      });
      
      console.log('\n👨‍💼 ADMIN ACCOUNTS (HOD/Dean):');
      demoAccounts.filter(acc => acc.role === 'hod' || acc.role === 'dean').forEach(acc => {
        console.log(`   Email: ${acc.email}`);
        console.log(`   Password: ${acc.password}`);
        console.log(`   Role: ${acc.role.toUpperCase()}`);
        console.log(`   Department: ${acc.department}`);
        console.log('   ---');
      });
      
      console.log('\n🌐 PORTAL ACCESS:');
      console.log('   Student Portal: http://localhost:3000/login');
      console.log('   Faculty Portal: http://localhost:3000/login/faculty');
      console.log('   Admin Portal:   http://localhost:3000/login/admin');
      console.log('='.repeat(80));
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
