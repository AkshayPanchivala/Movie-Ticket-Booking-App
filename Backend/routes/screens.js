const express = require('express');
const router = express.Router();
const {
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen
} = require('../controllers/screenController');
const { protect, authorize } = require('../middleware/auth');
const { publicLimiter, adminLimiter } = require('../middleware/rateLimiter');

router.get('/:id', publicLimiter, getScreenById);
router.post('/', adminLimiter, protect, authorize('theater_admin', 'super_admin'), createScreen);
router.put('/:id', adminLimiter, protect, authorize('theater_admin', 'super_admin'), updateScreen);
router.delete('/:id', adminLimiter, protect, authorize('theater_admin', 'super_admin'), deleteScreen);

module.exports = router;
