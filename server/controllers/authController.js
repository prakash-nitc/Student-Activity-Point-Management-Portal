const User = require('../models/userModel');
// These lines are now corrected to properly import the packages
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Basic domain + role validation specific to NITC
  const emailLower = String(email || '').toLowerCase();
  const domainOk = emailLower.endsWith('@nitc.ac.in');
  if (!domainOk) {
    res.status(400);
    throw new Error('Registration is restricted to @nitc.ac.in emails.');
  }

  // Identify student-pattern emails: e.g., name_b12345..., name_m12345...
  const localPart = emailLower.split('@')[0];
  const looksStudent = /[._-][bm]\d/.test(localPart);
  if (looksStudent && role !== 'student') {
    res.status(400);
    throw new Error('This appears to be a student email. You cannot register as faculty or admin.');
  }

  // Pass the plain-text password to the model; the pre-save hook will hash it
  const user = await User.create({ name, email, password, role });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

module.exports = { registerUser, loginUser };
