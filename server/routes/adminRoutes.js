const express = require('express');
const router = express.Router();
const {
  getUnassignedRequests,
  assignFaToRequest,
  getAllUsers,
  getFinalApprovalQueue
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes in this file are protected and for admins only
router.use(protect, authorize('admin'));

router.get('/requests/unassigned', getUnassignedRequests);
router.get('/requests/final-queue', getFinalApprovalQueue);
router.put('/requests/:id/assign-fa', assignFaToRequest);
router.get('/users', getAllUsers);

module.exports = router;