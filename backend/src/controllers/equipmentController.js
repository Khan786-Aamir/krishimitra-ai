const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Equipment = require('../models/Equipment');
const RentalRequest = require('../models/RentalRequest');
const EquipmentReview = require('../models/EquipmentReview');
const SavedEquipment = require('../models/SavedEquipment');
const User = require('../models/User');

// ==========================================
// EQUIPMENT LISTING CONTROLLERS
// ==========================================

// @desc    Get all approved and active equipment with filters & sorting
// @route   GET /api/v1/equipment
// @access  Private
exports.getEquipmentList = asyncHandler(async (req, res, next) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    state,
    district,
    condition,
    fuelType,
    availabilityStatus,
    sort
  } = req.query;

  // Build filter query object
  const filter = { status: 'Approved', isActive: true };

  if (search) {
    filter.$or = [
      { equipmentName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } }
    ];
  }

  if (category && category !== 'all' && category !== 'All') {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.rentalPricePerDay = {};
    if (minPrice) filter.rentalPricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.rentalPricePerDay.$lte = Number(maxPrice);
  }

  if (state) {
    filter.state = { $regex: state, $options: 'i' };
  }

  if (district) {
    filter.district = { $regex: district, $options: 'i' };
  }

  if (condition && condition !== 'All') {
    filter.condition = condition;
  }

  if (fuelType && fuelType !== 'All') {
    filter.fuelType = fuelType;
  }

  if (availabilityStatus && availabilityStatus !== 'All') {
    filter.availabilityStatus = availabilityStatus;
  }

  // Determine Sorting
  let sortQuery = { createdAt: -1 }; // Default: Newest
  if (sort === 'Price Low → High') {
    sortQuery = { rentalPricePerDay: 1 };
  } else if (sort === 'Price High → Low') {
    sortQuery = { rentalPricePerDay: -1 };
  } else if (sort === 'Highest Rated') {
    sortQuery = { rating: -1 };
  } else if (sort === 'Most Booked') {
    sortQuery = { bookingCount: -1 };
  }

  const equipmentList = await Equipment.find(filter)
    .populate('owner', 'name email phone profileImage location')
    .sort(sortQuery);

  res.status(200).json({
    success: true,
    count: equipmentList.length,
    data: equipmentList
  });
});

// @desc    Get single equipment listing details & increment views
// @route   GET /api/v1/equipment/:id
// @access  Private
exports.getEquipmentDetails = asyncHandler(async (req, res, next) => {
  const equipment = await Equipment.findById(req.params.id)
    .populate('owner', 'name email phone profileImage location createdAt');

  if (!equipment) {
    return next(new ErrorResponse('Equipment listing not found', 404));
  }

  // Increment views
  equipment.views = (equipment.views || 0) + 1;
  await equipment.save();

  // Fetch reviews for this equipment
  const reviews = await EquipmentReview.find({ equipment: req.params.id })
    .populate('reviewer', 'name profileImage')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      equipment,
      reviews
    }
  });
});

// @desc    Create new equipment listing
// @route   POST /api/v1/equipment
// @access  Private (Farmer only)
exports.createEquipment = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Farmer' && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to publish equipment listings', 403));
  }

  // Auto-fill owner and set verification status
  req.body.owner = req.user.id;
  req.body.status = 'Approved';
  req.body.isApproved = true;

  const equipment = await Equipment.create(req.body);

  res.status(201).json({
    success: true,
    data: equipment
  });
});

// @desc    Update equipment listing details
// @route   PUT /api/v1/equipment/:id
// @access  Private (Owner/Admin only)
exports.updateEquipment = asyncHandler(async (req, res, next) => {
  let equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    return next(new ErrorResponse('Equipment listing not found', 404));
  }

  // Check authorization
  if (equipment.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to modify this listing', 403));
  }

  // Auto-approve / keep active if listing is updated by owner
  if (req.user.role !== 'Admin') {
    req.body.status = 'Approved';
    req.body.isApproved = true;
  }

  equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: equipment
  });
});

// @desc    Delete equipment listing
// @route   DELETE /api/v1/equipment/:id
// @access  Private (Owner/Admin only)
exports.deleteEquipment = asyncHandler(async (req, res, next) => {
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    return next(new ErrorResponse('Equipment listing not found', 404));
  }

  // Check authorization
  if (equipment.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to delete this listing', 403));
  }

  // Delete related reviews and requests
  await EquipmentReview.deleteMany({ equipment: req.params.id });
  await RentalRequest.deleteMany({ equipment: req.params.id });
  await SavedEquipment.deleteMany({ equipment: req.params.id });

  await equipment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Farmer toggles equipment active state or availabilityStatus
// @route   PUT /api/v1/equipment/:id/status
// @access  Private (Owner/Admin only)
exports.updateEquipmentStatus = asyncHandler(async (req, res, next) => {
  const { isActive, availabilityStatus } = req.body;
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment) {
    return next(new ErrorResponse('Equipment listing not found', 404));
  }

  if (equipment.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to update status for this equipment', 403));
  }

  if (isActive !== undefined) {
    equipment.isActive = isActive;
  }
  if (availabilityStatus !== undefined) {
    equipment.availabilityStatus = availabilityStatus;
  }

  await equipment.save();

  res.status(200).json({
    success: true,
    data: equipment
  });
});

// @desc    Get owner's listed equipment
// @route   GET /api/v1/equipment/my-listings
// @access  Private (Farmer/Admin only)
exports.getMyEquipment = asyncHandler(async (req, res, next) => {
  const listings = await Equipment.find({ owner: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// ==========================================
// RENTAL REQUESTS CONTROLLERS
// ==========================================

// @desc    Create rental request for machinery
// @route   POST /api/v1/equipment/requests
// @access  Private
exports.createRentalRequest = asyncHandler(async (req, res, next) => {
  const { equipmentId, startDate, endDate, purpose, message, renterNotes } = req.body;

  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    return next(new ErrorResponse('Equipment listing not found', 404));
  }

  if (!equipment.isActive || equipment.status !== 'Approved') {
    return next(new ErrorResponse('This equipment is not active or approved for rent', 400));
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // Zero-out times for comparison
  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  now.setHours(0,0,0,0);

  if (start < now) {
    return next(new ErrorResponse('Lease start date cannot be in the past', 400));
  }

  if (end <= start) {
    return next(new ErrorResponse('Lease end date must be after the start date', 400));
  }

  // Calculate days
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start day

  // Validate min/max days
  const minDays = equipment.minRentalDays || 1;
  const maxDays = equipment.maxRentalDays || 30;

  if (diffDays < minDays) {
    return next(new ErrorResponse(`Rental duration is below the owner's limit of ${minDays} days`, 400));
  }

  if (diffDays > maxDays) {
    return next(new ErrorResponse(`Rental duration exceeds the owner's limit of ${maxDays} days`, 400));
  }

  // Prevent booking self-owned equipment
  if (equipment.owner.toString() === req.user.id) {
    return next(new ErrorResponse('You cannot rent your own equipment listing', 400));
  }

  // Calculate pricing
  const totalAmount = equipment.rentalPricePerDay * diffDays;
  const securityDeposit = equipment.securityDeposit;

  const request = await RentalRequest.create({
    equipment: equipmentId,
    owner: equipment.owner,
    renter: req.user.id,
    startDate: start,
    endDate: end,
    numberOfDays: diffDays,
    totalAmount,
    securityDeposit,
    purpose,
    message,
    renterNotes: renterNotes || '',
    status: 'Pending'
  });

  res.status(201).json({
    success: true,
    data: request
  });
});

// @desc    Get owner's received requests
// @route   GET /api/v1/equipment/requests/received
// @access  Private (Farmer/Admin only)
exports.getReceivedRequests = asyncHandler(async (req, res, next) => {
  const requests = await RentalRequest.find({ owner: req.user.id })
    .populate('equipment', 'equipmentName rentalPricePerDay securityDeposit images')
    .populate('renter', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

// @desc    Get renter's made rental requests
// @route   GET /api/v1/equipment/requests/sent
// @access  Private
exports.getSentRequests = asyncHandler(async (req, res, next) => {
  const requests = await RentalRequest.find({ renter: req.user.id })
    .populate('equipment', 'equipmentName rentalPricePerDay securityDeposit images owner location')
    .populate('owner', 'name email phone')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

// @desc    Owner approves rental request
// @route   PUT /api/v1/equipment/requests/:id/approve
// @access  Private (Owner/Admin only)
exports.approveRequest = asyncHandler(async (req, res, next) => {
  const { ownerNotes } = req.body;
  const request = await RentalRequest.findById(req.params.id);

  if (!request) {
    return next(new ErrorResponse('Rental request not found', 404));
  }

  if (request.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to approve this request', 403));
  }

  if (request.status !== 'Pending') {
    return next(new ErrorResponse(`Cannot approve a request with status: ${request.status}`, 400));
  }

  // Update request
  request.status = 'Approved';
  request.approvedAt = new Date();
  if (ownerNotes) request.ownerNotes = ownerNotes;
  await request.save();

  // Update equipment status
  const equipment = await Equipment.findById(request.equipment);
  if (equipment) {
    equipment.availabilityStatus = 'Booked';
    equipment.bookingCount = (equipment.bookingCount || 0) + 1;
    await equipment.save();
  }

  // Expire all other overlapping requests for this equipment (optional helper logic)
  await RentalRequest.updateMany(
    {
      _id: { $ne: request._id },
      equipment: request.equipment,
      status: 'Pending',
      $or: [
        { startDate: { $gte: request.startDate, $lte: request.endDate } },
        { endDate: { $gte: request.startDate, $lte: request.endDate } }
      ]
    },
    { $set: { status: 'Expired', ownerNotes: 'Auto-expired due to overlapping booking confirmation.' } }
  );

  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc    Owner rejects rental request
// @route   PUT /api/v1/equipment/requests/:id/reject
// @access  Private (Owner/Admin only)
exports.rejectRequest = asyncHandler(async (req, res, next) => {
  const { ownerNotes } = req.body;
  const request = await RentalRequest.findById(req.params.id);

  if (!request) {
    return next(new ErrorResponse('Rental request not found', 404));
  }

  if (request.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to reject this request', 403));
  }

  if (request.status !== 'Pending') {
    return next(new ErrorResponse(`Cannot reject a request with status: ${request.status}`, 400));
  }

  request.status = 'Rejected';
  if (ownerNotes) request.ownerNotes = ownerNotes;
  await request.save();

  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc    Renter cancels rental request
// @route   PUT /api/v1/equipment/requests/:id/cancel
// @access  Private (Renter/Owner/Admin only)
exports.cancelRequest = asyncHandler(async (req, res, next) => {
  const request = await RentalRequest.findById(req.params.id);

  if (!request) {
    return next(new ErrorResponse('Rental request not found', 404));
  }

  // Authorization: either renter or owner or admin can cancel
  if (
    request.renter.toString() !== req.user.id &&
    request.owner.toString() !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    return next(new ErrorResponse('Not authorized to cancel this request', 403));
  }

  if (request.status === 'Completed' || request.status === 'Cancelled' || request.status === 'Expired') {
    return next(new ErrorResponse(`Cannot cancel request in state: ${request.status}`, 400));
  }

  const previousStatus = request.status;
  request.status = 'Cancelled';
  await request.save();

  // If approved and active, free up equipment availabilityStatus
  if (previousStatus === 'Approved') {
    const equipment = await Equipment.findById(request.equipment);
    if (equipment) {
      equipment.availabilityStatus = 'Available';
      await equipment.save();
    }
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

// @desc    Owner marks rental as completed
// @route   PUT /api/v1/equipment/requests/:id/complete
// @access  Private (Owner/Admin only)
exports.completeRequest = asyncHandler(async (req, res, next) => {
  const request = await RentalRequest.findById(req.params.id);

  if (!request) {
    return next(new ErrorResponse('Rental request not found', 404));
  }

  if (request.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
    return next(new ErrorResponse('Not authorized to mark this rental as completed', 403));
  }

  if (request.status !== 'Approved') {
    return next(new ErrorResponse(`Cannot complete request with status: ${request.status}`, 400));
  }

  request.status = 'Completed';
  request.completedAt = new Date();
  await request.save();

  // Make equipment available again
  const equipment = await Equipment.findById(request.equipment);
  if (equipment) {
    equipment.availabilityStatus = 'Available';
    await equipment.save();
  }

  res.status(200).json({
    success: true,
    data: request
  });
});

// ==========================================
// REVIEW CONTROLLERS
// ==========================================

// @desc    Submit review for equipment
// @route   POST /api/v1/equipment/:id/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const { rating, review } = req.body;

  const equipment = await Equipment.findById(req.params.id);
  if (!equipment) {
    return next(new ErrorResponse('Equipment listing not found', 404));
  }

  // Ensure reviewer isn't the owner
  if (equipment.owner.toString() === req.user.id) {
    return next(new ErrorResponse('You cannot review your own equipment listing', 400));
  }

  // Check if reviewer has completed or approved rentals for this machinery (optional security check)
  const priorRental = await RentalRequest.findOne({
    equipment: req.params.id,
    renter: req.user.id,
    status: 'Completed'
  });

  if (!priorRental && req.user.role !== 'Admin') {
    return next(new ErrorResponse('You must complete a rental before submitting a review', 400));
  }

  const reviewItem = await EquipmentReview.create({
    equipment: req.params.id,
    reviewer: req.user.id,
    rating,
    review
  });

  // Calculate new average rating & reviews count
  const allReviews = await EquipmentReview.find({ equipment: req.params.id });
  const totalReviews = allReviews.length;
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  equipment.rating = Number(avgRating.toFixed(1));
  equipment.totalReviews = totalReviews;
  await equipment.save();

  res.status(201).json({
    success: true,
    data: reviewItem
  });
});

// ==========================================
// SAVED EQUIPMENT CONTROLLERS
// ==========================================

// @desc    Get user saved equipment list
// @route   GET /api/v1/equipment/wishlist
// @access  Private
exports.getSavedEquipment = asyncHandler(async (req, res, next) => {
  const list = await SavedEquipment.find({ user: req.user.id })
    .populate({
      path: 'equipment',
      populate: { path: 'owner', select: 'name email phone location' }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: list.length,
    data: list
  });
});

// @desc    Save equipment to wishlist
// @route   POST /api/v1/equipment/wishlist
// @access  Private
exports.saveEquipment = asyncHandler(async (req, res, next) => {
  const { equipmentId } = req.body;

  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    return next(new ErrorResponse('Equipment listing not found', 404));
  }

  let saved = await SavedEquipment.findOne({ user: req.user.id, equipment: equipmentId });
  if (saved) {
    return res.status(200).json({
      success: true,
      message: 'Equipment already saved in wishlist'
    });
  }

  saved = await SavedEquipment.create({
    user: req.user.id,
    equipment: equipmentId
  });

  res.status(201).json({
    success: true,
    data: saved
  });
});

// @desc    Remove equipment from wishlist
// @route   DELETE /api/v1/equipment/wishlist/:id
// @access  Private
exports.removeSavedEquipment = asyncHandler(async (req, res, next) => {
  const saved = await SavedEquipment.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!saved) {
    return next(new ErrorResponse('Saved item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
