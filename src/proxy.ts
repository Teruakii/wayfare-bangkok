import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/presentation/auth/constants";

/**
 * Optimistic check only: redirects visitors without a session cookie away
 * from protected pages. Pages still verify the session with requireUser().
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(login);
}

export const config = {
  // Protected pages. Each must also call requireUser().
  matcher: ["/dashboard/:path*"],
};
