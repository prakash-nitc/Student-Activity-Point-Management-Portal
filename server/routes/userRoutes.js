const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// This route is protected, only logged-in users can access it
router.route('/profile').get(protect, getUserProfile);

module.exports = router;