import type { QuoteServiceId } from "./taxonomy"
import { getQuoteService } from "./taxonomy"

export type RoutingInput = {
  serviceId?: QuoteServiceId | string
  propertyType?: string
  propertyCount?: string | number
  sightingVsPrevention?: string
  urgency?: string
  qualifiedArea?: boolean
}

export type RoutingResult = {
  tags: string[]
  ownerEnvKey: "GHL_OWNER_SALES_ID" | "GHL_OWNER_DEFAULT_ID"
  priority: "normal" | "urgent"
}

export function routeLead(input: RoutingInput): RoutingResult {
  const tags: string[] = []
  const svc = getQuoteService(input.serviceId || "")
  const count = Number(input.propertyCount) || 0
  const commercial =
    input.propertyType === "commercial" ||
    svc?.category === "commercial" ||
    count >= 2 ||
    input.serviceId === "multi-property"

  if (commercial) tags.push("route:sales", "priority:commercial")
  if (input.sightingVsPrevention === "active" || input.urgency === "asap" || input.urgency === "today") {
    tags.push("priority:urgent", "sla:same-day")
  }
  if (input.qualifiedArea === false) tags.push("unqualified:out-of-area")

  return {
    tags: Array.from(new Set(tags)),
    ownerEnvKey: commercial ? "GHL_OWNER_SALES_ID" : "GHL_OWNER_DEFAULT_ID",
    priority: tags.includes("priority:urgent") ? "urgent" : "normal",
  }
}

export function resolveOwnerId(key: RoutingResult["ownerEnvKey"]): string | undefined {
  return process.env[key]?.trim() || undefined
}
