const mongoose = require('mongoose');

const BuyerInquirySchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceListing',
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyerName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    requiredQuantity: {
      type: Number,
      required: true
    },
    expectedPrice: {
      type: Number,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    inquiryType: {
      type: String,
      enum: ['Bulk Purchase', 'Regular Purchase', 'Urgent Requirement'],
      default: 'Regular Purchase'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BuyerInquiry', BuyerInquirySchema);
