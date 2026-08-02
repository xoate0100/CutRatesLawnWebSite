/**
 * Go High Level / LeadConnector server-side client.
 * Used by /api/lead to upsert contacts that trigger GHL workflows via tags.
 *
 * Auth: Private Integration Token (sub-account) — never expose to the browser.
 * Docs: https://marketplace.gohighlevel.com/docs/
 */

const GHL_BASE = "https://services.leadconnectorhq.com"
const GHL_VERSION = "2021-07-28"

export type GhlLeadInput = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  service: string
  message?: string
  source: string
  requestId: string
}

export type GhlUpsertResult =
  | { ok: true; contactId: string; new: boolean }
  | { ok: false; reason: string; status?: number }

function ghlConfig() {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN?.trim()
  const locationId = process.env.GHL_LOCATION_ID?.trim()
  return { token, locationId, configured: Boolean(token && locationId) }
}

export function isGhlConfigured(): boolean {
  return ghlConfig().configured
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Version: GHL_VERSION,
    Accept: "application/json",
    "Content-Type": "application/json",
  }
}

function slugTag(prefix: string, value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  return slug ? `${prefix}:${slug}` : prefix
}

/** Tags used by GHL workflows (add via /tags so upsert does not wipe existing tags). */
export function leadWorkflowTags(lead: Pick<GhlLeadInput, "source" | "service">): string[] {
  const extra = (process.env.GHL_LEAD_TAGS || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  return Array.from(
    new Set([
      "website-lead",
      slugTag("source", lead.source || "contact"),
      slugTag("service", lead.service || "general"),
      ...extra,
    ]),
  )
}

async function addTags(token: string, contactId: string, tags: string[]): Promise<boolean> {
  if (!tags.length) return true
  const res = await fetch(`${GHL_BASE}/contacts/${contactId}/tags`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ tags }),
  })
  if (!res.ok) {
    console.error("ghl_add_tags_failed", { contactId, status: res.status })
    return false
  }
  return true
}

/**
 * Upsert contact in the configured location, then add workflow tags.
 * GHL automations should trigger on tag `website-lead` (and optionally source/service tags).
 */
export async function upsertLeadContact(lead: GhlLeadInput): Promise<GhlUpsertResult> {
  const { token, locationId, configured } = ghlConfig()
  if (!configured || !token || !locationId) {
    return { ok: false, reason: "GHL is not configured (GHL_PRIVATE_INTEGRATION_TOKEN + GHL_LOCATION_ID)." }
  }

  const name = `${lead.firstName} ${lead.lastName}`.trim()
  const body: Record<string, unknown> = {
    locationId,
    firstName: lead.firstName,
    lastName: lead.lastName,
    name,
    email: lead.email,
    source: `website:${lead.source}`,
  }
  if (lead.phone) body.phone = lead.phone

  // Custom fields are optional — set GHL_CF_* env vars to field IDs from Locations → Custom Fields.
  const customFields: Array<{ id: string; field_value: string }> = []
  const serviceCf = process.env.GHL_CF_SERVICE_ID?.trim()
  const messageCf = process.env.GHL_CF_MESSAGE_ID?.trim()
  const requestCf = process.env.GHL_CF_REQUEST_ID?.trim()
  if (serviceCf) customFields.push({ id: serviceCf, field_value: lead.service })
  if (messageCf && lead.message) customFields.push({ id: messageCf, field_value: lead.message.slice(0, 1000) })
  if (requestCf) customFields.push({ id: requestCf, field_value: lead.requestId })
  if (customFields.length) body.customFields = customFields

  const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.error("ghl_upsert_failed", { status: res.status, body: text.slice(0, 300) })
    return { ok: false, reason: "Go High Level rejected the contact upsert.", status: res.status }
  }

  const data = (await res.json()) as {
    contact?: { id?: string }
    new?: boolean
  }
  const contactId = data.contact?.id
  if (!contactId) {
    return { ok: false, reason: "GHL upsert returned no contact id." }
  }

  const tags = leadWorkflowTags(lead)
  await addTags(token, contactId, tags)

  console.info("ghl_lead_upserted", {
    contactId,
    isNew: Boolean(data.new),
    source: lead.source,
    tagCount: tags.length,
  })

  return { ok: true, contactId, new: Boolean(data.new) }
}
