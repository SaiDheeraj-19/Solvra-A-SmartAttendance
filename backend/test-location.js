const mongoose = require('mongoose');
const { isInsideCampus } = require('./utils/geo');
const geofenceService = require('./services/geofenceService');
require('dotenv').config();

async function testLocation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');
    
    // Load geofence data
    await geofenceService.loadFromDb();
    
    // Get current geofence
    const gf = geofenceService.getGeofence();
    console.log('Current geofence:', gf);
    
    // Test coordinates (you can change these to your current location)
    const testCoordinates = [
      // Default campus location
      { lat: 15.797113, lng: 78.077443, name: 'Default Campus Center' },
      // Points around the default campus
      { lat: 15.797113, lng: 78.077443 + 0.001, name: 'East of Campus' },
      { lat: 15.797113, lng: 78.077443 - 0.001, name: 'West of Campus' },
      { lat: 15.797113 + 0.001, lng: 78.077443, name: 'North of Campus' },
      { lat: 15.797113 - 0.001, lng: 78.077443, name: 'South of Campus' },
      // Your current location (replace with actual coordinates)
      { lat: 0, lng: 0, name: 'Your Current Location - REPLACE THESE COORDINATES' }
    ];
    
    console.log('\n📍 Location Tests:');
    console.log('==================');
    
    testCoordinates.forEach(coord => {
      const inside = isInsideCampus({ lat: coord.lat, lng: coord.lng });
      console.log(`${coord.name}:`);
      console.log(`  Coordinates: ${coord.lat}, ${coord.lng}`);
      console.log(`  Inside Campus: ${inside ? '✅ YES' : '❌ NO'}\n`);
    });
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLocation();