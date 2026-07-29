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
router.use('/admin', require('./admin'));
router.use('/marketplace', require('./marketplace'));
router.use('/equipment', require('./equipment'));
router.use('/ai', require('./ai'));
router.use('/upload', require('./upload'));
router.use('/public', require('./public'));

module.exports = router;
