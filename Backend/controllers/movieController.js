const Movie = require('../models/Movie');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all movies
// @route   GET /api/v1/movies
// @access  Public
exports.getAllMovies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, genre, search } = req.query;

    const query = { is_active: true };

    // Filter by genre
    if (genre) {
      query.genre = genre;
    }

    // Search by title
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }

    const movies = await Movie.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    const count = await Movie.countDocuments(query);

    // Convert to JSON to apply toJSON transform
    const moviesJSON = movies.map(movie => movie.toJSON());

    res.status(200).json({
      success: true,
      data: {
        movies: moviesJSON,
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

// @desc    Get movie by ID
// @route   GET /api/v1/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
      return next(new ErrorResponse('Invalid movie ID', 400, 'VALIDATION_ERROR'));
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: movie.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create movie
// @route   POST /api/v1/movies
// @access  Private (theater_admin, super_admin)
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/v1/movies/:id
// @access  Private (theater_admin, super_admin)
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/v1/movies/:id
// @access  Private (super_admin)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404, 'NOT_FOUND'));
    }

    // Soft delete
    movie.is_active = false;
    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
