const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');

// @desc    Get all users (students and FAs)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Assign a primary FA to a student (F3)
const assignPrimaryFA = asyncHandler(async (req, res) => {
  const { studentId, faId } = req.body;
  const student = await User.findById(studentId);

  if (student && student.role === 'student') {
    student.primary_fa_id = faId;
    await student.save();
    res.json({ message: 'Primary FA assigned successfully' });
  } else {
    res.status(404);
    throw new Error('Student not found');
  }
});

// @desc    Create a new category (F4)
const createCategory = asyncHandler(async (req, res) => {
  const { name, override_fa_id } = req.body;
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }
  const category = await Category.create({
    name,
    override_fa_id: override_fa_id || null
  });
  res.status(201).json(category);
});

// @desc    Update a category's assigned FA (F4)
const updateCategoryFA = asyncHandler(async (req, res) => {
  const { faId } = req.body;
  const category = await Category.findById(req.params.id);

  if (category) {
    category.override_fa_id = faId || null;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Get all categories for admin management
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate('override_fa_id', 'name');
  res.json(categories);
});

// @desc    Get requests pending final admin approval (F11)
const getFinalApprovalQueue = asyncHandler(async (req, res) => {
  const requests = await Request.find({ status: 'FA Approved' })
    .populate('studentId', 'name email')
    .populate('assignedFAId', 'name')
    .sort({ createdAt: -1 });
  res.json(requests);
});

module.exports = {
  getAllUsers,
  assignPrimaryFA,
  createCategory,
  updateCategoryFA,
  getCategories,
  getFinalApprovalQueue,
};