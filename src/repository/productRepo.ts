import { createSupabaseClient } from "../db"
import { Tables, TablesInsert, TablesUpdate } from "../types/database.types";
import { ApiResponse } from "../types/apiResponse";
import { Env } from "../types/env";
import { StatusCode } from 'hono/utils/http-status';

type Product = Tables<'product'>

type newProduct = TablesInsert<'product'>

type updateProduct = TablesUpdate<'product'>

export const GetAll = async (db: Env, order: boolean = true, from: number = 0, to: number = 20): Promise<ApiResponse<Product[]>> => {
	const { data, error, status } = order == null
	? await createSupabaseClient(db)
		.from('product')
		.select('*')
		.range(from, to)
		.returns<Product[]>()
	: await createSupabaseClient(db)
		.from('product')
		.select('*')
		.order('price', {ascending: order})
		.range(from, to)
		.returns<Product[]>();

	if (error) throw error;
	return { data, status: status as StatusCode };
}


export const GetById = async (db: Env, id: number): Promise<ApiResponse<Product>> => {
	const { data, error, status } = await createSupabaseClient(db)
		.from('product')
		.select('*')
		.eq('id', id)
		.returns<Product>();

	if (error) throw error;
	return { data, status: status as StatusCode };
}

export const GetByCategory = async (db: Env, category: string[], order: boolean = true, from: number = 0, to: number = 20): Promise<ApiResponse<Product[]>> => {
	const { data, error, status } = order == null
	? await createSupabaseClient(db)
		.from('product')
		.select('*')
		.contains('category', [category])
		.range(from, to)
		.returns<Product[]>()
	: await createSupabaseClient(db)
		.from('product')
		.select('*')
		.contains('category', [category])
		.order('price', { ascending: order })
		.range(from, to)
		.returns<Product[]>();

	if (error) throw error;
	return { data, status: status as StatusCode };
}

export const Create = async (db: Env, newProduct: newProduct): Promise<ApiResponse<Product>> => {
	const { data, error, status } = await createSupabaseClient(db)
		.from('product')
		.insert([newProduct])
		.returns<Product>();

	if (error) throw error;
	return { data, status: status as StatusCode };
}

export const Update = async (db: Env, id: number, product: updateProduct): Promise<ApiResponse<Product>> => {
	const { data, error, status } = await createSupabaseClient(db)
		.from('product')
		.update(product)
		.eq('id', id)
		.returns<Product>();

	if (error) throw error;
	return { data, status: status as StatusCode };
}

export const Delete = async (db: Env, id: number): Promise<number> => {
	const { error, status } = await createSupabaseClient(db)
		.from('product')
		.delete()
		.eq('id', id);

	if (error) throw error;
	return status as StatusCode;
}
