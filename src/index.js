// src/templates/basic/index.js
import { Hono } from 'hono';
import clientAPI from './controller/clientAPI';
import productAPI from './controller/productAPI';


export default {
	async fetch(request, env, context){
		const app = new Hono();
		const api = app.basePath('/api');
		clientAPI(api, env);
		productAPI(api, env);
		return app.fetch(request, env, context);
	}
}
