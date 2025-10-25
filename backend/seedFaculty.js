require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedFaculty = async () => {
  await connectDB();

  try {
    console.log('Creating faculty user...');

    // Check if faculty already exists
    const existingFaculty = await User.findOne({ email: 'faculty@gpcet.edu.in' });
    if (existingFaculty) {
      console.log('Faculty user already exists:', existingFaculty.email);
      return;
    }

    // Create faculty user
    const faculty = await User.create({
      name: 'Dr. Faculty Admin',
      email: 'faculty@gpcet.edu.in',
      password: 'faculty123', // This will be hashed by the pre-save middleware
      role: 'faculty',
      department: 'CSE',
      phone: '9876543210',
      isActive: true
    });

    console.log('Faculty user created successfully:', faculty.email);
    console.log('Password: faculty123');

  } catch (error) {
    console.error('Error creating faculty user:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedFaculty();
