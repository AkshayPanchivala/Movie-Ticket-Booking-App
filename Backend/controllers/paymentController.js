const stripe = require('../config/stripe');
const { Booking } = require('../models/Booking');
const Show = require('../models/Show');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create payment intent for booking
// @route   POST /api/v1/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { show_id, seat_ids } = req.body;

    if (!show_id || !seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      return next(new ErrorResponse('show_id and seat_ids are required', 400, 'VALIDATION_ERROR'));
    }

    // Validate show
    const show = await Show.findById(show_id)
      .populate('movie_id', 'title')
      .populate('theater_id', 'name');

    if (!show || !show.is_active) {
      return next(new ErrorResponse('Show not found or inactive', 404, 'NOT_FOUND'));
    }

    // Calculate amount in rupees (ticket price + platform fee)
    const PLATFORM_FEE = parseFloat(process.env.PLATFORM_FEE) || 50;
    const ticketTotal = show.price * seat_ids.length;
    const amountInRupees = ticketTotal + PLATFORM_FEE;

    // Stripe requires amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amountInRupees * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: 'inr',
      metadata: {
        user_id: req.user._id.toString(),
        show_id: show_id,
        seat_ids: JSON.stringify(seat_ids),
        movie_title: show.movie_id.title,
        theater_name: show.theater_id.name,
        show_date: show.show_date.toISOString(),
        show_time: show.show_time,
        number_of_seats: seat_ids.length
      },
      description: `Booking for ${show.movie_id.title} at ${show.theater_id.name}`,
    });

    res.status(200).json({
      success: true,
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: amountInRupees,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    next(new ErrorResponse('Failed to create payment intent', 500, 'PAYMENT_ERROR'));
  }
};

// @desc    Confirm payment and create booking
// @route   POST /api/v1/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res, next) => {
  try {
    const { payment_intent_id } = req.body;

    if (!payment_intent_id) {
      return next(new ErrorResponse('payment_intent_id is required', 400, 'VALIDATION_ERROR'));
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return next(new ErrorResponse('Payment not completed', 400, 'PAYMENT_PENDING'));
    }

    // Extract metadata
    const { user_id, show_id, seat_ids } = paymentIntent.metadata;

    // Verify user
    if (user_id !== req.user._id.toString()) {
      return next(new ErrorResponse('Unauthorized payment confirmation', 403, 'FORBIDDEN'));
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        payment_intent_id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert back to rupees
        show_id,
        seat_ids: JSON.parse(seat_ids)
      }
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    next(new ErrorResponse('Failed to confirm payment', 500, 'PAYMENT_ERROR'));
  }
};

// @desc    Handle Stripe webhooks
// @route   POST /api/v1/payments/webhook
// @access  Public (Stripe only)
exports.handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      // You can update booking status or send notifications here
      // For now, we handle this in the confirmPayment endpoint
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      break;

    default:
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

// @desc    Get payment history for user
// @route   GET /api/v1/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const bookings = await Booking.find({
      user_id: req.user._id,
      status: { $in: ['confirmed', 'completed'] }
    })
      .populate({
        path: 'show_id',
        populate: [
          { path: 'movie_id', select: 'title' },
          { path: 'theater_id', select: 'name' }
        ]
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    const payments = bookings.map(booking => ({
      id: booking._id,
      amount: booking.total_amount,
      payment_method: booking.payment_method,
      status: booking.status,
      booking_date: booking.booking_date,
      created_at: booking.created_at,
      movie_title: booking.show_id?.movie_id?.title,
      theater_name: booking.show_id?.theater_id?.name
    }));

    const count = await Booking.countDocuments({
      user_id: req.user._id,
      status: { $in: ['confirmed', 'completed'] }
    });

    res.status(200).json({
      success: true,
      data: {
        payments,
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

// @desc    Refund payment
// @route   POST /api/v1/payments/refund
// @access  Private
exports.refundPayment = async (req, res, next) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return next(new ErrorResponse('booking_id is required', 400, 'VALIDATION_ERROR'));
    }

    const booking = await Booking.findById(booking_id);

    if (!booking) {
      return next(new ErrorResponse('Booking not found', 404, 'NOT_FOUND'));
    }

    // Check if user owns this booking
    if (booking.user_id.toString() !== req.user._id.toString() &&
        !['theater_admin', 'super_admin'].includes(req.user.role)) {
      return next(new ErrorResponse('Not authorized', 403, 'FORBIDDEN'));
    }

    if (booking.status === 'cancelled') {
      return next(new ErrorResponse('Booking already cancelled', 400, 'VALIDATION_ERROR'));
    }

    // Get payment intent ID from payment_details
    const paymentIntentId = booking.payment_details?.payment_intent_id;

    if (!paymentIntentId) {
      return next(new ErrorResponse('Payment intent not found', 400, 'VALIDATION_ERROR'));
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer'
    });

    // Update booking status
    booking.status = 'cancelled';
    booking.payment_details.refund_id = refund.id;
    booking.payment_details.refund_status = refund.status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund_id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    next(new ErrorResponse('Failed to process refund', 500, 'PAYMENT_ERROR'));
  }
};
