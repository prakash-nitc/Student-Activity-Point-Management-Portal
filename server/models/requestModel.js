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
      'Pending Assignment',      // Waiting for Admin to assign an FA
      'Under Review',            // Assigned to an FA, waiting for their comments
      'Pending Final Approval',  // FA has commented, waiting for Admin's final decision
      'Approved',                // Final status
      'Rejected',                // Final status
    ],
    default: 'Pending Assignment',
  },
  proof: { type: String, required: true },
  assignedFAId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    role: { type: String },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;