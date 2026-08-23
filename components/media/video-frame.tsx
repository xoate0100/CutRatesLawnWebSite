"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { getMedia, mediaAlt, mediaSrc } from "@/lib/media"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export type VideoFrameProps = {
  /** Poster image slot (or video slot used for poster fallback) */
  slot: string
  posterSlot?: string
  /** Optional explicit video URL; otherwise uses getMedia(slot).url if it looks like video */
  videoSrc?: string
  className?: string
  aspect?: string
  priority?: boolean
}

function looksLikeVideo(url: string | null | undefined): boolean {
  if (!url) return false
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.includes("/video")
}

export function VideoFrame({
  slot,
  posterSlot,
  videoSrc,
  className,
  aspect = "16/9",
  priority = false,
}: VideoFrameProps) {
  const reduced = useReducedMotion()
  const poster = posterSlot ?? slot
  const media = getMedia(slot)
  const resolvedVideo =
    videoSrc || (looksLikeVideo(media.url) ? media.url! : undefined)
  const posterSrc = mediaSrc(poster)
  const alt = mediaAlt(poster, mediaAlt(slot, "Cut Rates Lawn Care video"))

  return (
    <div
      className={cn("relative overflow-hidden bg-forest-2", className)}
      style={{ aspectRatio: aspect }}
    >
      {resolvedVideo && !reduced ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={resolvedVideo}
          poster={posterSrc}
          muted
          autoPlay
          loop
          playsInline
          aria-label={alt}
        />
      ) : (
        <Image
          src={posterSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover"
        />
      )}
    </div>
  )
}
