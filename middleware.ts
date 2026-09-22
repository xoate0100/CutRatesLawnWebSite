import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { siteConfig } from "@/lib/site-config"

/**
 * Redirect legacy auth/account routes to the customer portal.
 * No local session cookies — accounts live in PestPortals.
 */
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (
    path.startsWith("/account") ||
    path.startsWith("/dashboard") ||
    path === "/login" ||
    path === "/register"
  ) {
    return NextResponse.redirect(siteConfig.customerPortalUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/dashboard/:path*", "/login", "/register"],
}
