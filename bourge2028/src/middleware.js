// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "Admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

  }

  return NextResponse.next();
}

// routes protégées
export const config = {
  matcher: ["/admin/:path*"],
};
