const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');
const User = require('../models/userModel');

// @desc    Get all requests that have no assigned FA
const getUnassignedRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ status: 'Pending Assignment' })
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// @desc    Assign an FA to a request
const assignFaToRequest = asyncHandler(async (req, res) => {
  const { faId } = req.body;
  const request = await Request.findById(req.params.id);

  if (request && faId) {
    request.assignedFAId = faId;
    request.status = 'Under Review'; // Update status so it appears on the FA's dashboard
    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } else {
    res.status(404);
    throw new Error('Request or Faculty Advisor not found');
  }
});

// @desc    Get all users (used by admin to find FAs)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc Get requests pending final admin approval
const getFinalApprovalQueue = asyncHandler(async (req, res) => {
    const requests = await Request.find({ status: 'Pending Final Approval' })
        .populate('studentId', 'name email')
        .populate('assignedFAId', 'name')
        .sort({ createdAt: -1 });
    res.json(requests);
});


module.exports = { 
    getUnassignedRequests, 
    assignFaToRequest, 
    getAllUsers,
    getFinalApprovalQueue 
};