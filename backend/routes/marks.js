const express = require('express');
const router = express.Router();
const { 
  getMarksAnalytics, 
  getSemesterSummary, 
  getSubjectPerformance, 
  getOverallPerformance 
} = require('../controllers/marksController');
const { protect } = require('../middleware/auth');

router.get('/analytics', protect, getMarksAnalytics);
router.get('/semester-summary', protect, getSemesterSummary);
router.get('/subject-performance', protect, getSubjectPerformance);
router.get('/overall-performance', protect, getOverallPerformance);

module.exports = router;
