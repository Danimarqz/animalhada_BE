import { createSupabaseClient } from '../db';

export const GetAll = async (db) => {
	const { data, error, status } = await createSupabaseClient(db).from('client').select('*');
	if (error) throw error;
	return { data, status };
};

export const GetById = async (db, id) => {
	const { data, error, status } = await createSupabaseClient(db).from('client').eq('id', id).select("*");
	if (error) throw error;
	return data, status;
}

export const Create = async(db, newClient) => {
	const { data, error, status } = await createSupabaseClient(db).from('client').insert([newClient]);
	if (error) throw error;
	return data, status;
}

export const Update = async(db, id, client) => {
	const { data, error, status } = await createSupabaseClient(db).from('client').update(client).eq('id', id);
	if (error) throw error;
	return data, status;
}

export const Delete = async(db, id) => {
	const { error, status } = await createSupabaseClient(db).from('client').delete().eq('id', id);
	if (error) throw error;
	return status;
}
