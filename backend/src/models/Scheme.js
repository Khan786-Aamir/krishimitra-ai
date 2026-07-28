const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a scheme title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a scheme description'],
      trim: true
    },
    type: {
      type: String,
      default: ''
    },
    benefit: {
      type: String,
      default: ''
    },
    eligibility: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Subsidy', 'Insurance', 'Equipment', 'Finance', 'Advisory', 'Other'],
      default: 'Subsidy'
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Expired'],
      default: 'Active'
    },
    expiryDate: {
      type: Date
    },
    detailsLink: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Scheme', SchemeSchema);
