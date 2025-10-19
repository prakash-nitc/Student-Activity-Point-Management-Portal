// server/models/categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  max_points: { type: Number },
  override_fa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;