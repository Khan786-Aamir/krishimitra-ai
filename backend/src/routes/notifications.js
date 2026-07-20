const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Notification = require('../models/Notification');
const router = express.Router();

router.use(authMiddleware);

// @desc    Get all notifications for logged-in user
// @route   GET /api/v1/notifications
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// @desc    Mark single notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { message: 'Notification not found' }
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authorized to access this notification' }
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

module.exports = router;
