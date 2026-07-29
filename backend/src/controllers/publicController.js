const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const MarketplaceListing = require('../models/MarketplaceListing');
const Equipment = require('../models/Equipment');
const DiagnosisReview = require('../models/DiagnosisReview');

// @desc    Get public system-wide dashboard statistics
// @route   GET /api/v1/public/stats
// @access  Public
exports.getPublicStats = asyncHandler(async (req, res, next) => {
  const [
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalExperts,
    totalMarketplaceListings,
    pendingListings,
    approvedListings,
    rejectedListings,
    totalEquipment,
    totalDiagnosisReviews
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'Farmer' }),
    User.countDocuments({ role: 'Buyer' }),
    User.countDocuments({ role: 'Expert' }),
    MarketplaceListing.countDocuments(),
    MarketplaceListing.countDocuments({ status: 'Pending' }),
    MarketplaceListing.countDocuments({ status: 'Approved' }),
    MarketplaceListing.countDocuments({ status: 'Rejected' }),
    Equipment.countDocuments(),
    DiagnosisReview.countDocuments()
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalExperts,
      totalMarketplaceListings,
      pendingListings,
      approvedListings,
      rejectedListings,
      totalEquipment,
      totalDiagnosisReviews
    }
  });
});
