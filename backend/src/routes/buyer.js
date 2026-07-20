const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  getDashboard,
  getFarmers,
  getProducts,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateProfile
} = require('../controllers/buyerController');

// All routes require authentication and Buyer role
router.use(authMiddleware);
router.use(roleMiddleware('Buyer'));

router.get('/dashboard', getDashboard);
router.get('/farmers', getFarmers);
router.get('/products', getProducts);
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:id', removeFromWishlist);
router.put('/profile', updateProfile);

module.exports = router;
