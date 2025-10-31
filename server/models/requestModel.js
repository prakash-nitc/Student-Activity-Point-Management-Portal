const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      'Submitted',            // New request, waiting for FA
      'FA Approved',          // FA approved, waiting for Admin
      'Admin Finalized',      // Admin approved, complete
      'Rejected',             // Rejected by FA or Admin
      'More Info Required',   // Sent back to student by FA
    ],
    default: 'Submitted', // Default status is now Submitted
  },
  proof: {
    type: String,
    required: true
  },
  assignedFAId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Now required, as it's set on creation
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: {
      type: String
    },
    role: {
      type: String
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;