const mongoose = require('mongoose');

const AIBookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    chatSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatSession',
      index: true
    },
    prompt: {
      type: String,
      required: [true, 'Please add the user prompt text']
    },
    response: {
      type: String,
      required: [true, 'Please add the AI response text']
    },
    tags: {
      type: [String],
      default: []
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Search index mapping
AIBookmarkSchema.index({ prompt: 'text', response: 'text', tags: 'text' });

module.exports = mongoose.model('AIBookmark', AIBookmarkSchema);
