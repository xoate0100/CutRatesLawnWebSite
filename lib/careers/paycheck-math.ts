/** Pure paycheck math — gross only, no tax assumptions. */
export type PaycheckEstimateInput = {
  hourlyRate: number
  regularHours: number
  overtimeHours: number
  payFrequency: "weekly" | "biweekly"
}

export type PaycheckEstimateResult = {
  grossPaycheck: number
  grossMonthly: number
  overtimeHoursUsed: number
  labeled: "gross-estimate"
}

export function estimateGrossPaycheck(input: PaycheckEstimateInput): PaycheckEstimateResult {
  const rate = Math.max(0, Number(input.hourlyRate) || 0)
  const regular = Math.min(80, Math.max(0, Number(input.regularHours) || 0))
  // Only count OT when caller explicitly provides it; never invent OT.
  const ot = Math.min(40, Math.max(0, Number(input.overtimeHours) || 0))
  const otPay = ot * rate * 1.5
  const regularPay = regular * rate
  const period = regularPay + otPay
  const periodsPerMonth = input.payFrequency === "weekly" ? 52 / 12 : 26 / 12
  return {
    grossPaycheck: Math.round(period * 100) / 100,
    grossMonthly: Math.round(period * periodsPerMonth * 100) / 100,
    overtimeHoursUsed: ot,
    labeled: "gross-estimate",
  }
}
