import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { isGhlConfigured, upsertLeadContact } from "@/lib/ghl"

export const runtime = "nodejs"

const leadSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  service: z.string().trim().min(1).max(80),
  message: z.string().trim().max(5000).optional().default(""),
  source: z.string().trim().max(80).optional().default("contact"),
  /** Client-generated UUID for idempotent retries */
  idempotencyKey: z.string().uuid(),
  /** Honeypot — bots fill this; humans leave empty */
  companyWebsite: z.string().max(200).optional().default(""),
  turnstileToken: z.string().optional(),
})

type LeadBody = z.infer<typeof leadSchema>

const seenKeys = new Map<string, number>()
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 8
const ipHits = new Map<string, number[]>()

function pruneMaps(now: number) {
  for (const [k, t] of seenKeys) {
    if (now - t > 24 * 60 * 60 * 1000) seenKeys.delete(k)
  }
  for (const [ip, hits] of ipHits) {
    const recent = hits.filter((h) => now - h < RATE_WINDOW_MS)
    if (recent.length) ipHits.set(ip, recent)
    else ipHits.delete(ip)
  }
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // optional until configured
  if (!token) return false
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  })
  const data = (await res.json()) as { success?: boolean }
  return Boolean(data.success)
}

async function deliverLead(lead: LeadBody, requestId: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const webhook = process.env.CONTACT_FORM_WEBHOOK_URL
  const resendKey = process.env.RESEND_API_KEY
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_BUSINESS_EMAIL
  const ghlReady = isGhlConfigured()

  if (!webhook && !resendKey && !ghlReady) {
    return {
      ok: false,
      reason:
        "Lead delivery is not configured. Set GHL_PRIVATE_INTEGRATION_TOKEN + GHL_LOCATION_ID, CONTACT_FORM_WEBHOOK_URL, or RESEND_API_KEY.",
    }
  }

  const payload = {
    requestId,
    idempotencyKey: lead.idempotencyKey,
    source: lead.source,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    service: lead.service,
    message: lead.message,
    receivedAt: new Date().toISOString(),
  }

  let delivered = false
  const failures: string[] = []

  if (ghlReady) {
    const ghl = await upsertLeadContact({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      message: lead.message,
      source: lead.source,
      requestId,
    })
    if (ghl.ok) {
      delivered = true
      console.info("lead_delivered_ghl", { requestId, contactId: ghl.contactId, source: lead.source })
    } else {
      failures.push(ghl.reason)
      console.error("lead_ghl_failed", { requestId, reason: ghl.reason })
    }
  }

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": lead.idempotencyKey,
        "X-Request-Id": requestId,
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      delivered = true
      console.info("lead_delivered_webhook", { requestId, source: lead.source })
    } else {
      failures.push("Delivery provider rejected the lead.")
      console.error("lead_webhook_failed", { requestId, status: res.status })
    }
  }

  if (resendKey && notifyTo) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": lead.idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "leads@cutrateslawn.com",
        to: [notifyTo],
        subject: `[Lead] ${lead.service} — ${lead.firstName} ${lead.lastName}`,
        text: [
          `Request ID: ${requestId}`,
          `Name: ${lead.firstName} ${lead.lastName}`,
          `Email: ${lead.email}`,
          `Phone: ${lead.phone}`,
          `Service: ${lead.service}`,
          `Source: ${lead.source}`,
          "",
          lead.message,
        ].join("\n"),
      }),
    })
    if (res.ok) {
      delivered = true
      console.info("lead_delivered_resend", { requestId, source: lead.source })
    } else {
      failures.push("Email provider rejected the lead.")
      console.error("lead_resend_failed", { requestId, status: res.status })
    }
  }

  if (delivered) return { ok: true }
  return { ok: false, reason: failures[0] || "Lead delivery is not fully configured." }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID()
  const now = Date.now()
  pruneMaps(now)

  const ip = clientIp(req)
  const hits = ipHits.get(ip) ?? []
  if (hits.filter((h) => now - h < RATE_WINDOW_MS).length >= RATE_MAX) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly.", requestId },
      { status: 429 },
    )
  }
  hits.push(now)
  ipHits.set(ip, hits)

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body.", requestId }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten(), requestId },
      { status: 400 },
    )
  }

  const lead = parsed.data
  if (lead.companyWebsite) {
    // Honeypot tripped — pretend success to bots without delivering
    return NextResponse.json({ ok: true, requestId, duplicate: false })
  }

  if (seenKeys.has(lead.idempotencyKey)) {
    return NextResponse.json({ ok: true, requestId, duplicate: true })
  }

  const turnstileOk = await verifyTurnstile(lead.turnstileToken, ip)
  if (!turnstileOk) {
    return NextResponse.json({ ok: false, error: "Spam check failed.", requestId }, { status: 400 })
  }

  const result = await deliverLead(lead, requestId)
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.reason,
        requestId,
        manualContactRequired: true,
      },
      { status: 503 },
    )
  }

  seenKeys.set(lead.idempotencyKey, now)
  return NextResponse.json({ ok: true, requestId, duplicate: false })
}
