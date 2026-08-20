import app from './app';
import { connectDB, registerShutdownHandlers } from './config/database';
import { env } from './config/env';

const PORT = env.PORT;

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Register OS signal handlers for graceful shutdown
    registerShutdownHandlers();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
