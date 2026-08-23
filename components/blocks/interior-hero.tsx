import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { MediaFrame } from "@/components/media/media-frame"
import { cn } from "@/lib/utils"

export type InteriorHeroProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  mediaSlot?: string
  ctaHref?: string
  ctaLabel?: string
  className?: string
}

export function InteriorHero({
  eyebrow = "Cut Rates Lawn Care",
  title,
  description,
  mediaSlot = "services.hero",
  ctaHref = "/quote",
  ctaLabel = "Get a quote",
  className,
}: InteriorHeroProps) {
  return (
    <section
      className={cn(
        "grain relative overflow-hidden bg-forest text-white",
        className,
      )}
    >
      <div className="mx-auto grid w-[min(1200px,92vw)] items-center gap-8 py-[clamp(2.5rem,6vw,4.5rem)] md:grid-cols-2">
        <div>
          <Eyebrow tone="lime">{eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.05]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-[40ch] text-lg text-white/80">{description}</p>
          ) : null}
          <Button asChild variant="lime" className="mt-6">
            <Link href={ctaHref}>
              {ctaLabel} <span aria-hidden>→</span>
            </Link>
          </Button>
        </div>
        <MediaFrame
          slot={mediaSlot}
          treatments={["grain", "ring"]}
          aspect="4/3"
          className="rounded-brand-lg"
          sizes="(max-width: 768px) 92vw, 50vw"
        />
      </div>
    </section>
  )
}
