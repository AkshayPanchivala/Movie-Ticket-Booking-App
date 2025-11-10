const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');
const { publicLimiter, authLimiter, adminLimiter } = require('../middleware/rateLimiter');

router.get('/', publicLimiter, getAllMovies);
router.get('/:id', publicLimiter, getMovieById);
router.post('/', adminLimiter, protect, authorize('theater_admin', 'super_admin'), createMovie);
router.put('/:id', adminLimiter, protect, authorize('theater_admin', 'super_admin'), updateMovie);
router.delete('/:id', adminLimiter, protect, authorize('super_admin'), deleteMovie);

module.exports = router;
