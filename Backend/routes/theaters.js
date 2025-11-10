const express = require('express');
const router = express.Router();
const {
  getAllTheaters,
  getTheaterById,
  createTheater,
  updateTheater,
  deleteTheater
} = require('../controllers/theaterController');
const { protect, authorize } = require('../middleware/auth');
const { publicLimiter, adminLimiter } = require('../middleware/rateLimiter');

router.get('/', publicLimiter, getAllTheaters);
router.get('/:id', publicLimiter, getTheaterById);
router.post('/', adminLimiter, protect, authorize('super_admin'), createTheater);
router.put('/:id', adminLimiter, protect, authorize('super_admin'), updateTheater);
router.delete('/:id', adminLimiter, protect, authorize('super_admin'), deleteTheater);

module.exports = router;
