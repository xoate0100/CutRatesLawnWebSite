import { NextRequest, NextResponse } from "next/server"
import { leadSchema } from "@/lib/lead/schema"
import { dequeueFailedLeads, enqueueFailedLead } from "@/lib/lead/store"

export const runtime = "nodejs"

async function runRetry(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim()
  const auth = req.headers.get("authorization") || ""
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "HUMAN SETUP: Set CRON_SECRET and a Vercel Cron for /api/cron/lead-retry." },
      { status: 501 },
    )
  }
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const batch = await dequeueFailedLeads(15)
  const retried: string[] = []
  const failed: string[] = []
  for (const item of batch) {
    try {
      const parsed = leadSchema.safeParse(item.body)
      if (!parsed.success) {
        failed.push(item.requestId)
        continue
      }
      const res = await fetch(new URL("/api/lead", req.url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, companyWebsite: "" }),
      })
      if (res.ok || res.status === 202) retried.push(item.requestId)
      else {
        failed.push(item.requestId)
        await enqueueFailedLead({ ...item, attempts: item.attempts + 1 })
      }
    } catch {
      failed.push(item.requestId)
      await enqueueFailedLead({ ...item, attempts: item.attempts + 1 })
    }
  }
  return NextResponse.json({ ok: true, retried: retried.length, failed: failed.length })
}

/** Vercel Cron invokes GET. Manual retries may POST. */
export async function GET(req: NextRequest) {
  return runRetry(req)
}

export async function POST(req: NextRequest) {
  return runRetry(req)
}
