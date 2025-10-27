const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const readline = require('readline');

// Import models
const User = require('../models/User');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

// Function to prompt user for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to add a student
async function addStudent() {
  console.log('\n=== Adding New Student ===');
  
  const name = await askQuestion('Enter student full name: ');
  const email = await askQuestion('Enter student email: ');
  const studentId = await askQuestion('Enter student ID: ');
  const department = await askQuestion('Enter department: ');
  const year = await askQuestion('Enter year (1-4): ');
  const phone = await askQuestion('Enter phone number: ');
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    console.log(`⚠️  User with email ${email} already exists!`);
    return;
  }
  
  try {
    // Create student user with default password
    const student = await User.create({
      name: name,
      email: email,
      password: await bcrypt.hash('student123', 10), // Default password
      role: 'student',
      studentId: studentId,
      department: department,
      year: year,
      phone: phone,
      isActive: true
    });
    
    console.log(`✅ Student created successfully!`);
    console.log(`Name: ${student.name}`);
    console.log(`Email: ${student.email}`);
    console.log(`Default Password: student123`);
    console.log(`Student ID: ${student.studentId}`);
  } catch (error) {
    console.error(`❌ Error creating student: ${error.message}`);
  }
}

// Function to add a faculty member
async function addFaculty() {
  console.log('\n=== Adding New Faculty Member ===');
  
  const name = await askQuestion('Enter faculty full name (with title like Dr./Prof.): ');
  const email = await askQuestion('Enter faculty email: ');
  const facultyId = await askQuestion('Enter faculty ID: ');
  const department = await askQuestion('Enter department: ');
  const phone = await askQuestion('Enter phone number: ');
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    console.log(`⚠️  User with email ${email} already exists!`);
    return;
  }
  
  try {
    // Create faculty user with default password
    const faculty = await User.create({
      name: name,
      email: email,
      password: await bcrypt.hash('faculty123', 10), // Default password
      role: 'faculty',
      studentId: facultyId,
      department: department,
      phone: phone,
      isActive: true
    });
    
    console.log(`✅ Faculty member created successfully!`);
    console.log(`Name: ${faculty.name}`);
    console.log(`Email: ${faculty.email}`);
    console.log(`Default Password: faculty123`);
    console.log(`Faculty ID: ${faculty.studentId}`);
  } catch (error) {
    console.error(`❌ Error creating faculty: ${error.message}`);
  }
}

// Main function
async function main() {
  await connectDB();
  
  console.log('\n=== SmartPresence Real Data Entry Tool ===');
  console.log('This tool helps you add real student and faculty data to the database.\n');
  
  while (true) {
    console.log('\nOptions:');
    console.log('1. Add Student');
    console.log('2. Add Faculty Member');
    console.log('3. Exit');
    
    const choice = await askQuestion('\nEnter your choice (1-3): ');
    
    switch (choice) {
      case '1':
        await addStudent();
        break;
      case '2':
        await addFaculty();
        break;
      case '3':
        console.log('👋 Exiting...');
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
      default:
        console.log('Invalid choice. Please enter 1, 2, or 3.');
    }
  }
}

// Handle Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n\n👋 Exiting...');
  rl.close();
  await mongoose.connection.close();
  process.exit(0);
});

// Run the script
main();