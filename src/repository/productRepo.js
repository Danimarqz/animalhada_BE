import { createSupabaseClient } from "../db"


export const GetAll = async (db, from=0, to=20) => {
	const { data, error, status } = await createSupabaseClient(db).from('product')
	.select('*').range(from, to);
	if (error) throw error;
	return { data, status };
}

export const GetById = async (db, id) => {
	const { data, error, status } = await createSupabaseClient(db).from('product')
	.select().eq('id', id);
	if (error) throw error;
	return { data, status };
}

export const GetByCategory = async (db, category, from=0, to=20) => {
	const { data, error, status } = await createSupabaseClient(db).from('product')
	.select().eq('category', category).range(from, to);
	if (error) throw error;
	return { data, status };
}

export const Create = async (db, newProduct) => {
	const { data, error, status } = await createSupabaseClient(db).from('product')
	.insert([newProduct]);
	if (error) throw error;
	return { data, status };
}

export const Update = async (db, id, product) => {
	const { data, error, status } = await createSupabaseClient(db).from('product')
	.update(product).eq('id', id);
	if (error) throw error;
	return { data, status };
}

export const Delete = async (db, id) => {
	const { error, status } = await createSupabaseClient(db).from('product')
	.delete().eq('id', id);
	if (error) throw error;
	return status;
}
