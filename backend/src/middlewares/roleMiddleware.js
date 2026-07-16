const ErrorResponse = require('../utils/ErrorResponse');

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ErrorResponse('User context is missing. Authentication is required.', 401, 'UNAUTHORIZED')
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this resource`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
};

module.exports = roleMiddleware;
