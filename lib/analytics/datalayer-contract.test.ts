/**
 * dataLayer contract — CI gate (Phase 6).
 * Runtime always emits conversions; vendor analytics.tracking may still require attribution.
 * Run: pnpm dlx tsx lib/analytics/datalayer-contract.test.ts
 */
import { classifyTraffic } from "./traffic"
import {
  CONVERSION_EVENTS,
  CONVERSION_GATED_ON_ATTRIBUTION,
  DATALAYER_CONTRACT_FIELDS,
} from "./types"

let failed = 0

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    failed++
  } else {
    console.log(`ok: ${msg}`)
  }
}

const required = ["event", "page_path", "timestamp", "traffic_type", "session_id"] as const
for (const field of required) {
  assert(DATALAYER_CONTRACT_FIELDS.includes(field), `contract includes ${field}`)
}

assert(CONVERSION_EVENTS.has("conversion_lead"), "conversion_lead is a conversion event")
assert(
  CONVERSION_GATED_ON_ATTRIBUTION === false,
  "runtime must not drop conversions for missing UTM/gclid (F-CRO-101)",
)

const organicPayload: Record<string, unknown> = {
  event: "conversion_lead",
  page_path: "/thank-you/mowing",
  timestamp: Date.now(),
  traffic_type: classifyTraffic({}),
  session_id: "session_contract_test",
  transaction_id: "rid-organic",
  conversion_value: 45,
  currency: "USD",
  conversion_gated_on_attribution: CONVERSION_GATED_ON_ATTRIBUTION,
}

for (const field of DATALAYER_CONTRACT_FIELDS) {
  assert(organicPayload[field] != null && organicPayload[field] !== "", `organic payload has ${field}`)
}

assert(organicPayload.traffic_type === "direct", "no-click-id traffic is still typed (direct)")
assert(
  Boolean(organicPayload.event) && Boolean(organicPayload.page_path),
  "organic conversion is emit-ready without utm_source or gclid",
)

const paidPayload = {
  ...organicPayload,
  traffic_type: classifyTraffic({ gclid: "TesTclId" }),
  gclid: "TesTclId",
}
assert(paidPayload.traffic_type === "paid", "gclid still classifies as paid")

if (failed) {
  console.error(`\n${failed} failed`)
  process.exit(1)
}
console.log("\ndataLayer contract: PASS")
