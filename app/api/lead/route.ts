import { NextRequest, NextResponse } from "next/server"
import { isGhlConfigured, leadToGhlInput, upsertLeadContact } from "@/lib/ghl"
import { leadSchema } from "@/lib/lead/schema"
import {
  enqueueFailedLead,
  hasIdempotencyKey,
  leadStoreMode,
  markIdempotencyKey,
  rateLimited,
} from "@/lib/lead/store"

export const runtime = "nodejs"

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  })
  const data = (await res.json()) as { success?: boolean }
  return Boolean(data.success)
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

async function deliverLead(
  lead: ReturnType<typeof leadSchema.parse>,
  requestId: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
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

  const estimateLines: string[] = []
  if (lead.estimateAmount != null && lead.estimateUnit) {
    estimateLines.push(`Planning estimate: $${lead.estimateAmount} ${lead.estimateUnit}`)
  }
  if (lead.areaSlug) estimateLines.push(`Area: ${lead.areaSlug}`)
  if (lead.qualifiedArea === false) estimateLines.push("Qualified area: false")
  if (lead.urgency) estimateLines.push(`Urgency: ${lead.urgency}`)
  if (lead.heardAboutUs) estimateLines.push(`Heard about us: ${lead.heardAboutUs}`)
  if (lead.serviceDetails) {
    for (const [k, v] of Object.entries(lead.serviceDetails)) {
      estimateLines.push(`${k}: ${String(v)}`)
    }
  }
  if (lead.propertyType) estimateLines.push(`Property: ${lead.propertyType}`)
  if (lead.lawnSizeSqFt) estimateLines.push(`Lawn size: ${lead.lawnSizeSqFt} sq ft`)
  if (lead.frequency) estimateLines.push(`Frequency: ${lead.frequency}`)
  if (lead.address) estimateLines.push(`Address: ${lead.address}`)
  const last = lead.lastTouch
  if (last?.gclid) estimateLines.push(`gclid: ${last.gclid}`)
  if (last?.utm_source) estimateLines.push(`utm: ${last.utm_source}/${last.utm_medium || ""}`)
  const enrichedMessage = [lead.message, estimateLines.length ? estimateLines.join("\n") : ""]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 5000)

  const payload = {
    requestId,
    idempotencyKey: lead.idempotencyKey,
    source: lead.source,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    service: lead.service,
    message: enrichedMessage,
    leadStatus: lead.leadStatus,
    areaSlug: lead.areaSlug ?? null,
    serviceId: lead.serviceId ?? null,
    receivedAt: new Date().toISOString(),
    storeMode: leadStoreMode(),
  }

  let delivered = false
  const failures: string[] = []

  if (ghlReady) {
    const ghl = await upsertLeadContact({
      ...leadToGhlInput({ ...lead, message: enrichedMessage }, requestId),
    })
    if (ghl.ok) delivered = true
    else failures.push(ghl.reason)
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
    if (res.ok) delivered = true
    else failures.push("Delivery provider rejected the lead.")
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
        subject: `[${lead.source === "quote" ? "Quote" : "Lead"}] ${lead.service} — ${lead.firstName} ${lead.lastName}`,
        text: [`Request ID: ${requestId}`, `Name: ${lead.firstName} ${lead.lastName}`, `Email: ${lead.email}`, `Phone: ${lead.phone}`, `Service: ${lead.service}`, `Source: ${lead.source}`, "", enrichedMessage].join("\n"),
      }),
    })
    if (res.ok) delivered = true
    else failures.push("Email provider rejected the lead.")
  }

  if (delivered) return { ok: true }
  return { ok: false, reason: failures[0] || "Lead delivery is not fully configured." }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID()
  const ip = clientIp(req)

  if (await rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly.", requestId },
      { status: 429 },
    )
  }

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
    return NextResponse.json({ ok: true, requestId, duplicate: false })
  }

  if (lead.leadStatus === "complete" && (await hasIdempotencyKey(lead.idempotencyKey))) {
    return NextResponse.json({ ok: true, requestId, duplicate: true })
  }

  const turnstileOk =
    lead.leadStatus === "partial" ? true : await verifyTurnstile(lead.turnstileToken, ip)
  if (!turnstileOk) {
    return NextResponse.json({ ok: false, error: "Spam check failed.", requestId }, { status: 400 })
  }

  const result = await deliverLead(lead, requestId)
  if (!result.ok) {
    // Only durable Redis queues may return 202 + thank-you. Memory queue is lost on cold start.
    if (leadStoreMode() === "redis") {
      const queued = await enqueueFailedLead({
        requestId,
        body: lead,
        queuedAt: new Date().toISOString(),
        attempts: 0,
      })
      if (queued) {
        return NextResponse.json(
          {
            ok: true,
            queued: true,
            requestId,
            error: result.reason,
            storeMode: leadStoreMode(),
          },
          { status: 202 },
        )
      }
    }
    console.error("lead_delivery_failed_no_durable_queue", { requestId, reason: result.reason })
    return NextResponse.json(
      {
        ok: false,
        error: result.reason,
        requestId,
        manualContactRequired: true,
        storeMode: leadStoreMode(),
      },
      { status: 503 },
    )
  }

  if (lead.leadStatus === "complete") await markIdempotencyKey(lead.idempotencyKey)
  return NextResponse.json({ ok: true, requestId, duplicate: false, storeMode: leadStoreMode() })
}
