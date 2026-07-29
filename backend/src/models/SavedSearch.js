const mongoose = require('mongoose');

const SavedSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    searchName: {
      type: String,
      required: [true, 'Please add a search name'],
      trim: true
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SavedSearch', SavedSearchSchema);
