const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    farmerName: {
      type: String,
      required: true,
      trim: true
    },
    crop: {
      type: String,
      default: 'General Inspection'
    },
    date: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
