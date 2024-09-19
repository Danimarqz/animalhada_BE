import { StatusCode } from "hono/utils/http-status";
import { createSupabaseClient } from "../db";
import { ApiResponse } from "../types/apiResponse";
import { Tables, TablesInsert, TablesUpdate } from "../types/database.types";
import { Env } from "../types/env";

export type User = Tables<'usuarios'>
export type newUser = TablesInsert<'usuarios'>
export type updateUser = TablesUpdate<'usuarios'>

export const GetUser = async (db: Env, username: string): Promise<ApiResponse<User>> => {
	const { data, error, status } = await createSupabaseClient(db)
		.from('usuarios')
		.select('*')
		.eq('username', username)
		.returns<User>();

	if (error) throw error
	return { data, status: status as StatusCode }
}
