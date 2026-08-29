"use client"

import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { pageWrap } from "@/lib/layout"
import { NAV_LINKS, SERVICES } from "@/lib/marketing-content"
import {
  NAV_SCROLL_TARGET,
  QUOTE_SOON_MESSAGE,
  PREVIEW_SECTION,
  scrollToSection,
} from "@/lib/preview-nav"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const FOOTER_SERVICES = SERVICES.slice(0, 5)

export type SiteFooterProps = {
  className?: string
}

export function SiteFooter({ className }: SiteFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer id={PREVIEW_SECTION.contact} className={cn("bg-forest-2 text-white", className)}>
      <div className={cn(pageWrap, "py-12")}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime to-green-soft font-display text-[1.15rem] font-extrabold text-forest-2">
                CR
              </span>
              <span className="min-w-0 leading-none">
                <b className="font-display text-[1.15rem] font-extrabold">Cut Rates</b>
                <small className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] opacity-70">
                  Lawn Care
                </small>
              </span>
            </Link>
            <p className="mt-3 max-w-[34ch] text-[0.9rem] text-white/70">
              Family-owned lawn &amp; landscape care for homes and businesses across south-central
              Kansas and the KC metro.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-lime">
              Services
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {FOOTER_SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${PREVIEW_SECTION.services}`}
                    className="hover:text-lime"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(PREVIEW_SECTION.services)
                    }}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-lime">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {NAV_LINKS.map((l) => {
                const target = NAV_SCROLL_TARGET[l.label]
                return (
                  <li key={l.href}>
                    <a
                      href={target ? `#${target}` : undefined}
                      className="hover:text-lime"
                      onClick={(e) => {
                        e.preventDefault()
                        if (target) scrollToSection(target)
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-lime">
              Get in touch
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>
                <a href={`tel:${siteConfig.phone.e164}`} className="hover:text-lime">
                  {siteConfig.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-lime">
                  {siteConfig.email}
                </a>
              </li>
              <li>{siteConfig.address.full}</li>
            </ul>
            <Button
              type="button"
              variant="lime"
              size="sm"
              className="mt-4"
              onClick={() => toast.message(QUOTE_SOON_MESSAGE)}
            >
              Free quote →
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
