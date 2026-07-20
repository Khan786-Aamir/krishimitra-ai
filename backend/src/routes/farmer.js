const express = require('express');
const {
  getDashboard,
  getCrops,
  addCrop,
  updateCrop,
  deleteCrop,
  updateProfile
} = require('../controllers/farmerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Protect all routes with JWT check and Farmer role check
router.use(authMiddleware);
router.use(roleMiddleware('Farmer'));

router.get('/dashboard', getDashboard);

router.route('/crops')
  .get(getCrops)
  .post(addCrop);

router.route('/crops/:id')
  .put(updateCrop)
  .delete(deleteCrop);

router.put('/profile', updateProfile);

module.exports = router;
