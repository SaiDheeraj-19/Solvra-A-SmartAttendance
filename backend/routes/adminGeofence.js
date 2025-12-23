const express = require('express');
const router = express.Router();
const { getGeofence, updateGeofence, testGeofence } = require('../controllers/geofenceController');
const { protect } = require('../middleware/auth');

// All routes protected by admin middleware
router.get('/', protect, getGeofence);
router.put('/', protect, updateGeofence);
router.post('/test', protect, testGeofence); // New test endpoint

module.exports = router;