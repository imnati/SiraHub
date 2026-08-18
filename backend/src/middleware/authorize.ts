import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware factory: restricts route access to specific roles.
 * Must be used AFTER authenticate middleware.
 */
export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
}
