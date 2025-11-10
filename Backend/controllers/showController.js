const Show = require('../models/Show');
const { Booking, BookingSeat } = require('../models/Booking');
const Seat = require('../models/Seat');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all shows with filters
// @route   GET /api/v1/shows
// @access  Public
exports.getAllShows = async (req, res, next) => {
  try {
    const { theater_id, movie_id, screen_id, date_from, date_to, page = 1, limit = 50 } = req.query;

    const query = { is_active: true };

    // Filter by theater
    if (theater_id) {
      query.theater_id = theater_id;
    }

    // Filter by movie
    if (movie_id) {
      query.movie_id = movie_id;
    }

    // Filter by screen
    if (screen_id) {
      query.screen_id = screen_id;
    }

    // Filter by date range
    if (date_from || date_to) {
      query.show_date = {};
      if (date_from) {
        const startDate = new Date(date_from);
        startDate.setHours(0, 0, 0, 0);
        query.show_date.$gte = startDate;
      }
      if (date_to) {
        const endDate = new Date(date_to);
        endDate.setHours(23, 59, 59, 999);
        query.show_date.$lte = endDate;
      }
    }

    const shows = await Show.find(query)
      .populate('movie_id', 'title poster_url runtime')
      .populate('theater_id', 'name location city')
      .populate('screen_id', 'name rows columns total_seats')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ show_date: 1, show_time: 1 });

    const count = await Show.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        shows: shows.map(show => show.toJSON()),
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

// @desc    Get shows by movie
// @route   GET /api/v1/movies/:movieId/shows
// @access  Public
exports.getShowsByMovie = async (req, res, next) => {
  try {
    const { theater_id, date, city } = req.query;

    const query = {
      movie_id: req.params.movieId,
      is_active: true
    };

    if (theater_id) {
      query.theater_id = theater_id;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.show_date = { $gte: startDate, $lte: endDate };
    }

    const shows = await Show.find(query)
      .populate('movie_id', 'title poster_url runtime')
      .populate('theater_id', 'name location city')
      .populate('screen_id', 'name')
      .sort({ show_date: 1, show_time: 1 });

    res.status(200).json({
      success: true,
      data: shows.map(show => show.toJSON())
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show by ID
// @route   GET /api/v1/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie_id')
      .populate('theater_id')
      .populate('screen_id');

    if (!show) {
      return next(new ErrorResponse('Show not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: show.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create show
// @route   POST /api/v1/shows
// @access  Private (theater_admin, super_admin)
exports.createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);

    // Populate the show before returning
    await show.populate([
      { path: 'movie_id', select: 'title poster_url runtime' },
      { path: 'theater_id', select: 'name location city' },
      { path: 'screen_id', select: 'name rows columns total_seats' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: show.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/v1/shows/:id
// @access  Private (theater_admin, super_admin)
exports.updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('movie_id', 'title poster_url runtime')
      .populate('theater_id', 'name location city')
      .populate('screen_id', 'name rows columns total_seats');

    if (!show) {
      return next(new ErrorResponse('Show not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      data: show.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/v1/shows/:id
// @access  Private (theater_admin, super_admin)
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return next(new ErrorResponse('Show not found', 404, 'NOT_FOUND'));
    }

    show.is_active = false;
    await show.save();

    res.status(200).json({
      success: true,
      message: 'Show deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available seats for show
// @route   GET /api/v1/shows/:showId/seats
// @access  Public
exports.getAvailableSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.showId)
      .populate('screen_id', 'name rows columns total_seats');

    if (!show) {
      return next(new ErrorResponse('Show not found', 404, 'NOT_FOUND'));
    }

    if (!show.screen_id) {
      return next(new ErrorResponse('Screen not found for this show', 404, 'NOT_FOUND'));
    }

    // Get all seats for this screen
    const allSeats = await Seat.find({
      screen_id: show.screen_id._id || show.screen_id,
      is_active: true
    }).sort({ row: 1, column: 1 });

    // If no seats found, return helpful error
    if (allSeats.length === 0) {
      console.warn(`No seats found for screen ${show.screen_id._id || show.screen_id}`);
    }

    // Get booked seats for this show
    const bookings = await Booking.find({
      show_id: req.params.showId,
      status: { $in: ['confirmed', 'completed'] }
    });

    const bookingIds = bookings.map(b => b._id);
    const bookedSeats = await BookingSeat.find({
      booking_id: { $in: bookingIds }
    }).select('seat_id');

    const bookedSeatIds = bookedSeats.map(bs => bs.seat_id.toString());

    // Mark seats as booked and convert to plain objects with id
    const seats = allSeats.map(seat => ({
      id: seat._id.toString(),
      seat_number: seat.seat_number,
      seat_type: seat.seat_type,
      row: seat.row,
      column: seat.column,
      is_booked: bookedSeatIds.includes(seat._id.toString()),
      is_active: seat.is_active
    }));

    res.status(200).json({
      success: true,
      data: {
        show: {
          id: show._id.toString(),
          movie_id: show.movie_id.toString(),
          screen_id: (show.screen_id._id || show.screen_id).toString(),
          show_date: show.show_date,
          show_time: show.show_time,
          screen: show.screen_id.name ? {
            name: show.screen_id.name,
            rows: show.screen_id.rows,
            columns: show.screen_id.columns,
            total_seats: show.screen_id.total_seats
          } : undefined
        },
        seats
      }
    });
  } catch (error) {
    next(error);
  }
};
