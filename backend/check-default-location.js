// Simple script to check a default location against the campus geofence
const { isInsideCampus, haversineDistanceMeters } = require('./utils/geo');
const geofenceService = require('./services/geofenceService');
const mongoose = require('mongoose');
require('dotenv').config();

async function checkDefaultLocation() {
  try {
    console.log('📍 Checking Default Test Location');
    console.log('==============================');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');
    
    // Load geofence data
    await geofenceService.loadFromDb();
    
    // Get current geofence
    const gf = geofenceService.getGeofence();
    console.log('\n🏫 Campus Geofence Information:');
    console.log(`   Center: ${gf.center.lat}, ${gf.center.lng}`);
    console.log(`   Radius: ${gf.radiusMeters} meters`);
    console.log(`   Source: ${gf.source}`);
    
    // Test with default campus center coordinates
    const testLocation = {
      lat: gf.center.lat,
      lng: gf.center.lng
    };
    
    console.log(`\n📍 Test Location: ${testLocation.lat}, ${testLocation.lng} (Campus Center)`);
    
    // Check if inside campus
    const inside = isInsideCampus(testLocation);
    
    // Calculate distance
    const distance = haversineDistanceMeters(
      { lat: gf.center.lat, lng: gf.center.lng },
      testLocation
    );
    
    console.log('\n📊 Results:');
    console.log(`   Distance from campus center: ${distance.toFixed(2)} meters`);
    console.log(`   Inside campus boundary: ${inside ? '✅ YES' : '❌ NO'}`);
    
    if (inside) {
      console.log('\n🎉 Great! The test location is within the campus boundary.');
    } else {
      console.log('\n⚠️  The test location is outside the campus boundary.');
    }
    
    // Test with a location outside the campus
    const outsideLocation = {
      lat: testLocation.lat + 0.01, // Move north by about 1.1km
      lng: testLocation.lng
    };
    
    console.log(`\n📍 Outside Test Location: ${outsideLocation.lat}, ${outsideLocation.lng}`);
    
    const outsideInside = isInsideCampus(outsideLocation);
    const outsideDistance = haversineDistanceMeters(
      { lat: gf.center.lat, lng: gf.center.lng },
      outsideLocation
    );
    
    console.log('\n📊 Outside Location Results:');
    console.log(`   Distance from campus center: ${outsideDistance.toFixed(2)} meters`);
    console.log(`   Inside campus boundary: ${outsideInside ? '✅ YES' : '❌ NO'}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Check completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDefaultLocation();