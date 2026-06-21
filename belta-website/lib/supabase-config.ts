// Public Supabase credentials.
//
// The anon/public key is *designed* to be shipped in client-side code — it only
// grants access permitted by your Row Level Security (RLS) policies, so exposing
// it is safe. (The service_role key is the secret one; it is never used here.)
//
// These are hardcoded as fallbacks because the Cloudflare Pages build runs
// `next build` via `npx vercel build`, which does NOT forward system/dashboard
// environment variables to the build. Since NEXT_PUBLIC_* values are inlined at
// build time, relying on the env vars alone would inline `undefined` and crash
// the Supabase client in the browser. Env vars still take precedence when present
// (e.g. local development with a .env.local file).

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://nssihkcwdrqsjbafanna.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zc2loa2N3ZHJxc2piYWZhbm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTExNzEsImV4cCI6MjA5MzYyNzE3MX0.oHv3sJ6PNceCV2i-pV2Nt9Y96dC2qxxefWPDjrwN_lg";
