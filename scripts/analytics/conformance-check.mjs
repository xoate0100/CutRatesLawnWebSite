#!/usr/bin/env node
/** Offline conformance against vendored analytics.tracking suite. */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { runSuite } from "../../adapters/node/lib/conformance_runner.mjs"
import {
  AnalyticsTrackingProvider,
  BrokenAnalyticsTrackingProvider,
} from "../../lib/analytics/conformance-provider.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const vendored = path.join(root, "vendor/capabilities/analytics.tracking")
const suitePath = path.join(vendored, "conformance/suite.json")

if (!fs.existsSync(suitePath)) {
  console.error("Missing vendored suite:", suitePath)
  process.exit(2)
}

const suite = JSON.parse(fs.readFileSync(suitePath, "utf8"))

function check(label, impl) {
  const result = runSuite(impl, suite)
  if (!result.passed) {
    console.error(`${label} FAILED:`, result.failed_ids)
    process.exit(1)
  }
  console.log(`${label} OK (${suite.cases.length} cases)`)
}

check("conformant", new AnalyticsTrackingProvider())

const broken = runSuite(new BrokenAnalyticsTrackingProvider(), suite)
if (broken.passed) {
  console.error("Broken provider should FAIL suite (attribution bite missing)")
  process.exit(1)
}
if (!broken.failed_ids.includes("reject-conversion-missing-attribution")) {
  console.error("Expected reject-conversion-missing-attribution in", broken.failed_ids)
  process.exit(1)
}
console.log("broken provider correctly fails attribution case")

console.log("analytics.tracking offline conformance: PASS")
