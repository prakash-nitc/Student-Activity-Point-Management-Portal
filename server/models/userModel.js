const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Changed back to 'password' for clarity
  role: {
    type: String,
    enum: ['student', 'fa', 'admin'],
    default: 'student',
  },
  primary_fa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// This hook now correctly watches the 'password' field
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This method now correctly compares against the 'password' field
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;