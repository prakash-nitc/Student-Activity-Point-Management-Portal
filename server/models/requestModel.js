// server/models/requestModel.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  points: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'Submitted',
      'More Info Required',
      'FA Approved',
      'Rejected',
      'Admin Finalized'
    ],
    default: 'Submitted',
  },
  proof: { type: String, required: true },
  assignedFAId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;