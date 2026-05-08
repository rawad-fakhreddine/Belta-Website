import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client — only import this in Server Components and Route Handlers.
// Never import in files marked "use client".
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from a Server Component where cookie mutation
            // is not allowed — the session will be refreshed client-side.
          }
        },
      },
    }
  );
}
