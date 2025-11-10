const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// This route will be nested under screens in the main server file
// So the actual path will be /screens/:screenId/seats/bulk

module.exports = router;
