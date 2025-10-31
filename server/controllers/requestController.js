const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');

// @desc    Create a new activity request (Implements F5)
const createRequest = asyncHandler(async (req, res) => {
  const { title, category, points } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Proof file is required');
  }

  // 1. Get the student document
  const student = await User.findById(req.user.id);

  // 2. Find the category document
  const activityCategory = await Category.findOne({ name: category });
  if (!activityCategory) {
    res.status(400);
    throw new Error('Selected category does not exist.');
  }

  // 3. Determine the correct FA (F5: Automatic Routing)
  let assignedFAId = null;
  if (activityCategory.override_fa_id) {
    // A. Check for category-specific FA
    assignedFAId = activityCategory.override_fa_id;
  } else if (student.primary_fa_id) {
    // B. Fallback to student's primary FA
    assignedFAId = student.primary_fa_id;
  }

  // 4. If no FA can be assigned, fail the request
  if (!assignedFAId) {
    res.status(400);
    throw new Error('This request cannot be submitted. No Faculty Advisor is assigned to your account or to this category. Please contact an admin.');
  }

  // 5. Create the request
  const request = await Request.create({
    studentId: req.user.id,
    title,
    category,
    points,
    proof: req.file.path,
    assignedFAId: assignedFAId,
    status: 'Submitted', // Default status
  });

  res.status(201).json(request);
});

// @desc    Get requests for the logged-in student
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ studentId: req.user.id })
    .populate('assignedFAId', 'name')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    Get pending requests for an FA (F6)
const getRequestsForFA = asyncHandler(async (req, res) => {
  const requests = await Request.find({
    assignedFAId: req.user.id,
    status: 'Submitted' // FA only sees new submissions
  })
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    FA updates a request's status (F6)
const updateFAStatus = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  
  // Security check: Is this FA assigned to this request?
  if (request.assignedFAId.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this request');
  }
  
  // FAs can only set these specific statuses
  const allowedStatuses = ['FA Approved', 'Rejected', 'More Info Required'];
  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status update');
  }

  request.status = status;
  if (comment) {
    request.comments.push({
      user: req.user.id,
      userName: req.user.name,
      role: req.user.role,
      text: comment,
    });
  }

  const updatedRequest = await request.save();
  res.json(updatedRequest);
});

// @desc    FA performs bulk approval (F7)
const bulkApproveRequests = asyncHandler(async (req, res) => {
    const { requestIds } = req.body;
    
    await Request.updateMany(
      { 
        _id: { $in: requestIds },
        assignedFAId: req.user.id, // Security check
        status: 'Submitted' 
      },
      { 
        $set: { status: 'FA Approved' }
      }
    );
    
    res.json({ message: 'Requests approved successfully' });
});

// @desc    Admin finalizes a request (F11)
const finalizeAdminApproval = asyncHandler(async (req, res) => {
  const { status, comment } = req.body;
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Only admins can do this
  if (req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  // Admin can only finalize requests approved by an FA
  if (request.status !== 'FA Approved') {
    res.status(400);
    throw new Error('Request must be approved by an FA first');
  }

  // Admin final decision
  const allowedStatuses = ['Admin Finalized', 'Rejected'];
  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid final status');
  }

  request.status = status;
  if (comment) {
    request.comments.push({
      user: req.user.id,
      userName: req.user.name,
      role: req.user.role,
      text: comment,
    });
  }
  
  // F12: Update student points (this is where you would add logic)
  if (status === 'Admin Finalized') {
    // E.g., find student, add request.points to their total
    // const student = await User.findById(request.studentId);
    // student.totalPoints += request.points;
    // await student.save();
  }

  const updatedRequest = await request.save();
  res.json(updatedRequest);
});


module.exports = {
  createRequest,
  getMyRequests,
  getRequestsForFA,
  updateFAStatus,
  bulkApproveRequests,
  finalizeAdminApproval
};