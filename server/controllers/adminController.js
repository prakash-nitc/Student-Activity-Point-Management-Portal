// server/controllers/adminController.js
const asyncHandler = require('express-async-handler');
const Request = require('../models/requestModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');

// --- USER MANAGEMENT ---
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
});

const assignPrimaryFa = asyncHandler(async (req, res) => {
    const { studentId, faId } = req.body;
    const student = await User.findById(studentId);
    if (student && student.role === 'student') {
        student.primary_fa_id = faId || null;
        await student.save();
        res.json({ message: 'FA assigned successfully' });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// --- CATEGORY MANAGEMENT ---
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).populate('override_fa_id', 'name');
    res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, max_points, override_fa_id } = req.body;
    const category = await Category.create({ name, max_points, override_fa_id });
    res.status(201).json(category);
});

module.exports = { getAllUsers, assignPrimaryFa, getAllCategories, createCategory };