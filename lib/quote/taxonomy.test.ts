import { marketingServiceSlugs, taxonomyPageSlugs, GHL_SERVICE_LABELS, QUOTE_SERVICES } from "./taxonomy"

let failed = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    failed++
  } else console.log(`ok: ${msg}`)
}

assert(QUOTE_SERVICES.length === 36, `36 quote services (got ${QUOTE_SERVICES.length})`)
assert(Object.keys(GHL_SERVICE_LABELS).length === 36, "36 GHL labels")

const mkt = new Set(marketingServiceSlugs())
const tax = new Set(taxonomyPageSlugs())
for (const s of mkt) {
  assert(tax.has(s), `taxonomy covers marketing slug ${s}`)
}

if (failed) {
  process.exit(1)
}
console.log("taxonomy: PASS")
