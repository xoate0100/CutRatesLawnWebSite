/**
 * Traffic classifier + unattributed conversion contract (F-CRO-101).
 * Run: pnpm dlx tsx lib/analytics/traffic.test.ts
 */
import { classifyTraffic } from "./traffic"

let failed = 0

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    failed++
  } else {
    console.log(`ok: ${msg}`)
  }
}

assert(classifyTraffic({ gclid: "abc" }) === "paid", "gclid is paid")
assert(classifyTraffic({ gbraid: "x" }) === "paid", "gbraid is paid")
assert(classifyTraffic({ utm_medium: "cpc", utm_source: "google" }) === "paid", "cpc is paid")
assert(classifyTraffic({ utm_source: "google", utm_medium: "organic" }) === "organic", "google organic utm")
assert(classifyTraffic({ referrer: "https://www.google.com/search?q=lawn" }) === "organic", "google referrer organic")
assert(classifyTraffic({}) === "direct", "empty is direct")
assert(
  classifyTraffic({ referrer: "https://nextdoor.com/x", pageHost: "cutrateslawn.com" }) === "referral",
  "nextdoor referral",
)
assert(
  classifyTraffic({ referrer: "https://cutrateslawn.com/services", pageHost: "cutrateslawn.com" }) ===
    "internal",
  "same-host internal",
)

/** F-CRO-101: unattributed conversion must be classifiable, not discarded. */
const organicConversion = {
  event: "conversion_lead",
  page_path: "/thank-you",
  transaction_id: "t1",
  conversion_value: 0,
  traffic_type: classifyTraffic({}),
}
assert(organicConversion.traffic_type === "direct", "unattributed conversion still classified")
assert(Boolean(organicConversion.event), "unattributed conversion object is emit-ready")

if (failed) {
  console.error(`\n${failed} failed`)
  process.exit(1)
}
console.log("\ntraffic + F-CRO-101 contract: PASS")
