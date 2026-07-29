const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadMiddleware, uploadImages } = require('../controllers/uploadController');

// Secure route - requires authentication and parses multiform images array
router.post('/', authMiddleware, uploadMiddleware, uploadImages);

module.exports = router;
