"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

type UseCountUpOptions = {
  end: number
  durationMs?: number
  decimals?: number
  suffix?: string
  prefix?: string
  threshold?: number
}

type UseCountUpResult = {
  ref: RefObject<HTMLElement | null>
  display: string
  started: boolean
}

/** Animates a number when in view; jumps to end under reduced motion. */
export function useCountUp({
  end,
  durationMs = 1400,
  decimals = 0,
  suffix = "",
  prefix = "",
  threshold = 0.6,
}: UseCountUpOptions): UseCountUpResult {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true)
            io.disconnect()
          }
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  useEffect(() => {
    if (!started) return
    if (reduced) {
      setValue(end)
      return
    }

    let raf = 0
    let t0: number | null = null
    const step = (ts: number) => {
      if (t0 === null) t0 = ts
      const p = Math.min((ts - t0) / durationMs, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(end * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [started, end, durationMs, reduced])

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString()

  return {
    ref,
    display: `${prefix}${formatted}${suffix}`,
    started,
  }
}
