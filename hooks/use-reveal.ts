"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

type UseRevealOptions = {
  /** Intersection ratio to trigger (0–1) */
  threshold?: number
  rootMargin?: string
  /** Only reveal once (default true) */
  once?: boolean
}

type UseRevealResult = {
  ref: RefObject<HTMLElement | null>
  visible: boolean
  className: string
}

/**
 * Scroll-triggered reveal. Respects prefers-reduced-motion.
 * Emits both brand (`.reveal` / `.reveal.in`) and legacy atm classes.
 */
export function useReveal(options: UseRevealOptions = {}): UseRevealResult {
  const { threshold = 0.14, rootMargin = "0px 0px -48px 0px", once = true } = options
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) io.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, once])

  return {
    ref,
    visible,
    className: `reveal${visible ? " in" : ""} atm-reveal${visible ? " atm-reveal-visible" : ""}`,
  }
}
