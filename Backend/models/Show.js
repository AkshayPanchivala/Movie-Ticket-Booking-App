const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie ID is required']
  },
  screen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: [true, 'Screen ID is required']
  },
  theater_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Theater ID is required']
  },
  show_date: {
    type: Date,
    required: [true, 'Show date is required']
  },
  show_time: {
    type: String,
    required: [true, 'Show time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
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

// Compound index to prevent double booking
showSchema.index({ screen_id: 1, show_date: 1, show_time: 1 }, { unique: true });
showSchema.index({ movie_id: 1, show_date: 1 });
showSchema.index({ theater_id: 1, show_date: 1 });

module.exports = mongoose.model('Show', showSchema);
