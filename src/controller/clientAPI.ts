import { Hono, Context } from 'hono';
import { Env } from '../types/env';
import { Create, Delete, GetAll, GetById, Update } from '../repository/clientRepo';
import { errorMsg, getPaginationLimits } from '../utils/utils';
import { Tables } from '../types/database.types';
import { Pagination } from '../types/pagination';
import { StatusCode } from 'hono/utils/http-status';

type Client = Tables<'client'>

const clientAPI = (app: Hono, db: Env) => {
	app.get('/client/id/:id', async (c: Context) => {
	  const id: number = parseInt(c.req.param('id'), 10);
	  if (isNaN(id)) {
		return c.json({ error: 'Invalid ID' }, 400);
	  }
	  try {
		const { data, status } = await GetById(db, id);
		if (!data) {
		  return c.json({ error: 'Client not found' }, 404);
		}
		return c.json(data as Client, status as StatusCode);
	  } catch (error) {
		return errorMsg(c, error as Error);
	  }
	});

  app.get('/client', async (c: Context) => {
    const pageParam: string | undefined = c.req.query('page');
    const pagination: Pagination | null = getPaginationLimits(pageParam);
    try {
      const { data, status } = pagination
        ? await GetAll(db, pagination.from, pagination.to)
        : await GetAll(db);
      return c.json(data as Client[], status as StatusCode);
    } catch (error) {
      return errorMsg(c, error as Error);
    }
  });

  app.post('/client', async (c: Context) => {
    const newClient = await c.req.json() as Client;
    try {
      const { data, status } = await Create(db, newClient);
      return c.json(data as Client, status as StatusCode);
    } catch (error) {
      return errorMsg(c, error as Error);
    }
  });

  app.put('/client/:id', async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'Invalid ID' }, 400);
    }
    const updatedClient = await c.req.json() as Client;
    try {
      const { data, status } = await Update(db, id, updatedClient);
      return c.json(data as Client, status as StatusCode);
    } catch (error) {
      return errorMsg(c, error as Error);
    }
  });

  app.delete('/client/:id', async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    if (isNaN(id)) {
      return c.json({ error: 'Invalid ID' }, 400);
    }
    try {
      const status = await Delete(db, id);
      return c.json(status as StatusCode);
    } catch (error) {
      return errorMsg(c, error as Error);
    }
  });
};

export default clientAPI;
