const Theater = require('../models/Theater');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all theaters
// @route   GET /api/v1/theaters
// @access  Public
exports.getAllTheaters = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, city } = req.query;

    const query = { is_active: true };

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const theaters = await Theater.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    const count = await Theater.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        theaters: theaters.map(t => t.toJSON()),
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

// @desc    Get theater by ID
// @route   GET /api/v1/theaters/:id
// @access  Public
exports.getTheaterById = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id).populate('screens');

    if (!theater) {
      return next(new ErrorResponse('Theater not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: theater.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create theater
// @route   POST /api/v1/theaters
// @access  Private (super_admin)
exports.createTheater = async (req, res, next) => {
  try {
    const theater = await Theater.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Theater created successfully',
      data: theater.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theater
// @route   PUT /api/v1/theaters/:id
// @access  Private (super_admin)
exports.updateTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!theater) {
      return next(new ErrorResponse('Theater not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'Theater updated successfully',
      data: theater.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theater
// @route   DELETE /api/v1/theaters/:id
// @access  Private (super_admin)
exports.deleteTheater = async (req, res, next) => {
  try {
    const theater = await Theater.findById(req.params.id);

    if (!theater) {
      return next(new ErrorResponse('Theater not found', 404, 'NOT_FOUND'));
    }

    theater.is_active = false;
    await theater.save();

    res.status(200).json({
      success: true,
      message: 'Theater deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
