import Image from "next/image"
import { mediaAlt, mediaSrc } from "@/lib/media"
import { cn } from "@/lib/utils"

/** Local owned brand mark (transparent PNG). CDN slot overrides when published. */
export const BRAND_LOGO_FALLBACK = "/branding/cut-rates-logo.png"

export type BrandLogoProps = {
  className?: string
  /** Intrinsic display height in CSS pixels (width scales with asset ratio). */
  height?: number
  priority?: boolean
}

export function BrandLogo({ className, height = 56, priority = false }: BrandLogoProps) {
  const src = mediaSrc("header.logo", BRAND_LOGO_FALLBACK)
  const alt = mediaAlt("header.logo", "Cut Rates Lawn Care LLC")
  // Asset is ~775×703; keep aspect when height is constrained.
  const width = Math.round(height * (775 / 703))

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ height, width: "auto" }}
    />
  )
}
