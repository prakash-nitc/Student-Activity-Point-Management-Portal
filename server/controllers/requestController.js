const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');

/**
 * @desc    Create a new activity request
 * @route   POST /api/requests
 * @access  Private (Students only)
 */
const createRequest = asyncHandler(async (req, res) => {
  const { title, category, points } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Proof file is required');
  }

  // 1. Get the logged-in student's document to find their primary FA
  const student = await User.findById(req.user.id);
  let assignedFAId = student.primary_fa_id;

  // 2. Check for a category-specific FA override (Implements F4)
  const activityCategory = await Category.findOne({ name: category });
  if (activityCategory && activityCategory.override_fa_id) {
    assignedFAId = activityCategory.override_fa_id;
  }

  // 3. If no override FA exists and the student has no primary FA, reject submission (Implements F3)
  if (!assignedFAId) {
    res.status(400);
    throw new Error('You do not have an assigned Faculty Advisor. Please contact an admin.');
  }

  // 4. Create the request with the correctly determined FA (Implements F5)
  const request = await Request.create({
    studentId: req.user.id,
    title,
    category,
    points,
    proof: req.file.path,
    assignedFAId: assignedFAId,
  });

  res.status(201).json(request);
});

/**
 * @desc    Get requests for the logged-in student
 * @route   GET /api/requests/myrequests
 * @access  Private (Students only)
 */
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ studentId: req.user.id }).sort({ createdAt: -1 });
  res.json(requests);
});

/**
 * @desc    Get pending requests for a Faculty Advisor
 * @route   GET /api/requests/pending/fa
 * @access  Private (FAs only)
 */
const getPendingRequestsForFA = asyncHandler(async (req, res) => {
  const requests = await Request.find({ assignedFAId: req.user.id, status: 'Submitted' })
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });
  res.json(requests);
});

/**
 * @desc    Get FA-approved requests for an Admin's final approval queue
 * @route   GET /api/requests/pending/admin
 * @access  Private (Admins only)
 */
const getFinalApprovalQueue = asyncHandler(async (req, res) => {
  const requests = await Request.find({ status: 'FA Approved' })
    .populate('studentId', 'name email')
    .populate('assignedFAId', 'name')
    .sort({ createdAt: -1 });
  res.json(requests);
});

/**
 * @desc    Update the status of a request
 * @route   PUT /api/requests/:id/status
 * @access  Private (FAs and Admins)
 */
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Authorization check: User must be an Admin or the specifically assigned FA
  const isAssignedFA = req.user.role === 'fa' && request.assignedFAId.toString() === req.user.id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isAssignedFA && !isAdmin) {
    res.status(403);
    throw new Error('User not authorized to perform this action');
  }

  request.status = status;
  if (comment) {
    request.comments.push({ user: req.user.id, text: comment });
  }

  const updatedRequest = await request.save();
  res.json(updatedRequest);
});

module.exports = {
  createRequest,
  getMyRequests,
  getPendingRequestsForFA,
  getFinalApprovalQueue,
  updateRequestStatus,
};