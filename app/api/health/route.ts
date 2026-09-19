import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Non-sensitive liveness check only.
 * Full API diagnostics must not be public in production.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
}
