const Seat = require('../models/Seat');
const Screen = require('../models/Screen');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get seats by screen
// @route   GET /api/v1/screens/:screenId/seats
// @access  Public
exports.getSeatsByScreen = async (req, res, next) => {
  try {
    const seats = await Seat.find({
      screen_id: req.params.screenId,
      is_active: true
    }).sort({ row: 1, column: 1 });

    res.status(200).json({
      success: true,
      data: seats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create seats in bulk
// @route   POST /api/v1/screens/:screenId/seats/bulk
// @access  Private (theater_admin, super_admin)
exports.createSeatsBulk = async (req, res, next) => {
  try {
    const { seats } = req.body;

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return next(new ErrorResponse('Please provide seats array', 400, 'VALIDATION_ERROR'));
    }

    // Add screen_id to each seat
    const seatsWithScreen = seats.map(seat => ({
      ...seat,
      screen_id: req.params.screenId,
      seat_number: `${seat.row}${seat.column}`
    }));

    const createdSeats = await Seat.insertMany(seatsWithScreen);

    res.status(201).json({
      success: true,
      message: 'Seats created successfully',
      data: createdSeats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auto-generate seats for a screen
// @route   POST /api/v1/screens/:screenId/seats/generate
// @access  Private (theater_admin, super_admin)
exports.generateSeatsForScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findById(req.params.screenId);

    if (!screen) {
      return next(new ErrorResponse('Screen not found', 404, 'NOT_FOUND'));
    }

    // Check if seats already exist
    const existingSeats = await Seat.find({ screen_id: req.params.screenId });
    if (existingSeats.length > 0) {
      return next(
        new ErrorResponse(
          `This screen already has ${existingSeats.length} seats. Delete existing seats first if you want to regenerate.`,
          400,
          'SEATS_EXIST'
        )
      );
    }

    // Generate seats
    const seats = [];
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < screen.rows; r++) {
      for (let c = 1; c <= screen.columns; c++) {
        const rowLetter = rowLetters[r];
        const seatNumber = `${rowLetter}${c}`;

        // First 2 rows are premium, rest are regular
        const seatType = r < 2 ? 'premium' : 'regular';

        seats.push({
          screen_id: screen._id,
          row: rowLetter,
          column: c,
          seat_number: seatNumber,
          seat_type: seatType,
          is_active: true
        });
      }
    }

    const createdSeats = await Seat.insertMany(seats);

    res.status(201).json({
      success: true,
      message: `Successfully generated ${createdSeats.length} seats for ${screen.name}`,
      data: {
        screen_id: screen._id,
        screen_name: screen.name,
        total_seats_created: createdSeats.length,
        layout: {
          rows: screen.rows,
          columns: screen.columns,
          premium_seats: screen.columns * 2,
          regular_seats: createdSeats.length - (screen.columns * 2)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
