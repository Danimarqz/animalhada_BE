import { Context } from 'hono';
import { Pagination } from '../types/pagination'

export const errorMsg = (c: Context, error: Error): Response => {
	return c.json({ error: error.message }, 500);
};

export const getPaginationLimits = (page: string | undefined): Pagination | null => {
	const limit = page ? parseInt(page, 10) * 20 : null;
	return limit ? { from: limit - 20, to: limit } : null;
};
