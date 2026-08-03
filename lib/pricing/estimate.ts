/**
 * Website quote estimator — planning numbers only.
 *
 * Authority (CFO / CRL projects):
 * - Residential mowing: Updated_Services_Pricing_Model.csv
 *   ($45 / $65 / $85 up to ¼ acre — Green Standard / Complete / Premier)
 * - Commercial mowing: CRL_ProposalGeneration greenbriermc.md crew model
 *   (0.00009 person-hrs/sq ft × $30 loaded labor ÷ 0.2476, ×0.85 recurring)
 * - Fertilization: CRL_Lights_Landing KC-Fert
 *   ($35/mo ≤5k sq ft; +$1.40/mo per 100 sq ft over 5k)
 * - Financial_Operating_Structure_2026.md — loaded labor ~$30/hr, Price = costs/(1−GM)
 */

export type PropertyType = "residential" | "commercial"
export type ServiceType = "mowing" | "fertilization" | "weed-control" | "full-service"
export type Frequency = "weekly" | "biweekly"
export type MowTier = "standard" | "complete" | "premier"

export type EstimateUnit = "per visit" | "per month" | "per treatment"

export type EstimateInput = {
  propertyType: PropertyType
  serviceType: ServiceType
  lawnSizeSqFt: number
  frequency: Frequency
  /** Residential mowing package; default Green Standard */
  mowTier?: MowTier
}

export type EstimateResult = {
  amount: number
  unit: EstimateUnit
  /** Short label for UI, e.g. "$45 per visit" */
  displayAmount: string
  notes: string[]
}

export const QUARTER_ACRE_SQ_FT = 10_890
export const ACRE_SQ_FT = 43_560
export const MIN_LAWN_SQ_FT = 500

/** Updated_Services_Pricing_Model.csv — residential ≤¼ acre */
export const RESIDENTIAL_MOW_PER_VISIT: Record<MowTier, number> = {
  standard: 45,
  complete: 65,
  premier: 85,
}

/** ProposalGeneration commercial crew productivity */
export const PERSON_HOURS_PER_SQ_FT = 0.00009
export const LOADED_LABOR_PER_HOUR = 30
/** Denominator from greenbriermc: absorbs materials/admin/commissions + ~40% margin */
export const COMMERCIAL_PRICE_DENOMINATOR = 0.2476
export const MIN_PERSON_HOURS = 1
export const RECURRING_EFFICIENCY = 0.85

/** KC-Fert monthly base (cents) */
export const FERT_BASE_MONTHLY_CENTS = 3500
export const FERT_OVERAGE_PER_100_CENTS = 140
export const FERT_THRESHOLD_SQ_FT = 5000

const VISITS_PER_MONTH: Record<Frequency, number> = {
  weekly: 4.33,
  biweekly: 2.17,
}

export function fertMonthlyDollars(sqFt: number): number {
  if (sqFt <= 0) return FERT_BASE_MONTHLY_CENTS / 100
  const overage = Math.max(0, sqFt - FERT_THRESHOLD_SQ_FT)
  const cents = FERT_BASE_MONTHLY_CENTS + Math.round((overage / 100) * FERT_OVERAGE_PER_100_CENTS)
  return cents / 100
}

/**
 * Residential mowing per visit.
 * Published rates apply through ¼ acre; above that, scale toward ~2× at 1 acre (planning only).
 */
export function residentialMowPerVisit(sqFt: number, tier: MowTier = "standard"): number {
  const base = RESIDENTIAL_MOW_PER_VISIT[tier]
  if (sqFt <= QUARTER_ACRE_SQ_FT) return base
  if (sqFt <= ACRE_SQ_FT) {
    const t = (sqFt - QUARTER_ACRE_SQ_FT) / (ACRE_SQ_FT - QUARTER_ACRE_SQ_FT)
    return Math.round(base * (1 + t))
  }
  const acres = sqFt / ACRE_SQ_FT
  return Math.round(base * 2 * Math.min(Math.max(acres, 1), 3))
}

/** Commercial recurring mow per visit (crew model + 15% route efficiency). */
export function commercialMowPerVisit(sqFt: number): number {
  const personHours = Math.max(MIN_PERSON_HOURS, sqFt * PERSON_HOURS_PER_SQ_FT)
  const laborCost = personHours * LOADED_LABOR_PER_HOUR
  const firstVisit = laborCost / COMMERCIAL_PRICE_DENOMINATOR
  return Math.round(firstVisit * RECURRING_EFFICIENCY)
}

/** Standalone weed treatment — same size curve as fert program monthly (planning). */
export function weedPerTreatment(sqFt: number): number {
  return Math.max(35, Math.round(fertMonthlyDollars(sqFt)))
}

export function mowPerVisit(
  propertyType: PropertyType,
  sqFt: number,
  tier: MowTier = "standard",
): number {
  return propertyType === "residential"
    ? residentialMowPerVisit(sqFt, tier)
    : commercialMowPerVisit(sqFt)
}

export function fullServiceMonthly(
  propertyType: PropertyType,
  sqFt: number,
  frequency: Frequency,
): number {
  const visit = mowPerVisit(propertyType, sqFt, "complete")
  const fert = fertMonthlyDollars(sqFt)
  return Math.round(visit * VISITS_PER_MONTH[frequency] + fert)
}

export type EstimateError = { ok: false; error: string }
export type EstimateOk = { ok: true; result: EstimateResult }

export function calculateEstimate(input: EstimateInput): EstimateError | EstimateOk {
  const { propertyType, serviceType, lawnSizeSqFt, frequency, mowTier = "standard" } = input

  if (!serviceType) {
    return { ok: false, error: "Select a service type to estimate." }
  }
  if (!Number.isFinite(lawnSizeSqFt) || lawnSizeSqFt < MIN_LAWN_SQ_FT) {
    return { ok: false, error: `Enter a lawn size of at least ${MIN_LAWN_SQ_FT} sq ft.` }
  }

  const notes: string[] = [
    "Planning estimate only — final price confirmed after property review.",
  ]

  let amount: number
  let unit: EstimateUnit

  switch (serviceType) {
    case "mowing": {
      amount = mowPerVisit(propertyType, lawnSizeSqFt, mowTier)
      unit = "per visit"
      if (propertyType === "residential" && lawnSizeSqFt <= QUARTER_ACRE_SQ_FT) {
        notes.push(
          `Based on published residential ${mowTier} mowing (up to ¼ acre). Bi-weekly uses the same per-visit rate.`,
        )
      } else if (propertyType === "commercial") {
        notes.push("Based on commercial crew productivity and loaded labor (~$30/hr).")
      }
      break
    }
    case "fertilization": {
      amount = fertMonthlyDollars(lawnSizeSqFt)
      unit = "per month"
      notes.push("KC-Fert program rate: $35/mo through 5,000 sq ft, then +$1.40 per 100 sq ft.")
      break
    }
    case "weed-control": {
      amount = weedPerTreatment(lawnSizeSqFt)
      unit = "per treatment"
      notes.push("Standalone weed treatment planning rate; often bundled with fertilization.")
      break
    }
    case "full-service": {
      amount = fullServiceMonthly(propertyType, lawnSizeSqFt, frequency)
      unit = "per month"
      notes.push(
        `Complete mowing (${frequency}) plus fertilization program. Frequency affects visit count, not per-mow rate.`,
      )
      break
    }
    default:
      return { ok: false, error: "Select a service type to estimate." }
  }

  const displayAmount = `$${amount} ${unit}`
  return { ok: true, result: { amount, unit, displayAmount, notes } }
}

/**
 * Legacy scaffold formula (pre-CFO alignment) — kept for regression comparison only.
 * Do not use for customer-facing estimates.
 */
export function legacyScaffoldEstimate(input: EstimateInput): number {
  const basePrice = input.propertyType === "residential" ? 50 : 100
  const sizeMultiplier = Math.max(input.lawnSizeSqFt, 500) / 1000
  const frequencyMultiplier = input.frequency === "weekly" ? 1 : 0.65
  let total = basePrice * sizeMultiplier * frequencyMultiplier
  switch (input.serviceType) {
    case "fertilization":
      total *= 1.2
      break
    case "weed-control":
      total *= 1.1
      break
    case "full-service":
      total *= 1.5
      break
    default:
      break
  }
  return Math.max(45, Math.round(total))
}
