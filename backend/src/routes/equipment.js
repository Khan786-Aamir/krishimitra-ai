const express = require('express');
const router = express.Router();
const {
  getEquipmentList,
  getEquipmentDetails,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  updateEquipmentStatus,
  getMyEquipment,
  createRentalRequest,
  getReceivedRequests,
  getSentRequests,
  approveRequest,
  rejectRequest,
  cancelRequest,
  completeRequest,
  addReview,
  getSavedEquipment,
  saveEquipment,
  removeSavedEquipment
} = require('../controllers/equipmentController');

const authMiddleware = require('../middlewares/authMiddleware');

// All equipment rental routes require authentication
router.use(authMiddleware);

// Basic listings endpoints
router.get('/', getEquipmentList);
router.post('/', createEquipment);
router.get('/my-listings', getMyEquipment);
router.get('/:id', getEquipmentDetails);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);
router.put('/:id/status', updateEquipmentStatus);

// Rental requests endpoints
router.post('/requests', createRentalRequest);
router.get('/requests/received', getReceivedRequests);
router.get('/requests/sent', getSentRequests);
router.put('/requests/:id/approve', approveRequest);
router.put('/requests/:id/reject', rejectRequest);
router.put('/requests/:id/cancel', cancelRequest);
router.put('/requests/:id/complete', completeRequest);

// Reviews endpoints
router.post('/:id/reviews', addReview);

// Wishlist/Saved equipment endpoints
router.get('/wishlist/all', getSavedEquipment);
router.post('/wishlist', saveEquipment);
router.delete('/wishlist/:id', removeSavedEquipment);

module.exports = router;
