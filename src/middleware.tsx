import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import CommonConstants from "./constants/commanConstants";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(CommonConstants.TICKET_KEY)?.value;
  const { pathname } = req.nextUrl;

  // Create a response object
  const res = NextResponse.next();

  // If token expired or you want to force logout -> delete cookie
  if (!token) {
    res.cookies.set({
      name: CommonConstants.TICKET_KEY,
      value: "",
      maxAge: 0, // expire immediately
      path: "/",
    });

    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  }

  // Prevent logged-in users from accessing /login
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/calls", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/calls/:path*"],
};
