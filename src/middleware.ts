import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // Not logged in
  if (isAdminRoute && !token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Already logged in
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
