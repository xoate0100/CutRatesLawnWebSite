import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CTASectionProps = {
  title?: ReactNode
  description?: string
  ctaHref?: string
  ctaLabel?: string
  className?: string
}

export function CTASection({
  title = (
    <>
      Make your lawn the easiest
      <br />
      thing on your list.
    </>
  ),
  description = "Free quote in about two minutes. Local crew, no contracts, done right.",
  ctaHref = "/quote",
  ctaLabel = "Get a fast quote",
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "grain relative overflow-hidden bg-forest py-[clamp(3rem,6vw,5rem)] text-center text-white",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.35),transparent_65%)] blur-md"
      />
      <div className="relative z-[1] mx-auto w-[min(800px,92vw)]">
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-[42ch] text-white/75">{description}</p>
        <Button asChild variant="lime" size="lg" className="mt-6">
          <Link href={ctaHref}>
            {ctaLabel} <span aria-hidden>→</span>
          </Link>
        </Button>
      </div>
    </section>
  )
}
