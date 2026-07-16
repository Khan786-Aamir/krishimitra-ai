const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Ensure token is present
  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this resource', 401, 'UNAUTHORIZED')
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB and attach to req
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new ErrorResponse('User associated with this token was not found', 401, 'USER_NOT_FOUND')
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorResponse('Invalid or expired token', 401, 'INVALID_TOKEN')
    );
  }
});

module.exports = authMiddleware;
