/**
 * Go High Level / LeadConnector server-side client.
 */
import { routeLead, resolveOwnerId } from "@/lib/quote/routing"
import { mapToGhlServiceRequested } from "@/lib/quote/taxonomy"
import type { LeadBody } from "@/lib/lead/schema"

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
  extraTags?: string[]
  customFieldValues?: Record<string, string>
  estimateAmount?: number
  areaSlug?: string
  leadStatus?: "complete" | "partial"
  serviceId?: string
  qualifiedArea?: boolean
  propertyType?: string
  urgency?: string
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

export function slugTag(prefix: string, value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  return slug ? `${prefix}:${slug}` : prefix
}

export function leadWorkflowTags(
  lead: Pick<GhlLeadInput, "source" | "service" | "extraTags" | "areaSlug" | "leadStatus">,
): string[] {
  const extra = (process.env.GHL_LEAD_TAGS || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  return Array.from(
    new Set([
      "website-lead",
      slugTag("source", lead.source || "contact"),
      slugTag("service", lead.service || "general"),
      lead.areaSlug ? slugTag("area", lead.areaSlug) : "",
      lead.leadStatus === "partial" ? "lead-status:partial" : "lead-status:complete",
      ...(lead.extraTags || []),
      ...extra,
    ].filter(Boolean)),
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

function envCustomFields(lead: GhlLeadInput): Array<{ id: string; field_value: string }> {
  const customFields: Array<{ id: string; field_value: string }> = []
  // Service Requested is MULTIPLE_OPTIONS — value must match GHL picklist exactly.
  const serviceRequested = mapToGhlServiceRequested(lead.serviceId, lead.service)
  const pairs: Array<[string | undefined, string | undefined]> = [
    [process.env.GHL_CF_SERVICE_ID, serviceRequested],
    [process.env.GHL_CF_MESSAGE_ID, lead.message?.slice(0, 1000)],
    [process.env.GHL_CF_REQUEST_ID, lead.requestId],
    [process.env.GHL_CF_AREA_ID, lead.areaSlug],
    [process.env.GHL_CF_GCLID_ID, lead.customFieldValues?.gclid],
    [process.env.GHL_CF_LANDING_ID, lead.customFieldValues?.landing_page],
    [process.env.GHL_CF_URGENCY_ID, lead.customFieldValues?.urgency],
    [process.env.GHL_CF_SOURCE_SELF_ID, lead.customFieldValues?.heardAboutUs],
    [process.env.GHL_CF_DETAILS_ID, lead.customFieldValues?.serviceDetails],
    [process.env.GHL_CF_FIRST_TOUCH_ID, lead.customFieldValues?.firstTouch],
    [process.env.GHL_CF_LAST_TOUCH_ID, lead.customFieldValues?.lastTouch],
  ]
  for (const [id, value] of pairs) {
    if (id && value) customFields.push({ id, field_value: value })
  }
  return customFields
}

export async function upsertLeadContact(lead: GhlLeadInput): Promise<GhlUpsertResult> {
  const { token, locationId, configured } = ghlConfig()
  if (!configured || !token || !locationId) {
    return { ok: false, reason: "GHL is not configured (GHL_PRIVATE_INTEGRATION_TOKEN + GHL_LOCATION_ID)." }
  }

  const name = `${lead.firstName} ${lead.lastName}`.trim()
  const fakeEmail =
    !lead.email ||
    /@leads\.cutrateslawn\.com$/i.test(lead.email) ||
    /@applicants\.cutrateslawn\.com$/i.test(lead.email)
  const body: Record<string, unknown> = {
    locationId,
    firstName: lead.firstName,
    lastName: lead.lastName || "Lead",
    name,
    source: `website:${lead.source}`,
  }
  // Omit placeholder / invented emails so GHL workflows never mailbounce sender reputation.
  if (lead.email && !fakeEmail) body.email = lead.email
  if (lead.phone) body.phone = lead.phone

  const customFields = envCustomFields(lead)
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

  const data = (await res.json()) as { contact?: { id?: string }; new?: boolean }
  const contactId = data.contact?.id
  if (!contactId) return { ok: false, reason: "GHL upsert returned no contact id." }

  const tags = leadWorkflowTags(lead)
  await addTags(token, contactId, tags)

  if (lead.leadStatus !== "partial") {
    await createLeadOpportunity(token, locationId, contactId, lead)
  }

  console.info("ghl_lead_upserted", {
    contactId,
    isNew: Boolean(data.new),
    source: lead.source,
    tagCount: tags.length,
  })

  return { ok: true, contactId, new: Boolean(data.new) }
}

export async function createLeadOpportunity(
  token: string,
  locationId: string,
  contactId: string,
  lead: GhlLeadInput,
): Promise<void> {
  const pipelineId = process.env.GHL_PIPELINE_ID?.trim() || "F0DVnJbjW0nJMm8HlYpG"
  const stageId = process.env.GHL_PIPELINE_STAGE_ID?.trim()
  const routing = routeLead({
    serviceId: lead.serviceId,
    propertyType: lead.propertyType,
    qualifiedArea: lead.qualifiedArea,
    urgency: lead.urgency,
  })
  const owner = resolveOwnerId(routing.ownerEnvKey)
  const monetary = lead.estimateAmount && lead.estimateAmount > 0 ? lead.estimateAmount : 0
  const payload: Record<string, unknown> = {
    locationId,
    contactId,
    pipelineId,
    name: `${lead.service} — ${lead.firstName} ${lead.lastName}`.slice(0, 80),
    status: "open",
    monetaryValue: monetary,
  }
  if (stageId) payload.pipelineStageId = stageId
  if (owner) payload.assignedTo = owner

  const res = await fetch(`${GHL_BASE}/opportunities/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.error("ghl_opportunity_failed", { status: res.status, body: text.slice(0, 300) })
    return
  }
  if (routing.tags.length) await addTags(token, contactId, routing.tags)
}

export function leadToGhlInput(lead: LeadBody, requestId: string): GhlLeadInput {
  const last = lead.lastTouch || {}
  const first = lead.firstTouch || {}
  return {
    firstName: lead.firstName,
    lastName: lead.lastName || "Lead",
    email: lead.email,
    phone: lead.phone,
    service: lead.service,
    message: lead.message,
    source: lead.source,
    requestId,
    areaSlug: lead.areaSlug,
    leadStatus: lead.leadStatus,
    serviceId: lead.serviceId,
    qualifiedArea: lead.qualifiedArea,
    propertyType: lead.propertyType,
    urgency: lead.urgency,
    estimateAmount: lead.estimateAmount,
    extraTags: [
      lead.qualifiedArea === false ? "unqualified:out-of-area" : "",
    ].filter(Boolean),
    customFieldValues: {
      gclid: last.gclid || first.gclid || "",
      landing_page: first.landing_page || last.landing_page || "",
      urgency: lead.urgency || "",
      heardAboutUs: lead.heardAboutUs || "",
      serviceDetails: JSON.stringify(lead.serviceDetails || {}).slice(0, 1000),
      firstTouch: JSON.stringify(first).slice(0, 500),
      lastTouch: JSON.stringify(last).slice(0, 500),
    },
  }
}

export { GHL_BASE, GHL_VERSION, headers as ghlHeaders, ghlConfig }
