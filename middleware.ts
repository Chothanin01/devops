import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest } from "next/server";

export const { auth } = NextAuth(authConfig);

export function middleware(req: NextRequest) {
  return auth(req as any); // auth expects NextRequest internally
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
