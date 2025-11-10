const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400, 'VALIDATION_ERROR'));
    }

    // Create user
    const user = await User.create({
      email,
      password,
      full_name
    });

    // Generate token
    const token = generateToken(user._id);

    // Prepare response
    const profile = {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      theater_id: user.theater_id,
      is_active: user.is_active,
      created_at: user.created_at
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          full_name: user.full_name
        },
        token,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400, 'VALIDATION_ERROR'));
    }

    // Check for user (include password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401, 'UNAUTHORIZED'));
    }

    // Check if user is active
    if (!user.is_active) {
      return next(new ErrorResponse('Account is deactivated', 403, 'FORBIDDEN'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401, 'UNAUTHORIZED'));
    }

    // Generate token
    const token = generateToken(user._id);

    // Prepare response
    const profile = {
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      theater_id: user.theater_id,
      is_active: user.is_active,
      created_at: user.created_at
    };

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email
        },
        token,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // Here we just send a success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        theater_id: user.theater_id,
        is_active: user.is_active,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};
