// src/auth/supabaseClient.ts

// Import the createClient function from the Supabase library
import { createClient } from '@supabase/supabase-js';

// Retrieve the Supabase URL and Key from environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

// Create and export a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);