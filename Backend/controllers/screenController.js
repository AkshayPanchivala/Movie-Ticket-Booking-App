const Screen = require('../models/Screen');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get screens by theater
// @route   GET /api/v1/theaters/:theaterId/screens
// @access  Public
exports.getScreensByTheater = async (req, res, next) => {
  try {
    const screens = await Screen.find({
      theater_id: req.params.theaterId,
      is_active: true
    });

    res.status(200).json({
      success: true,
      data: screens
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get screen by ID
// @route   GET /api/v1/screens/:id
// @access  Public
exports.getScreenById = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return next(new ErrorResponse('Screen not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: screen
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create screen
// @route   POST /api/v1/screens
// @access  Private (theater_admin, super_admin)
exports.createScreen = async (req, res, next) => {
  try {
    const screen = await Screen.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      data: screen
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update screen
// @route   PUT /api/v1/screens/:id
// @access  Private (theater_admin, super_admin)
exports.updateScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!screen) {
      return next(new ErrorResponse('Screen not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'Screen updated successfully',
      data: screen
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete screen
// @route   DELETE /api/v1/screens/:id
// @access  Private (theater_admin, super_admin)
exports.deleteScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.id);

    if (!screen) {
      return next(new ErrorResponse('Screen not found', 404, 'NOT_FOUND'));
    }

    screen.is_active = false;
    await screen.save();

    res.status(200).json({
      success: true,
      message: 'Screen deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
