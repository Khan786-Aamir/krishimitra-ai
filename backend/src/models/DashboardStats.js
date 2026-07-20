const mongoose = require('mongoose');

const DashboardStatsSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    totalCrops: {
      type: Number,
      default: 0
    },
    healthyCrops: {
      type: Number,
      default: 0
    },
    aiDiagnoses: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    activeRentals: {
      type: Number,
      default: 0
    },
    marketplaceOrders: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DashboardStats', DashboardStatsSchema);
