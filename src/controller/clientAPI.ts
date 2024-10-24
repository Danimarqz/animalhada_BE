import { Hono, Context } from 'hono';
import { Env } from '../types/env';
import { Client, newClient, updateClient, Create, Delete, GetAll, GetById, Update } from '../repository/clientRepo';
import { errorMsg, getPaginationLimits } from '../utils/utils';
import { Pagination } from '../types/pagination';
import { StatusCode } from 'hono/utils/http-status';
import { ApiResponse } from '../types/apiResponse';
import { checkOriginBoth, checkOriginAdmin, errorCors, checkAPIKEY } from '../cors';

const clientAPI = (app: Hono, db: Env) => {
	app.get('/client/id/:id', async (c: Context) => {
		if(!checkOriginBoth(c, db)) return errorCors(c)

		const id: number = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		try {
			const { data, status }: ApiResponse<Client> = await GetById(db, id);
			if (!data) {
				return c.json({ error: 'Client not found' }, 404);
			}
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	app.get('/client', async (c: Context) => {
		if(!checkOriginBoth(c, db)) return errorCors(c)

		const pageParam: string | undefined = c.req.query('page')
		const pagination: Pagination | null = getPaginationLimits(pageParam);
		try {
			const { data, status }: ApiResponse<Client[]> = pagination
				? await GetAll(db, pagination.from, pagination.to)
				: await GetAll(db);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	app.post('/admin/client', async (c: Context) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c)
		if (!checkAPIKEY(c, db)) return errorCors(c)

		const newClient = await c.req.json() as newClient
		try {
			const { data, status }: ApiResponse<Client> = await Create(db, newClient);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	app.put('/admin/client/:id', async (c: Context) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c)
		if (!checkAPIKEY(c, db)) return errorCors(c)

		const id = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		const updatedClient = await c.req.json() as updateClient;
		try {
			const { data, status }: ApiResponse<Client> = await Update(db, id, updatedClient);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	app.delete('/admin/client/:id', async (c: Context) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c)
		if (!checkAPIKEY(c, db)) return errorCors(c)

		const id: number = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		try {
			const status: StatusCode= await Delete(db, id);
			return c.json(status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});
};

export default clientAPI;
