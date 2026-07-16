require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const connectDB = async () => {
  const connect = require('./src/config/db');
  await connect();
};

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io instance on app for controller access (app.get('io'))
app.set('io', io);

// WebSocket Connection Handler
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Base socket room configuration
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined socket room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Connect database and start server
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  server.close(() => {
    process.exit(1);
  });
});
