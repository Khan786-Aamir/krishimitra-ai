const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all AI Assistant endpoints
router.use(authMiddleware);

// Chat & Feedback routes
router.post('/chat', aiController.chat);
router.post('/feedback', aiController.toggleFeedback);

// Session history CRUD
router.get('/sessions', aiController.getSessions);
router.get('/sessions/:id', aiController.getSession);
router.put('/sessions/:id', aiController.renameSession);
router.put('/sessions/:id/pin', aiController.togglePinSession);
router.delete('/sessions/:id', aiController.deleteSession);

// Bookmarks routes
router.get('/bookmarks', aiController.getBookmarks);
router.post('/bookmarks', aiController.createBookmark);
router.delete('/bookmarks/:id', aiController.deleteBookmark);
router.put('/bookmarks/:id/favorite', aiController.toggleFavoriteBookmark);

module.exports = router;
