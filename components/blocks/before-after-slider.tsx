"use client"

import Image from "next/image"
import { useCallback, useRef, useState, type KeyboardEvent } from "react"
import { mediaAlt, mediaSrc } from "@/lib/media"
import { cn } from "@/lib/utils"

export type BeforeAfterSliderProps = {
  beforeSlot?: string
  afterSlot?: string
  className?: string
}

export function BeforeAfterSlider({
  beforeSlot = "gallery.before",
  afterSlot = "gallery.after",
  className,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const setFromClientX = useCallback((clientX: number) => {
    const el = rootRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const p = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(2, Math.min(98, p)))
  }, [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setPos((p) => Math.max(2, p - 2))
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      setPos((p) => Math.min(98, p + 2))
    } else if (e.key === "Home") {
      e.preventDefault()
      setPos(2)
    } else if (e.key === "End") {
      e.preventDefault()
      setPos(98)
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative aspect-[16/9] w-full touch-none overflow-hidden rounded-brand select-none shadow-brand",
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
        setFromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromClientX(e.clientX)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
      onPointerCancel={() => {
        dragging.current = false
      }}
    >
      <Image
        src={mediaSrc(afterSlot)}
        alt={mediaAlt(afterSlot, "After")}
        fill
        className="pointer-events-none object-cover"
        sizes="(max-width: 768px) 100vw, 1000px"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={mediaSrc(beforeSlot)}
          alt={mediaAlt(beforeSlot, "Before")}
          fill
          className="pointer-events-none object-cover"
          sizes="(max-width: 768px) 100vw, 1000px"
        />
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-forest/80 px-2.5 py-1 text-xs font-bold text-white">
        Before
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-lime px-2.5 py-1 text-xs font-bold text-forest-2">
        After
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Compare before and after"
        aria-valuemin={2}
        aria-valuemax={98}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% after revealed`}
        className="absolute inset-y-0 z-10 w-1 -translate-x-1/2 cursor-ew-resize bg-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-lime"
        style={{ left: `${pos}%` }}
        onKeyDown={onKeyDown}
      >
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-forest bg-white font-bold text-forest shadow-brand">
          ↔
        </span>
      </div>
    </div>
  )
}
