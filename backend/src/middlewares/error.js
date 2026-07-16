const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developer diagnostic (Console / Winston in production)
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
    error.code = 'RESOURCE_NOT_FOUND';
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 409;
    error.code = 'DUPLICATE_FIELD_VALUE';
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    error.details = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
  }

  const statusCode = error.statusCode || 500;
  const errorCode = error.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: error.message || 'Server encountered an unexpected condition',
      details: error.details || []
    }
  });
};

module.exports = errorHandler;
