"use client"

import type { ReactNode } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PREVIEW_SECTION, QUOTE_SOON_MESSAGE, scrollToSection } from "@/lib/preview-nav"
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
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(420px,100%)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.35),transparent_65%)] blur-md"
      />
      <div className="relative z-[1] mx-auto w-full max-w-[800px] px-4 sm:px-6">
        <h2 className="font-display text-[clamp(1.75rem,6vw,3rem)] font-extrabold leading-[1.08]">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-[42ch] text-white/75">{description}</p>
        <Button
          type="button"
          variant="lime"
          size="lg"
          className="mt-6 max-w-full"
          onClick={() => {
            toast.message(QUOTE_SOON_MESSAGE)
            scrollToSection(PREVIEW_SECTION.quote)
          }}
        >
          {ctaLabel} <span aria-hidden>→</span>
        </Button>
      </div>
    </section>
  )
}
