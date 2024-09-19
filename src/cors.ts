import { Context } from "hono";
import { Env } from "./types/env";

export function checkOriginBoth(c: Context, db: Env): boolean {
	const origin: string | undefined = c.req.header('Origin');
	if (!origin && origin !== db.CORS_ADMIN && origin !== db.CORS_FE){
		return false;
	}
	return true
}
export function checkOriginAdmin(c: Context, db: Env) {
	const origin = c.req.header('Origin');
	if (!origin && origin !== db.CORS_ADMIN){
		return false
	}
	return true
}

export const errorCors = (c: Context) => {
	return c.json({ error: 'Origin not allowed' }, 403);
}
