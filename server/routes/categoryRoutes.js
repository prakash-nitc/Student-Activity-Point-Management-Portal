const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

// This route allows any logged-in user to get the list of categories
router.route('/').get(protect, getAllCategories);

module.exports = router;