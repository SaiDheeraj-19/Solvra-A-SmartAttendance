const express = require('express');
const router = express.Router();
const { getGeofence, updateGeofence } = require('../controllers/geofenceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Anyone authenticated can view current geofence
router.get('/', protect, getGeofence);

// Admins only can update
router.post('/', protect, adminOnly, updateGeofence);

module.exports = router;
