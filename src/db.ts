import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Env } from './types/env';
import { Database } from './types/database.types';


export function createSupabaseClient(env: Env): SupabaseClient {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;

  return createClient<Database>(supabaseUrl, supabaseKey);
}
