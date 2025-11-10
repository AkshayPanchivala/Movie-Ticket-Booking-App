const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { authLimiter, adminLimiter } = require('../middleware/rateLimiter');

// User routes
router.post('/', authLimiter, protect, createBooking);
router.get('/user', authLimiter, protect, getUserBookings);
router.get('/:id', authLimiter, protect, getBookingById);
router.put('/:id/cancel', authLimiter, protect, cancelBooking);

// Admin routes
router.get('/', adminLimiter, protect, authorize('theater_admin', 'super_admin'), getAllBookings);

module.exports = router;
