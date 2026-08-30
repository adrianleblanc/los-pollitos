import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname.startsWith("/login");

  // Check for authjs / next-auth session cookie
  const sessionCookie =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  // In production, enforce login redirection if no cookie
  if (process.env.NODE_ENV === "production" && isAdminPath && !sessionCookie) {
    const callbackUrl = encodeURIComponent(
      request.nextUrl.pathname + request.nextUrl.search
    );
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
