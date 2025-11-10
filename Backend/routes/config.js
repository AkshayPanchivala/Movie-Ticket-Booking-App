const express = require('express');
const router = express.Router();
const { getConfig } = require('../controllers/configController');
const { publicLimiter } = require('../middleware/rateLimiter');

router.get('/', publicLimiter, getConfig);

module.exports = router;
