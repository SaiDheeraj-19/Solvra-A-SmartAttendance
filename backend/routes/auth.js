const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, getFaculty, getAllUsers, updateUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/faculty', protect, getFaculty);

// User management routes (admin only)
router.get('/users', protect, getAllUsers);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
