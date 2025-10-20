const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes for students to create and view their own requests
router.route('/').post(protect, upload.single('proof'), createRequest);
router.route('/myrequests').get(protect, getMyRequests);

// Route for admins/FAs to update a request's status
router.route('/:id/status').put(protect, updateRequestStatus);

module.exports = router;