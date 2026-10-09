/**
 * gtmEvent: single push + volatile key reset so prior event params do not leak.
 * Run: pnpm dlx tsx lib/analytics/gtm-event.test.ts
 */
import { gtmEvent, GTM_VOLATILE_KEYS } from "./gtm"

let failed = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    failed++
  } else {
    console.log(`ok: ${msg}`)
  }
}

// Minimal browser stubs for Node.
;(globalThis as unknown as { window: Window }).window = {
  dataLayer: [],
  google_tag_manager: {},
} as unknown as Window

// consent helpers read localStorage — stub empty.
const store: Record<string, string> = {}
;(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => {
    store[k] = v
  },
  removeItem: (k: string) => {
    delete store[k]
  },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k]
  },
  key: () => null,
  length: 0,
} as Storage
;(globalThis as unknown as { sessionStorage: Storage }).sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
} as Storage

type Dl = Record<string, unknown>
const dl = () => (window.dataLayer = window.dataLayer || []) as Dl[]

dl().length = 0
gtmEvent("conversion_lead", {
  service_id: "mowing",
  lead_source: "quote",
  transaction_id: "t1",
  conversion_value: 49,
})
gtmEvent("phone_click", { click_location: "header" })

const pushes = dl()
assert(pushes.length >= 4, `reset+event for each call (got ${pushes.length})`)

// Merge model simulation: apply pushes in order (undefined clears).
const model: Record<string, unknown> = {}
for (const p of pushes) {
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined) delete model[k]
    else model[k] = v
  }
}

assert(model.event === "phone_click", "last event is phone_click")
assert(model.click_location === "header", "phone click_location present")
assert(model.service_id === undefined, "service_id cleared after conversion_lead")
assert(model.lead_source === undefined, "lead_source cleared after conversion_lead")
assert(model.transaction_id === undefined, "transaction_id cleared")
assert(GTM_VOLATILE_KEYS.includes("service_id"), "volatile list includes service_id")

if (failed) {
  console.error(`\n${failed} failed`)
  process.exit(1)
}
console.log("\ngtm-event: PASS")
