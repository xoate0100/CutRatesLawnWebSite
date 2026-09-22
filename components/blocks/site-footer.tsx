import Link from "next/link"
import { BrandLogo } from "@/components/brand/brand-logo"
import { Button } from "@/components/ui/button"
import { pageWrap } from "@/lib/layout"
import { NAV_LINKS, SERVICES } from "@/lib/marketing-content"
import { siteConfig } from "@/lib/site-config"
import { GOOGLE_MAPS_URL, GOOGLE_RATING_LABEL } from "@/lib/google-reviews"
import { KWCH_FEATURE } from "@/lib/press"
import { cn } from "@/lib/utils"
import { AnalyticsPhoneLink } from "@/components/analytics/phone-link"

const FOOTER_SERVICES = SERVICES.filter((s) =>
  ["landscaping", "lawn-care", "pest-control", "holiday-lights", "commercial", "power-washing"].includes(
    s.id,
  ),
)

export type SiteFooterProps = {
  className?: string
}

export function SiteFooter({ className }: SiteFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={cn("bg-forest-2 text-white", className)}>
      <div className={cn(pageWrap, "py-12")}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <Link href="/" className="inline-flex" aria-label="Cut Rates Lawn Care — home">
              <BrandLogo height={72} />
            </Link>
            <p className="mt-3 max-w-[34ch] text-[0.9rem] text-white/70">
              Family-owned lawn, landscape, and pest protection for homes and businesses across
              south-central Kansas and the KC metro. {GOOGLE_RATING_LABEL}.
            </p>
            <p className="mt-3 text-sm">
              <a
                href={KWCH_FEATURE.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lime hover:underline"
              >
                {KWCH_FEATURE.label}
              </a>
              {" · "}
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lime hover:underline"
              >
                Read Google reviews
              </a>
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-lime">
              Services
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {FOOTER_SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={s.href} className="hover:text-lime">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-lime">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-lime"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="hover:text-lime">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-lime">
              Get in touch
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <AnalyticsPhoneLink href={`tel:${siteConfig.phone.e164}`} location="footer" className="hover:text-lime">
                  {siteConfig.phone.display}
                </AnalyticsPhoneLink>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-lime">
                  {siteConfig.email}
                </a>
              </li>
              <li>{siteConfig.address.full}</li>
            </ul>
            <Button asChild variant="lime" size="sm" className="mt-4">
              <Link href="/quote">Free quote →</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-line-lt pt-5 text-xs text-white/55">
          <span>© {year} Cut Rates Lawn Care LLC</span>
          <span>Landscaping · Lawn Care · Wichita → KC</span>
        </div>
      </div>
    </footer>
  )
}
