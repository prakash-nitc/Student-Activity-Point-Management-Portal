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

  const student = await User.findById(req.user.id);
  const activityCategory = await Category.findOne({ name: category });
  if (!activityCategory) {
    res.status(400);
    throw new Error('Selected category does not exist.');
  }

  let assignedFAId = null;
  if (activityCategory.override_fa_id) {
    assignedFAId = activityCategory.override_fa_id;
  } else if (student.primary_fa_id) {
    assignedFAId = student.primary_fa_id;
  }

  if (!assignedFAId) {
    res.status(400);
    throw new Error('This request cannot be submitted. No Faculty Advisor is assigned. Please contact an admin.');
  }

  // Enforce per-category cap of 10 points per student (includes pending + finalized, excludes rejected)
  const requestedPoints = Number(points);
  if (Number.isNaN(requestedPoints) || requestedPoints <= 0) {
    res.status(400);
    throw new Error('Points must be a positive number.');
  }

  const existing = await Request.aggregate([
    { $match: { studentId: student._id, category, status: { $nin: ['Rejected'] } } },
    { $group: { _id: null, total: { $sum: '$points' } } },
  ]);
  const alreadyClaimed = existing[0]?.total || 0;
  const cap = 10;
  if (alreadyClaimed + requestedPoints > cap) {
    const remaining = Math.max(cap - alreadyClaimed, 0);
    res.status(400);
    throw new Error(`You can claim at most ${cap} points in "${category}". Remaining: ${remaining}.`);
  }

  const request = await Request.create({
    studentId: req.user.id,
    title,
    category,
    points: requestedPoints, // Ensure points are a Number
    proof: req.file.path,
    assignedFAId: assignedFAId,
    status: 'Submitted',
  });

  res.status(201).json(request);
});

// ... (getMyRequests and getRequestsForFA functions remain the same) ...
const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ studentId: req.user.id })
    .populate('assignedFAId', 'name')
    .sort({ createdAt: -1 });
  res.json(requests);
});

const getRequestsForFA = asyncHandler(async (req, res) => {
  const requests = await Request.find({
    assignedFAId: req.user.id,
    status: 'Submitted'
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
  
  if (request.assignedFAId.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this request');
  }
  
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
        assignedFAId: req.user.id, 
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

  if (req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  if (request.status !== 'FA Approved') {
    res.status(400);
    throw new Error('This request must be approved by an FA first.');
  }

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
  
  if (status === 'Admin Finalized') {
    const student = await User.findById(request.studentId);
    if (student) {
        
        if (!student.pointsData) {
            student.pointsData = [];
        }

        const categoryIndex = student.pointsData.findIndex(
            p => p.category === request.category
        );

        // Enforce cap=10 at finalization time too
        const cap = 10;
        const current = categoryIndex > -1 ? Number(student.pointsData[categoryIndex].points || 0) : 0;
        const addition = Number(request.points) || 0;
        if (current >= cap) {
          res.status(400);
          throw new Error(`Category "${request.category}" already has the maximum ${cap} points.`);
        }
        if (current + addition > cap) {
          res.status(400);
          throw new Error(`Finalizing this request would exceed the ${cap}-point limit for "${request.category}". Current: ${current}, Request: ${addition}.`);
        }

        if (categoryIndex > -1) {
          student.pointsData[categoryIndex].points = current + addition;
        } else {
          student.pointsData.push({ category: request.category, points: addition });
        }
        await student.save();
    }
  }

  const updatedRequest = await request.save();
  res.json(updatedRequest);
});

// @desc    Student resubmits with new proof after 'More Info Required'
// @route   PUT /api/requests/:id/resubmit
// @access  Private (student)
const resubmitRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  if (request.studentId.toString() !== req.user.id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this request');
  }
  if (request.status !== 'More Info Required') {
    res.status(400);
    throw new Error('Only requests marked "More Info Required" can be resubmitted.');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please re-upload the proof file to resubmit.');
  }

  const newPoints = req.body.points !== undefined ? Number(req.body.points) : Number(request.points);
  if (Number.isNaN(newPoints) || newPoints <= 0) {
    res.status(400);
    throw new Error('Points must be a positive number.');
  }

  const existing = await Request.aggregate([
    { $match: { studentId: request.studentId, category: request.category, status: { $nin: ['Rejected'] }, _id: { $ne: request._id } } },
    { $group: { _id: null, total: { $sum: '$points' } } },
  ]);
  const alreadyClaimed = existing[0]?.total || 0;
  const cap = 10;
  if (alreadyClaimed + newPoints > cap) {
    const remaining = Math.max(cap - alreadyClaimed, 0);
    res.status(400);
    throw new Error(`You can claim at most ${cap} points in "${request.category}". Remaining: ${remaining}.`);
  }

  request.points = newPoints;
  request.proof = req.file.path;
  request.status = 'Submitted';
  request.comments.push({
    user: req.user.id,
    userName: req.user.name,
    role: 'student',
    text: 'Student resubmitted with new proof',
  });

  const updated = await request.save();
  res.json(updated);
});


module.exports = {
  createRequest,
  getMyRequests,
  getRequestsForFA,
  updateFAStatus,
  bulkApproveRequests,
  finalizeAdminApproval,
  resubmitRequest,
};
