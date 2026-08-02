import Image from "next/image"
import { mediaAlt, mediaSrc } from "@/lib/media"

type HeroPlaneProps = {
  slot: string
  altFallback?: string
  className?: string
  children: React.ReactNode
  priority?: boolean
  heightClass?: string
}

/** Full-bleed photo hero with scrim, grain, and vignette. */
export function HeroPlane({
  slot,
  altFallback = "",
  className = "",
  children,
  priority = false,
  heightClass = "h-[560px] md:h-[680px]",
}: HeroPlaneProps) {
  return (
    <section className={`relative overflow-hidden ${heightClass} ${className}`}>
      <Image
        src={mediaSrc(slot)}
        alt={mediaAlt(slot, altFallback)}
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      <div className="atm-hero-scrim absolute inset-0 z-[1]" />
      <div className="atm-vignette" />
      <div className="atm-grain" />
      <div className="relative z-[2] flex h-full items-center">{children}</div>
    </section>
  )
}
