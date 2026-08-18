import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { env } from './config/env';

// ─── Route imports (stubs — implemented in later phases) ──────────────────────
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import jobRoutes from './routes/job.routes';
import companyRoutes from './routes/company.routes';
import applicationRoutes from './routes/application.routes';
import categoryRoutes from './routes/category.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

// ─── Security & parsing middleware ───────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// ─── Rate limiting (global) ──────────────────────────────────────────────────
app.use('/api', rateLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// ─── Error handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
