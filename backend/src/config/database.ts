import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      // Mongoose 8+ sensible defaults
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
}
