// src/templates/basic/clientAPI.js
import { Create, Delete, GetAll, GetById, Update } from '../repository/clientRepo';

const errorMsg = (error) => c.json( { error: error.message }, 500);

const clientAPI = (app, db) => {
	app.get('/client', async (c) => {
		try {
			const { data, status } = await GetAll(db);
			return c.json(data, status);
		} catch(error) {
			return errorMsg(error);
		}
	});

	app.get('/client:id', async (c) => {
		try {
			const { data, status } = await GetById(db);
			return c.json(data, status);
		} catch(error) {
			return errorMsg(error);
		}
	})
	app.post('/client', async (c) => {
		const newClient = await c.req.json();
		try {
			const { data, status } = await Create(db, newClient);
			return c.json(data, status);
		} catch(error) {
			return errorMsg(error);
		}
	});

	app.put('/client/:id', async (c) => {
		const id = c.req.param('id');
		const updatedClient = await c.req.json();
		try {
			const { data, status } = await Update(db, id, updatedClient);
			return c.json(data, status);
		} catch(error) {
			return errorMsg(error);
		}
	});

	app.delete('/client/:id', async (c) => {
		const id = c.req.param('id');
		try {
			const { status } = await Delete(db, id);
			return c.json(status);
		} catch(error) {
			return errorMsg(error);
		}
	});
};

export default clientAPI;
