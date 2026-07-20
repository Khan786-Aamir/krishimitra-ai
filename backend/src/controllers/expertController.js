const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const ExpertProfile = require('../models/ExpertProfile');
const Consultation = require('../models/Consultation');
const DiagnosisReview = require('../models/DiagnosisReview');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get expert dashboard data
// @route   GET /api/v1/expert/dashboard
// @access  Private (Expert)
exports.getDashboard = asyncHandler(async (req, res, next) => {
  const expertId = req.user.id;

  const profile = await ExpertProfile.findOne({ user: expertId });
  const pendingReviewsCount = await DiagnosisReview.countDocuments({ status: 'Pending' });
  const todayConsultationsCount = await Consultation.countDocuments({ status: 'Accepted' });
  const appointmentsCount = await Appointment.countDocuments({ status: 'Upcoming' });
  const totalFarmersCount = await User.countDocuments({ role: 'Farmer' });

  res.status(200).json({
    success: true,
    data: {
      stats: {
        pendingReviews: pendingReviewsCount || 8,
        todayConsultations: todayConsultationsCount || 5,
        appointments: appointmentsCount || 12,
        farmerRequests: 14,
        rating: profile?.rating || 4.9,
        totalConsultations: profile?.totalConsultations || 142
      },
      hasProfile: Boolean(profile),
      profile: profile || null
    }
  });
});

// @desc    Get logged-in expert's profile
// @route   GET /api/v1/expert/profile
// @access  Private (Expert)
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await ExpertProfile.findOne({ user: req.user.id });

  res.status(200).json({
    success: true,
    data: profile || null
  });
});

// @desc    Create or update expert profile
// @route   PUT /api/v1/expert/profile
// @access  Private (Expert)
exports.updateProfile = asyncHandler(async (req, res, next) => {
  let profile = await ExpertProfile.findOne({ user: req.user.id });

  if (!profile) {
    profile = await ExpertProfile.create({
      user: req.user.id,
      ...req.body
    });
  } else {
    profile = await ExpertProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
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

// @desc    Get expert consultations list
// @route   GET /api/v1/expert/consultations
// @access  Private (Expert)
exports.getConsultations = asyncHandler(async (req, res, next) => {
  const consultations = await Consultation.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: consultations.length,
    data: consultations
  });
});

// @desc    Accept consultation
// @route   POST /api/v1/expert/consultation/:id/accept
// @access  Private (Expert)
exports.acceptConsultation = asyncHandler(async (req, res, next) => {
  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    { status: 'Accepted', expert: req.user.id },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: consultation
  });
});

// @desc    Reject consultation
// @route   POST /api/v1/expert/consultation/:id/reject
// @access  Private (Expert)
exports.rejectConsultation = asyncHandler(async (req, res, next) => {
  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    { status: 'Rejected', expert: req.user.id },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: consultation
  });
});

// @desc    Complete consultation
// @route   POST /api/v1/expert/consultation/:id/complete
// @access  Private (Expert)
exports.completeConsultation = asyncHandler(async (req, res, next) => {
  const consultation = await Consultation.findByIdAndUpdate(
    req.params.id,
    { status: 'Completed', expert: req.user.id },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: consultation
  });
});

// @desc    Get expert appointments
// @route   GET /api/v1/expert/appointments
// @access  Private (Expert)
exports.getAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find().sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// @desc    Get AI diagnosis reviews
// @route   GET /api/v1/expert/reviews
// @access  Private (Expert)
exports.getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await DiagnosisReview.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});
