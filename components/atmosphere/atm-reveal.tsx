"use client"

import { useReveal } from "@/hooks/use-reveal"

type AtmRevealProps = {
  children: React.ReactNode
  className?: string
  /** Extra delay: 1 | 2 | 3 */
  delay?: 1 | 2 | 3
}

/** Client wrapper: fade-up when scrolled into view. */
export function AtmReveal({ children, className = "", delay }: AtmRevealProps) {
  const { ref, className: revealClass } = useReveal()
  const delayClass =
    delay === 1 ? "atm-reveal-delay-1" : delay === 2 ? "atm-reveal-delay-2" : delay === 3 ? "atm-reveal-delay-3" : ""

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${revealClass} ${delayClass} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
