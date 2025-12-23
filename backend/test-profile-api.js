const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');

// Test endpoint to create a user and generate a valid token
app.get('/setup-test-user', async (req, res) => {
  try {
    // Create a test user
    const existingUser = await User.findOne({ email: 'test@api.com' });
    if (existingUser) {
      await User.deleteOne({ email: 'test@api.com' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('test123', salt);

    const user = new User({
      name: 'API Test User',
      email: 'test@api.com',
      passwordHash,
      role: 'student',
      studentId: 'TEST001',
      department: 'Computer Science'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random-change-this-in-production',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Test user created successfully',
      userId: user._id,
      token: token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to update profile
app.put('/test-profile-update', async (req, res) => {
  try {
    const { token, updateData } = req.body;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    if (!updateData) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random-change-this-in-production');
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Test API server running on port ${PORT}`);
  console.log(`🔧 To set up a test user, visit: http://localhost:${PORT}/setup-test-user`);
  console.log(`🔧 To test profile update, send POST to: http://localhost:${PORT}/test-profile-update`);
});