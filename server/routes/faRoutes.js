const express = require('express');
const router = express.Router();
const {
  getRequestsForFA,
  submitFAReview,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes in this file are for logged-in Faculty Advisors
router.use(protect, authorize('fa'));

router.route('/requests').get(getRequestsForFA);
router.route('/requests/:id/review').put(submitFAReview);

module.exports = router;