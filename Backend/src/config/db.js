// src/config/db.js
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connects to MongoDB with retry logic and connection pooling.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error('MONGO_URI is missing in .env file!');
    process.exit(1);
  }

  try {
    // Mongoose 6+ always uses the new parser and topology, 
    // so we only need to pass performance-related options.
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,           
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000,    
      family: 4,                 
    });

    // These logs are crucial for troubleshooting:
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📂 Database Name: ${conn.connection.name}`);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.warn('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error(`❌ DB Connection Failed: ${error.message}`);
    logger.info('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000); 
  }
};

export default connectDB;