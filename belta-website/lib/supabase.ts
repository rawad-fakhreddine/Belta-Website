import { createBrowserClient } from "@supabase/ssr";

// Browser-side singleton — safe to import in any client component ("use client")
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
