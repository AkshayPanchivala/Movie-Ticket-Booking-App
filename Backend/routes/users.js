const express = require('express');
const router = express.Router();
const {
  createUserByAdmin,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

router.post('/', adminLimiter, protect, authorize('super_admin'), createUserByAdmin);
router.get('/', adminLimiter, protect, authorize('super_admin'), getAllUsers);
router.put('/:id/role', adminLimiter, protect, authorize('super_admin'), updateUserRole);
router.put('/:id/deactivate', adminLimiter, protect, authorize('super_admin'), deactivateUser);
router.put('/:id/activate', adminLimiter, protect, authorize('super_admin'), activateUser);

module.exports = router;
