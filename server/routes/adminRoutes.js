// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  assignPrimaryFa,
  getAllCategories,
  createCategory,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

// User routes
router.get('/users', getAllUsers);
router.put('/users/assign-fa', assignPrimaryFa);

// Category routes
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);

module.exports = router;