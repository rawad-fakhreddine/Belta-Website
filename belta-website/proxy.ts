import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) =>
    c.name.startsWith("sb-nssihkcwdrqsjbafanna-auth-token")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAuthenticated(request)) {
    const loginUrl = new URL("/auth/login", request.url);
    // Preserve destination for /admin routes so we redirect back after login
    if (pathname.startsWith("/admin")) {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protects the homepage and all admin routes.
  // Remove "/" from matcher when the site opens to the public.
  matcher: ["/", "/admin/:path*"],
};
