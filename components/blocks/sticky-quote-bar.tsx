"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { PREVIEW_SECTION, QUOTE_SOON_MESSAGE, scrollToSection } from "@/lib/preview-nav"
import { cn } from "@/lib/utils"

export type StickyQuoteBarProps = {
  className?: string
  /** px scrolled before the chip may appear */
  threshold?: number
}

/**
 * Compact floating CTA — not a full-bleed bottom sheet.
 * Full-width sticky bars cover mid-viewport copy (failed responsive audit).
 */
export function StickyQuoteBar({ className, threshold = 520 }: StickyQuoteBarProps) {
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      const doc = document.documentElement
      const nearFooter = y + window.innerHeight > doc.scrollHeight - 120
      // Show only after hero scroll, and tuck away when footer is in play
      setVisible(y > threshold && !nearFooter)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [threshold])

  return (
    <div
      data-sticky-quote
      className={cn(
        // Corner chip — leaves center/left reading column clear of a full-width overlay
        "pointer-events-none fixed bottom-4 left-4 z-40 md:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        // Avoid transition-all — it can animate top/bottom and yank fixed chips off-screen
        reduced ? "" : "transition-[opacity,transform] duration-300",
        className,
      )}
      aria-hidden={!visible}
    >
      {visible ? (
        <div className="pointer-events-auto flex max-w-[min(18rem,calc(100vw-5.5rem))] items-center gap-2 rounded-full border border-line bg-paper/95 py-1.5 pl-3 pr-1.5 shadow-[0_12px_28px_-12px_rgba(11,58,30,0.45)] backdrop-blur">
          <span className="min-w-0 truncate text-xs font-bold text-ink">Free quote · 2 min</span>
          <Button
            type="button"
            variant="lime"
            size="sm"
            className="shrink-0 shadow-none max-sm:shadow-none"
            onClick={() => {
              toast.message(QUOTE_SOON_MESSAGE)
              scrollToSection(PREVIEW_SECTION.quote)
            }}
          >
            Quote →
          </Button>
        </div>
      ) : null}
    </div>
  )
}
