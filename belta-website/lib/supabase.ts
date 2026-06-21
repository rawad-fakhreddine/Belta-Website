import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config";

// Browser-side singleton — safe to import in any client component ("use client").
// Credentials come from lib/supabase-config (env var, falling back to the public
// anon key) so they are always defined at build time and never crash at runtime.
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Database row shapes ────────────────────────────────────────────────────────

export type ProductRow = {
  id:            number;
  name:          string;
  name_ar:       string | null;
  material:      string;
  material_ar:   string | null;
  price:         string;
  badge:         "new" | "count" | "final" | null;
  badge_label:   string | null;
  material_type: "silk" | "cotton" | "modal";
  active:        boolean;
  sort_order:    number | null;
};
