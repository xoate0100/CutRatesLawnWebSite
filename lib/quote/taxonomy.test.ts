import {
  marketingServiceSlugs,
  taxonomyPageSlugs,
  GHL_SERVICE_LABELS,
  GHL_SERVICE_REQUESTED_OPTIONS,
  QUOTE_SERVICES,
  mapToGhlServiceRequested,
} from "./taxonomy"

let failed = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    failed++
  } else console.log(`ok: ${msg}`)
}

assert(QUOTE_SERVICES.length === 36, `36 quote services (got ${QUOTE_SERVICES.length})`)
assert(Object.keys(GHL_SERVICE_LABELS).length === 36, "36 GHL labels")

const picklist = GHL_SERVICE_REQUESTED_OPTIONS as readonly string[]
for (const s of QUOTE_SERVICES) {
  const label = GHL_SERVICE_LABELS[s.id]
  assert(picklist.includes(label), `picklist includes site label "${label}"`)
  assert(mapToGhlServiceRequested(s.id, s.label) === label, `${s.id} → "${label}" pass-through`)
}

assert(mapToGhlServiceRequested("holiday-lights") === "Holiday Lights", "holiday lights not collapsed")
assert(mapToGhlServiceRequested("termites") === "Termite Protection", "termites not collapsed to Pest Control")
assert(mapToGhlServiceRequested(undefined, "Sod") === "Sod", "phone-only Sod kept")
assert(mapToGhlServiceRequested(undefined, "Mystery Job") === "Other", "unknown → Other")

const mkt = new Set(marketingServiceSlugs())
const tax = new Set(taxonomyPageSlugs())
for (const s of mkt) {
  assert(tax.has(s), `taxonomy covers marketing slug ${s}`)
}

if (failed) {
  process.exit(1)
}
console.log("taxonomy: PASS")
