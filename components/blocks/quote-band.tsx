"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pill } from "@/components/ui/pill"
import {
  calculateEstimate,
  type Frequency,
  type PropertyType,
  type ServiceType,
} from "@/lib/pricing/estimate"
import { pageWrap } from "@/lib/layout"
import { cn } from "@/lib/utils"

function Seg({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mt-1 flex overflow-hidden rounded-xl border border-[rgba(11,58,30,0.2)] bg-white/50">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cn(
            "flex-1 px-3 py-2 text-sm font-bold transition-colors",
            value === opt.value ? "bg-forest text-white" : "text-forest-2 hover:bg-white/80",
          )}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/** Compact estimator for the quote band — preserves calculateEstimate math. */
export function QuoteEstimator({ className }: { className?: string }) {
  const [propertyType, setPropertyType] = useState<PropertyType>("residential")
  const [frequency, setFrequency] = useState<Frequency>("weekly")
  const [lawnSize, setLawnSize] = useState(2000)
  const serviceType: ServiceType = "mowing"

  const estimate = useMemo(() => {
    return calculateEstimate({
      propertyType,
      serviceType,
      lawnSizeSqFt: lawnSize,
      frequency,
    })
  }, [propertyType, lawnSize, frequency])

  const display = estimate.ok ? estimate.result.displayAmount : "—"

  return (
    <div
      className={cn(
        "rounded-brand border border-[rgba(11,58,30,0.18)] bg-white/70 p-5 shadow-brand backdrop-blur-sm",
        className,
      )}
    >
      <label className="text-sm font-bold text-forest-2">Property type</label>
      <Seg
        options={[
          { label: "Residential", value: "residential" },
          { label: "Commercial", value: "commercial" },
        ]}
        value={propertyType}
        onChange={(v) => setPropertyType(v as PropertyType)}
      />

      <label htmlFor="quote-band-lawn-size" className="mt-3 block text-sm font-bold text-forest-2">
        Lawn size — <span>{lawnSize.toLocaleString()}</span> sq ft
      </label>
      <input
        id="quote-band-lawn-size"
        type="range"
        min={500}
        max={15000}
        step={250}
        value={lawnSize}
        onChange={(e) => setLawnSize(Number(e.target.value))}
        className="mt-1 w-full accent-forest"
        aria-valuemin={500}
        aria-valuemax={15000}
        aria-valuenow={lawnSize}
      />

      <label className="mt-3 block text-sm font-bold text-forest-2">Frequency</label>
      <Seg
        options={[
          { label: "Weekly", value: "weekly" },
          { label: "Bi-weekly", value: "biweekly" },
        ]}
        value={frequency}
        onChange={(v) => setFrequency(v as Frequency)}
      />

      <div className="mt-4 rounded-xl bg-forest/5 px-4 py-3">
        <small className="text-xs font-semibold uppercase tracking-wider text-sage">
          Planning estimate
        </small>
        <b className="font-display mt-0.5 block text-2xl text-forest-2">{display}</b>
        {!estimate.ok ? (
          <p className="mt-1 text-sm text-red-700">{estimate.error}</p>
        ) : null}
      </div>

      <Button asChild variant="lime" className="mt-4 w-full">
        <Link href={`/quote?size=${lawnSize}&property=${propertyType}&frequency=${frequency}`}>
          Get my real quote <span aria-hidden>→</span>
        </Link>
      </Button>
    </div>
  )
}

export type QuoteBandProps = {
  className?: string
}

export function QuoteBand({ className }: QuoteBandProps) {
  return (
    <section
      id="quote"
      className={cn(
        "grain relative overflow-hidden bg-gradient-to-br from-lime to-lime-2 text-forest-2",
        className,
      )}
    >
      <div className={cn(pageWrap, "grid items-center gap-8 py-[clamp(2.2rem,4vw,3.2rem)] md:grid-cols-[1.2fr_0.8fr]")}>
        <div className="min-w-0">
          <Pill tone="on-lime">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-forest-2" />
            Most quotes take under 2 minutes
          </Pill>
          <h2 className="font-display mt-3 text-[clamp(1.7rem,6vw,2.8rem)] font-bold leading-[1.08]">
            Tell us what you need.
            <br />
            We&apos;ll make the next step clear.
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["1", "Your property"],
              ["2", "Instant estimate"],
              ["3", "We text you"],
              ["4", "Done"],
            ].map(([n, label]) => (
              <span
                key={n}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(11,58,30,0.2)] bg-white/40 px-3 py-1.5 text-sm font-semibold"
              >
                <b className="grid h-6 w-6 place-items-center rounded-full bg-forest text-xs text-white">
                  {n}
                </b>
                {label}
              </span>
            ))}
          </div>
        </div>
        <QuoteEstimator />
      </div>
    </section>
  )
}
