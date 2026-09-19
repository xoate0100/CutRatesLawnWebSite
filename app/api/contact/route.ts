import { NextResponse } from "next/server"

/** Legacy stub removed — use POST /api/lead. */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "This endpoint is gone. Submit leads via POST /api/lead.",
    },
    { status: 410 },
  )
}

export async function GET() {
  return new NextResponse(null, { status: 404 })
}
