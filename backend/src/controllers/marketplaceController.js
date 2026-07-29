const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const MarketplaceListing = require('../models/MarketplaceListing');
const BuyerInquiry = require('../models/BuyerInquiry');
const SavedSearch = require('../models/SavedSearch');
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// @desc    Get all approved listings with filters
// @route   GET /api/v1/marketplace/listings
// @access  Private
exports.getListings = asyncHandler(async (req, res, next) => {
  const {
    search,
    category,
    organic,
    freshHarvest,
    minPrice,
    maxPrice,
    state,
    district,
    minQuantity,
    minRating,
    sort
  } = req.query;

  // Build filter object
  // Standard Marketplace catalog must only show Approved status listings
  const filter = { status: 'Approved' };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  if (category && category !== 'all' && category !== 'All') {
    filter.category = category;
  }

  if (organic === 'true' || organic === true) {
    filter.isOrganic = true;
  }

  if (freshHarvest === 'true' || freshHarvest === true) {
    filter.isFreshHarvest = true;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (state) {
    filter.state = { $regex: state, $options: 'i' };
  }

  if (district) {
    filter.district = { $regex: district, $options: 'i' };
  }

  if (minQuantity) {
    filter.availableQuantity = { $gte: Number(minQuantity) };
  }

  if (minRating) {
    filter.averageRating = { $gte: Number(minRating) };
  }

  // Sorting
  let sortQuery = { createdAt: -1 }; // Default: Newest
  if (sort === 'Lowest Price') {
    sortQuery = { price: 1 };
  } else if (sort === 'Highest Price') {
    sortQuery = { price: -1 };
  } else if (sort === 'Most Popular') {
    sortQuery = { totalReviews: -1, averageRating: -1 };
  }

  const listings = await MarketplaceListing.find(filter)
    .populate('farmer', 'name email phone location')
    .sort(sortQuery);

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// @desc    Get single listing details
// @route   GET /api/v1/marketplace/listings/:id
// @access  Private
exports.getListingDetails = asyncHandler(async (req, res, next) => {
  const listing = await MarketplaceListing.findById(req.params.id)
    .populate('farmer', 'name email phone location');

  if (!listing) {
    return next(new ErrorResponse('Marketplace listing not found', 404));
  }

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Create new listing
// @route   POST /api/v1/marketplace/listings
// @access  Private (Farmer only)
exports.createListing = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Farmer' && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to publish listings', 403));
  }

  // Auto-fill farmer ID
  req.body.farmer = req.user.id;
  // Enforce pending status upon creation for admin approval flow
  req.body.status = 'Pending';

  const listing = await MarketplaceListing.create(req.body);

  res.status(201).json({
    success: true,
    data: listing
  });
});

// @desc    Update listing details
// @route   PUT /api/v1/marketplace/listings/:id
// @access  Private (Farmer only)
exports.updateListing = asyncHandler(async (req, res, next) => {
  let listing = await MarketplaceListing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorResponse('Listing not found', 404));
  }

  // Ensure owner is the one modifying
  if (listing.farmer.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to modify this listing', 403));
  }

  // Resets status to Pending for admin re-approval
  req.body.status = 'Pending';

  listing = await MarketplaceListing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Delete listing
// @route   DELETE /api/v1/marketplace/listings/:id
// @access  Private (Farmer only)
exports.deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await MarketplaceListing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorResponse('Listing not found', 404));
  }

  if (listing.farmer.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to delete this listing', 403));
  }

  await listing.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Farmer toggles listing availability/hiding
// @route   PUT /api/v1/marketplace/listings/:id/status
// @access  Private (Farmer only)
exports.updateListingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const listing = await MarketplaceListing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorResponse('Listing not found', 404));
  }

  if (listing.farmer.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to toggle listing status', 403));
  }

  listing.status = status;
  await listing.save();

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Submit inquiry for crop listing
// @route   POST /api/v1/marketplace/inquiries
// @access  Private
exports.sendInquiry = asyncHandler(async (req, res, next) => {
  const { listingId, buyerName, phone, requiredQuantity, expectedPrice, message, inquiryType } = req.body;

  const listing = await MarketplaceListing.findById(listingId);
  if (!listing) {
    return next(new ErrorResponse('Target crop listing not found', 404));
  }

  const inquiry = await BuyerInquiry.create({
    listing: listingId,
    buyer: req.user.id,
    farmer: listing.farmer,
    buyerName,
    phone,
    requiredQuantity,
    expectedPrice,
    message,
    inquiryType,
    status: 'Pending'
  });

  res.status(201).json({
    success: true,
    data: inquiry
  });
});

// @desc    Get inquiries (Farmer receives them, Buyer sends them)
// @route   GET /api/v1/marketplace/inquiries
// @access  Private
exports.getInquiries = asyncHandler(async (req, res, next) => {
  let query = {};
  if (req.user.role === 'Farmer') {
    query = { farmer: req.user.id };
  } else if (req.user.role === 'Buyer') {
    query = { buyer: req.user.id };
  } else {
    // Admin gets all
    query = {};
  }

  const inquiries = await BuyerInquiry.find(query)
    .populate('listing', 'name price unit images qualityGrade')
    .populate('buyer', 'name email phone')
    .populate('farmer', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries
  });
});

// @desc    Accept/Reject inquiry status
// @route   PUT /api/v1/marketplace/inquiries/:id
// @access  Private (Farmer only)
exports.updateInquiryStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const inquiry = await BuyerInquiry.findById(req.params.id);

  if (!inquiry) {
    return next(new ErrorResponse('Inquiry not found', 404));
  }

  // Only the farmer receiving the inquiry can update status
  if (inquiry.farmer.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to modify this inquiry', 403));
  }

  inquiry.status = status;
  await inquiry.save();

  res.status(200).json({
    success: true,
    data: inquiry
  });
});

// @desc    Get farmer's own listings (including Draft, Pending, Approved)
// @route   GET /api/v1/marketplace/my-listings
// @access  Private (Farmer only)
exports.getMyListings = asyncHandler(async (req, res, next) => {
  const listings = await MarketplaceListing.find({ farmer: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// @desc    Add item to wishlist
// @route   POST /api/v1/marketplace/wishlist
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { listingId } = req.body;

  let wishlistItem = await Wishlist.findOne({ user: req.user.id, listing: listingId });
  if (wishlistItem) {
    return res.status(200).json({
      success: true,
      message: 'Listing already in wishlist'
    });
  }

  const listing = await MarketplaceListing.findById(listingId);
  if (!listing) {
    return next(new ErrorResponse('Crop listing not found', 404));
  }

  // Add listing and also write metadata to cropData for compatibility
  wishlistItem = await Wishlist.create({
    user: req.user.id,
    listing: listingId,
    cropData: {
      name: listing.name,
      price: listing.price,
      quantity: `${listing.availableQuantity} ${listing.unit}`,
      farmerName: 'Accredited Farmer',
      location: listing.location,
      qualityGrade: listing.qualityGrade,
      isOrganic: listing.isOrganic,
      image: listing.images && listing.images.length > 0 ? listing.images[0].url : ''
    }
  });

  res.status(201).json({
    success: true,
    data: wishlistItem
  });
});

// @desc    Get user's wishlist
// @route   GET /api/v1/marketplace/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.find({ user: req.user.id })
    .populate('listing')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: wishlist.length,
    data: wishlist
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/v1/marketplace/wishlist/:id
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Save search filters to MongoDB
// @route   POST /api/v1/marketplace/saved-searches
// @access  Private
exports.saveSearch = asyncHandler(async (req, res, next) => {
  const { searchName, filters } = req.body;

  const savedSearch = await SavedSearch.create({
    user: req.user.id,
    searchName,
    filters
  });

  res.status(201).json({
    success: true,
    data: savedSearch
  });
});

// @desc    Get user's saved searches
// @route   GET /api/v1/marketplace/saved-searches
// @access  Private
exports.getSavedSearches = asyncHandler(async (req, res, next) => {
  const searches = await SavedSearch.find({ user: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: searches.length,
    data: searches
  });
});

// @desc    Delete a saved search
// @route   DELETE /api/v1/marketplace/saved-searches/:id
// @access  Private
exports.deleteSavedSearch = asyncHandler(async (req, res, next) => {
  const search = await SavedSearch.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!search) {
    return next(new ErrorResponse('Saved search parameter template not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get market stats/trends insights
// @route   GET /api/v1/marketplace/insights
// @access  Private
exports.getMarketInsights = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      trendingCrops: [
        { name: 'Basmati Rice', rate: '₹6,200/Quintal', trend: '+4.2%' },
        { name: 'Organic Turmeric', rate: '₹8,500/Quintal', trend: '+6.1%' },
        { name: 'Alphonso Mangoes', rate: '₹12,000/Ton', trend: '-2.5%' },
        { name: 'Desi Chana (Pulses)', rate: '₹5,400/Quintal', trend: '+1.8%' }
      ],
      highestDemand: [
        { name: 'Cereals', volume: '14,200 Tons', growth: 'High' },
        { name: 'Organic Produce', volume: '3,800 Tons', growth: 'Very High' },
        { name: 'Spices', volume: '1,200 Tons', growth: 'Moderate' }
      ],
      popularCategories: ['Cereals', 'Vegetables', 'Organic Produce', 'Spices']
    }
  });
});
