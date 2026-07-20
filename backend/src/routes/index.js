const express = require('express');
const router = express.Router();

// Root API Healthcheck Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date()
    }
  });
});

// Route mount stubs (For future module development phases)
router.use('/auth', require('./auth'));
router.use('/farmer', require('./farmer'));
router.use('/buyer', require('./buyer'));
router.use('/expert', require('./expert'));
router.use('/weather', require('./weather'));
router.use('/schemes', require('./schemes'));
router.use('/notifications', require('./notifications'));

module.exports = router;
