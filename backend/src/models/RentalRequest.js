const mongoose = require('mongoose');

const RentalRequestSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startDate: {
      type: Date,
      required: [true, 'Please add the start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please add the end date']
    },
    numberOfDays: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    securityDeposit: {
      type: Number,
      required: true
    },
    purpose: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },
    ownerNotes: {
      type: String,
      default: ''
    },
    renterNotes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled', 'Expired'],
      default: 'Pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    approvedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RentalRequest', RentalRequestSchema);
