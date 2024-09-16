import { Context, Hono } from "hono";
import { Create, GetAll, GetByCategory, GetById, Update, Delete } from "../repository/productRepo";
import { errorMsg, getPaginationLimits } from "../utils/utils";
import { Env } from "../types/env";
import { Tables } from "../types/database.types";
import { StatusCode } from "hono/utils/http-status";
import { Pagination } from "../types/pagination";

type Product = Tables<'product'>

const productAPI = (app: Hono, db: Env) => {
	// 1 product by id
	app.get('/product/id/:id', async (c: Context) => {
		const id: number = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		try {
			const { data, status } = await GetById(db, id);
			return c.json(data as Product, status as StatusCode);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// all products filtered by category, with pagination and ordering by price
	app.get('/product/category/:category/:page?/:order?', async (c: Context) => {
		const pageParam: string = c.req.param('page');
		const pagination: Pagination | null = getPaginationLimits(pageParam);
		const category: string[] = [c.req.param('category')];
		const order: boolean | null = Boolean(c.req.param('order'));
		try {
			const { data, status } = pagination
				? await GetByCategory(db, category, order, pagination.from, pagination.to)
				: await GetByCategory(db, category, order);

			return c.json(data as Product[], status as StatusCode);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// all products paginated with ordering by price
	app.get('/product/:page?/:order?', async (c: Context) => {
		const pageParam: string = c.req.param('page');
		const pagination: Pagination | null = getPaginationLimits(pageParam);
		const order: boolean | null = Boolean(c.req.param('order'));
		try {
			const { data, status } = pagination
				? await GetAll(db, order, pagination.from, pagination.to)
				: await GetAll(db, order);

			return c.json(data as Product[], status as StatusCode);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// new product
	app.post('/product', async (c: Context) => {
		const newProduct: Product = await c.req.json();
		try {
			const { data, status } = await Create(db, newProduct);
			return c.json(data as Product, status as StatusCode);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// update product
	app.put('/product/:id', async (c: Context) => {
		const id: number = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		const updates: Product = await c.req.json();
		try {
			const { data, status } = await Update(db, id, updates);
			return c.json(data as Product, status as StatusCode);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// delete product
	app.delete('/product/:id', async (c: Context) => {
		const id: number = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		try {
			const status: number = await Delete(db, id);
			return c.json(status as StatusCode);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});
};

export default productAPI;

