const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    farmerName: {
      type: String,
      required: true,
      trim: true
    },
    crop: {
      type: String,
      required: true,
      trim: true
    },
    issue: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    image: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
      default: 'Pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Consultation', ConsultationSchema);
