import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token =
      request.cookies.get("admin_auth")?.value;

    if (
      token !== process.env.ADMIN_TOKEN
    ) {
      return NextResponse.redirect(
        new URL("/admin-login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};