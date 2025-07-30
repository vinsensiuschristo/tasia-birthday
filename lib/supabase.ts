// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Pastikan variabel lingkungan ini tersedia
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

// Buat client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
