import { Context, Hono } from "hono";
import { Create, GetAll, GetByCategory, GetById, Update, Delete } from "../repository/productRepo";
import { errorMsg, getPaginationLimits } from "../utils/utils";
import { Env } from "../types/env";
import { Tables, TablesInsert, TablesUpdate } from "../types/database.types";
import { StatusCode } from "hono/utils/http-status";
import { Pagination } from "../types/pagination";
import { ApiResponse } from "../types/apiResponse";
import { checkOriginAdmin, checkOriginBoth, errorCors } from "../cors";

type Product = Tables<'product'>

type newProduct = TablesInsert<'product'>

type updateProduct = TablesUpdate<'product'>

const productAPI = (app: Hono, db: Env) => {
	// 1 product by id
	app.get('/product/id/:id', async (c: Context) => {
		if(!checkOriginBoth(c, db)) return errorCors(c)

		const id: number = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		try {
			const { data, status }: ApiResponse<Product> = await GetById(db, id);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// all products filtered by category, with pagination and ordering by price
	app.get('/product/category/', async (c: Context) => {
		if(!checkOriginBoth(c, db)) return errorCors(c)

		const { page, order } = c.req.query();
		const categories: string[] = c.req.queries('category') || []
		const pagination: Pagination | null = getPaginationLimits(page);
		try {
			const { data, status }: ApiResponse<Product[]> = pagination
				? await GetByCategory(db, categories, Boolean(order), pagination.from, pagination.to)
				: await GetByCategory(db, categories, Boolean(order));

			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// all products paginated with ordering by price
	app.get('/product', async (c: Context) => {
		if(!checkOriginBoth(c, db)) return errorCors(c)

		const { page, order } = c.req.query();
		const pagination: Pagination | null = getPaginationLimits(page);
		try {
			const { data, status }: ApiResponse<Product[]> = pagination
				? await GetAll(db, Boolean(order), pagination.from, pagination.to)
				: await GetAll(db, Boolean(order));

			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// new product
	app.post('/admin/product', async (c: Context) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c)

		const newProduct: newProduct = await c.req.json();
		try {
			const { data, status }: ApiResponse<Product> = await Create(db, newProduct);
			return c.json(data, status);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// update product
	app.put('/admin/product/:id', async (c: Context) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c)

		const id: number = parseInt(c.req.param('id'), 10);
		if (isNaN(id)) {
			return c.json({ error: 'Invalid ID' }, 400);
		}
		const updates: updateProduct = await c.req.json();
		try {
			const { data, status }: ApiResponse<Product> = await Update(db, id, updates);
			return c.json(data, status as StatusCode);
		} catch (error) {
			return errorMsg(c, error as Error);
		}
	});

	// delete product
	app.delete('/admin/product/:id', async (c: Context) => {
		if (!checkOriginAdmin(c, db)) return errorCors(c)

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

