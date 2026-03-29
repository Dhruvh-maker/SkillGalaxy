/**
 * Database configuration
 * Reuses the existing dbConnect from src/lib/db.js
 */
import dbConnect from '../../src/lib/db.js';

const connectDB = async () => {
  try {
    await dbConnect();
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
