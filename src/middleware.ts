import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

export default async function middleware(req: NextRequestWithAuth) {
  // Rate limiting
  const ip = req.ip ?? "127.0.0.1";
  const { success, limit, reset, remaining } = await ratelimit.limit(
    `ratelimit_${ip}`
  );

  if (!success) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    });
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return response;
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  // Role-based access control
  const role = token.role as string;
  const isAdmin = role === "ADMIN";

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/members/register") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/members/:path*",
    "/auth/:path*",
    "/api/members/:path*",
    "/api/certificates/:path*",
  ],
};
