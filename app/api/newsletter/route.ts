import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { isGhlConfigured, upsertLeadContact } from "@/lib/ghl"

export const runtime = "nodejs"

const schema = z.object({
  email: z.string().trim().email().max(254),
  consent: z.literal(true),
  source: z.string().max(40).optional(),
  idempotencyKey: z.string().uuid(),
})

const seen = new Map<string, number>()

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID()
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON.", requestId }, { status: 400 })
  }

  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed.", requestId }, { status: 400 })
  }

  if (seen.has(parsed.data.idempotencyKey)) {
    return NextResponse.json({ ok: true, requestId, duplicate: true })
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL || process.env.CONTACT_FORM_WEBHOOK_URL
  const resendKey = process.env.RESEND_API_KEY
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_BUSINESS_EMAIL
  const ghlReady = isGhlConfigured()

  if (!webhook && !resendKey && !ghlReady) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Newsletter delivery is not configured. Set GHL_PRIVATE_INTEGRATION_TOKEN + GHL_LOCATION_ID, NEWSLETTER_WEBHOOK_URL, or RESEND_API_KEY.",
        requestId,
      },
      { status: 503 },
    )
  }

  let delivered = false

  if (ghlReady) {
    const ghl = await upsertLeadContact({
      firstName: "Newsletter",
      lastName: "Subscriber",
      email: parsed.data.email,
      service: "newsletter",
      message: "Newsletter subscribe",
      source: parsed.data.source || "newsletter",
      requestId,
    })
    if (ghl.ok) {
      delivered = true
      console.info("newsletter_delivered_ghl", { requestId, contactId: ghl.contactId })
    } else {
      console.error("newsletter_ghl_failed", { requestId, reason: ghl.reason })
    }
  }

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": parsed.data.idempotencyKey,
      },
      body: JSON.stringify({
        type: "newsletter_subscribe",
        email: parsed.data.email,
        consent: true,
        source: parsed.data.source,
        requestId,
      }),
    })
    if (res.ok) {
      delivered = true
    } else {
      console.error("newsletter_webhook_failed", { requestId, status: res.status })
    }
  }

  if (!delivered && resendKey && notifyTo) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": parsed.data.idempotencyKey,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "leads@cutrateslawn.com",
        to: [notifyTo],
        subject: `[Newsletter] ${parsed.data.email}`,
        text: `Newsletter subscribe request\nEmail: ${parsed.data.email}\nSource: ${parsed.data.source}\nRequest: ${requestId}`,
      }),
    })
    if (res.ok) {
      delivered = true
    } else {
      console.error("newsletter_resend_failed", { requestId, status: res.status })
    }
  }

  if (!delivered) {
    return NextResponse.json({ ok: false, error: "Newsletter delivery failed.", requestId }, { status: 502 })
  }

  seen.set(parsed.data.idempotencyKey, Date.now())
  console.info("newsletter_subscribed", { requestId, source: parsed.data.source })
  return NextResponse.json({ ok: true, requestId })
}
