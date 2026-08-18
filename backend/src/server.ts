import app from './app';
import { connectDB } from './config/database';
import { env } from './config/env';

const PORT = env.PORT;

async function startServer(): Promise<void> {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
