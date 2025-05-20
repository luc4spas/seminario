import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These values will be replaced by the actual values from the .env file
// after connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);