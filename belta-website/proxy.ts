import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) =>
    c.name.startsWith("sb-nssihkcwdrqsjbafanna-auth-token")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never gate the auth pages themselves — prevents redirect loops.
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Only the admin area requires authentication. The storefront is public.
  if (pathname.startsWith("/admin") && !isAuthenticated(request)) {
    const loginUrl = new URL("/auth/login", request.url);
    // Preserve destination so we redirect back after login.
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect only the admin area. Homepage and storefront are public.
  matcher: ["/admin/:path*"],
};
