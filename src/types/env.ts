export type Env = {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
	CORS_FE: string;
	CORS_ADMIN: string;
	SECRET_KEY: string;
	API_KEY: string;
	CRYPTO_KEY: string;
	[key: string]: string | undefined;
}
