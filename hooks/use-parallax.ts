"use client"

import { useEffect, useRef, type CSSProperties, type RefObject } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type UseParallaxOptions = {
  /** Max translate in px (positive = move opposite to scroll) */
  strength?: number
}

type UseParallaxResult = {
  ref: RefObject<HTMLElement | null>
  style: CSSProperties
}

/** rAF parallax on scroll; no-op under reduced motion. */
export function useParallax(options: UseParallaxOptions = {}): UseParallaxResult {
  const { strength = 24 } = options
  const ref = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()
  const styleRef = useRef<CSSProperties>({})

  useEffect(() => {
    if (reduced) {
      styleRef.current = {}
      return
    }

    let raf = 0
    const el = ref.current

    const tick = () => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const mid = rect.top + rect.height / 2
      const viewportMid = window.innerHeight / 2
      const delta = (mid - viewportMid) / window.innerHeight
      const y = Math.max(-strength, Math.min(strength, -delta * strength))
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [strength, reduced])

  return { ref, style: styleRef.current }
}
