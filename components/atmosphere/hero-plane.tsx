import Image from "next/image"
import { mediaAlt, mediaSrc } from "@/lib/media"

type HeroPlaneProps = {
  slot: string
  altFallback?: string
  className?: string
  children: React.ReactNode
  priority?: boolean
  heightClass?: string
  /** Stronger film grain on hero */
  grainStrong?: boolean
  /** Subtle green multiply tint over photo */
  photoTint?: boolean
}

/** Full-bleed photo hero with scrim, grain, and vignette. */
export function HeroPlane({
  slot,
  altFallback = "",
  className = "",
  children,
  priority = false,
  heightClass = "h-[560px] md:h-[680px]",
  grainStrong = true,
  photoTint = true,
}: HeroPlaneProps) {
  return (
    <section className={`relative overflow-hidden ${heightClass} ${className}`}>
      <Image
        src={mediaSrc(slot)}
        alt={mediaAlt(slot, altFallback)}
        fill
        priority={priority}
        className="object-cover atm-parallax-media"
        sizes="100vw"
      />
      <div className="atm-hero-scrim absolute inset-0 z-[1]" aria-hidden />
      {photoTint && <div className="atm-photo-tint" aria-hidden />}
      <div className="atm-vignette" aria-hidden />
      <div className={`atm-grain ${grainStrong ? "atm-grain-strong" : ""}`} aria-hidden />
      <div className="relative z-[2] flex h-full items-center">{children}</div>
    </section>
  )
}
