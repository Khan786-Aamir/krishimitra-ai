const { v4: uuidv4 } = require('uuid');
const ChatSession = require('../models/ChatSession');
const AIBookmark = require('../models/AIBookmark');
const aiProvider = require('../services/aiProvider');
const promptTemplates = require('../utils/promptTemplates');

/**
 * Clean user prompts to avoid HTML tags.
 */
const sanitizePrompt = (text) => {
  if (!text) return '';
  // Strip any HTML tags using regex
  return text.replace(/<[^>]*>/g, '').trim();
};

/**
 * Detect spam or repeating characters.
 */
const detectSpam = (text) => {
  if (!text) return false;
  // If user inputs same character repeating more than 15 times
  const repeatRegex = /(.)\1{14,}/;
  return repeatRegex.test(text);
};

/**
 * Controller methods for AI Assistant actions.
 */
const aiController = {
  // 1. Send Chat Message & Get AI Response
  chat: async (req, res) => {
    try {
      const { message, sessionId, persona = 'general', language = 'en' } = req.body;
      const userId = req.user.id;

      // Sanitization
      const cleanMessage = sanitizePrompt(message);
      if (!cleanMessage || cleanMessage.trim() === '') {
        return res.status(400).json({ success: false, message: 'Message prompt cannot be empty.' });
      }

      // Length Check
      if (cleanMessage.length > 2000) {
        return res.status(400).json({ success: false, message: 'Message prompt exceeds the maximum limit of 2000 characters.' });
      }

      // Spam Check
      if (detectSpam(cleanMessage)) {
        return res.status(400).json({ success: false, message: 'Suspicious input detected. Please do not enter repeating characters.' });
      }

      // Daily Rate Limit Checks (Limit: 100 queries since midnight local time)
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const sessionsToday = await ChatSession.find({
        user: userId,
        updatedAt: { $gte: startOfToday }
      });

      let totalMessagesToday = 0;
      sessionsToday.forEach(session => {
        totalMessagesToday += session.messages.filter(
          m => m.role === 'user' && m.timestamp >= startOfToday
        ).length;
      });

      if (totalMessagesToday >= 100) {
        return res.status(429).json({
          success: false,
          message: 'Daily AI Assistant limit of 100 messages reached. Daily quota resets at midnight.',
          isRateLimited: true
        });
      }

      // Retrieve or initialize Chat Session
      let session;
      const mongoose = require('mongoose');
      if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
        session = await ChatSession.findOne({ _id: sessionId, user: userId });
      }

      if (!session) {
        // Create new session
        const titleText = cleanMessage.slice(0, 40) + (cleanMessage.length > 40 ? '...' : '');
        session = new ChatSession({
          user: userId,
          title: titleText,
          messages: []
        });
      }

      // Convert session history to provider format
      const history = session.messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Query AI Provider
      let aiResult;
      try {
        aiResult = await aiProvider.generateChatResponse(history, cleanMessage, {
          persona,
          language
        });
      } catch (aiError) {
        // AI call failed - return categorized error states
        console.error('AI provider generation error:', aiError);
        return res.status(500).json({
          success: false,
          errorType: aiError.type || 'AI_PROVIDER_ERROR',
          message: aiError.message || 'The AI assistant is temporarily unavailable. Please try again later.'
        });
      }

      // Create message entries
      const userMsgId = uuidv4();
      const modelMsgId = uuidv4();

      const userMessage = {
        id: userMsgId,
        role: 'user',
        content: cleanMessage,
        timestamp: new Date()
      };

      const modelMessage = {
        id: modelMsgId,
        role: 'model',
        content: aiResult.reply,
        model: aiResult.model,
        responseTime: aiResult.responseTime,
        timestamp: new Date()
      };

      // Append and Save
      session.messages.push(userMessage);
      session.messages.push(modelMessage);
      session.lastMessage = aiResult.reply;
      session.lastUpdated = new Date();
      session.messageCount = session.messages.length;

      await session.save();

      return res.status(200).json({
        success: true,
        reply: aiResult.reply,
        messageId: modelMsgId,
        sessionId: session._id,
        responseTime: aiResult.responseTime,
        model: aiResult.model,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Chat error:', err);
      return res.status(500).json({ success: false, message: 'Server error handling chat request' });
    }
  },

  // 2. Get All User Chat Sessions (supports text search & pinning sort)
  getSessions: async (req, res) => {
    try {
      const userId = req.user.id;
      const { q } = req.query;

      let query = { user: userId };
      
      // Text search match
      if (q && q.trim() !== '') {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { 'messages.content': { $regex: q, $options: 'i' } }
        ];
      }

      // Sort pinned chats first, then lastUpdated desc
      const sessions = await ChatSession.find(query)
        .select('title isPinned messageCount lastMessage lastUpdated createdAt')
        .sort({ isPinned: -1, lastUpdated: -1 });

      return res.status(200).json({ success: true, data: sessions });
    } catch (err) {
      console.error('Get sessions error:', err);
      return res.status(500).json({ success: false, message: 'Server error loading conversation logs.' });
    }
  },

  // 3. Get Single Chat Session Details
  getSession: async (req, res) => {
    try {
      const session = await ChatSession.findOne({ _id: req.params.id, user: req.user.id });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Conversation not found.' });
      }
      return res.status(200).json({ success: true, data: session });
    } catch (err) {
      console.error('Get session error:', err);
      return res.status(500).json({ success: false, message: 'Server error loading session.' });
    }
  },

  // 4. Rename Session Title
  renameSession: async (req, res) => {
    try {
      const { title } = req.body;
      if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Title cannot be empty.' });
      }

      const session = await ChatSession.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { title: title.trim() },
        { new: true }
      );

      if (!session) {
        return res.status(404).json({ success: false, message: 'Conversation not found.' });
      }

      return res.status(200).json({ success: true, data: session });
    } catch (err) {
      console.error('Rename error:', err);
      return res.status(500).json({ success: false, message: 'Server error renaming conversation.' });
    }
  },

  // 5. Toggle Pin Session
  togglePinSession: async (req, res) => {
    try {
      const session = await ChatSession.findOne({ _id: req.params.id, user: req.user.id });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Conversation not found.' });
      }

      session.isPinned = !session.isPinned;
      await session.save();

      return res.status(200).json({ success: true, data: session });
    } catch (err) {
      console.error('Pin error:', err);
      return res.status(500).json({ success: false, message: 'Server error pinning conversation.' });
    }
  },

  // 6. Delete Chat Session
  deleteSession: async (req, res) => {
    try {
      const session = await ChatSession.findOneAndDelete({ _id: req.params.id, user: req.user.id });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Conversation not found.' });
      }
      
      // Clean up linked bookmarks if necessary
      await AIBookmark.deleteMany({ chatSession: req.params.id, user: req.user.id });

      return res.status(200).json({ success: true, message: 'Conversation deleted successfully.' });
    } catch (err) {
      console.error('Delete session error:', err);
      return res.status(500).json({ success: false, message: 'Server error deleting conversation.' });
    }
  },

  // 7. Get Bookmarked AI Responses (supports search, tags, favorites)
  getBookmarks: async (req, res) => {
    try {
      const userId = req.user.id;
      const { q, tag, favorite } = req.query;

      let query = { user: userId };

      if (tag) {
        query.tags = tag;
      }

      if (favorite === 'true') {
        query.isFavorite = true;
      }

      if (q && q.trim() !== '') {
        query.$or = [
          { prompt: { $regex: q, $options: 'i' } },
          { response: { $regex: q, $options: 'i' } },
          { tags: { $regex: q, $options: 'i' } }
        ];
      }

      const bookmarks = await AIBookmark.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: bookmarks });
    } catch (err) {
      console.error('Get bookmarks error:', err);
      return res.status(500).json({ success: false, message: 'Server error loading bookmarks.' });
    }
  },

  // 8. Add Reply to Bookmarks
  createBookmark: async (req, res) => {
    try {
      const userId = req.user.id;
      const { prompt, response, tags = [], isFavorite = false, chatSessionId, messageId } = req.body;

      if (!prompt || !response) {
        return res.status(400).json({ success: false, message: 'Prompt and response are required for bookmarking.' });
      }

      const bookmark = new AIBookmark({
        user: userId,
        chatSession: chatSessionId,
        prompt,
        response,
        tags,
        isFavorite
      });

      await bookmark.save();

      // If linked messageId and chatSessionId are provided, update isBookmarked in the session sub-document
      if (chatSessionId && messageId) {
        await ChatSession.updateOne(
          { _id: chatSessionId, user: userId, 'messages.id': messageId },
          { $set: { 'messages.$.isBookmarked': true } }
        );
      }

      return res.status(201).json({ success: true, data: bookmark });
    } catch (err) {
      console.error('Create bookmark error:', err);
      return res.status(500).json({ success: false, message: 'Server error saving bookmark.' });
    }
  },

  // 9. Delete Bookmark
  deleteBookmark: async (req, res) => {
    try {
      const userId = req.user.id;
      const bookmark = await AIBookmark.findOneAndDelete({ _id: req.params.id, user: userId });

      if (!bookmark) {
        return res.status(404).json({ success: false, message: 'Bookmark not found.' });
      }

      // If linked chatSession exists, update isBookmarked flag to false in ChatSession model
      if (bookmark.chatSession) {
        await ChatSession.updateOne(
          { _id: bookmark.chatSession, user: userId, 'messages.content': bookmark.response },
          { $set: { 'messages.$.isBookmarked': false } }
        );
      }

      return res.status(200).json({ success: true, message: 'Bookmark removed.' });
    } catch (err) {
      console.error('Delete bookmark error:', err);
      return res.status(500).json({ success: false, message: 'Server error removing bookmark.' });
    }
  },

  // 10. Toggle Favorite Bookmark
  toggleFavoriteBookmark: async (req, res) => {
    try {
      const bookmark = await AIBookmark.findOne({ _id: req.params.id, user: req.user.id });
      if (!bookmark) {
        return res.status(404).json({ success: false, message: 'Bookmark not found.' });
      }

      bookmark.isFavorite = !bookmark.isFavorite;
      await bookmark.save();

      return res.status(200).json({ success: true, data: bookmark });
    } catch (err) {
      console.error('Favorite toggle error:', err);
      return res.status(500).json({ success: false, message: 'Server error saving favorite preference.' });
    }
  },

  // 11. Toggle Like / Dislike Feedback on Chat Message
  toggleFeedback: async (req, res) => {
    try {
      const { sessionId, messageId, feedbackType } = req.body; // feedbackType = 'like' | 'dislike' | 'none'
      const userId = req.user.id;

      const session = await ChatSession.findOne({ _id: sessionId, user: userId });
      if (!session) {
        return res.status(404).json({ success: false, message: 'Conversation session not found.' });
      }

      const msgIndex = session.messages.findIndex(m => m.id === messageId);
      if (msgIndex === -1) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }

      if (feedbackType === 'like') {
        session.messages[msgIndex].isLiked = true;
        session.messages[msgIndex].isDisliked = false;
      } else if (feedbackType === 'dislike') {
        session.messages[msgIndex].isLiked = false;
        session.messages[msgIndex].isDisliked = true;
      } else {
        session.messages[msgIndex].isLiked = false;
        session.messages[msgIndex].isDisliked = false;
      }

      await session.save();
      return res.status(200).json({ success: true, message: 'Message feedback updated.' });
    } catch (err) {
      console.error('Feedback toggle error:', err);
      return res.status(500).json({ success: false, message: 'Server error saving feedback.' });
    }
  }
};

module.exports = aiController;
