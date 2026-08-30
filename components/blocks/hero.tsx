"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Pill } from "@/components/ui/pill"
import { MediaFrame } from "@/components/media/media-frame"
import { useCountUp } from "@/hooks/use-count-up"
import { useParallax } from "@/hooks/use-parallax"
import { cn } from "@/lib/utils"
import type { RefObject } from "react"

function Stat({
  end,
  decimals = 0,
  suffix = "",
  label,
}: {
  end: number
  decimals?: number
  suffix?: string
  label: string
}) {
  const { ref, display } = useCountUp({ end, decimals, suffix })
  return (
    <div>
      <b
        ref={ref as RefObject<HTMLElement>}
        className="font-display block text-2xl font-extrabold leading-none text-lime"
      >
        {display}
      </b>
      <small className="text-[0.82rem] font-semibold text-white/72">{label}</small>
    </div>
  )
}

export type HeroProps = {
  className?: string
}

export function Hero({ className }: HeroProps) {
  const glow = useParallax({ strength: 28 })

  return (
    <section
      className={cn(
        "grain stripes relative overflow-hidden bg-[radial-gradient(120%_90%_at_82%_-10%,#17512c_0%,var(--forest)_45%,var(--forest-2)_100%)] py-[clamp(3rem,7vw,6rem)] pb-[clamp(4rem,8vw,7rem)] text-white",
        className,
      )}
    >
      <div
        ref={glow.ref as RefObject<HTMLDivElement>}
        aria-hidden
        className="pointer-events-none absolute -right-[140px] -top-[200px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.5),rgba(200,241,53,0)_62%)] blur-[8px]"
      />
      <div className="relative z-[2] mx-auto grid w-full max-w-[1200px] items-center gap-[clamp(1.5rem,4vw,3.5rem)] px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="relative z-10 min-w-0">
          <Pill tone="on-dark">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime shadow-[0_0_0_4px_rgba(200,241,53,0.25)]" />
            Local. Reliable. Easy to book.
          </Pill>
          <h1 className="font-display mt-4 text-balance text-[clamp(2.1rem,8vw,4rem)] font-extrabold leading-[1.08] lg:text-[clamp(2.2rem,2.35vw,2.65rem)] xl:text-[clamp(2.35rem,2.7vw,2.85rem)]">
            A better-looking lawn,
            <br />
            <span className="relative inline text-white">
              without the runaround.
              <svg
                className="absolute -bottom-[14%] -left-[3%] -z-10 h-[44%] w-[106%] text-lime"
                viewBox="0 0 300 60"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M6 40 C60 20 120 48 180 34 C230 22 270 40 296 30 L292 54 C250 46 210 58 160 50 C110 42 60 58 10 52 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </h1>
          <p className="mt-5 max-w-[36ch] text-[clamp(1.05rem,1.5vw,1.28rem)] text-white/82">
            Straightforward, dependable lawn &amp; landscape care from a family-owned local crew —
            from Wichita to the Kansas City side. We show up, do it right, and make booking
            painless.
          </p>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:gap-3">
            <Button asChild variant="lime" size="lg" className="max-w-full">
              <Link href="/quote">
                Get my free quote <span aria-hidden>→</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="max-w-full text-white">
              <Link href="/our-work">See our work</Link>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-5 text-[0.9rem] font-semibold text-white/80">
            {["No contracts", "Fast response", "Locally owned"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-lime/16">
                  <Check className="h-3 w-3 text-lime" strokeWidth={3} />
                </span>
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-8">
            <Stat end={1200} suffix="+" label="Lawns cared for" />
            <Stat end={4.8} decimals={1} suffix="★" label="Google rating" />
            <Stat end={7} label="Towns served" />
          </div>
        </div>
        <div className="relative z-0 min-w-0">
          <div
            aria-hidden
            className="absolute -right-[4%] bottom-[16%] -z-10 hidden h-[70px] w-[46%] -rotate-[14deg] rounded-[14px] bg-lime shadow-[0_14px_30px_-10px_rgba(200,241,53,0.6)] sm:block"
          />
          <MediaFrame
            slot="home.hero"
            treatments={["mask", "stripe", "grain"]}
            aspect="5/6"
            priority
            className="mx-auto max-w-full shadow-brand"
            sizes="(max-width: 1024px) 92vw, 42vw"
          />
        </div>
      </div>
    </section>
  )
}
