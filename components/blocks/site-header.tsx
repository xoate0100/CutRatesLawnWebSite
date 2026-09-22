"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { BrandLogo } from "@/components/brand/brand-logo"
import { Button } from "@/components/ui/button"
import { pageWrap } from "@/lib/layout"
import { GoogleRatingBadge } from "@/components/trust/google-rating-badge"
import { NAV_LINKS, type NavLink } from "@/lib/marketing-content"
import { siteConfig } from "@/lib/site-config"
import { trackPhoneClick } from "@/lib/analytics/core"
import { cn } from "@/lib/utils"

function NavItem({
  link,
  className,
  onNavigate,
  withUnderline = false,
}: {
  link: NavLink
  className?: string
  onNavigate?: () => void
  withUnderline?: boolean
}) {
  const label = withUnderline ? (
    <>
      {link.label}
      <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-lime transition-transform duration-200 group-hover:scale-x-100" />
    </>
  ) : (
    link.label
  )

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {label}
      </a>
    )
  }

  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      {label}
    </Link>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-[80] isolate border-b border-line-lt bg-[rgba(11,58,30,0.86)] text-white backdrop-blur-md",
      )}
    >
      <div className={cn(pageWrap, "flex h-[70px] items-center gap-3 sm:gap-4")}>
        <Link
          href="/"
          className="mr-auto flex shrink-0 items-center"
          onClick={() => setOpen(false)}
          aria-label="Cut Rates Lawn Care — home"
        >
          <BrandLogo height={58} priority className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
        </Link>

        <nav
          className="hidden items-center gap-4 font-semibold lg:gap-5 md:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              withUnderline
              className="group relative py-1 text-[0.92rem] opacity-85 hover:opacity-100"
            />
          ))}
        </nav>

        <GoogleRatingBadge tone="on-dark" className="hidden xl:inline-flex" />

        <a
          href={`tel:${siteConfig.phone.e164}`}
          className="hidden font-bold text-[0.9rem] opacity-90 lg:inline"
          onClick={() => trackPhoneClick("header_desktop")}
        >
          {siteConfig.phone.display}
        </a>

        <Button asChild variant="lime" size="sm" className="hidden md:inline-flex">
          <Link href="/quote">
            Get a quote <span aria-hidden>→</span>
          </Link>
        </Button>

        <button
          type="button"
          className="rounded-[10px] border border-line-lt px-3 py-2 font-bold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-line-lt bg-forest-2 px-5 py-4 sm:px-6 md:hidden"
        >
          <nav className="flex flex-col gap-3 font-semibold" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                className="py-2 opacity-90"
                onNavigate={() => setOpen(false)}
              />
            ))}
            <a
              href={`tel:${siteConfig.phone.e164}`}
              className="py-2 font-bold"
              onClick={() => trackPhoneClick("header_mobile")}
            >
              {siteConfig.phone.display}
            </a>
            <Button asChild variant="lime" className="mt-2 w-full">
              <Link href="/quote" onClick={() => setOpen(false)}>
                Get a quote →
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
