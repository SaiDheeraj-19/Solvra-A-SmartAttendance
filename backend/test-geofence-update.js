// Script to test geofence updates
const mongoose = require('mongoose');
const geofenceService = require('./services/geofenceService');
const Geofence = require('./models/Geofence');
require('dotenv').config();

async function testGeofenceUpdate() {
  try {
    console.log('🧪 Testing Geofence Update Functionality');
    console.log('=====================================');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');
    
    // Load current geofence
    await geofenceService.loadFromDb();
    let currentGeofence = geofenceService.getGeofence();
    console.log('\n📍 Current Geofence:');
    console.log('   Center:', currentGeofence.center);
    console.log('   Radius:', currentGeofence.radiusMeters, 'meters');
    console.log('   Source:', currentGeofence.source);
    console.log('   ID:', currentGeofence.id || 'None');
    
    // Test updating existing geofence
    console.log('\n🔄 Testing Geofence Update...');
    
    if (currentGeofence.id) {
      console.log('   Updating existing geofence...');
      const updatedDoc = await geofenceService.updateExistingGeofence(currentGeofence.id, {
        center: { lat: 15.798000, lng: 78.078000 },
        radiusMeters: 2000,
        note: 'Test update - ' + new Date().toISOString()
      });
      
      console.log('   ✅ Update successful!');
      console.log('   New Center:', updatedDoc.center);
      console.log('   New Radius:', updatedDoc.radiusMeters, 'meters');
      
      // Reload geofence to verify cache update
      currentGeofence = geofenceService.getGeofence();
      console.log('\n📍 Updated Geofence (from cache):');
      console.log('   Center:', currentGeofence.center);
      console.log('   Radius:', currentGeofence.radiusMeters, 'meters');
      console.log('   Source:', currentGeofence.source);
      console.log('   ID:', currentGeofence.id);
    } else {
      console.log('   Creating new geofence...');
      const newDoc = await geofenceService.updateGeofence({
        center: { lat: 15.798000, lng: 78.078000 },
        radiusMeters: 2000,
        note: 'Test creation - ' + new Date().toISOString()
      });
      
      console.log('   ✅ Creation successful!');
      console.log('   New Center:', newDoc.center);
      console.log('   New Radius:', newDoc.radiusMeters, 'meters');
      
      // Reload geofence to verify cache update
      currentGeofence = geofenceService.getGeofence();
      console.log('\n📍 New Geofence (from cache):');
      console.log('   Center:', currentGeofence.center);
      console.log('   Radius:', currentGeofence.radiusMeters, 'meters');
      console.log('   Source:', currentGeofence.source);
      console.log('   ID:', currentGeofence.id);
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
}

testGeofenceUpdate();