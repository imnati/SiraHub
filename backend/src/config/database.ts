import mongoose from 'mongoose';
import { env } from './env';

/**
 * Connect to MongoDB Atlas using the MONGODB_URI from environment.
 * Mongoose 8 manages the connection pool internally.
 */
export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(env.MONGODB_URI, {
      dbName: 'sirahub',
      // Mongoose 8 sensible defaults — no deprecated options needed
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Emit unhandled Mongoose errors to stderr (won't crash the process)
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB runtime error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected.');
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Gracefully close the MongoDB connection.
 * Called during SIGTERM / SIGINT shutdown.
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed gracefully.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

/**
 * Register OS signal handlers for graceful shutdown.
 * Call once at server startup.
 */
export function registerShutdownHandlers(): void {
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    await disconnectDB();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
