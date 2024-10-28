import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);