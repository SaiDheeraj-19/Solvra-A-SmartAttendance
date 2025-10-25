/**
 * Geofence Testing Script
 * Tests the campus geofencing functionality
 * 
 * Campus Location: Latitude: 15.797113, Longitude: 78.077443
 * Radius: 500 meters
 */

const { isInsideCampus, haversineDistanceMeters } = require('./utils/geo');
const geofence = require('./config/geofence');

console.log('=== Campus Geofence Testing ===\n');
console.log('Campus Center Coordinates:');
console.log(`  Latitude: ${geofence.center.lat}`);
console.log(`  Longitude: ${geofence.center.lng}`);
console.log(`  Radius: ${geofence.radiusMeters} meters\n`);

// Test locations
const testLocations = [
  {
    name: 'Campus Center (Exact)',
    lat: 15.797113,
    lng: 78.077443,
    expectedInside: true
  },
  {
    name: 'Inside Campus - 100m North',
    lat: 15.798013, // ~100m north
    lng: 78.077443,
    expectedInside: true
  },
  {
    name: 'Inside Campus - 200m East',
    lat: 15.797113,
    lng: 78.079243, // ~200m east
    expectedInside: true
  },
  {
    name: 'Edge of Campus - 490m South',
    lat: 15.792713,
    lng: 78.077443,
    expectedInside: true
  },
  {
    name: 'Outside Campus - 600m North',
    lat: 15.802513,
    lng: 78.077443,
    expectedInside: false
  },
  {
    name: 'Far Outside - 1km West',
    lat: 15.797113,
    lng: 78.063443,
    expectedInside: false
  },
  {
    name: 'Random Location - Different City',
    lat: 12.971599,
    lng: 77.594563,
    expectedInside: false
  }
];

console.log('Testing various locations:\n');

let passedTests = 0;
let failedTests = 0;

testLocations.forEach((location, index) => {
  const distance = haversineDistanceMeters(
    { lat: location.lat, lng: location.lng },
    geofence.center
  );
  
  const isInside = isInsideCampus({ lat: location.lat, lng: location.lng });
  const testPassed = isInside === location.expectedInside;
  
  console.log(`Test ${index + 1}: ${location.name}`);
  console.log(`  Coordinates: ${location.lat}, ${location.lng}`);
  console.log(`  Distance from center: ${distance.toFixed(2)}m`);
  console.log(`  Inside campus: ${isInside ? 'YES ✓' : 'NO ✗'}`);
  console.log(`  Expected: ${location.expectedInside ? 'Inside' : 'Outside'}`);
  console.log(`  Result: ${testPassed ? '✓ PASS' : '✗ FAIL'}\n`);
  
  if (testPassed) {
    passedTests++;
  } else {
    failedTests++;
  }
});

console.log('=== Test Summary ===');
console.log(`Total Tests: ${testLocations.length}`);
console.log(`Passed: ${passedTests} ✓`);
console.log(`Failed: ${failedTests} ✗`);
console.log(`Success Rate: ${((passedTests / testLocations.length) * 100).toFixed(1)}%\n`);

if (failedTests === 0) {
  console.log('✓ All geofencing tests passed successfully!');
  console.log('The geofencing system is working correctly.\n');
} else {
  console.log('✗ Some tests failed. Please review the geofencing configuration.');
  process.exit(1);
}
