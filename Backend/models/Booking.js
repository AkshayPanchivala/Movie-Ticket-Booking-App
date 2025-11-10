const mongoose = require('mongoose');

const bookingSeatSchema = new mongoose.Schema({
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true
  }
}, { _id: true });

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  show_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: [true, 'Show ID is required']
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  total_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  payment_method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'stripe'],
    required: [true, 'Payment method is required']
  },
  payment_intent_id: {
    type: String,
    default: null
  },
  payment_details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for booking_seats
bookingSchema.virtual('booking_seats', {
  ref: 'BookingSeat',
  localField: '_id',
  foreignField: 'booking_id'
});

// Index for efficient queries
bookingSchema.index({ user_id: 1, status: 1 });
bookingSchema.index({ show_id: 1 });
bookingSchema.index({ booking_date: -1 });

// Separate model for booking seats (many-to-many relationship)
const bookingSeatFullSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  seat_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Ensure a seat can only be booked once per show
bookingSeatFullSchema.index({ booking_id: 1, seat_id: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
const BookingSeat = mongoose.model('BookingSeat', bookingSeatFullSchema);

module.exports = { Booking, BookingSeat };
