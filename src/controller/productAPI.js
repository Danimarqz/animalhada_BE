import { Create, GetAll, GetByCategory, GetById, Update, Delete } from "../repository/productRepo";
import { errorMsg, getPaginationLimits } from "../utils/utils";

const productAPI = (app, db) => {
	// 1 product by id
	app.get('/product/id/:id', async (c) => {
		const id = parseInt(c.req.param('id'), 10);
		try {
			const { data, status } = await GetById(db, id);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error);
		}
	});

	// all products filtered by category, with pagination and ordering by price
	app.get('/product/category/:category/:page?/:order?', async (c) => {
		const pagination = getPaginationLimits(c.req.param('page'));
		const category = [c.req.param('category')];

		const orderParam = c.req.param('order');
		let order = null;

		if (orderParam !== null && orderParam !== undefined) {
			order = orderParam === 'false' ? false : true;
		  }
		try {
			const { data, status } = pagination
				? await GetByCategory(db, category, pagination.from, pagination.to, order)
				: await GetByCategory(db, category, order);

			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error);
		}
	});

	// all products paginated with ordering by price
	app.get('/product/:page?/:order?', async (c) => {
		const pagination = getPaginationLimits(c.req.param('page'));
		const order = c.req.param('order') || null;
		try {
			const { data, status } = pagination
				? await GetAll(db, pagination.from, pagination.to, order)
				: await GetAll(db, order);

			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error);
		}
	});

	// new product
	app.post('/product', async (c) => {
		const newProduct = await c.req.json();
		try {
			const { data, status } = await Create(db, newProduct);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error);
		}
	});

	// update product
	app.put('/product/:id', async (c) => {
		const id = c.req.param('id');
		const updates = await c.req.json();
		try {
			const { data, status } = await Update(db, id, updates);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error);
		}
	});

	// delete product
	app.delete('/product/:id', async (c) => {
		const id = c.req.param('id');
		try {
			const { status } = await Delete(db, id);
			return c.json(status);
		} catch (error) {
			return errorMsg(c, error);
		}
	});
};

export default productAPI;

