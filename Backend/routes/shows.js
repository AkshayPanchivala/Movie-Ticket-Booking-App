const express = require('express');
const router = express.Router();
const {
  getAllShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
  getAvailableSeats
} = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');
const { publicLimiter, authLimiter, adminLimiter } = require('../middleware/rateLimiter');

// Note: More specific routes must come before general /:id route
router.get('/:showId/seats', publicLimiter, getAvailableSeats);
router.get('/', publicLimiter, getAllShows);
router.post('/', adminLimiter, protect, authorize('theater_admin', 'super_admin'), createShow);
router.get('/:id', publicLimiter, getShowById);
router.put('/:id', adminLimiter, protect, authorize('theater_admin', 'super_admin'), updateShow);
router.delete('/:id', adminLimiter, protect, authorize('theater_admin', 'super_admin'), deleteShow);

module.exports = router;
