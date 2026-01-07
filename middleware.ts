import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the auth token from the cookies
  const authToken = request.cookies.get("auth_token")?.value

  // Check if the request is for a protected route
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/account") || request.nextUrl.pathname.startsWith("/dashboard")

  // If it's a protected route and there's no auth token, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If it's the login page and there is an auth token, redirect to account
  if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && authToken) {
    const accountUrl = new URL("/account", request.url)
    return NextResponse.redirect(accountUrl)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/account/:path*", "/dashboard/:path*", "/login", "/register"],
}
