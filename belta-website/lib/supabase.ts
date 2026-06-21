import { createBrowserClient } from "@supabase/ssr";

// Lazily initialized — defers createBrowserClient until first use so the
// module can be imported at build time without requiring env vars to be present.
let _client: ReturnType<typeof createBrowserClient> | undefined;

function getClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_, prop) {
    return (getClient() as any)[prop];
  },
});

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
