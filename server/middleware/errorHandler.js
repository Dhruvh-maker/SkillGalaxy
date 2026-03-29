/**
 * Centralized error handler middleware
 * Handles errors from async route handlers and sends JSON responses
 */
const errorHandler = (err, req, res, next) => {
  console.error('Server Error:', err);

  // Default error status and message
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
