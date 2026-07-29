const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  model: {
    type: String,
    default: 'gemini-1.5-flash'
  },
  responseTime: {
    type: Number,
    default: 0
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  isDisliked: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please add a chat title'],
      trim: true,
      default: 'New Conversation'
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    messageCount: {
      type: Number,
      default: 0
    },
    lastMessage: {
      type: String,
      default: ''
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    messages: [MessageSchema]
  },
  {
    timestamps: true
  }
);

// Enable text search indexing for title and message bodies
ChatSessionSchema.index({ title: 'text', 'messages.content': 'text' });

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
