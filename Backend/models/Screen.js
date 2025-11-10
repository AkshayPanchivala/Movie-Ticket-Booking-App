const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  theater_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Theater ID is required']
  },
  name: {
    type: String,
    required: [true, 'Screen name is required'],
    trim: true
  },
  total_seats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Must have at least 1 seat']
  },
  rows: {
    type: Number,
    required: [true, 'Number of rows is required'],
    min: [1, 'Must have at least 1 row']
  },
  columns: {
    type: Number,
    required: [true, 'Number of columns is required'],
    min: [1, 'Must have at least 1 column']
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

// Index for efficient queries
screenSchema.index({ theater_id: 1 });

module.exports = mongoose.model('Screen', screenSchema);
