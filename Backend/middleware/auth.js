const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401, 'UNAUTHORIZED'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new ErrorResponse('User not found', 404, 'NOT_FOUND'));
      }

      if (!req.user.is_active) {
        return next(new ErrorResponse('User account is deactivated', 403, 'FORBIDDEN'));
      }

      next();
    } catch (error) {
      return next(new ErrorResponse('Not authorized to access this route', 401, 'UNAUTHORIZED'));
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          'Insufficient permissions',
          403,
          'FORBIDDEN'
        )
      );
    }
    next();
  };
};

// Check if user is theater admin for specific theater
exports.checkTheaterAccess = async (req, res, next) => {
  try {
    const theaterId = req.body.theater_id || req.params.theaterId;

    if (req.user.role === 'super_admin') {
      return next();
    }

    if (req.user.role === 'theater_admin') {
      if (!req.user.theater_id || req.user.theater_id.toString() !== theaterId) {
        return next(
          new ErrorResponse(
            'Not authorized to access this theater',
            403,
            'FORBIDDEN'
          )
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
