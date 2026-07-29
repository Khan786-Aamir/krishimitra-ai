const mongoose = require('mongoose');

const EquipmentReviewSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    review: {
      type: String,
      required: [true, 'Please add a review text'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EquipmentReview', EquipmentReviewSchema);
