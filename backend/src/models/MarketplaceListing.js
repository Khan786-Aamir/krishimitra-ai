const mongoose = require('mongoose');

const MarketplaceListingSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please add a crop name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Cereals', 'Vegetables', 'Fruits', 'Pulses', 'Oil Seeds', 'Spices', 'Flowers', 'Organic Produce'],
      default: 'Cereals'
    },
    description: {
      type: String,
      required: [true, 'Please add a listing description']
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price']
    },
    unit: {
      type: String,
      required: [true, 'Please specify the unit (e.g. / Quintal, / kg)'],
      default: '/ Quintal'
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Please specify available quantity']
    },
    harvestDate: {
      type: Date,
      required: [true, 'Please specify the harvest date']
    },
    isOrganic: {
      type: Boolean,
      default: false
    },
    isFreshHarvest: {
      type: Boolean,
      default: true
    },
    images: [
      {
        url: { type: String, required: true },
        filename: { type: String, default: '' }
      }
    ],
    location: {
      type: String,
      required: [true, 'Please specify the farm location']
    },
    district: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    minOrder: {
      type: Number,
      default: 1
    },
    storageInfo: {
      type: String,
      default: 'Stored in dry temperature-controlled storage.'
    },
    transportationDetails: {
      type: String,
      default: 'Tractor transport available within a 50km radius.'
    },
    qualityGrade: {
      type: String,
      default: 'A+'
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Hidden'],
      default: 'Pending'
    },
    averageRating: {
      type: Number,
      default: 4.8
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MarketplaceListing', MarketplaceListingSchema);
