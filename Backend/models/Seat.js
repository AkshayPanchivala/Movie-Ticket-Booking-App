const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  screen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: [true, 'Screen ID is required']
  },
  row: {
    type: String,
    required: [true, 'Row is required'],
    trim: true
  },
  column: {
    type: Number,
    required: [true, 'Column is required'],
    min: [1, 'Column must be at least 1']
  },
  seat_number: {
    type: String,
    required: [true, 'Seat number is required'],
    trim: true
  },
  seat_type: {
    type: String,
    enum: ['regular', 'premium', 'vip'],
    default: 'regular'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
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

// Compound index to ensure unique seat per screen
seatSchema.index({ screen_id: 1, seat_number: 1 }, { unique: true });
seatSchema.index({ screen_id: 1 });

module.exports = mongoose.model('Seat', seatSchema);
