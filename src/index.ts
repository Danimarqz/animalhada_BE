import { ExecutionContext, Hono } from 'hono';
import clientAPI from './controller/clientAPI';
import productAPI from './controller/productAPI';
import userAPI from './controller/userAPI';
import { Env } from './types/env';

export default {
	async fetch(request: Request, env: Env, context: ExecutionContext): Promise<Response> {
		const app = new Hono();
		const api = app.basePath('/api');

		clientAPI(api, env);
		productAPI(api, env);
		userAPI(api, env);

		return app.fetch(request, env, context);
	}
}
