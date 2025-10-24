const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');

const createRequest = asyncHandler(async (req, res) => {
  const { title, category, points } = req.body;
  if (!req.file) {
    res.status(400);
    throw new Error('Proof file is required');
  }
  const request = await Request.create({
    studentId: req.user.id,
    title,
    category,
    points,
    proof: req.file.path,
  });
  res.status(201).json(request);
});

const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ studentId: req.user.id }).sort({ createdAt: -1 });
  res.json(requests);
});

// This is the function for the FA dashboard
const getRequestsForFA = asyncHandler(async (req, res) => {
  // --- START OF DEBUG CODE ---
  console.log('--- FA DASHBOARD DEBUG ---');
  console.log('Logged-in FA User ID:', req.user.id);

  const query = { assignedFAId: req.user.id, status: 'Under Review' };
  console.log('Database Query:', query);
  // --- END OF DEBUG CODE ---

  const requests = await Request.find(query)
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });
  
  // --- MORE DEBUG CODE ---
  console.log('Requests Found:', requests.length);
  console.log('--------------------------');
  // --- END OF DEBUG CODE ---
  
  res.json(requests);
});

const submitFAReview = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const request = await Request.findById(req.params.id);

  if (request && request.assignedFAId.toString() === req.user.id.toString()) {
    request.status = 'Pending Final Approval';
    request.comments.push({
        user: req.user.id,
        userName: req.user.name,
        role: req.user.role,
        text: comment,
    });
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error('Request not found or you are not authorized');
  }
});

const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status, comment } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    const isAdmin = req.user.role === 'admin';

    if (!isAdmin) {
        res.status(403);
        throw new Error('User not authorized to perform this action');
    }
    
    if ((status === 'Approved' || status === 'Rejected') && !isAdmin) {
        res.status(403);
        throw new Error('Only an Admin can perform the final approval or rejection.');
    }

    request.status = status;
    if (comment) {
        request.comments.push({ 
            user: req.user.id,
            userName: req.user.name,
            role: req.user.role,
            text: comment 
        });
    }

    const updatedRequest = await request.save();
    res.json(updatedRequest);
});

module.exports = {
  createRequest,
  getMyRequests,
  getRequestsForFA,
  submitFAReview,
  updateRequestStatus,
};