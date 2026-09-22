import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { siteConfig } from "@/lib/site-config"

/**
 * - Redirect legacy auth/account routes to the customer portal.
 * - Forward pathname so root generateMetadata can emit per-URL canonicals.
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

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", path)
  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    /*
     * Skip static assets and Next internals; run on pages + account redirects.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
}
