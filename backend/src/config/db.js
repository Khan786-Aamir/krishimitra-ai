const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin if env variables are present
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const User = require('../models/User');
      const adminEmail = process.env.ADMIN_EMAIL.toLowerCase();
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        await User.create({
          name: 'Ecosystem Administrator',
          email: adminEmail,
          password: process.env.ADMIN_PASSWORD,
          role: 'Admin',
          phone: '+91 99999 88888',
          isVerified: true
        });
        console.log(`Admin user successfully seeded: ${adminEmail}`);
      } else {
        console.log(`Admin user exists: ${adminEmail}`);
      }
    } else {
      console.log('Admin seeding skipped: ADMIN_EMAIL or ADMIN_PASSWORD not specified in env.');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error event: ${err}`);
});

// Capture termination signals to close connection gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
