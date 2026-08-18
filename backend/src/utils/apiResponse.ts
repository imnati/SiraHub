import { Response } from 'express';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Sends a standardised success response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: PaginationMeta
): void {
  const body: Record<string, unknown> = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    body.pagination = pagination;
  }

  res.status(statusCode).json(body);
}

/**
 * Sends a standardised error response.
 * Prefer using AppError + errorHandler middleware instead when possible.
 */
export function sendError(
  res: Response,
  message: string,
  statusCode = 500
): void {
  res.status(statusCode).json({
    success: false,
    message,
  });
}
