import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client for server-only use (the /admin route).
 * Never import this from a client component — the service role key
 * bypasses RLS entirely.
 */
export function supabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
