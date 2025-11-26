import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://rodgpnbaewagvfedxbqs.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZGdwbmJhZXdhZ3ZmZWR4YnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1OTU0MTMsImV4cCI6MjA3MzE3MTQxM30.l1hAf5e8w7aET8tr9Eenu_bkJY9nWINnDJhVfPJuXW8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
