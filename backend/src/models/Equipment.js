const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    equipmentName: {
      type: String,
      required: [true, 'Please add the equipment name'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Tractors',
        'Harvesters',
        'Tillers & Cultivators',
        'Seeders & Planters',
        'Irrigation Equipment',
        'Sprayers',
        'Hand Tools',
        'Other'
      ],
      default: 'Other'
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    images: [
      {
        url: { type: String, required: true },
        filename: { type: String, default: '' }
      }
    ],
    rentalPricePerDay: {
      type: Number,
      required: [true, 'Please specify the rental price per day']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Please specify the security deposit amount']
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Booked', 'Maintenance', 'Unavailable'],
      default: 'Available'
    },
    location: {
      type: String,
      required: [true, 'Please specify the pick-up location']
    },
    district: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    contactNumber: {
      type: String,
      required: [true, 'Please add a contact phone number']
    },
    condition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Needs Repair'],
      default: 'Good'
    },
    brand: {
      type: String,
      default: ''
    },
    model: {
      type: String,
      default: ''
    },
    yearOfPurchase: {
      type: Number
    },
    workingHours: {
      type: Number,
      default: 0
    },
    fuelType: {
      type: String,
      enum: ['Diesel', 'Petrol', 'Electric', 'CNG', 'Manual', 'None'],
      default: 'None'
    },
    attachments: [
      {
        type: String
      }
    ],
    rating: {
      type: Number,
      default: 5.0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    bookingCount: {
      type: Number,
      default: 0
    },
    minRentalDays: {
      type: Number,
      default: 1
    },
    maxRentalDays: {
      type: Number,
      default: 30
    },
    isReported: {
      type: Boolean,
      default: false
    },
    reportedReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Equipment', EquipmentSchema);
