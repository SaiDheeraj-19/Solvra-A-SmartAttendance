// Script to debug location issues
const { isInsideCampus, haversineDistanceMeters } = require('./utils/geo');
const geofenceService = require('./services/geofenceService');
const mongoose = require('mongoose');
require('dotenv').config();

async function debugLocation() {
  try {
    console.log('🔍 Location Debug Tool');
    console.log('====================');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');
    
    // Load geofence data
    await geofenceService.loadFromDb();
    
    // Get current geofence
    const gf = geofenceService.getGeofence();
    console.log('\n📍 Current Geofence:');
    console.log(`   Center: ${gf.center.lat}, ${gf.center.lng}`);
    console.log(`   Radius: ${gf.radiusMeters} meters`);
    console.log(`   Source: ${gf.source}`);
    
    // Test various locations
    const testLocations = [
      {
        name: 'Campus Center',
        lat: gf.center.lat,
        lng: gf.center.lng
      },
      {
        name: '100m North',
        lat: gf.center.lat + (100 / 111320), // Approximate conversion
        lng: gf.center.lng
      },
      {
        name: '100m South',
        lat: gf.center.lat - (100 / 111320),
        lng: gf.center.lng
      },
      {
        name: '100m East',
        lat: gf.center.lat,
        lng: gf.center.lng + (100 / (111320 * Math.cos(gf.center.lat * Math.PI / 180)))
      },
      {
        name: '100m West',
        lat: gf.center.lat,
        lng: gf.center.lng - (100 / (111320 * Math.cos(gf.center.lat * Math.PI / 180)))
      },
      {
        name: '500m North-East',
        lat: gf.center.lat + (500 / 111320),
        lng: gf.center.lng + (500 / (111320 * Math.cos(gf.center.lat * Math.PI / 180)))
      }
    ];
    
    console.log('\n🧪 Location Tests:');
    console.log('==================');
    
    testLocations.forEach(location => {
      const distance = haversineDistanceMeters(
        { lat: gf.center.lat, lng: gf.center.lng },
        { lat: location.lat, lng: location.lng }
      );
      
      const inside = isInsideCampus({ lat: location.lat, lng: location.lng });
      
      console.log(`\n📍 ${location.name}:`);
      console.log(`   Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
      console.log(`   Distance: ${distance.toFixed(2)}m`);
      console.log(`   Inside Campus: ${inside ? '✅ YES' : '❌ NO'}`);
      
      if (!inside && distance <= gf.radiusMeters) {
        console.log(`   ⚠️  WARNING: Should be inside but reported as outside!`);
      } else if (inside && distance > gf.radiusMeters) {
        console.log(`   ⚠️  WARNING: Should be outside but reported as inside!`);
      }
    });
    
    // Test edge cases
    console.log('\n⚠️  Edge Case Tests:');
    console.log('====================');
    
    // Test with invalid coordinates
    console.log('\nInvalid coordinates test:');
    const invalidCoord1 = { lat: "invalid", lng: 0 };
    console.log('isInsideCampus({lat: "invalid", lng: 0}):', isInsideCampus(invalidCoord1));
    
    const invalidCoord2 = { lat: NaN, lng: 0 };
    console.log('isInsideCampus({lat: NaN, lng: 0}):', isInsideCampus(invalidCoord2));
    
    const invalidCoord3 = { lat: 0, lng: Infinity };
    console.log('isInsideCampus({lat: 0, lng: Infinity}):', isInsideCampus(invalidCoord3));
    
    await mongoose.connection.close();
    console.log('\n✅ Debug completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugLocation();