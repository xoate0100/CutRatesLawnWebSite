"use client"

import { useState } from "react"
import { CAREERS_ROLES, type CareersRoleId } from "@/lib/careers/fact-registry"
import { cn } from "@/lib/utils"

const DAYS = [
  { day: "Mon", label: "Report → route / project work" },
  { day: "Tue", label: "Route / project · quality check" },
  { day: "Wed", label: "Route / project · notes/photos" },
  { day: "Thu", label: "Route / project · equipment care" },
  { day: "Fri", label: "Finish week · unload · documentation" },
  { day: "Sat", label: "Off (unless seasonal demand)" },
  { day: "Sun", label: "Off" },
] as const

export function SchedulePreview({ className }: { className?: string }) {
  const [roleId, setRoleId] = useState<CareersRoleId>("landscape-crew")
  const role = CAREERS_ROLES.find((r) => r.id === roleId)!
  const [active, setActive] = useState(0)

  return (
    <div className={cn("rounded-brand border border-line bg-white p-5 sm:p-6", className)}>
      <p className="text-xs font-bold uppercase tracking-wider text-green">Typical workweek</p>
      <h3 className="font-display mt-1 text-2xl font-bold text-ink">What could a normal week look like?</h3>
      <p className="mt-2 text-sm text-sage">
        Weather, workload, and season can change actual hours. This is a typical pattern — not a guarantee.
      </p>

      <label className="mt-4 block text-sm font-semibold">
        Role
        <select
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value as CareersRoleId)}
        >
          {CAREERS_ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-3 text-sm text-ink">
        <strong>Report:</strong> {role.typicalStartTime}
        <br />
        <strong>Days:</strong> {role.typicalDays}
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Week days">
        {DAYS.map((d, i) => (
          <button
            key={d.day}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={cn(
              "min-w-[3rem] shrink-0 rounded-full px-3 py-2 text-sm font-bold",
              active === i ? "bg-forest text-lime" : "bg-cream text-ink",
            )}
            onClick={() => setActive(i)}
          >
            {d.day}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-cream px-4 py-3 text-sm text-ink" role="tabpanel">
        <strong>{DAYS[active].day}:</strong> {DAYS[active].label}
        <p className="mt-1 text-sage">{role.typicalHoursNote}</p>
      </div>
    </div>
  )
}
