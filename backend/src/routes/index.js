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
// router.use('/profiles', require('./profiles'));
// router.use('/ai', require('./ai'));
// router.use('/marketplace', require('./marketplace'));
// router.use('/orders', require('./orders'));
// router.use('/rentals', require('./rentals'));
// router.use('/forum', require('./forum'));
// router.use('/finance', require('./finance'));
// router.use('/notifications', require('./notifications'));
// router.use('/weather', require('./weather'));
// router.use('/chat', require('./chat'));

module.exports = router;
