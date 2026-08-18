import { Request } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Extracts and normalises pagination params from a query string.
 * Defaults: page=1, limit=10. Max limit enforced at 50.
 */
export function getPaginationOptions(req: Request): PaginationOptions {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const rawLimit = parseInt(req.query.limit as string, 10) || 10;
  const limit = Math.min(Math.max(1, rawLimit), 50);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): { total: number; page: number; limit: number; totalPages: number } {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
