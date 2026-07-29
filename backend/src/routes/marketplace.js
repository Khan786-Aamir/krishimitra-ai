const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingDetails,
  createListing,
  updateListing,
  deleteListing,
  updateListingStatus,
  sendInquiry,
  getInquiries,
  updateInquiryStatus,
  getMyListings,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  saveSearch,
  getSavedSearches,
  deleteSavedSearch,
  getMarketInsights
} = require('../controllers/marketplaceController');

const authMiddleware = require('../middlewares/authMiddleware'); // Import the auth middleware

// All routes are protected
router.use(authMiddleware);

// Basic listings endpoints
router.get('/listings', getListings);
router.get('/listings/:id', getListingDetails);
router.post('/listings', createListing);
router.put('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);
router.put('/listings/:id/status', updateListingStatus);

// Inquiries endpoints
router.post('/inquiries', sendInquiry);
router.get('/inquiries', getInquiries);
router.put('/inquiries/:id', updateInquiryStatus);

// Farmer specific endpoints
router.get('/my-listings', getMyListings);

// Wishlist endpoints
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:id', removeFromWishlist);

// Saved searches endpoints
router.get('/saved-searches', getSavedSearches);
router.post('/saved-searches', saveSearch);
router.delete('/saved-searches/:id', deleteSavedSearch);

// Market Insights ticker endpoints
router.get('/insights', getMarketInsights);

module.exports = router;
