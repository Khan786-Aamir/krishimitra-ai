const mongoose = require('mongoose');

const ExpertProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true
    },
    institute: {
      type: String,
      required: [true, 'Institute/University is required'],
      trim: true
    },
    experienceYears: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0
    },
    specializations: {
      type: [String],
      default: []
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi']
    },
    consultationFee: {
      type: Number,
      default: 500
    },
    workingHours: {
      type: String,
      default: '09:00 AM - 05:00 PM (Mon - Sat)'
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    bio: {
      type: String,
      trim: true,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.9
    },
    totalConsultations: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ExpertProfile', ExpertProfileSchema);
