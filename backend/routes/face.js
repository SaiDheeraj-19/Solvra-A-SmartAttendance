const express = require('express');
const router = express.Router();
const { registerFace, getFaceStatus, updateSecuritySettings, verifyFace } = require('../controllers/faceController');
const { protect } = require('../middleware/auth');

// Face registration and verification routes
router.post('/register', protect, registerFace); // Face registration enabled
router.get('/status', protect, getFaceStatus);
router.put('/security-settings', protect, updateSecuritySettings);
router.post('/verify', protect, verifyFace); // Verify face during attendance

module.exports = router;
