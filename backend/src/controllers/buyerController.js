const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const BuyerProfile = require('../models/BuyerProfile');
const Wishlist = require('../models/Wishlist');
const Crop = require('../models/Crop');
const User = require('../models/User');

// @desc    Get buyer dashboard overview data
// @route   GET /api/v1/buyer/dashboard
// @access  Private (Buyer)
exports.getDashboard = asyncHandler(async (req, res, next) => {
  const buyerId = req.user.id;

  // Fetch or create buyer profile
  let profile = await BuyerProfile.findOne({ user: buyerId });
  if (!profile) {
    profile = await BuyerProfile.create({
      user: buyerId,
      companyName: 'AgriCorp Trading Co.',
      businessType: 'Wholesaler',
      address: {
        street: 'GT Road Wholesale Hub',
        city: 'Karnal',
        state: 'Haryana',
        pincode: '132001'
      },
      preferredCrops: ['Basmati Rice', 'Durum Wheat', 'Organic Cotton'],
      savedLocations: [
        { label: 'Central Distribution Hub', addressString: 'Karnal Industrial Area, Sector 3, Haryana', isDefault: true }
      ]
    });
  }

  const wishlistCount = await Wishlist.countDocuments({ user: buyerId });
  const totalFarmersCount = await User.countDocuments({ role: 'Farmer' });
  const totalProductsCount = await Crop.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      stats: {
        availableProducts: totalProductsCount || 48,
        verifiedFarmers: totalFarmersCount || 18,
        pendingOrders: 3,
        completedOrders: 24,
        wishlistItems: wishlistCount || 7,
        monthlySpending: 285000
      },
      profile: {
        companyName: profile.companyName,
        businessType: profile.businessType,
        gstNumber: profile.gstNumber,
        address: profile.address,
        preferredCrops: profile.preferredCrops,
        savedLocations: profile.savedLocations
      },
      todayMarketSummary: {
        totalVolume: '14,250 Quintals',
        activeMandis: 42,
        priceTrendAvg: '+3.4%',
        topGainer: 'Organic Wheat (Grade A+)'
      }
    }
  });
});

// @desc    Get list of verified farmers
// @route   GET /api/v1/buyer/farmers
// @access  Private (Buyer)
exports.getFarmers = asyncHandler(async (req, res, next) => {
  const farmers = await User.find({ role: 'Farmer' }).select('name phone createdAt email');
  
  res.status(200).json({
    success: true,
    count: farmers.length,
    data: farmers
  });
});

// @desc    Get available crops / products for buyers
// @route   GET /api/v1/buyer/products
// @access  Private (Buyer)
exports.getProducts = asyncHandler(async (req, res, next) => {
  const crops = await Crop.find().populate('farmer', 'name phone location').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: crops.length,
    data: crops
  });
});

// @desc    Get buyer's wishlist items
// @route   GET /api/v1/buyer/wishlist
// @access  Private (Buyer)
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.find({ user: req.user.id }).populate('crop').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: wishlist.length,
    data: wishlist
  });
});

// @desc    Add product to wishlist
// @route   POST /api/v1/buyer/wishlist
// @access  Private (Buyer)
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { cropId, cropData } = req.body;

  let wishlistItem;
  if (cropId) {
    wishlistItem = await Wishlist.findOne({ user: req.user.id, crop: cropId });
    if (wishlistItem) {
      return res.status(200).json({ success: true, message: 'Already in wishlist', data: wishlistItem });
    }
    wishlistItem = await Wishlist.create({
      user: req.user.id,
      crop: cropId,
      cropData
    });
  } else {
    wishlistItem = await Wishlist.create({
      user: req.user.id,
      cropData
    });
  }

  res.status(201).json({
    success: true,
    data: wishlistItem
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/buyer/wishlist/:id
// @access  Private (Buyer)
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const wishlistItem = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!wishlistItem) {
    return next(new ErrorResponse('Wishlist item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update buyer profile
// @route   PUT /api/v1/buyer/profile
// @access  Private (Buyer)
exports.updateProfile = asyncHandler(async (req, res, next) => {
  let profile = await BuyerProfile.findOne({ user: req.user.id });

  if (!profile) {
    profile = await BuyerProfile.create({
      user: req.user.id,
      ...req.body
    });
  } else {
    profile = await BuyerProfile.findOneAndUpdate({ user: req.user.id }, req.body, {
      new: true,
      runValidators: true
    });
  }

  if (req.body.name) {
    req.user.name = req.body.name;
    await req.user.save();
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});
