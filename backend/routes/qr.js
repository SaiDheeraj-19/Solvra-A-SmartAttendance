const express = require('express');
const router = express.Router();
const { generateQR, scanQR, getActiveQRs } = require('../controllers/qrController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateQR);
router.post('/scan', protect, scanQR);
router.get('/active', protect, getActiveQRs);

module.exports = router;
