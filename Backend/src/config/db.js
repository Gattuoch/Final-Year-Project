// src/config/db.js
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connects to MongoDB with retry logic, connection pooling,
 * and detailed success/error logging.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error('MONGO_URI is missing in .env file!');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,           // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,    // Close sockets after 45 seconds of inactivity
      family: 4,                 // Use IPv4, skip trying IPv6
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    logger.info(`Database: ${conn.connection.name}`);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.warn('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`DB Connection Failed: ${error.message}`);
    logger.error('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000); // Auto-retry
  }
};

export default connectDB;