const { Booking, BookingSeat } = require('../models/Booking');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');
const stripe = require('../config/stripe');

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { show_id, seat_ids, payment_method, payment_details, payment_intent_id } = req.body;

    // If using Stripe, verify payment intent
    if (payment_method === 'stripe' || payment_intent_id) {
      if (!payment_intent_id) {
        await session.abortTransaction();
        return next(new ErrorResponse('payment_intent_id is required for Stripe payments', 400, 'VALIDATION_ERROR'));
      }

      try {
        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (paymentIntent.status !== 'succeeded') {
          await session.abortTransaction();
          return next(new ErrorResponse('Payment not completed', 400, 'PAYMENT_PENDING'));
        }

        // Verify metadata matches
        if (paymentIntent.metadata.user_id !== req.user._id.toString() ||
            paymentIntent.metadata.show_id !== show_id) {
          await session.abortTransaction();
          return next(new ErrorResponse('Payment verification failed', 400, 'PAYMENT_MISMATCH'));
        }
      } catch (error) {
        await session.abortTransaction();
        console.error('Payment verification error:', error);
        return next(new ErrorResponse('Payment verification failed', 400, 'PAYMENT_ERROR'));
      }
    }

    // Validate show
    const show = await Show.findById(show_id)
      .populate('movie_id', 'title poster_url')
      .populate('theater_id', 'name location')
      .populate('screen_id', 'name');

    if (!show || !show.is_active) {
      await session.abortTransaction();
      return next(new ErrorResponse('Show not found or inactive', 404, 'NOT_FOUND'));
    }

    // Check if seats are already booked
    const existingBookings = await Booking.find({
      show_id,
      status: { $in: ['confirmed', 'completed'] }
    });

    const existingBookingIds = existingBookings.map(b => b._id);
    const bookedSeats = await BookingSeat.find({
      booking_id: { $in: existingBookingIds },
      seat_id: { $in: seat_ids }
    });

    if (bookedSeats.length > 0) {
      await session.abortTransaction();
      const bookedSeatDetails = await Seat.find({
        _id: { $in: bookedSeats.map(bs => bs.seat_id) }
      });
      const bookedSeatNumbers = bookedSeatDetails.map(s => s.seat_number);

      return next(
        new ErrorResponse(
          'Seats already booked',
          409,
          'CONFLICT',
          { booked_seats: bookedSeatNumbers }
        )
      );
    }

    // Calculate total amount (ticket price + platform fee)
    const PLATFORM_FEE = parseFloat(process.env.PLATFORM_FEE) || 50;
    const ticketTotal = show.price * seat_ids.length;
    const total_amount = ticketTotal + PLATFORM_FEE;

    // Prepare payment details
    const bookingPaymentDetails = payment_details || {};
    if (payment_intent_id) {
      bookingPaymentDetails.payment_intent_id = payment_intent_id;
      bookingPaymentDetails.payment_status = 'succeeded';
    }

    // Create booking
    const booking = await Booking.create([{
      user_id: req.user._id,
      show_id,
      total_amount,
      payment_method: payment_intent_id ? 'stripe' : payment_method,
      payment_details: bookingPaymentDetails,
      status: 'confirmed'
    }], { session });

    // Create booking seats
    const bookingSeats = seat_ids.map(seat_id => ({
      booking_id: booking[0]._id,
      seat_id
    }));

    await BookingSeat.insertMany(bookingSeats, { session });

    await session.commitTransaction();

    // Fetch complete booking details
    const completeBooking = await Booking.findById(booking[0]._id)
      .populate({
        path: 'show_id',
        populate: [
          { path: 'movie_id', select: 'title poster_url' },
          { path: 'theater_id', select: 'name location' },
          { path: 'screen_id', select: 'name' }
        ]
      });

    const seats = await BookingSeat.find({ booking_id: booking[0]._id })
      .populate('seat_id', 'seat_number');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: completeBooking._id,
        user_id: completeBooking.user_id,
        show_id: completeBooking.show_id._id,
        booking_date: completeBooking.booking_date,
        total_amount: completeBooking.total_amount,
        status: completeBooking.status,
        created_at: completeBooking.created_at,
        seats: seats.map(s => ({
          id: s._id,
          seat_id: s.seat_id._id,
          seat_number: s.seat_id.seat_number
        })),
        show: {
          show_date: completeBooking.show_id.show_date,
          show_time: completeBooking.show_id.show_time,
          movie: {
            title: completeBooking.show_id.movie_id.title
          },
          theater: {
            name: completeBooking.show_id.theater_id.name
          }
        }
      }
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get user bookings
// @route   GET /api/v1/bookings/user
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user_id: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate({
        path: 'show_id',
        populate: [
          { path: 'movie_id', select: 'title poster_url' },
          { path: 'theater_id', select: 'name location' },
          { path: 'screen_id', select: 'name' }
        ]
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    // Get booking seats for each booking
    const bookingsWithSeats = await Promise.all(
      bookings.map(async (booking) => {
        const bookingSeats = await BookingSeat.find({ booking_id: booking._id })
          .populate('seat_id', 'seat_number');

        return {
          id: booking._id,
          user_id: booking.user_id,
          show_id: booking.show_id._id,
          booking_date: booking.booking_date,
          total_amount: booking.total_amount,
          status: booking.status,
          created_at: booking.created_at,
          show: {
            show_date: booking.show_id.show_date,
            show_time: booking.show_id.show_time,
            movie: {
              id: booking.show_id.movie_id._id,
              title: booking.show_id.movie_id.title,
              poster_url: booking.show_id.movie_id.poster_url
            },
            theater: {
              name: booking.show_id.theater_id.name,
              location: booking.show_id.theater_id.location
            },
            screen: {
              name: booking.show_id.screen_id.name
            }
          },
          booking_seats: bookingSeats.map(bs => ({
            seat: {
              seat_number: bs.seat_id.seat_number
            }
          }))
        };
      })
    );

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings: bookingsWithSeats,
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

// @desc    Get booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'show_id',
        populate: [
          { path: 'movie_id' },
          { path: 'theater_id' },
          { path: 'screen_id' }
        ]
      });

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404, 'NOT_FOUND'));
    }

    // Check if user owns this booking or is admin
    if (booking.user_id.toString() !== req.user._id.toString() &&
        !['theater_admin', 'super_admin'].includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized to access this booking', 403, 'FORBIDDEN'));
    }

    const bookingSeats = await BookingSeat.find({ booking_id: booking._id })
      .populate('seat_id');

    res.status(200).json({
      success: true,
      data: {
        ...booking.toObject(),
        booking_seats: bookingSeats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404, 'NOT_FOUND'));
    }

    // Check if user owns this booking
    if (booking.user_id.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to cancel this booking', 403, 'FORBIDDEN'));
    }

    if (booking.status === 'cancelled') {
      return next(new ErrorResponse('Booking already cancelled', 400, 'VALIDATION_ERROR'));
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        id: booking._id,
        status: booking.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/v1/bookings
// @access  Private (theater_admin, super_admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { theater_id, status, date_from, date_to, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (date_from || date_to) {
      query.booking_date = {};
      if (date_from) {
        query.booking_date.$gte = new Date(date_from);
      }
      if (date_to) {
        query.booking_date.$lte = new Date(date_to);
      }
    }

    let bookings = await Booking.find(query)
      .populate({
        path: 'show_id',
        populate: [
          { path: 'movie_id' },
          { path: 'theater_id' },
          { path: 'screen_id' }
        ]
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    // Filter by theater if specified
    if (theater_id) {
      bookings = bookings.filter(b => b.show_id.theater_id._id.toString() === theater_id);
    }

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
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
