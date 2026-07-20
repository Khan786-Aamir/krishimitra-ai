const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema(
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
    area: {
      type: Number,
      required: [true, 'Please specify the area size (in acres/hectares)']
    },
    growthStage: {
      type: String,
      enum: {
        values: ['Germination', 'Vegetative', 'Flowering', 'Harvesting'],
        message: 'Growth stage must be Germination, Vegetative, Flowering, or Harvesting'
      },
      default: 'Germination'
    },
    healthStatus: {
      type: String,
      enum: {
        values: ['Healthy', 'Warning', 'Critical'],
        message: 'Health status must be Healthy, Warning, or Critical'
      },
      default: 'Healthy'
    },
    progress: {
      type: Number,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot exceed 100'],
      default: 0
    },
    image: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Crop', CropSchema);
