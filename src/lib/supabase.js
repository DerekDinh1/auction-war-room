import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL || "";
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export function isSupabaseConfigured() {
  return Boolean(url && anon && url.startsWith("http"));
}

let client = null;
export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
