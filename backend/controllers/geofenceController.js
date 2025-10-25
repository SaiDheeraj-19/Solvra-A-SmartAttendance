const geofenceService = require('../services/geofenceService');

// Get current geofence (cached)
exports.getGeofence = async (req, res) => {
  try {
    const gf = geofenceService.getGeofence();
    return res.json({ success: true, geofence: gf });
  } catch (e) {
    console.error('Get geofence error:', e);
    return res.status(500).json({ success: false, msg: 'Error fetching geofence' });
  }
};

// Admin update geofence
exports.updateGeofence = async (req, res) => {
  try {
    // Only admins should be allowed here; middleware will enforce
    const { center, radiusMeters, note } = req.body;
    if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
      return res.status(400).json({ success: false, msg: 'Invalid center coordinates' });
    }
    if (typeof radiusMeters !== 'number' || radiusMeters <= 0) {
      return res.status(400).json({ success: false, msg: 'Invalid radiusMeters' });
    }

    const doc = await geofenceService.updateGeofence({ center, radiusMeters, updatedBy: req.user._id, note });
    return res.json({ success: true, message: 'Geofence updated', geofence: doc });
  } catch (e) {
    console.error('Update geofence error:', e);
    return res.status(500).json({ success: false, msg: e.message || 'Error updating geofence' });
  }
};
