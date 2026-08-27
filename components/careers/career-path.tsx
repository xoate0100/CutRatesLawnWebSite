"use client"

import { useState } from "react"
import { CAREERS_ROLES, type CareersRoleId } from "@/lib/careers/fact-registry"
import { cn } from "@/lib/utils"

const TRACKS = [
  {
    id: "equipment",
    label: "Equipment",
    milestones: [
      "Safety Ready + hand tools",
      "Trimmer / blower checkoff",
      "Mower / stand-on qualification",
      "Equipment Operator eligibility when openings exist",
    ],
  },
  {
    id: "leadership",
    label: "Crew Leadership",
    milestones: [
      "Crew communication + quality notes",
      "Brief crew / coach safely",
      "Crew Lead Ready skills",
      "Supervisor track when openings exist",
    ],
  },
  {
    id: "turf",
    label: "Turf / Fertilization",
    milestones: [
      "Property protection + documentation",
      "Turf product handling basics",
      "Route workflow under supervision",
      "Specialist eligibility after training/licensing when required",
    ],
  },
  {
    id: "pest",
    label: "Pest Control",
    milestones: [
      "Safety + label awareness",
      "Assisted applications",
      "Licensing support when the role requires it",
      "Lead technician eligibility when openings exist",
    ],
  },
  {
    id: "irrigation",
    label: "Irrigation",
    milestones: [
      "Site awareness + property protection",
      "Assist irrigation service under supervision",
      "Troubleshooting modules as offered",
      "Specialist eligibility when openings exist",
    ],
  },
  {
    id: "operations",
    label: "Operations",
    milestones: [
      "Reliable attendance + documentation",
      "Cross-crew coordination",
      "Quality and retention ownership",
      "Ops leadership when openings exist",
    ],
  },
] as const

export function CareerPathSimulator({ className }: { className?: string }) {
  const [startId, setStartId] = useState<CareersRoleId>("landscape-crew")
  const [trackId, setTrackId] = useState<(typeof TRACKS)[number]["id"]>("equipment")
  const start = CAREERS_ROLES.find((r) => r.id === startId)!
  const track = TRACKS.find((t) => t.id === trackId)!

  return (
    <div className={cn("rounded-brand border border-line bg-forest p-5 text-white sm:p-6", className)} id="path">
      <p className="text-xs font-bold uppercase tracking-wider text-lime">Build your path</p>
      <h3 className="font-display mt-1 text-2xl font-bold">Start where you are. Move up by proving skills.</h3>
      <p className="mt-2 text-sm text-white/75">
        Competency-based and subject to openings — not a guaranteed promotion timeline.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Starting role
          <select
            className="mt-1 w-full rounded-lg border border-white/20 bg-forest-2 px-3 py-2 font-normal text-white"
            value={startId}
            onChange={(e) => setStartId(e.target.value as CareersRoleId)}
          >
            {CAREERS_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          What you want to learn
          <select
            className="mt-1 w-full rounded-lg border border-white/20 bg-forest-2 px-3 py-2 font-normal text-white"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value as (typeof TRACKS)[number]["id"])}
          >
            {TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {track.milestones.map((m, i) => (
          <li key={m} className="rounded-brand border border-white/15 bg-white/5 p-4">
            <span className="font-display text-sm font-bold text-lime">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-2 text-sm leading-snug text-white/90">{m}</p>
          </li>
        ))}
      </ol>

      <p className="mt-5 rounded-lg bg-lime/15 px-4 py-3 text-sm text-lime">
        If you start as <strong>{start.title}</strong> and qualify on {track.label.toLowerCase()} skills, you can become
        eligible for the next role when an opening is available.
      </p>
    </div>
  )
}
