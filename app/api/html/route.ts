import { NextResponse } from "next/server"

export function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 })
  }
  return new Response("<h1>Test Page</h1>", {
    headers: { "Content-Type": "text/html" },
  })
}
