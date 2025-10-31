const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  finalizeAdminApproval
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Student routes
router.route('/').post(protect, authorize('student'), upload.single('proof'), createRequest);
router.route('/myrequests').get(protect, authorize('student'), getMyRequests);

// Admin final approval route (F11)
router.route('/:id/status').put(protect, authorize('admin'), finalizeAdminApproval);

module.exports = router;