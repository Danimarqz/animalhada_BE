// src/templates/basic/db.js
import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient(env) {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY;
  return createClient(supabaseUrl, supabaseKey);
}
