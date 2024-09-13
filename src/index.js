// src/templates/basic/index.js
import { Hono } from 'hono';
import clientAPI from './controller/clientAPI';
import productAPI from './controller/productAPI';


// Monta la aplicación Hono y agrega las rutas CRUD para 'client'

export default {
	async fetch(request, env, context){
		const app = new Hono();
		clientAPI(app, env);
		productAPI(app, env);
		return app.fetch(request, env, context);
	}
}
