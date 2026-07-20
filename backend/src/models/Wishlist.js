const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    },
    // Fallback metadata in case crop is external or custom dummy
    cropData: {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: String, default: '100 Quintals' },
      farmerName: { type: String, default: 'Farmer' },
      location: { type: String, default: 'India' },
      qualityGrade: { type: String, default: 'A+' },
      isOrganic: { type: Boolean, default: false },
      image: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Wishlist', WishlistSchema);
