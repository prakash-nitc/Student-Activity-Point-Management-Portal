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

  const request = await Request.create({
    studentId: req.user.id,
    title,
    category,
    points: Number(points), // --- FIX: Ensure points are saved as a Number
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

        if (categoryIndex > -1) {
             // --- FIX: Ensure points are added as a Number
            student.pointsData[categoryIndex].points += Number(request.points);
        } else {
            student.pointsData.push({ category: request.category, points: Number(request.points) });
        }
        await student.save();
    }
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