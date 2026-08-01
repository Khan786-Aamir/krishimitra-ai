const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./src/middlewares/error');
const routes = require('./src/routes');

const app = express();

// Security Middlewares
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://krishimitra-ai-dv7d.onrender.com'
];

if (process.env.CORS_ORIGIN) {
  const origins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
  origins.forEach(origin => {
    if (origin && !allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/v1', routes);

// Catch 404 (Resource Not Found)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
