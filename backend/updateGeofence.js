const mongoose = require('mongoose');
const geofenceService = require('./services/geofenceService');
require('dotenv').config();

async function updateGeofence() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');

    // Update geofence with new coordinates
    const newGeofence = {
      center: { lat: 15.797113, lng: 78.077443 },
      radiusMeters: 500,
      note: 'Updated campus coordinates'
    };

    // Create a mock user ID for the update
    const mockUserId = new mongoose.Types.ObjectId();

    const result = await geofenceService.updateGeofence({
      center: newGeofence.center,
      radiusMeters: newGeofence.radiusMeters,
      updatedBy: mockUserId,
      note: newGeofence.note
    });

    console.log('✅ Geofence updated successfully:');
    console.log('  Center:', result.center);
    console.log('  Radius:', result.radiusMeters, 'meters');
    console.log('  Note:', result.note);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error updating geofence:', error);
    process.exit(1);
  }
}

// Run the script
updateGeofence();