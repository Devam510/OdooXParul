import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/shared", "/explore"];
const API_PUBLIC = ["/api/auth/login", "/api/auth/signup", "/api/auth/refresh", "/api/auth/forgot-password", "/api/auth/reset-password", "/api/shared"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (API_PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // API routes — token checked in withAuth wrapper, not here
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // Dashboard routes — check token
  const token = req.cookies.get("access_token")?.value
    ?? req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyAccessToken(token);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("access_token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
