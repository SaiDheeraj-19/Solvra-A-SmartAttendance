const express = require('express');
const router = express.Router();
const { 
  getTimetable, 
  createTimetableSlot, 
  updateTimetableSlot, 
  deleteTimetableSlot,
  getFacultyTimetable 
} = require('../controllers/timetableController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get all timetable slots
router.get('/', getTimetable);

// Create a new timetable slot (faculty only)
router.post('/', createTimetableSlot);

// Update a timetable slot (faculty only)
router.put('/:id', updateTimetableSlot);

// Delete a timetable slot (faculty only)
router.delete('/:id', deleteTimetableSlot);

// Get timetable for a specific faculty
router.get('/faculty', getFacultyTimetable);
router.get('/faculty/:facultyId', getFacultyTimetable);

module.exports = router;
