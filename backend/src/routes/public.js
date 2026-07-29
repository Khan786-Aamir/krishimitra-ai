const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/publicController');

// Public route to fetch system counts for the landing page hero section
router.get('/stats', getPublicStats);

module.exports = router;
