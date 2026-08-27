/**
 * Careers fact registry — only assert verified facts.
 * Null / unverified fields must be omitted in production UI (never invented).
 */
export type CareersRoleId =
  | "landscape-crew"
  | "service-professional"
  | "pest-turf-tech"

export type CareersRoleFact = {
  id: CareersRoleId
  title: string
  market: string
  reportingLocation: string
  /** Omit from cards when null — do not invent ranges */
  startingPayLow: number | null
  startingPayHigh: number | null
  payFrequency: "weekly" | "biweekly" | null
  typicalDays: string
  typicalStartTime: string
  typicalHoursNote: string
  employmentStatus: string
  seasonality: string
  experienceRequired: string
  driversLicenseRequired: boolean | null
  coreDuties: string[]
  trainingPaid: boolean | null
  toolsProvided: string[]
  ppeProvided: string[]
  employeeSuppliedItems: string[]
  careerNextSteps: string[]
  /** Illustrative only for paycheck estimator — labeled non-offer */
  planningHourlyExample: number | null
}

export const CAREERS_ROLES: CareersRoleFact[] = [
  {
    id: "landscape-crew",
    title: "Landscape Crew Member",
    market: "Wichita, KS",
    reportingLocation: "Valley Center yard (exact address confirmed at hire)",
    startingPayLow: null,
    startingPayHigh: null,
    payFrequency: null,
    typicalDays: "Monday–Friday (weather can shift the day)",
    typicalStartTime: "Early morning report (exact time confirmed before day one)",
    typicalHoursNote: "Full-time field hours; overtime only when the work and season require it",
    employmentStatus: "Full-time / seasonal options may apply by opening",
    seasonality: "Outdoor work year-round with seasonal service mix",
    experienceRequired: "No prior landscaping experience required for entry openings",
    driversLicenseRequired: null,
    coreDuties: [
      "Mowing, edging, and cleanup to company standard",
      "Loading/unloading tools and protecting property",
      "Following crew lead direction and safety checkoffs",
    ],
    trainingPaid: true,
    toolsProvided: ["Commercial mowers and hand tools (after checkoff)", "Company truck travel to sites"],
    ppeProvided: ["Required PPE per company policy"],
    employeeSuppliedItems: ["Work boots / closed-toe footwear", "Weather-ready clothing"],
    careerNextSteps: ["Crew Member II / Equipment Operator", "Crew Lead", "Specialist tracks"],
    planningHourlyExample: 16,
  },
  {
    id: "service-professional",
    title: "Service Professional",
    market: "Wichita, KS",
    reportingLocation: "Valley Center yard (exact address confirmed at hire)",
    startingPayLow: null,
    startingPayHigh: null,
    payFrequency: null,
    typicalDays: "Monday–Friday route days (weather dependent)",
    typicalStartTime: "Early morning report",
    typicalHoursNote: "Weekly maintenance focus with property documentation",
    employmentStatus: "Full-time",
    seasonality: "Year-round outdoor service mix",
    experienceRequired: "Outdoor work experience helpful; training available",
    driversLicenseRequired: true,
    coreDuties: [
      "Weekly maintenance routes",
      "Quality checks and property notes/photos",
      "Customer-facing professionalism on site",
    ],
    trainingPaid: true,
    toolsProvided: ["Route equipment after qualification", "Vehicle for route work when assigned"],
    ppeProvided: ["Required PPE per company policy"],
    employeeSuppliedItems: ["Valid driver’s license when the role requires driving", "Work boots"],
    careerNextSteps: ["Crew Lead", "Turf / Pest specialist modules"],
    planningHourlyExample: 18,
  },
  {
    id: "pest-turf-tech",
    title: "Pest & Turf Technician",
    market: "Wichita, KS",
    reportingLocation: "Valley Center yard (exact address confirmed at hire)",
    startingPayLow: null,
    startingPayHigh: null,
    payFrequency: null,
    typicalDays: "Weekday service routes",
    typicalStartTime: "Early morning report",
    typicalHoursNote: "Technical outdoor work; licensing support when applicable",
    employmentStatus: "Full-time",
    seasonality: "Seasonal peaks for turf and pest programs",
    experienceRequired: "Interest in technical outdoor work; licensing path supported when required",
    driversLicenseRequired: true,
    coreDuties: [
      "Turf and/or pest service applications per plan",
      "Documentation and property protection",
      "Following label, safety, and quality standards",
    ],
    trainingPaid: true,
    toolsProvided: ["Application equipment after training/checkoff"],
    ppeProvided: ["Required PPE for chemical work per policy"],
    employeeSuppliedItems: ["Work boots", "Valid driver’s license when required"],
    careerNextSteps: ["Licensed specialist", "Lead technician", "Supervisor track"],
    planningHourlyExample: 19,
  },
]

export function getCareersRole(id: CareersRoleId): CareersRoleFact {
  const role = CAREERS_ROLES.find((r) => r.id === id)
  if (!role) throw new Error(`Unknown careers role: ${id}`)
  return role
}

export function formatPayCardLine(role: CareersRoleFact): string {
  if (role.startingPayLow != null && role.startingPayHigh != null && role.payFrequency) {
    return `$${role.startingPayLow}–$${role.startingPayHigh}/hr · ${role.payFrequency}`
  }
  return "Starting pay confirmed before you accept"
}
