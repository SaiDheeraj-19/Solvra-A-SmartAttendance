const express = require('express');
const router = express.Router();
const { 
  checkIn, 
  checkOut, 
  getAttendance, 
  getSummary, 
  getAnalytics,
  getStudents,
  getSubjects,
  getFacultyOverview,
  getAttendanceForDate,
  getFacultyAnalytics,
  proxyCheckIn,
  getProxyAttendanceHistory,
  toggleProxyAttendancePermission
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

// Student routes
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/me', protect, getAttendance);
router.get('/summary', protect, getSummary);
router.get('/analytics', protect, getAnalytics);
router.put('/proxy-permission', protect, toggleProxyAttendancePermission);

// Proxy attendance routes
router.post('/proxy-check-in', protect, proxyCheckIn);
router.get('/proxy-history', protect, getProxyAttendanceHistory);

// Faculty routes
router.get('/students', protect, getStudents);
router.get('/subjects', protect, getSubjects);
router.get('/faculty-overview', protect, getFacultyOverview);
router.get('/faculty-date/:date', protect, getAttendanceForDate);
router.get('/faculty-analytics', protect, getFacultyAnalytics);

module.exports = router;