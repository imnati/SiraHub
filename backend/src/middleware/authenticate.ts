import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to carry authenticated user info
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware: verifies JWT from Authorization header or cookie.
 * Attaches decoded payload to req.user.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token =
    (authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined) ?? req.cookies?.accessToken;

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}
