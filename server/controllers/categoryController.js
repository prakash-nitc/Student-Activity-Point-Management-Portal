const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

/**
 * @desc    Fetch all categories
 * @route   GET /api/categories
 * @access  Private (any logged-in user)
 */
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

module.exports = { getAllCategories };