/**
 * Gross paycheck estimator — careers site.
 * Run: pnpm dlx tsx lib/careers/paycheck-math.test.ts
 */
import { estimateGrossPaycheck } from "./paycheck-math"

let failed = 0

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`FAIL: ${msg}`)
    failed++
  } else {
    console.log(`ok: ${msg}`)
  }
}

function assertClose(actual: number, expected: number, msg: string, tol = 0.01) {
  assert(Math.abs(actual - expected) <= tol, `${msg} (got ${actual}, expected ${expected})`)
}

{
  const r = estimateGrossPaycheck({
    hourlyRate: 16,
    regularHours: 40,
    overtimeHours: 0,
    payFrequency: "weekly",
  })
  assertClose(r.grossPaycheck, 640, "40h @ $16 weekly gross")
  assertClose(r.grossMonthly, 640 * (52 / 12), "weekly → monthly gross")
  assert(r.labeled === "gross-estimate", "labeled gross-estimate")
  assert(r.overtimeHoursUsed === 0, "no invented OT")
}

{
  const r = estimateGrossPaycheck({
    hourlyRate: 18,
    regularHours: 40,
    overtimeHours: 4,
    payFrequency: "biweekly",
  })
  assertClose(r.grossPaycheck, 40 * 18 + 4 * 18 * 1.5, "OT at 1.5x when provided")
  assertClose(r.grossMonthly, r.grossPaycheck * (26 / 12), "biweekly → monthly")
}

{
  const r = estimateGrossPaycheck({
    hourlyRate: -5,
    regularHours: -10,
    overtimeHours: 100,
    payFrequency: "weekly",
  })
  assert(r.grossPaycheck >= 0, "clamps negative rates/hours")
  assert(r.overtimeHoursUsed === 40, "OT capped at 40")
}

if (failed > 0) {
  console.error(`\n${failed} paycheck math test(s) failed`)
  process.exit(1)
}
console.log("\nAll paycheck math tests passed")
