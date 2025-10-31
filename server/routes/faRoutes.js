const express = require('express');
const router = express.Router();
const {
  getRequestsForFA,
  updateFAStatus,
  bulkApproveRequests,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes in this file are for logged-in Faculty Advisors
router.use(protect, authorize('fa'));

router.route('/requests').get(getRequestsForFA); // Get pending requests (F6)
router.route('/requests/bulk-approve').post(bulkApproveRequests); // Bulk approve (F7)
router.route('/requests/:id/status').put(updateFAStatus); // Single approve/reject (F6)

module.exports = router;