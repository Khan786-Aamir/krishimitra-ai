const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const Crop = require('../models/Crop');
const FarmerProfile = require('../models/FarmerProfile');
const DashboardStats = require('../models/DashboardStats');
const Notification = require('../models/Notification');

// @desc    Get farmer dashboard overview data
// @route   GET /api/v1/farmer/dashboard
// @access  Private (Farmer)
exports.getDashboard = asyncHandler(async (req, res, next) => {
  const farmerId = req.user.id;

  // 1. Calculate dynamic counts from Crop collection
  const totalCrops = await Crop.countDocuments({ farmer: farmerId });
  const healthyCrops = await Crop.countDocuments({ farmer: farmerId, healthStatus: 'Healthy' });

  // 2. Fetch or initialize static stats from DashboardStats
  let stats = await DashboardStats.findOne({ farmer: farmerId });
  if (!stats) {
    stats = await DashboardStats.create({
      farmer: farmerId,
      totalCrops,
      healthyCrops,
      aiDiagnoses: 12, // default seed
      revenue: 45000, // default seed
      activeRentals: 2, // default seed
      marketplaceOrders: 5 // default seed
    });
  } else {
    // Keep dynamic counts updated in stats cache
    stats.totalCrops = totalCrops;
    stats.healthyCrops = healthyCrops;
    await stats.save();
  }

  // 3. Fetch or initialize FarmerProfile
  let profile = await FarmerProfile.findOne({ user: farmerId });
  if (!profile) {
    profile = await FarmerProfile.create({
      user: farmerId,
      farmSize: 5,
      location: 'Punjab, India',
      membership: 'Basic',
      experience: 8,
      primaryCrops: ['Wheat', 'Rice'],
      preferredLanguage: 'English'
    });
  }

  // 4. Compile recent activities timeline dynamically
  const activities = [];
  
  // Add crops created
  const recentCrops = await Crop.find({ farmer: farmerId }).sort({ createdAt: -1 }).limit(5);
  recentCrops.forEach(crop => {
    activities.push({
      id: `crop-${crop._id}`,
      type: 'crop',
      title: 'Crop Registered',
      description: `Successfully added ${crop.name} (${crop.area} acres) to your farm tracking system.`,
      time: crop.createdAt,
      icon: 'Sprout'
    });
  });

  // Add recent notifications
  const recentNotifications = await Notification.find({ user: farmerId }).sort({ createdAt: -1 }).limit(5);
  recentNotifications.forEach(notif => {
    activities.push({
      id: `notif-${notif._id}`,
      type: 'notification',
      title: notif.title,
      description: notif.message,
      time: notif.createdAt,
      icon: notif.icon || 'Bell'
    });
  });

  // Sort all activities by time descending
  activities.sort((a, b) => b.time - a.time);

  // If empty, add standard default starter activities
  if (activities.length === 0) {
    activities.push({
      id: 'welcome',
      type: 'system',
      title: 'Welcome to KrishiMitra AI',
      description: 'Your farmer profile is initialized. Add your first crop to get started.',
      time: profile.createdAt || new Date(),
      icon: 'User'
    });
  }

  // 5. Generate Recharts Analytics Mock Structure
  const monthlyCropYield = [
    { month: 'Jan', yield: 40 },
    { month: 'Feb', yield: 48 },
    { month: 'Mar', yield: 62 },
    { month: 'Apr', yield: 55 },
    { month: 'May', yield: 78 },
    { month: 'Jun', yield: 85 }
  ];

  const revenueTrend = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 22000 },
    { month: 'Mar', revenue: 35000 },
    { month: 'Apr', revenue: 28000 },
    { month: 'May', revenue: 42000 },
    { month: 'Jun', revenue: 50000 }
  ];

  // Compile real crop distribution from user's crops
  const cropMap = {};
  const allUserCrops = await Crop.find({ farmer: farmerId });
  allUserCrops.forEach(c => {
    cropMap[c.name] = (cropMap[c.name] || 0) + 1;
  });
  let cropDistribution = Object.keys(cropMap).map(key => ({
    name: key,
    value: cropMap[key]
  }));
  if (cropDistribution.length === 0) {
    cropDistribution = [
      { name: 'Wheat', value: 3 },
      { name: 'Rice', value: 2 },
      { name: 'Sugarcane', value: 1 }
    ];
  }

  const diagnosisTrend = [
    { month: 'Jan', count: 2 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 1 },
    { month: 'Apr', count: 4 },
    { month: 'May', count: 8 },
    { month: 'Jun', count: 12 }
  ];

  const rainfallTrend = [
    { month: 'Jan', rainfall: 45 },
    { month: 'Feb', rainfall: 30 },
    { month: 'Mar', rainfall: 25 },
    { month: 'Apr', rainfall: 60 },
    { month: 'May', rainfall: 150 },
    { month: 'Jun', rainfall: 210 }
  ];

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalCrops: stats.totalCrops,
        healthyCrops: stats.healthyCrops,
        aiDiagnoses: stats.aiDiagnoses,
        revenue: stats.revenue,
        activeRentals: stats.activeRentals,
        marketplaceOrders: stats.marketplaceOrders
      },
      profile: {
        farmSize: profile.farmSize,
        location: profile.location,
        membership: profile.membership,
        experience: profile.experience,
        primaryCrops: profile.primaryCrops,
        preferredLanguage: profile.preferredLanguage
      },
      activities: activities.slice(0, 8),
      charts: {
        monthlyCropYield,
        revenueTrend,
        cropDistribution,
        diagnosisTrend,
        rainfallTrend
      }
    }
  });
});

// @desc    Get all crops for the logged-in farmer
// @route   GET /api/v1/farmer/crops
// @access  Private (Farmer)
exports.getCrops = asyncHandler(async (req, res, next) => {
  const crops = await Crop.find({ farmer: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: crops.length,
    data: crops
  });
});

// @desc    Add a new crop
// @route   POST /api/v1/farmer/crops
// @access  Private (Farmer)
exports.addCrop = asyncHandler(async (req, res, next) => {
  req.body.farmer = req.user.id;

  const crop = await Crop.create(req.body);

  // Send an in-app notification when a crop is registered
  await Notification.create({
    user: req.user.id,
    title: 'New Crop Registered',
    message: `${crop.name} has been added to your tracking log successfully.`,
    icon: 'Sprout',
    priority: 'low',
    category: 'Crops',
    link: '/farmer/crops'
  });

  res.status(201).json({
    success: true,
    data: crop
  });
});

// @desc    Update a crop
// @route   PUT /api/v1/farmer/crops/:id
// @access  Private (Farmer)
exports.updateCrop = asyncHandler(async (req, res, next) => {
  let crop = await Crop.findById(req.params.id);

  if (!crop) {
    return next(new ErrorResponse(`Crop not found with id of ${req.params.id}`, 404));
  }

  // Ensure crop belongs to farmer
  if (crop.farmer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this crop', 401));
  }

  crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: crop
  });
});

// @desc    Delete a crop
// @route   DELETE /api/v1/farmer/crops/:id
// @access  Private (Farmer)
exports.deleteCrop = asyncHandler(async (req, res, next) => {
  const crop = await Crop.findById(req.params.id);

  if (!crop) {
    return next(new ErrorResponse(`Crop not found with id of ${req.params.id}`, 404));
  }

  // Ensure crop belongs to farmer
  if (crop.farmer.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this crop', 401));
  }

  await crop.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update farmer profile
// @route   PUT /api/v1/farmer/profile
// @access  Private (Farmer)
exports.updateProfile = asyncHandler(async (req, res, next) => {
  let profile = await FarmerProfile.findOne({ user: req.user.id });

  if (!profile) {
    profile = await FarmerProfile.create({
      user: req.user.id,
      ...req.body
    });
  } else {
    profile = await FarmerProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
  }

  // Optionally update user name if passed in request
  if (req.body.name) {
    req.user.name = req.body.name;
    await req.user.save();
  }

  res.status(200).json({
    success: true,
    data: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      farmSize: profile.farmSize,
      location: profile.location,
      membership: profile.membership,
      experience: profile.experience,
      primaryCrops: profile.primaryCrops,
      preferredLanguage: profile.preferredLanguage
    }
  });
});
