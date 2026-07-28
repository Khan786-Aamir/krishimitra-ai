const mongoose = require('mongoose');

const AdminProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    department: {
      type: String,
      default: 'Ecosystem Operations'
    },
    role: {
      type: String,
      default: 'Super Admin'
    },
    bio: {
      type: String,
      default: ''
    },
    permissions: {
      type: [String],
      default: ['All Access']
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now
    },
    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AdminProfile', AdminProfileSchema);
