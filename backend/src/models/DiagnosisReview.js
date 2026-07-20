const mongoose = require('mongoose');

const DiagnosisReviewSchema = new mongoose.Schema(
  {
    farmerName: {
      type: String,
      required: true,
      trim: true
    },
    cropName: {
      type: String,
      required: true,
      trim: true
    },
    disease: {
      type: String,
      required: true,
      trim: true
    },
    confidence: {
      type: Number,
      required: true,
      default: 92
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Critical'],
      default: 'Moderate'
    },
    symptoms: {
      type: [String],
      default: []
    },
    aiRecommendation: {
      type: String,
      required: true
    },
    expertFeedback: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Modified'],
      default: 'Pending'
    },
    leafImage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DiagnosisReview', DiagnosisReviewSchema);
