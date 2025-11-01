const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  assignPrimaryFA,
  createCategory,
  updateCategoryFA,
  getCategories,
  getFinalApprovalQueue,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes in this file are for admins only
router.use(protect, authorize('admin'));

// User Management Routes (F3)
router.route('/users').get(getAllUsers);
router.route('/users/assign-fa').put(assignPrimaryFA);

// Category Management Routes (F4)
router.route('/categories').get(getCategories).post(createCategory);
router.route('/categories/:id').put(updateCategoryFA);

// Approval Queue Route (F11)
router.route('/requests/final-queue').get(getFinalApprovalQueue);

module.exports = router;
