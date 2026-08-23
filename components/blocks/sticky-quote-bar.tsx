"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

export type StickyQuoteBarProps = {
  className?: string
  threshold?: number
}

export function StickyQuoteBar({ className, threshold = 420 }: StickyQuoteBarProps) {
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 px-4 py-3 shadow-[0_-8px_30px_-12px_rgba(11,58,30,0.35)] backdrop-blur md:hidden",
        reduced ? "" : "transition-transform duration-300",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
        className,
      )}
      // Prefer inert over aria-hidden so focusable descendants are excluded from a11y tree
      {...(visible ? {} : { inert: "" as unknown as undefined })}
    >
      {visible ? (
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div>
            <b className="block text-sm font-bold text-ink">Free quote in 2 min</b>
            <small className="text-xs text-sage">No contracts · local crew</small>
          </div>
          <Button asChild variant="lime" size="sm">
            <Link href="/quote">Get a quote →</Link>
          </Button>
        </div>
      ) : null}
    </div>
  )
}
