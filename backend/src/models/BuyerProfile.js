const mongoose = require('mongoose');

const BuyerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      trim: true,
      default: ''
    },
    businessType: {
      type: String,
      enum: ['Retailer', 'Wholesaler', 'Exporter', 'Food Processor', 'Individual', 'Other'],
      default: 'Wholesaler'
    },
    gstNumber: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' }
    },
    preferredCrops: {
      type: [String],
      default: []
    },
    savedLocations: [
      {
        label: { type: String, default: 'Primary Warehouse' },
        addressString: { type: String, default: '' },
        isDefault: { type: Boolean, default: false }
      }
    ],
    totalPurchasesCount: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BuyerProfile', BuyerProfileSchema);
