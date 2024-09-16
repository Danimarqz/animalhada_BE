import { ExecutionContext, Hono } from 'hono';
import clientAPI from './controller/clientAPI';
import productAPI from './controller/productAPI';

export default {
  async fetch(request: Request, env: any, context: ExecutionContext): Promise<Response> {
    const app = new Hono();
    const api = app.basePath('/api');

    // Pasar el tipo de `env` al API de clientes y productos
    clientAPI(api, env);
    productAPI(api, env);

    return app.fetch(request, env, context);
  }
}
