const mongoose = require('mongoose');

const FarmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    farmSize: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    membership: {
      type: String,
      enum: {
        values: ['Basic', 'Premium', 'Enterprise'],
        message: 'Membership must be Basic, Premium, or Enterprise'
      },
      default: 'Basic'
    },
    experience: {
      type: Number,
      default: 0
    },
    primaryCrops: {
      type: [String],
      default: []
    },
    preferredLanguage: {
      type: String,
      default: 'English',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FarmerProfile', FarmerProfileSchema);
