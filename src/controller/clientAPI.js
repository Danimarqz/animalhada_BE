// src/templates/basic/clientAPI.js
import { Create, Delete, GetAll, GetById, Update } from '../repository/clientRepo';
import { errorMsg, getPaginationLimits } from '../utils/utils';


const clientAPI = (app, db) => {
	app.get('/client/:page?', async (c) => {
		const pagination = getPaginationLimits(c.req.param('page'));
		try {
			const { data, status } = pagination
			? await GetAll(db, pagination.from, pagination.to)
			: await GetAll(db);
			return c.json(data, status);
		} catch(error) {
			return errorMsg(c, error);
		}
	});

	app.get('/client/id/:id', async (c) => {
		const id = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		try {
			const { data, status } = await GetById(db, id);
			if (!data || data.length === 0) {
				return c.json({ error: 'Client not found' }, 404);
			}
			return c.json(data, status);
		} catch(error) {
			return errorMsg(c, error);
		}
	})
	app.post('/client', async (c) => {
		const newClient = await c.req.json();
		try {
			const { data, status } = await Create(db, newClient);
			return c.json(data, status);
		} catch(error) {
			return errorMsg(c, error);
		}
	});

	app.put('/client/:id', async (c) => {
		const id = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		const updatedClient = await c.req.json();
		try {
			const { data, status } = await Update(db, id, updatedClient);
			return c.json(data, status);
		} catch(error) {
			return errorMsg(c, error);
		}
	});

	app.delete('/client/:id', async (c) => {
		const id = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		try {
			const { status } = await Delete(db, id);
			return c.json(status);
		} catch(error) {
			return errorMsg(c, error);
		}
	});
};

export default clientAPI;
