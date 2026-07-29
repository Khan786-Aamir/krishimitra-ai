const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const BuyerProfile = require('../models/BuyerProfile');
const ExpertProfile = require('../models/ExpertProfile');
const Crop = require('../models/Crop');
const Consultation = require('../models/Consultation');
const DiagnosisReview = require('../models/DiagnosisReview');
const Scheme = require('../models/Scheme');
const AdminProfile = require('../models/AdminProfile');
const MarketplaceListing = require('../models/MarketplaceListing');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Local storage for mock items not fully backed by models (in-memory persistent for server runtime)
let localSettings = {
  platformName: 'KrishiMitra AI Portal',
  allowPublicRegistration: true,
  maintenanceMode: false,
  backupSchedule: 'Weekly',
  securityLogLevel: 'High'
};

let localEquipmentRentals = [
  { id: 'eq-1', owner: 'Gurpreet Singh', name: 'John Deere Tractor 5050D', price: '₹2,500/day', availability: 'Available', status: 'Approved', requests: 4 },
  { id: 'eq-2', owner: 'Ramesh Patel', name: 'Laser Land Leveller', price: '₹1,800/day', availability: 'Leased', status: 'Approved', requests: 2 },
  { id: 'eq-3', owner: 'Sunil Deshmukh', name: 'Mahindra Paddy Harvester', price: '₹3,500/day', availability: 'Available', status: 'Pending', requests: 7 },
  { id: 'eq-4', owner: 'Venkatesh Rao', name: 'Power Tiller 15HP', price: '₹1,200/day', availability: 'Available', status: 'Rejected', requests: 1 }
];

let localReportedPosts = [
  { id: 'post-r1', author: 'Ravi Kumar', content: 'Buy these chemicals for instant 500% yield growth! Link: spammy-pesticides.com', reportsCount: 8, reason: 'Commercial Spam / Suspicious Link', status: 'Reported' },
  { id: 'post-r2', author: 'Vikram Singh', content: 'Selling black market crop seeds, contact me on WhatsApp directly.', reportsCount: 14, reason: 'Illegal Sales / Terms Violation', status: 'Reported' },
  { id: 'post-r3', author: 'Aditya Patil', content: 'Our government scheme analysis post.', reportsCount: 1, reason: 'Duplicate spam', status: 'Approved' }
];

let localReportedComments = [
  { id: 'comm-r1', author: 'Suresh Lal', postTitle: 'Fungal infestation in mustard crops', content: 'You guys don\'t know anything, the app diagnosis is total garbage!', reportsCount: 4, reason: 'Abusive language', status: 'Reported' },
  { id: 'comm-r2', author: 'Rahul Gupta', postTitle: 'Organic composting tips', content: 'Buy crypto coins now to double farming profits!', reportsCount: 12, reason: 'Financial fraud spam', status: 'Hidden' }
];

// Health and performance metrics simulator
const getUptimeString = () => {
  const uptime = process.uptime();
  const hrs = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);
  return `${hrs}h ${mins}m ${secs}s`;
};

// @desc    Get Admin Dashboard Stats & System Telemetry
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const farmersCount = await User.countDocuments({ role: 'Farmer' });
  const buyersCount = await User.countDocuments({ role: 'Buyer' });
  const expertsCount = await User.countDocuments({ role: 'Expert' });
  
  const activeListings = await Crop.countDocuments();
  const pendingApprovals = await User.countDocuments({ isVerified: false, role: 'Expert' });
  const consultationsCount = await Consultation.countDocuments();
  const aiReportsCount = await DiagnosisReview.countDocuments();
  const schemesCount = await Scheme.countDocuments();

  // Simulated metrics
  const revenue = 524800; // Simulated platform earnings
  const growth = 18.4;
  
  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        farmersCount,
        buyersCount,
        expertsCount,
        activeListings,
        pendingApprovals,
        equipmentRentals: localEquipmentRentals.length,
        consultationsCount,
        aiReportsCount,
        schemesCount,
        revenue,
        growth
      },
      health: {
        serverHealth: 'Excellent',
        systemUptime: getUptimeString(),
        avgApiResponseTime: '45ms',
        cpuUsage: '12%',
        memoryUsage: '34%'
      },
      activityStream: [
        { id: 1, type: 'registration', message: 'New expert Dr. Anita Verma registered.', time: '10 mins ago' },
        { id: 2, type: 'marketplace', message: 'Gurpreet Singh listed 250 Qtl Sharbati Wheat.', time: '1 hr ago' },
        { id: 3, type: 'consultation', message: 'Appointment booked between Sunil and Expert Amit.', time: '3 hrs ago' },
        { id: 4, type: 'report', message: 'Spam post flagged in Crop Diseases community board.', time: '5 hrs ago' },
        { id: 5, type: 'scheme', message: 'Admin published new Scheme: PM Fasal Bima update.', time: 'Yesterday' }
      ]
    }
  });
});

// @desc    Get all users list (paginated, with search and role filters)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { role, search, status } = req.query;
  let query = {};

  if (role && role !== 'All') {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Fetch all users matching query sorted by date
  const users = await User.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Update user status / details
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const { name, phone, isVerified, role } = req.body;
  user.name = name || user.name;
  user.phone = phone !== undefined ? phone : user.phone;
  user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;
  user.role = role || user.role;

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Delete matching profiles
  if (user.role === 'Farmer') await FarmerProfile.findOneAndDelete({ user: user._id });
  if (user.role === 'Buyer') await BuyerProfile.findOneAndDelete({ user: user._id });
  if (user.role === 'Expert') await ExpertProfile.findOneAndDelete({ user: user._id });
  await AdminProfile.findOneAndDelete({ user: user._id });

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User and all related profiles successfully deleted'
  });
});

// @desc    Suspend / Unsuspend user session (simulated via DB flag or verification)
// @route   PUT /api/v1/admin/users/:id/suspend
// @access  Private/Admin
exports.toggleUserSuspension = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // We toggle isVerified or another state. Let's toggle isVerified as a suspension flag or update dynamically
  // If isVerified is false, in normal terms they are unverified, but we can treat verification as account status
  user.isVerified = !user.isVerified;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
    message: `User status set to ${user.isVerified ? 'Active' : 'Suspended'}`
  });
});

// @desc    Bulk Delete Users
// @route   POST /api/v1/admin/users/bulk-delete
// @access  Private/Admin
exports.bulkDeleteUsers = asyncHandler(async (req, res, next) => {
  const { userIds } = req.body;
  if (!userIds || !Array.isArray(userIds)) {
    return next(new ErrorResponse('Please provide an array of user IDs', 400));
  }

  // Delete all profiles matching IDs
  await FarmerProfile.deleteMany({ user: { $in: userIds } });
  await BuyerProfile.deleteMany({ user: { $in: userIds } });
  await ExpertProfile.deleteMany({ user: { $in: userIds } });
  await AdminProfile.deleteMany({ user: { $in: userIds } });

  // Delete users
  await User.deleteMany({ _id: { $in: userIds } });

  res.status(200).json({
    success: true,
    message: `${userIds.length} users successfully deleted`
  });
});

// @desc    Bulk Suspend/Activate Users
// @route   POST /api/v1/admin/users/bulk-suspend
// @access  Private/Admin
exports.bulkSuspendUsers = asyncHandler(async (req, res, next) => {
  const { userIds, suspend } = req.body;
  if (!userIds || !Array.isArray(userIds)) {
    return next(new ErrorResponse('Please provide an array of user IDs', 400));
  }

  // Set isVerified flag (false represents suspended/unverified, true active)
  await User.updateMany(
    { _id: { $in: userIds } },
    { $set: { isVerified: !suspend } }
  );

  res.status(200).json({
    success: true,
    message: `${userIds.length} users status updated successfully`
  });
});

// @desc    Get all Farmers directories
// @route   GET /api/v1/admin/farmers
// @access  Private/Admin
exports.getFarmers = asyncHandler(async (req, res, next) => {
  const farmers = await User.find({ role: 'Farmer' }).sort({ createdAt: -1 });
  const profiles = await FarmerProfile.find().populate('user');
  
  // Combine users and profiles
  const farmersList = farmers.map(f => {
    const prof = profiles.find(p => p.user && p.user._id.toString() === f._id.toString());
    return {
      id: f._id,
      name: f.name,
      email: f.email,
      phone: f.phone,
      isVerified: f.isVerified,
      joinedDate: f.createdAt,
      farmSize: prof ? `${prof.farmSize} Acres` : 'N/A',
      location: prof ? prof.location : 'Not specified',
      cropTypes: prof ? prof.primaryCrops : [],
      diseaseHistory: ['Rust Infection', 'Late Blight'] // Simulated history
    };
  });

  res.status(200).json({
    success: true,
    data: farmersList
  });
});

// @desc    Get all Buyers directories
// @route   GET /api/v1/admin/buyers
// @access  Private/Admin
exports.getBuyers = asyncHandler(async (req, res, next) => {
  const buyers = await User.find({ role: 'Buyer' }).sort({ createdAt: -1 });
  const profiles = await BuyerProfile.find().populate('user');

  const buyersList = buyers.map(b => {
    const prof = profiles.find(p => p.user && p.user._id.toString() === b._id.toString());
    return {
      id: b._id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      isVerified: b.isVerified,
      joinedDate: b.createdAt,
      businessName: prof ? prof.companyName || 'Agri Wholesaler' : 'Individual Buyer',
      purchaseCapacity: prof ? `₹${(prof.totalSpent || 50000).toLocaleString()}` : '₹50,000',
      ordersCount: prof ? prof.totalPurchasesCount || 0 : 0,
      location: prof && prof.address ? `${prof.address.city}, ${prof.address.state}` : 'Not Specified'
    };
  });

  res.status(200).json({
    success: true,
    data: buyersList
  });
});

// @desc    Get all Experts directories
// @route   GET /api/v1/admin/experts
// @access  Private/Admin
exports.getExperts = asyncHandler(async (req, res, next) => {
  const experts = await User.find({ role: 'Expert' }).sort({ createdAt: -1 });
  const profiles = await ExpertProfile.find().populate('user');

  const expertsList = experts.map(e => {
    const prof = profiles.find(p => p.user && p.user._id.toString() === e._id.toString());
    return {
      id: e._id,
      name: e.name,
      email: e.email,
      phone: e.phone,
      isVerified: e.isVerified,
      joinedDate: e.createdAt,
      qualification: prof ? prof.qualification : 'PhD Agronomy',
      experience: prof ? `${prof.experienceYears} Years` : '5 Years',
      specialization: prof ? (prof.specializations || []).join(', ') : 'Soil Chemistry',
      rating: prof ? prof.rating : 4.8,
      consultationsCount: prof ? prof.totalConsultations : 12,
      institute: prof ? prof.institute : 'IARI Delhi'
    };
  });

  res.status(200).json({
    success: true,
    data: expertsList
  });
});

// @desc    Approve or Reject expert profile verification
// @route   PUT /api/v1/admin/experts/:id/verify
// @access  Private/Admin
exports.verifyExpert = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'Expert') {
    return next(new ErrorResponse('Expert user not found', 404));
  }

  const { status } = req.body; // 'Approve' or 'Reject'
  user.isVerified = (status === 'Approve');
  await user.save();

  res.status(200).json({
    success: true,
    message: `Expert verification status successfully updated to ${status}`
  });
});

// @desc    Get Marketplace products preview (Pending, Approved, Rejected)
// @route   GET /api/v1/admin/marketplace
// @access  Private/Admin
exports.getMarketplace = asyncHandler(async (req, res, next) => {
  const listings = await MarketplaceListing.find().populate('farmer');
  
  const mappedListings = listings.map((l) => {
    return {
      id: l._id,
      name: l.name,
      farmerName: l.farmer ? l.farmer.name : 'Unknown Farmer',
      location: l.location || 'Not Specified',
      quantity: `${l.availableQuantity} ${l.unit}`,
      price: `₹${l.price.toLocaleString()}`,
      stage: l.isOrganic ? 'Organic' : 'Standard',
      status: l.status,
      image: l.images && l.images.length > 0 ? l.images[0].url : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600'
    };
  });

  res.status(200).json({
    success: true,
    data: mappedListings
  });
});

// @desc    Approve/Reject Marketplace listed crop
// @route   PUT /api/v1/admin/marketplace/:id/verify
// @access  Private/Admin
exports.verifyProduct = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const listing = await MarketplaceListing.findById(req.params.id);
  if (!listing) {
    return next(new ErrorResponse('Marketplace listing not found', 404));
  }
  listing.status = status;
  await listing.save();

  res.status(200).json({
    success: true,
    message: `Crop product listing ${status} successfully`
  });
});

// @desc    Get equipment rentals overview
// @route   GET /api/v1/admin/equipment
// @access  Private/Admin
exports.getEquipment = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: localEquipmentRentals
  });
});

// @desc    Approve/Reject equipment rental listings
// @route   PUT /api/v1/admin/equipment/:id/verify
// @access  Private/Admin
exports.verifyRental = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const index = localEquipmentRentals.findIndex(item => item.id === req.params.id);
  if (index !== -1) {
    localEquipmentRentals[index].status = status;
  }
  res.status(200).json({
    success: true,
    message: `Equipment status updated to ${status}`
  });
});

// @desc    Get all Government Schemes
// @route   GET /api/v1/admin/schemes
// @access  Private/Admin
exports.getSchemes = asyncHandler(async (req, res, next) => {
  const schemes = await Scheme.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: schemes.length,
    data: schemes
  });
});

// @desc    Create new Government Scheme
// @route   POST /api/v1/admin/schemes
// @access  Private/Admin
exports.createScheme = asyncHandler(async (req, res, next) => {
  const scheme = await Scheme.create(req.body);
  res.status(201).json({
    success: true,
    data: scheme
  });
});

// @desc    Update Government Scheme
// @route   PUT /api/v1/admin/schemes/:id
// @access  Private/Admin
exports.updateScheme = asyncHandler(async (req, res, next) => {
  let scheme = await Scheme.findById(req.params.id);
  if (!scheme) {
    return next(new ErrorResponse('Scheme not found', 404));
  }
  scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: scheme
  });
});

// @desc    Delete Government Scheme
// @route   DELETE /api/v1/admin/schemes/:id
// @access  Private/Admin
exports.deleteScheme = asyncHandler(async (req, res, next) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) {
    return next(new ErrorResponse('Scheme not found', 404));
  }
  await Scheme.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Scheme deleted successfully'
  });
});

// @desc    Get AI Diagnosis Reports and assignment history
// @route   GET /api/v1/admin/ai-reports
// @access  Private/Admin
exports.getAIReports = asyncHandler(async (req, res, next) => {
  const reports = await DiagnosisReview.find().sort({ createdAt: -1 });

  // Map reviewHistory entries inside a simulation block or DB values
  const reviewHistory = [
    { id: 'h1', expertName: 'Dr. Amit Patel', reviewTime: new Date(Date.now() - 3600000 * 2).toISOString(), previousStatus: 'Pending', currentStatus: 'Approved' },
    { id: 'h2', expertName: 'Dr. Anita Verma', reviewTime: new Date(Date.now() - 3600000 * 24).toISOString(), previousStatus: 'Pending', currentStatus: 'Modified' }
  ];

  res.status(200).json({
    success: true,
    data: reports,
    reviewHistory,
    stats: {
      cropDistribution: [
        { name: 'Wheat', value: 42 },
        { name: 'Rice', value: 28 },
        { name: 'Mustard', value: 15 },
        { name: 'Onion', value: 15 }
      ],
      diseaseDistribution: [
        { name: 'Leaf Rust', value: 50 },
        { name: 'Blight', value: 30 },
        { name: 'Downy Mildew', value: 20 }
      ]
    }
  });
});

// @desc    Assign expert to AI Diagnosis report
// @route   PUT /api/v1/admin/ai-reports/:id/assign
// @access  Private/Admin
exports.assignExpert = asyncHandler(async (req, res, next) => {
  const report = await DiagnosisReview.findById(req.params.id);
  if (!report) {
    return next(new ErrorResponse('AI Report not found', 404));
  }
  const { expertName } = req.body;
  report.expertFeedback = `Assigned to ${expertName}`;
  await report.save();
  res.status(200).json({
    success: true,
    data: report,
    message: `Expert ${expertName} successfully assigned to this diagnosis report.`
  });
});

// @desc    Approve/Reject AI Report
// @route   PUT /api/v1/admin/ai-reports/:id/verify
// @access  Private/Admin
exports.verifyAIReport = asyncHandler(async (req, res, next) => {
  const report = await DiagnosisReview.findById(req.params.id);
  if (!report) {
    return next(new ErrorResponse('AI Report not found', 404));
  }
  const { status } = req.body;
  report.status = status;
  await report.save();
  res.status(200).json({
    success: true,
    data: report,
    message: `Diagnosis report set to ${status}`
  });
});

// @desc    Get Reported Posts/Comments for Community Moderation
// @route   GET /api/v1/admin/community
// @access  Private/Admin
exports.getCommunityContent = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      posts: localReportedPosts,
      comments: localReportedComments
    }
  });
});

// @desc    Moderate community post
// @route   PUT /api/v1/admin/community/posts/:id
// @access  Private/Admin
exports.moderatePost = asyncHandler(async (req, res, next) => {
  const { status } = req.body; // 'Delete', 'Approve', 'Hide'
  const index = localReportedPosts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    localReportedPosts[index].status = status;
  }
  res.status(200).json({
    success: true,
    message: `Post moderated: status set to ${status}`
  });
});

// @desc    Moderate community comment
// @route   PUT /api/v1/admin/community/comments/:id
// @access  Private/Admin
exports.moderateComment = asyncHandler(async (req, res, next) => {
  const { status } = req.body; // 'Delete', 'Approve', 'Hide'
  const index = localReportedComments.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    localReportedComments[index].status = status;
  }
  res.status(200).json({
    success: true,
    message: `Comment moderated: status set to ${status}`
  });
});

// @desc    Get Platform Analytics
// @route   GET /api/v1/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      platformGrowth: [
        { month: 'Jan', registrations: 120, marketplaceSales: 80, rentals: 25 },
        { month: 'Feb', registrations: 180, marketplaceSales: 110, rentals: 38 },
        { month: 'Mar', registrations: 240, marketplaceSales: 160, rentals: 42 },
        { month: 'Apr', registrations: 310, marketplaceSales: 140, rentals: 30 },
        { month: 'May', registrations: 450, marketplaceSales: 220, rentals: 65 },
        { month: 'Jun', registrations: 600, marketplaceSales: 310, rentals: 95 }
      ],
      userDistribution: [
        { name: 'Farmers', value: 65, color: '#22C55E' },
        { name: 'Buyers', value: 20, color: '#3B82F6' },
        { name: 'Experts', value: 15, color: '#EAB308' }
      ],
      marketplaceGrowth: [
        { month: 'Jan', revenue: 150000 },
        { month: 'Feb', revenue: 240000 },
        { month: 'Mar', revenue: 310000 },
        { month: 'Apr', revenue: 280000 },
        { month: 'May', revenue: 420000 },
        { month: 'Jun', revenue: 524800 }
      ],
      equipmentUsage: [
        { category: 'Tractors', listings: 12, bookings: 45 },
        { category: 'Harvesters', listings: 8, bookings: 32 },
        { category: 'Tillers', listings: 18, bookings: 60 },
        { category: 'Irrigation', listings: 15, bookings: 24 }
      ],
      consultationTrends: [
        { month: 'Jan', consultations: 40 },
        { month: 'Feb', consultations: 65 },
        { month: 'Mar', consultations: 90 },
        { month: 'Apr', consultations: 85 },
        { month: 'May', consultations: 130 },
        { month: 'Jun', consultations: 175 }
      ],
      aiDiagnosisTrends: [
        { crop: 'Wheat', healthy: 250, disease: 45 },
        { crop: 'Rice', healthy: 180, disease: 32 },
        { crop: 'Mustard', healthy: 90, disease: 18 },
        { crop: 'Onion', healthy: 120, disease: 24 }
      ],
      govSchemeReach: [
        { title: 'PM Kisan', reach: 450 },
        { title: 'PMFBY', reach: 310 },
        { title: 'SMAM', reach: 180 },
        { title: 'KCC', reach: 290 },
        { title: 'Soil Card', reach: 410 }
      ]
    }
  });
});

// @desc    Get Admin profile
// @route   GET /api/v1/admin/profile
// @access  Private/Admin
exports.getProfile = asyncHandler(async (req, res, next) => {
  let profile = await AdminProfile.findOne({ user: req.user.id });
  if (!profile) {
    // Send back custom flag indicating missing profile, let client handle banner
    return res.status(200).json({
      success: true,
      profileExists: false,
      data: null
    });
  }

  res.status(200).json({
    success: true,
    profileExists: true,
    data: {
      ...profile.toObject(),
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    }
  });
});

// @desc    Save/Create Admin profile
// @route   POST /api/v1/admin/profile
// @access  Private/Admin
exports.saveProfile = asyncHandler(async (req, res, next) => {
  const { department, role, bio, permissions } = req.body;

  let profile = await AdminProfile.findOne({ user: req.user.id });
  if (!profile) {
    profile = await AdminProfile.create({
      user: req.user.id,
      department: department || 'Ecosystem Operations',
      role: role || 'Super Admin',
      bio: bio || '',
      permissions: permissions || ['All Access'],
      profileCompleted: true,
      lastLogin: new Date(),
      lastPasswordChange: new Date()
    });
  } else {
    profile.department = department || profile.department;
    profile.role = role || profile.role;
    profile.bio = bio || profile.bio;
    profile.permissions = permissions || profile.permissions;
    profile.profileCompleted = true;
    await profile.save();
  }

  res.status(200).json({
    success: true,
    data: {
      ...profile.toObject(),
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    }
  });
});

// @desc    Get settings
// @route   GET /api/v1/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: localSettings
  });
});

// @desc    Update settings
// @route   PUT /api/v1/admin/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res, next) => {
  localSettings = {
    ...localSettings,
    ...req.body
  };
  res.status(200).json({
    success: true,
    data: localSettings
  });
});
