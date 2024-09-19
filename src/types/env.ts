export type Env = {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	CORS_FE: string;
	CORS_ADMIN: string;
	[key: string]: string | undefined;
}
