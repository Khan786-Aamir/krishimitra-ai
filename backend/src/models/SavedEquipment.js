const mongoose = require('mongoose');

const SavedEquipmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SavedEquipment', SavedEquipmentSchema);
