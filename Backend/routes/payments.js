const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Note: Webhook route is registered in server.js before body parser

// Protected routes
router.post('/create-intent', authLimiter, protect, createPaymentIntent);
router.post('/confirm', authLimiter, protect, confirmPayment);
router.get('/history', authLimiter, protect, getPaymentHistory);
router.post('/refund', authLimiter, protect, refundPayment);

module.exports = router;
