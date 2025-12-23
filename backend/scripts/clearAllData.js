require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Face = require('../models/Face');
const Class = require('../models/Class');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');
const Settings = require('../models/Settings');

async function clearAllData() {
  try {
    // Connect to database
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);

    // Clear all collections
    await User.deleteMany({});
    await Face.deleteMany({});
    await Class.deleteMany({});
    await Session.deleteMany({});
    await Attendance.deleteMany({});
    await Marks.deleteMany({});
    await Settings.deleteMany({});

    console.log('✅ All data cleared successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error clearing data: ${error.message}`);
    process.exit(1);
  }
}

clearAllData();