/**
 * Season helper — deterministic, overridable via NEXT_PUBLIC_CRO_SEASON_MONTH=1-12
 */
export type SeasonEmphasis = "snow" | "lights" | "aeration" | "fert" | "default"

export function currentMonth(now = new Date()): number {
  const override = Number(process.env.NEXT_PUBLIC_CRO_SEASON_MONTH)
  if (override >= 1 && override <= 12) return override
  return now.getMonth() + 1
}

export function seasonEmphasis(month = currentMonth()): SeasonEmphasis {
  if (month >= 10 || month <= 3) return "snow"
  if (month >= 9 && month <= 12) return "lights"
  if (month >= 8 && month <= 10) return "aeration"
  if (month >= 3 && month <= 6) return "fert"
  return "default"
}

const PRIORITY: Record<SeasonEmphasis, string[]> = {
  snow: ["snow-removal", "commercial", "lawn-care", "pest-control", "landscaping"],
  lights: ["holiday-lights", "landscaping", "lawn-care", "pest-control", "snow-removal"],
  aeration: ["aeration", "lawn-care", "landscaping", "pest-control"],
  fert: ["lawn-care", "landscaping", "pest-control", "aeration"],
  default: ["landscaping", "lawn-care", "pest-control"],
}

export function orderServiceIds<T extends { id: string }>(items: T[], month = currentMonth()): T[] {
  const rank = PRIORITY[seasonEmphasis(month)]
  return [...items].sort((a, b) => {
    const ia = rank.indexOf(a.id)
    const ib = rank.indexOf(b.id)
    const ra = ia === -1 ? 50 : ia
    const rb = ib === -1 ? 50 : ib
    return ra - rb
  })
}

export function seasonalAnnouncement(month = currentMonth()): string | null {
  const e = seasonEmphasis(month)
  if (e === "snow") return "Snow season — book driveway and lot service before the next freeze"
  if (e === "lights") return "Holiday lights — install windows fill up; get on the list"
  if (e === "aeration") return "Aeration & overseeding window is open"
  if (e === "fert") return "Spring fertility programs are booking"
  return null
}
