const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const {
  getDashboard,
  getProfile,
  updateProfile,
  getConsultations,
  acceptConsultation,
  rejectConsultation,
  completeConsultation,
  getAppointments,
  getReviews
} = require('../controllers/expertController');

// All routes require authentication and Expert role
router.use(authMiddleware);
router.use(roleMiddleware('Expert'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/consultations', getConsultations);
router.get('/appointments', getAppointments);
router.get('/reviews', getReviews);

router.post('/consultation/:id/accept', acceptConsultation);
router.post('/consultation/:id/reject', rejectConsultation);
router.post('/consultation/:id/complete', completeConsultation);

module.exports = router;
