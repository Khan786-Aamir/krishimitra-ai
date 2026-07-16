const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, profileImage } = req.body;

  // 1. Input Validation
  if (!name || !email || !password) {
    return next(
      new ErrorResponse('Please provide a name, email, and password', 400, 'VALIDATION_ERROR')
    );
  }

  // Email format verification
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(
      new ErrorResponse('Please provide a valid email address', 400, 'VALIDATION_ERROR')
    );
  }

  // Password length verification
  if (password.length < 6) {
    return next(
      new ErrorResponse('Password must be at least 6 characters long', 400, 'VALIDATION_ERROR')
    );
  }

  // Role verification (Admin not allowed to register publicly)
  const allowedRoles = ['Farmer', 'Buyer', 'Expert'];
  if (role && !allowedRoles.includes(role)) {
    return next(
      new ErrorResponse('Public registration is restricted to Farmer, Buyer, or Expert roles', 400, 'VALIDATION_ERROR')
    );
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(
      new ErrorResponse('Email address is already registered', 409, 'DUPLICATE_FIELD_VALUE')
    );
  }

  // 3. Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Farmer', // Defaults to Farmer
    phone: phone || '',
    profileImage: profileImage || '',
    isVerified: false
  });

  // 4. Generate JWT
  const token = user.generateJWT();

  // 5. Send response
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validate email and password inputs
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide email and password', 400, 'VALIDATION_ERROR')
    );
  }

  // 2. Fetch user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(
      new ErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    );
  }

  // 3. Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(
      new ErrorResponse('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    );
  }

  // 4. Generate JWT
  const token = user.generateJWT();

  // 5. Send response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
  // Stateless JWT logout clears any potential client cookie context and confirms logout success
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  // req.user has already been populated by authMiddleware
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        profileImage: req.user.profileImage,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
      }
    }
  });
});
