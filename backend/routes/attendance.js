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
const { protect } = require('../middleware/auth');

// Protected routes
router.post('/check-in', protect, checkIn);
router.post('/check-out', protect, checkOut);
router.get('/me', protect, getAttendance);
router.get('/summary', protect, getSummary);
router.get('/analytics', protect, getAnalytics);

// Proxy attendance routes
router.post('/proxy-check-in', protect, proxyCheckIn);
router.get('/proxy-history', protect, getProxyAttendanceHistory);
router.put('/proxy-permission', protect, toggleProxyAttendancePermission);

// Faculty routes
router.get('/students', protect, getStudents);
router.get('/subjects', protect, getSubjects);
router.get('/faculty-overview', protect, getFacultyOverview);
router.get('/faculty-date/:date', protect, getAttendanceForDate);
router.get('/faculty-analytics', protect, getFacultyAnalytics);

// New endpoint for testing location without affecting attendance
router.post('/test-location', protect, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    // Import the location check function
    const { isInsideCampus } = require('../utils/geo');
    
    // Validate coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid coordinates provided',
        error: 'Coordinates must be valid numbers'
      });
    }
    
    // Check if inside campus
    const insideCampus = isInsideCampus({ lat, lng });
    
    // Get current geofence info
    const geofenceService = require('../services/geofenceService');
    const geofence = geofenceService.getGeofence();
    
    // Calculate distance for debugging
    const { haversineDistanceMeters } = require('../utils/geo');
    const distance = haversineDistanceMeters(
      { lat: geofence.center.lat, lng: geofence.center.lng },
      { lat, lng }
    );
    
    res.json({
      success: true,
      insideCampus,
      coordinates: { lat, lng },
      geofence: {
        center: geofence.center,
        radiusMeters: geofence.radiusMeters,
        source: geofence.source
      },
      distance: {
        meters: distance,
        kilometers: distance / 1000
      },
      message: insideCampus 
        ? 'You are inside the campus boundary' 
        : 'You are outside the campus boundary'
    });
  } catch (error) {
    console.error('Location test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error testing location',
      error: error.message
    });
  }
});

module.exports = router;