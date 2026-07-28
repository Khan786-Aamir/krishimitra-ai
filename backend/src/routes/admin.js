const express = require('express');
const {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  toggleUserSuspension,
  bulkDeleteUsers,
  bulkSuspendUsers,
  getFarmers,
  getBuyers,
  getExperts,
  verifyExpert,
  getMarketplace,
  verifyProduct,
  getEquipment,
  verifyRental,
  getSchemes,
  createScheme,
  updateScheme,
  deleteScheme,
  getAIReports,
  assignExpert,
  verifyAIReport,
  getCommunityContent,
  moderatePost,
  moderateComment,
  getAnalytics,
  getProfile,
  saveProfile,
  getSettings,
  updateSettings
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Protect all routes with authentication and Admin role check
router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

// Core Admin Dashboard & Analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// User Management & Bulk Operations
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/suspend', toggleUserSuspension);
router.post('/users/bulk-delete', bulkDeleteUsers);
router.post('/users/bulk-suspend', bulkSuspendUsers);

// Domain Directories
router.get('/farmers', getFarmers);
router.get('/buyers', getBuyers);
router.get('/experts', getExperts);
router.put('/experts/:id/verify', verifyExpert);

// Marketplace & Equipment Rentals PREVIEW
router.get('/marketplace', getMarketplace);
router.put('/marketplace/:id/verify', verifyProduct);
router.get('/equipment', getEquipment);
router.put('/equipment/:id/verify', verifyRental);

// Schemes CRUD
router.route('/schemes')
  .get(getSchemes)
  .post(createScheme);
router.route('/schemes/:id')
  .put(updateScheme)
  .delete(deleteScheme);

// AI Reports & Assignments
router.get('/ai-reports', getAIReports);
router.put('/ai-reports/:id/assign', assignExpert);
router.put('/ai-reports/:id/verify', verifyAIReport);

// Community Moderation
router.get('/community', getCommunityContent);
router.put('/community/posts/:id', moderatePost);
router.put('/community/comments/:id', moderateComment);

// Admin Profile
router.route('/profile')
  .get(getProfile)
  .post(saveProfile);

// Settings
router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

module.exports = router;
