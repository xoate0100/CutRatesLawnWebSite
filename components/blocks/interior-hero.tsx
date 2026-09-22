import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { MediaFrame } from "@/components/media/media-frame"
import { pageWrap } from "@/lib/layout"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { AnalyticsPhoneLink } from "@/components/analytics/phone-link"

export type InteriorHeroProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  mediaSlot?: string
  ctaHref?: string
  ctaLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  className?: string
}

export function InteriorHero({
  eyebrow = "Cut Rates Lawn Care",
  title,
  description,
  mediaSlot = "services.hero",
  ctaHref = "/quote",
  ctaLabel = "Get a quote",
  secondaryHref = `tel:${siteConfig.phone.e164}`,
  secondaryLabel = `Call ${siteConfig.phone.display}`,
  className,
}: InteriorHeroProps) {
  return (
    <section
      className={cn(
        "grain relative overflow-hidden bg-forest text-white",
        className,
      )}
    >
      <div
        className={cn(
          pageWrap,
          "grid items-center gap-8 py-[clamp(2.5rem,6vw,4.5rem)] md:grid-cols-2",
        )}
      >
        <div className="min-w-0">
          <Eyebrow tone="lime">{eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-[clamp(2rem,7vw,3.6rem)] font-extrabold leading-[1.08]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-[40ch] text-base text-white/80 sm:text-lg">{description}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="lime" className="max-w-full">
              <Link href={ctaHref}>
                {ctaLabel} <span aria-hidden>→</span>
              </Link>
            </Button>
            {secondaryHref && secondaryLabel ? (
              <Button asChild variant="ghost" className="max-w-full text-white">
                {secondaryHref.startsWith("tel:") ? (
                  <AnalyticsPhoneLink href={secondaryHref} location="interior_hero">
                    {secondaryLabel}
                  </AnalyticsPhoneLink>
                ) : (
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                )}
              </Button>
            ) : null}
          </div>
        </div>
        <MediaFrame
          slot={mediaSlot}
          treatments={["grain", "ring"]}
          aspect="4/3"
          className="max-w-full rounded-brand-lg"
          sizes="(max-width: 768px) 92vw, 50vw"
        />
      </div>
    </section>
  )
}
