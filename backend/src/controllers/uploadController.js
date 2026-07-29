const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// Ensure uploads folder exists in backend root
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Invalid file type. Only JPG, JPEG, PNG and WEBP are allowed.', 400), false);
  }
};

// Multer limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure Cloudinary if credentials are set
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Upload Single or Multiple Files Handler
exports.uploadImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('Please upload at least one image file', 400));
  }

  const uploadedImages = [];

  for (const file of req.files) {
    let imageUrl = '';
    let filename = file.filename;

    if (isCloudinaryConfigured) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'krishimitra'
        });
        imageUrl = result.secure_url;
        filename = result.public_id;

        // Delete local temporary file
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Cloudinary upload failed, falling back to local storage:', err);
        // Fallback: Use local file URL
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }
    } else {
      // Local storage url
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    }

    uploadedImages.push({
      url: imageUrl,
      filename: filename
    });
  }

  res.status(200).json({
    success: true,
    data: uploadedImages
  });
});

exports.uploadMiddleware = upload.array('images', 5);
