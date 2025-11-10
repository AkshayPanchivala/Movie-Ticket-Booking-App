const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theater name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  total_screens: {
    type: Number,
    required: [true, 'Total screens is required'],
    min: [1, 'Must have at least 1 screen']
  },
  facilities: {
    type: [String],
    default: []
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
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Virtual populate screens
theaterSchema.virtual('screens', {
  ref: 'Screen',
  localField: '_id',
  foreignField: 'theater_id'
});

// Index for searching
theaterSchema.index({ city: 1 });
theaterSchema.index({ name: 'text', location: 'text' });

module.exports = mongoose.model('Theater', theaterSchema);
