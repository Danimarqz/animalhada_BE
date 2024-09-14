import { createSupabaseClient } from '../db';

export const GetAll = async (db, from=0, to=20) => {
	const { data, error, status } = await createSupabaseClient(db).from('client')
	.select('*').range(from, to);
	if (error) throw error;
	return { data, status };
};

export const GetById = async (db, id) => {
	const { data, error, status } = await createSupabaseClient(db).from('client')
	.select().eq('id', id);
	if (error) throw error;
	return data, status;
}

export const Create = async(db, newClient) => {
	const { data, error, status } = await createSupabaseClient(db).from('client')
	.insert([newClient]);
	if (error) throw error;
	return data, status;
}

export const Update = async(db, id, client) => {
	const { data, error, status } = await createSupabaseClient(db).from('client')
	.update(client).eq('id', id);
	if (error) throw error;
	return { data, status };
}

export const Delete = async(db, id) => {
	const { error, status } = await createSupabaseClient(db).from('client')
	.delete().eq('id', id);
	if (error) throw error;
	return status;
}
