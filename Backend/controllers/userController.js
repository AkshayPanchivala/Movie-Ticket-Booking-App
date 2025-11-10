const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create user by admin
// @route   POST /api/v1/users
// @access  Private (super_admin)
exports.createUserByAdmin = async (req, res, next) => {
  try {
    const { email, password, full_name, role, theater_id } = req.body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return next(new ErrorResponse('Please provide email, password, and full name', 400, 'VALIDATION_ERROR'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User with this email already exists', 400, 'DUPLICATE_ERROR'));
    }

    // Create user data
    const userData = {
      email,
      password,
      full_name,
      role: role || 'user'
    };

    // Add theater_id if role is theater_admin
    if (role === 'theater_admin' && theater_id) {
      userData.theater_id = theater_id;
    }

    // Create user
    const user = await User.create(userData);

    // Return user without auth tokens (admin is creating, not logging in as this user)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (super_admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { full_name: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/v1/users/:id/role
// @access  Private (super_admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, theater_id } = req.body;

    if (!role) {
      return next(new ErrorResponse('Role is required', 400, 'VALIDATION_ERROR'));
    }

    const updateData = { role };

    if (role === 'theater_admin' && theater_id) {
      updateData.theater_id = theater_id;
    } else if (role !== 'theater_admin') {
      updateData.theater_id = null;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user
// @route   PUT /api/v1/users/:id/deactivate
// @access  Private (super_admin)
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate user
// @route   PUT /api/v1/users/:id/activate
// @access  Private (super_admin)
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_active: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'User activated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};
