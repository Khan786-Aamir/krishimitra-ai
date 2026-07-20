const mongoose = require('mongoose');

const PriceAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cropName: {
      type: String,
      required: true,
      trim: true
    },
    targetPrice: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      enum: ['BELOW', 'ABOVE', 'EQUALS'],
      default: 'BELOW'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'TRIGGERED', 'MUTED'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PriceAlert', PriceAlertSchema);
