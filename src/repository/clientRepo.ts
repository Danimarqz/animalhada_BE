import { createSupabaseClient } from '../db';
import { Tables } from '../types/database.types';
import { ApiResponse } from '../types/apiResponse';
import { Env } from '../types/env';
import { StatusCode } from 'hono/utils/http-status';

type Client = Tables<'client'>

export const GetAll = async (db: Env, from: number = 0, to: number = 20): Promise<ApiResponse<Client[]>> => {
  const { data, error, status } = await createSupabaseClient(db)
    .from('client')
    .select('*')
    .range(from, to)
		.returns<Client[]>();

  if (error) throw error;
  return { data, status: status as StatusCode };
};

export const GetById = async (db: Env, id: number): Promise<ApiResponse<Client>> => {
  const { data, error, status } = await createSupabaseClient(db)
    .from('client')
    .select('*')
    .eq('id', id)
		.returns<Client>();

  if (error) throw error;
  return { data, status: status as StatusCode };
};

export const Create = async (db: Env, newClient: Client): Promise<ApiResponse<Client>> => {
  const { data, error, status } = await createSupabaseClient(db)
    .from('client')
    .insert([newClient])
		.returns<Client>();

  if (error) throw error;
  return { data, status: status as StatusCode };
};

export const Update = async (db: Env, id: number, client: Partial<Client>): Promise<ApiResponse<Client>> => {
  const { data, error, status } = await createSupabaseClient(db)
    .from('client')
    .update(client)
    .eq('id', id)
		.returns<Client>();

  if (error) throw error;
  return { data, status: status as StatusCode };
};

export const Delete = async (db: Env, id: number): Promise<StatusCode> => {
  const { error, status } = await createSupabaseClient(db)
    .from('client')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return status as StatusCode;
};
