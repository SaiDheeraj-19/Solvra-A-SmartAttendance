// Script to check your current location against the campus geofence
const { isInsideCampus, haversineDistanceMeters } = require('./utils/geo');
const geofenceService = require('./services/geofenceService');
const mongoose = require('mongoose');
require('dotenv').config();

async function checkMyLocation() {
  try {
    console.log('📍 Checking Your Current Location');
    console.log('================================');
    
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
    
    // Prompt user for their current location
    console.log('\n📝 Please enter your current coordinates:');
    
    // We'll use readline to get input from user
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Latitude: ', (latInput) => {
      rl.question('Longitude: ', async (lngInput) => {
        rl.close();
        
        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);
        
        if (isNaN(lat) || isNaN(lng)) {
          console.log('❌ Invalid coordinates entered. Please enter valid numbers.');
          await mongoose.connection.close();
          return;
        }
        
        console.log(`\n📍 Your Location: ${lat}, ${lng}`);
        
        // Check if inside campus
        const inside = isInsideCampus({ lat, lng });
        
        // Calculate distance
        const distance = haversineDistanceMeters(
          { lat: gf.center.lat, lng: gf.center.lng },
          { lat, lng }
        );
        
        console.log('\n📊 Results:');
        console.log(`   Distance from campus center: ${distance.toFixed(2)} meters`);
        console.log(`   Inside campus boundary: ${inside ? '✅ YES' : '❌ NO'}`);
        
        if (inside) {
          console.log('\n🎉 Great! You are within the campus boundary.');
          console.log('   You should be able to check in successfully.');
        } else {
          console.log('\n⚠️  You are outside the campus boundary.');
          console.log(`   You are ${distance.toFixed(2)} meters away from the campus center.`);
          console.log(`   The campus boundary is set to ${gf.radiusMeters} meters from the center.`);
          
          // Calculate how much farther you need to go
          const distanceNeeded = distance - gf.radiusMeters;
          if (distanceNeeded > 0) {
            console.log(`   You need to move approximately ${distanceNeeded.toFixed(2)} meters closer to the campus center.`);
          }
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Check completed');
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Also create a function to get location from IP (approximate)
async function checkLocationByIP() {
  try {
    console.log('🌍 Getting approximate location by IP address...');
    
    // For demo purposes, we'll just show how this could work
    console.log('\n💡 Note: IP-based location is less accurate than GPS.');
    console.log('   For attendance purposes, GPS location is required.');
    
    // In a real implementation, you would use a service like:
    // const response = await fetch('http://ip-api.com/json/');
    // const data = await response.json();
    // console.log(`Approximate location: ${data.lat}, ${data.lon}`);
    
    console.log('\n🔧 To get your precise location:');
    console.log('   1. On mobile: Use a GPS app to get your coordinates');
    console.log('   2. On desktop: Visit Google Maps, right-click your location, select "What\'s here?"');
    console.log('   3. In browser console: navigator.geolocation.getCurrentPosition(pos => console.log(pos.coords))');
    
  } catch (error) {
    console.error('❌ Error getting IP location:', error.message);
  }
}

// Run the location checker
if (process.argv.includes('--ip')) {
  checkLocationByIP();
} else {
  checkMyLocation();
}