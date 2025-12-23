// Script to update geofence settings
const mongoose = require('mongoose');
const Geofence = require('./models/Geofence');
require('dotenv').config();

async function updateGeofence() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');
    
    // Update or create geofence with larger radius
    const updatedGeofence = await Geofence.findOneAndUpdate(
      {}, // Find any existing geofence
      {
        center: { lat: 15.797113, lng: 78.077443 },
        radiusMeters: 1500, // Increased from 500 to 1500 meters
        note: 'Updated radius for better coverage - ' + new Date().toISOString()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );
    
    console.log('✅ Geofence updated successfully:');
    console.log(`   Center: ${updatedGeofence.center.lat}, ${updatedGeofence.center.lng}`);
    console.log(`   Radius: ${updatedGeofence.radiusMeters} meters`);
    console.log(`   Note: ${updatedGeofence.note}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateGeofence();