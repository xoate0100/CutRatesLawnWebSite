"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const STEPS = [
  {
    title: "Where you report",
    detail: "Valley Center yard. Exact address and parking notes are confirmed before day one.",
  },
  {
    title: "Who you meet first",
    detail: "A named lead or supervisor — confirmed at hire. Not “figure it out alone.”",
  },
  {
    title: "What to wear / bring",
    detail: "Work boots or closed-toe footwear, weather-ready clothes, water, and your ID if asked.",
  },
  {
    title: "What we provide",
    detail: "Required PPE per policy, commercial tools after checkoff, and travel to sites when assigned.",
  },
  {
    title: "Orientation + safety",
    detail: "Timekeeping, danger zones, heat/weather, emergency reporting, and crew communication.",
  },
  {
    title: "First supervised task",
    detail: "Hands-on work under observation — mowing, cleanup, or assist duties matched to your role.",
  },
] as const

export function FirstDayPreview({ className }: { className?: string }) {
  const [open, setOpen] = useState(0)

  return (
    <div className={cn("rounded-brand border border-line bg-white p-5 sm:p-6", className)} id="first-day">
      <p className="text-xs font-bold uppercase tracking-wider text-green">Your first day</p>
      <h3 className="font-display mt-1 text-2xl font-bold text-ink">
        Know what happens before you ever clock in.
      </h3>
      <p className="mt-2 text-sm text-sage">Typical process — exact details come from recruiting before day one.</p>

      <ol className="mt-5 space-y-2">
        {STEPS.map((s, i) => {
          const active = open === i
          return (
            <li key={s.title}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-brand border px-4 py-3 text-left transition-colors",
                  active ? "border-forest bg-cream" : "border-line bg-paper hover:border-forest/40",
                )}
                aria-expanded={active}
                onClick={() => setOpen(i)}
              >
                <span className="font-display shrink-0 text-sm font-bold text-lime-2 bg-forest px-2 py-0.5 rounded">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">{s.title}</span>
                  {active ? <span className="mt-1 block text-sm text-sage">{s.detail}</span> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
