const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password, studentId, department, year, phone, role, employeeId } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Name, email, and password are required' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User with this email already exists' });

    // Check if student ID already exists (if provided)
    if (studentId) {
      const existingStudent = await User.findOne({ studentId });
      if (existingStudent) return res.status(400).json({ msg: 'Student ID already exists' });
    }

    // Check if employee ID already exists (if provided)
    if (employeeId) {
      const existingEmployee = await User.findOne({ studentId: employeeId }); // Using studentId field for employeeId
      if (existingEmployee) return res.status(400).json({ msg: 'Employee ID already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      passwordHash: hashed,
      studentId: studentId || employeeId, // Use studentId field for both student and employee IDs
      department,
      year,
      phone,
      role: role || 'student'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        year: user.year,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        year: user.year,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, studentId, department, year, phone, profilePicture } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: 'Email already exists' });
    }

    // Check if student ID is being changed and if it already exists
    if (studentId && studentId !== req.user.studentId) {
      const existingStudent = await User.findOne({ studentId });
      if (existingStudent) return res.status(400).json({ msg: 'Student ID already exists' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (studentId !== undefined) updateData.studentId = studentId;
    if (department) updateData.department = department;
    if (year) updateData.year = year;
    if (phone) updateData.phone = phone;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
    }

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(req.user._id, { passwordHash: hashedNewPassword });

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all faculty members
exports.getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: { $in: ['faculty', 'admin'] } })
      .select('name email department phone isActive createdAt')
      .sort({ name: 1 });
    
    res.status(200).json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ msg: 'Server error fetching faculty' });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user has admin privileges
    const currentUser = await User.findById(req.user._id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    let query = {};
    
    // Filter by role if specified
    if (req.query.role && req.query.role !== 'all') {
      if (req.query.role === 'admin') {
        query.role = 'admin';
      } else {
        query.role = req.query.role;
      }
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Server error fetching users' });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    // Check if user has admin privileges
    const currentUser = await User.findById(req.user._id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    const { name, email, role, department, year, studentId, phone, password } = req.body;
    const userId = req.params.id;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
    }

    // Check if student ID is being changed and if it already exists
    if (studentId) {
      const existingStudent = await User.findOne({ studentId, _id: { $ne: userId } });
      if (existingStudent) {
        return res.status(400).json({ msg: 'Student/Employee ID already exists' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (year) updateData.year = year;
    if (studentId !== undefined) updateData.studentId = studentId;
    if (phone) updateData.phone = phone;
    
    // Only update password if provided
    if (password && password.trim() !== '') {
      const hashed = await bcrypt.hash(password, 10);
      updateData.passwordHash = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ msg: 'Server error updating user' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    // Check if user has admin privileges
    const currentUser = await User.findById(req.user._id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    const userId = req.params.id;

    // Prevent users from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ msg: 'You cannot delete your own account' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ msg: 'Server error deleting user' });
  }
};
