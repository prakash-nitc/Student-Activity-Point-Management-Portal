const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // ADDED: To store the category-specific FA override (F4)
  override_fa_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;