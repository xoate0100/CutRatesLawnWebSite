import { NextResponse } from "next/server"
import { runApiDiagnostics } from "@/lib/api-diagnostics"

export async function GET() {
  try {
    // Run API diagnostics
    const diagnostics = await runApiDiagnostics()

    // Return diagnostics results
    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      diagnostics,
    })
  } catch (error) {
    // Return error information
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
