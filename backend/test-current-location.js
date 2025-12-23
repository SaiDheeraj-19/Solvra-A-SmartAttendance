const { isInsideCampus } = require('./utils/geo');
const geofenceService = require('./services/geofenceService');
const mongoose = require('mongoose');
require('dotenv').config();

async function testCurrentLocation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartattendance');
    console.log('✅ Connected to MongoDB');
    
    // Load geofence data
    await geofenceService.loadFromDb();
    
    // Get current geofence
    const gf = geofenceService.getGeofence();
    console.log('📍 Current Geofence Configuration:');
    console.log('====================================');
    console.log(`Center: ${gf.center.lat}, ${gf.center.lng}`);
    console.log(`Radius: ${gf.radiusMeters} meters`);
    console.log(`Source: ${gf.source}\n`);
    
    // Test your current location (replace with your actual coordinates)
    // You can find your current coordinates using:
    // 1. Google Maps (right-click on your location and select "What's here?")
    // 2. Smartphone GPS apps
    // 3. Browser console: navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords))
    
    const yourCurrentLocation = {
      lat: 15.797113, // Replace with your latitude
      lng: 78.077443  // Replace with your longitude
    };
    
    console.log('📍 Testing Location:');
    console.log('====================');
    console.log(`Your Location: ${yourCurrentLocation.lat}, ${yourCurrentLocation.lng}\n`);
    
    // Test if you're inside the campus
    const inside = isInsideCampus(yourCurrentLocation);
    
    if (inside) {
      console.log('✅ SUCCESS: You are inside the campus boundary!');
      console.log('You should be able to check in without any issues.');
    } else {
      console.log('❌ ISSUE: You are outside the campus boundary.');
      console.log('Possible solutions:');
      console.log('1. Check if your coordinates are correct');
      console.log('2. Increase the geofence radius');
      console.log('3. Update the campus center coordinates');
      console.log('4. Check for GPS accuracy issues');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCurrentLocation();