const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getSalesReport
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

router.get('/dashboard', adminLimiter, protect, authorize('theater_admin', 'super_admin'), getDashboardAnalytics);
router.get('/sales', adminLimiter, protect, authorize('theater_admin', 'super_admin'), getSalesReport);

module.exports = router;
