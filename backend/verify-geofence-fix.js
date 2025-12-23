// Script to verify the geofence update fix
const mongoose = require('mongoose');
const geofenceService = require('./services/geofenceService');
require('dotenv').config();

async function verifyGeofenceFix() {
  try {
    console.log('🔍 Verifying Geofence Update Fix');
    console.log('============================');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');
    
    // Load current geofence
    await geofenceService.loadFromDb();
    let currentGeofence = geofenceService.getGeofence();
    console.log('\n📍 Initial Geofence:');
    console.log('   Center:', currentGeofence.center);
    console.log('   Radius:', currentGeofence.radiusMeters, 'meters');
    console.log('   Source:', currentGeofence.source);
    console.log('   ID:', currentGeofence.id || 'None');
    
    // Test updating the geofence
    console.log('\n🔄 Testing Geofence Update...');
    
    if (currentGeofence.id) {
      // Update existing geofence
      const updatedDoc = await geofenceService.updateExistingGeofence(currentGeofence.id, {
        center: { lat: 15.800000, lng: 78.080000 },
        radiusMeters: 3000,
        note: 'Verification test - ' + new Date().toISOString()
      });
      
      console.log('   ✅ Update successful!');
      console.log('   Updated Center:', updatedDoc.center);
      console.log('   Updated Radius:', updatedDoc.radiusMeters, 'meters');
    } else {
      // Create new geofence
      const newDoc = await geofenceService.updateGeofence({
        center: { lat: 15.800000, lng: 78.080000 },
        radiusMeters: 3000,
        note: 'Verification test - ' + new Date().toISOString()
      });
      
      console.log('   ✅ Creation successful!');
      console.log('   New Center:', newDoc.center);
      console.log('   New Radius:', newDoc.radiusMeters, 'meters');
    }
    
    // Reload and verify the cache was updated
    currentGeofence = geofenceService.getGeofence();
    console.log('\n📍 Updated Geofence (from cache):');
    console.log('   Center:', currentGeofence.center);
    console.log('   Radius:', currentGeofence.radiusMeters, 'meters');
    console.log('   Source:', currentGeofence.source);
    console.log('   ID:', currentGeofence.id);
    
    // Verify the changes took effect
    if (currentGeofence.center.lat === 15.800000 && 
        currentGeofence.center.lng === 78.080000 && 
        currentGeofence.radiusMeters === 3000) {
      console.log('\n🎉 SUCCESS: Geofence update fix is working correctly!');
      console.log('   Changes are properly persisted and cached.');
    } else {
      console.log('\n❌ ISSUE: Geofence update fix is not working correctly.');
      console.log('   Expected: lat=15.800000, lng=78.080000, radius=3000');
      console.log('   Actual:', currentGeofence);
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Verification completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
}

verifyGeofenceFix();