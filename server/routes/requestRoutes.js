const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getPendingRequestsForFA,
  getFinalApprovalQueue,
  updateRequestStatus,
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, authorize('student'), upload.single('proof'), createRequest);
router.get('/myrequests', protect, authorize('student'), getMyRequests);
router.get('/pending/fa', protect, authorize('fa'), getPendingRequestsForFA);
router.get('/pending/admin', protect, authorize('admin'), getFinalApprovalQueue);
router.put('/:id/status', protect, authorize('fa', 'admin'), updateRequestStatus);

module.exports = router;