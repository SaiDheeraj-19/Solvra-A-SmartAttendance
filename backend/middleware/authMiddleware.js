const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: 'Not authorized, token failed' });
  }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (!req.user || !['admin', 'hod', 'dean'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Not authorized, admin access required' });
  }
  next();
};

// Faculty only middleware
exports.facultyOnly = (req, res, next) => {
  if (!req.user || !['faculty', 'hod', 'dean'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Not authorized, faculty access required' });
  }
  next();
};