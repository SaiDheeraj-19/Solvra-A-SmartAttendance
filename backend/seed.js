require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Face = require('./models/Face');
const Class = require('./models/Class');
const Session = require('./models/Session');
const Attendance = require('./models/Attendance');
const Marks = require('./models/Marks');
const Settings = require('./models/Settings');
const connectDB = require('./config/db');

// Sample data for seeding
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Face.deleteMany({});
    await Class.deleteMany({});
    await Session.deleteMany({});
    await Attendance.deleteMany({});
    await Marks.deleteMany({});
    await Settings.deleteMany({});

    console.log('Existing data cleared');

    // Create sample users
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'admin',
      department: 'Computer Science',
      faceRegistered: true,
      createdAt: new Date()
    });

    const facultyUser = await User.create({
      name: 'Faculty User',
      email: 'faculty@example.com',
      passwordHash: hashedPassword,
      role: 'faculty',
      department: 'Computer Science',
      faceRegistered: true,
      createdAt: new Date()
    });

    const studentUser = await User.create({
      name: 'Student User',
      email: 'student@example.com',
      passwordHash: hashedPassword,
      role: 'student',
      studentId: 'STU001',
      department: 'Computer Science',
      subjects: [],
      faceRegistered: false,
      createdAt: new Date()
    });

    console.log('Users created');

    // Create sample class
    const sampleClass = await Class.create({
      subjectName: 'Database Systems',
      subjectCode: 'CS301',
      facultyId: facultyUser._id,
      semester: 3,
      department: 'Computer Science',
      createdAt: new Date()
    });

    console.log('Class created');

    // Update student with class
    await User.findByIdAndUpdate(studentUser._id, {
      subjects: [sampleClass._id]
    });

    // Create sample session
    const sampleSession = await Session.create({
      classId: sampleClass._id,
      facultyId: facultyUser._id,
      qrToken: 'SAMPLE_QR_TOKEN_12345',
      expiryTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      geoFence: {
        lat: 12.9716,
        lng: 77.5946,
        radius: 100
      },
      status: 'active',
      createdAt: new Date()
    });

    console.log('Session created');

    // Create sample attendance
    await Attendance.create({
      studentId: studentUser._id,
      sessionId: sampleSession._id,
      classId: sampleClass._id,
      status: 'present',
      timestamp: new Date(),
      geoLocation: {
        lat: 12.9716,
        lng: 77.5946
      },
      faceVerified: true,
      distanceFromCampus: 25
    });

    console.log('Attendance created');

    // Create sample marks
    await Marks.create({
      studentId: studentUser._id,
      classId: sampleClass._id,
      assessmentType: 'midterm',
      marksObtained: 85,
      totalMarks: 100,
      createdAt: new Date()
    });

    console.log('Marks created');

    // Create sample settings
    await Settings.create({
      adminId: adminUser._id,
      geoFence: {
        lat: 12.9716,
        lng: 77.5946,
        radius: 500
      },
      qrExpiryMinutes: 5,
      updatedAt: new Date()
    });

    console.log('Settings created');

    // Create sample face data
    await Face.create({
      userId: studentUser._id,
      embedding: [0.1, 0.2, 0.3, 0.4, 0.5], // Sample embedding data
      imageURL: 'https://example.com/face-image.jpg',
      registeredBy: adminUser._id,
      createdAt: new Date()
    });

    console.log('Face data created');

    console.log('Sample data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();