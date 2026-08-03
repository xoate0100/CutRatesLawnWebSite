/**
 * Math tests for CFO-aligned quote estimator.
 * Run: npx --yes tsx lib/pricing/estimate.test.ts
 */
import {
  calculateEstimate,
  commercialMowPerVisit,
  fertMonthlyDollars,
  legacyScaffoldEstimate,
  residentialMowPerVisit,
  weedPerTreatment,
  fullServiceMonthly,
} from "./estimate"

let failed = 0

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    failed++
  } else {
    console.log(`ok: ${msg}`)
  }
}

function assertClose(actual: number, expected: number, msg: string, tol = 0) {
  const ok = Math.abs(actual - expected) <= tol
  assert(ok, `${msg} (got ${actual}, expected ${expected}±${tol})`)
}

// --- CFO anchors: residential mowing (Updated_Services_Pricing_Model.csv) ---
assertClose(residentialMowPerVisit(2000, "standard"), 45, "res mow 2k standard")
assertClose(residentialMowPerVisit(5000, "standard"), 45, "res mow 5k standard")
assertClose(residentialMowPerVisit(10000, "standard"), 45, "res mow 10k (≤¼ acre) standard")
assertClose(residentialMowPerVisit(10890, "complete"), 65, "res mow ¼ acre complete")
assertClose(residentialMowPerVisit(10890, "premier"), 85, "res mow ¼ acre premier")

// --- KC-Fert monthly (CRL_Lights_Landing) ---
assertClose(fertMonthlyDollars(4000), 35, "fert ≤5k = $35")
assertClose(fertMonthlyDollars(5000), 35, "fert 5k = $35")
assertClose(fertMonthlyDollars(6000), 49, "fert 6k = $49")
assertClose(fertMonthlyDollars(8000), 77, "fert 8k = $77")

// --- Commercial crew model (greenbriermc) ---
// 8,847 sq ft → min 1 person-hr → 30/0.2476 * 0.85 ≈ 103
assertClose(commercialMowPerVisit(8847), 103, "Garden Pines-scale commercial recurring", 1)
// 32,104 → continuous 2.889 ph → ~$298 recurring (doc rounded to 3 ph → $309)
assertClose(commercialMowPerVisit(32104), 298, "Golf Park-scale commercial recurring", 1)

// --- Weed / full-service sanity ---
assertClose(weedPerTreatment(5000), 35, "weed treatment ~ fert base")
assertClose(fullServiceMonthly("residential", 5000, "weekly"), Math.round(65 * 4.33 + 35), "full-service weekly 5k")
assertClose(fullServiceMonthly("residential", 5000, "biweekly"), Math.round(65 * 2.17 + 35), "full-service biweekly 5k")

// --- calculateEstimate API ---
{
  const r = calculateEstimate({
    propertyType: "residential",
    serviceType: "mowing",
    lawnSizeSqFt: 2000,
    frequency: "weekly",
  })
  assert(r.ok === true && r.result.amount === 45 && r.result.unit === "per visit", "API res weekly mow $45/visit")
}
{
  const r = calculateEstimate({
    propertyType: "residential",
    serviceType: "mowing",
    lawnSizeSqFt: 2000,
    frequency: "biweekly",
  })
  assert(r.ok === true && r.result.amount === 45, "biweekly does not discount per-visit mow rate")
}
{
  const r = calculateEstimate({
    propertyType: "residential",
    serviceType: "fertilization",
    lawnSizeSqFt: 5000,
    frequency: "weekly",
  })
  assert(r.ok === true && r.result.amount === 35 && r.result.unit === "per month", "API fert $35/mo")
}
{
  const r = calculateEstimate({
    propertyType: "commercial",
    serviceType: "mowing",
    lawnSizeSqFt: 5000,
    frequency: "weekly",
  })
  assert(r.ok === true && r.result.amount === commercialMowPerVisit(5000), "API commercial mow matches crew model")
}

// --- Legacy scaffold is unrealistic vs CFO (documents why we replaced it) ---
{
  const legacy = legacyScaffoldEstimate({
    propertyType: "residential",
    serviceType: "mowing",
    lawnSizeSqFt: 5000,
    frequency: "weekly",
  })
  const cfo = residentialMowPerVisit(5000)
  assert(legacy === 250, `legacy scaffold still computes $250 for 5k res mow (got ${legacy})`)
  assert(cfo === 45, "CFO rate is $45")
  assert(legacy > cfo * 3, "legacy overprices residential mowing by >3× vs CFO")
}
{
  const legacy = legacyScaffoldEstimate({
    propertyType: "residential",
    serviceType: "fertilization",
    lawnSizeSqFt: 5000,
    frequency: "weekly",
  })
  assert(legacy === 300, `legacy fert planning was $300/visit-ish (got ${legacy})`)
  assert(fertMonthlyDollars(5000) === 35, "CFO fert is $35/month")
}

// --- Realistic range checks (Wichita residential planning band) ---
for (const sq of [1500, 3000, 5500, 8000, 10000]) {
  const mow = residentialMowPerVisit(sq)
  assert(mow >= 45 && mow <= 85, `res mow ${sq} sq ft in $45–$85 band for ≤¼ acre (got $${mow})`)
}

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed`)
  process.exit(1)
}
console.log("\nAll pricing estimate tests passed")
