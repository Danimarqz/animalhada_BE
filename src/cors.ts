import { Context } from "hono";
import { Env } from "./types/env";

export function checkOriginBoth(c: Context, env: Env): boolean {
	const origin: string | undefined = c.req.header('Origin');
	if (!origin && origin !== env.CORS_ADMIN && origin !== env.CORS_FE){
		return false;
	}
	return true
}
export function checkOriginAdmin(c: Context, env: Env) {
	const origin = c.req.header('Origin');
	if (!origin && origin !== env.CORS_ADMIN){
		return false
	}
	return true
}

export const errorCors = (c: Context) => {
	return c.json({ error: 'Origin not allowed' }, 403);
}

export function checkAPIKEY(c: Context, env: Env) {
	const api = c.req.header('X-API-KEY');
	if (!api && api !== env.API_KEY) {
		return false
	}
	return true
}
