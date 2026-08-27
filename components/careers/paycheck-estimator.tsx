"use client"

import { useMemo, useState } from "react"
import { CAREERS_ROLES, type CareersRoleId } from "@/lib/careers/fact-registry"
import { estimateGrossPaycheck } from "@/lib/careers/paycheck-math"
import { cn } from "@/lib/utils"

export function PaycheckEstimator({ className }: { className?: string }) {
  const [roleId, setRoleId] = useState<CareersRoleId>("landscape-crew")
  const role = CAREERS_ROLES.find((r) => r.id === roleId)!
  const [hourly, setHourly] = useState(role.planningHourlyExample ?? 16)
  const [hours, setHours] = useState(40)
  const [ot, setOt] = useState(0)
  const [freq, setFreq] = useState<"weekly" | "biweekly">("weekly")

  const result = useMemo(
    () =>
      estimateGrossPaycheck({
        hourlyRate: hourly,
        regularHours: hours,
        overtimeHours: ot,
        payFrequency: freq,
      }),
    [hourly, hours, ot, freq],
  )

  return (
    <div className={cn("rounded-brand border border-line bg-white p-5 sm:p-6", className)}>
      <p className="text-xs font-bold uppercase tracking-wider text-green">Paycheck preview</p>
      <h3 className="font-display mt-1 text-2xl font-bold text-ink">See what a paycheck could look like.</h3>
      <p className="mt-2 text-sm text-sage">
        Choose a role and typical hours. We show a <strong>gross</strong> estimate before taxes and deductions —
        not take-home pay. Planning rates are examples until Ops publishes verified ranges.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Role
          <select
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
            value={roleId}
            onChange={(e) => {
              const id = e.target.value as CareersRoleId
              setRoleId(id)
              const next = CAREERS_ROLES.find((r) => r.id === id)
              if (next?.planningHourlyExample) setHourly(next.planningHourlyExample)
            }}
          >
            {CAREERS_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink">
          Pay frequency
          <select
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
            value={freq}
            onChange={(e) => setFreq(e.target.value as "weekly" | "biweekly")}
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold text-ink">
        Hourly rate (planning example): ${hourly.toFixed(0)}/hr
        <input
          type="range"
          min={14}
          max={28}
          step={1}
          value={hourly}
          onChange={(e) => setHourly(Number(e.target.value))}
          className="mt-2 w-full accent-forest"
          aria-valuetext={`${hourly} dollars per hour`}
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-ink">
        Regular hours this pay period: {hours}
        <input
          type="range"
          min={20}
          max={50}
          step={1}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="mt-2 w-full accent-forest"
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-ink">
        Overtime hours (optional — only if OT is real for you): {ot}
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={ot}
          onChange={(e) => setOt(Number(e.target.value))}
          className="mt-2 w-full accent-forest"
        />
      </label>

      <div className="mt-6 rounded-brand bg-forest px-5 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-lime">Estimated gross pay</p>
        <p className="font-display mt-1 text-3xl font-extrabold">${result.grossPaycheck.toFixed(2)}</p>
        <p className="mt-1 text-sm text-white/75">
          About ${result.grossMonthly.toFixed(0)}/mo gross · taxes and deductions not included
        </p>
      </div>
    </div>
  )
}
