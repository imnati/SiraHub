import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

/**
 * GET /api/health
 * Returns server and database health status.
 */
router.get('/', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

  res.status(200).json({
    success: true,
    message: 'SiraHub API is running',
    environment: process.env.NODE_ENV,
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
