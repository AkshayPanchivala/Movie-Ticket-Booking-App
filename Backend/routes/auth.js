const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { publicLimiter, authLimiter } = require('../middleware/rateLimiter');

router.post('/register', publicLimiter, register);
router.post('/login', publicLimiter, login);
router.post('/logout', authLimiter, protect, logout);
router.get('/profile', authLimiter, protect, getProfile);

module.exports = router;
