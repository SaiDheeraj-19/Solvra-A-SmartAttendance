const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { deleteFaceData, getAllStudentsFaceStatus } = require('../controllers/adminFaceController');

// Admin face management routes
router.delete('/delete/:studentId', protect, adminOnly, deleteFaceData);
router.get('/students', protect, adminOnly, getAllStudentsFaceStatus);

module.exports = router;