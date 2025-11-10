const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Movie description is required']
  },
  poster_url: {
    type: String,
    required: [true, 'Poster URL is required']
  },
  trailer_url: {
    type: String
  },
  director: {
    type: String,
    required: [true, 'Director name is required']
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required']
  },
  language: {
    type: String,
    required: [true, 'Language is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  movie_cast: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  runtime: {
    type: Number,
    required: [true, 'Runtime is required']
  },
  release_date: {
    type: Date,
    required: [true, 'Release date is required']
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

// Index for searching with language-neutral text index
movieSchema.index({ title: 'text', director: 'text' }, { default_language: 'none' });
movieSchema.index({ genre: 1 });
movieSchema.index({ release_date: -1 });

module.exports = mongoose.model('Movie', movieSchema);
