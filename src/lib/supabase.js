import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create Supabase client if real credentials are provided
export const supabase = (supabaseUrl && supabaseUrl.startsWith('https://'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
