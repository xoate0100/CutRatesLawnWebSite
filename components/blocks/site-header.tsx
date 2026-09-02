"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pageWrap } from "@/lib/layout"
import { NAV_LINKS } from "@/lib/marketing-content"
import { siteConfig } from "@/lib/site-config"
import { trackPhoneClick } from "@/lib/analytics/core"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-[80] isolate border-b border-line-lt bg-[rgba(11,58,30,0.86)] text-white backdrop-blur-md",
      )}
    >
      <div className={cn(pageWrap, "flex h-[70px] items-center gap-3 sm:gap-4")}>
        <Link href="/" className="mr-auto flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-gradient-to-br from-lime to-green-soft font-display text-[1.15rem] font-extrabold text-forest-2 shadow-[0_6px_18px_-6px_rgba(200,241,53,0.6)]">
            CR
          </span>
          <span className="leading-none">
            <b className="font-display text-[1.15rem] font-extrabold tracking-[-0.01em]">Cut Rates</b>
            <small className="block text-[0.62rem] font-semibold uppercase tracking-[0.22em] opacity-70">
              Lawn Care
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 font-semibold md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative py-1 text-[0.92rem] opacity-85 hover:opacity-100"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-lime transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

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
              <Link
                key={link.href}
                href={link.href}
                className="py-2 opacity-90"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
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
