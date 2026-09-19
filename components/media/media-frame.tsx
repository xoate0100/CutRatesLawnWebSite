"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { getMedia, mediaAlt, mediaSrc } from "@/lib/media"

export type MediaTreatment = "duotone" | "grain" | "mask" | "stripe" | "ring"

export type MediaFrameProps = {
  slot: string
  treatments?: MediaTreatment[]
  aspect?: string
  priority?: boolean
  className?: string
  fill?: boolean
  sizes?: string
}

export function MediaFrame({
  slot,
  treatments = [],
  aspect = "16/10",
  priority = false,
  className,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: MediaFrameProps) {
  const media = getMedia(slot)
  const src = mediaSrc(slot)
  const alt = mediaAlt(slot, media.alt || "Cut Rates Lawn Care")
  const has = (t: MediaTreatment) => treatments.includes(t)
  const isPlaceholder = !media.url || /placeholder/i.test(src)

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        has("mask") && "rounded-[36%_36%_30%_30%/8%_8%_6%_6%]",
        has("ring") && "ring-2 ring-line shadow-brand",
        fill ? "h-full w-full" : "w-full",
        className,
      )}
      style={fill ? undefined : { aspectRatio: aspect }}
    >
      {isPlaceholder ? (
        <div
          className="absolute inset-0 flex items-end bg-[radial-gradient(120%_90%_at_80%_0%,#17512c_0%,#0b3a1e_70%)] p-4"
          role="img"
          aria-label={alt}
        >
          <p className="font-display max-w-[18ch] text-left text-lg font-bold leading-tight text-lime">
            {alt}
          </p>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "pointer-events-none object-cover transition-transform duration-500",
            has("duotone") && "contrast-110 saturate-75",
          )}
        />
      )}
      {has("duotone") && !isPlaceholder ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-green/25 mix-blend-multiply"
        />
      ) : null}
      {has("stripe") ? <div aria-hidden className="mow-stripe pointer-events-none absolute inset-0" /> : null}
      {has("grain") ? <div aria-hidden className="grain pointer-events-none absolute inset-0" /> : null}
    </div>
  )
}
