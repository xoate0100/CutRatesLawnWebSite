import { TurfMotif, type TurfMotifCoverage, type TurfMotifVariant } from "@/components/atmosphere/turf-motif"

type SectionShellProps = {
  children: React.ReactNode
  className?: string
  tone?: "canvas" | "canvas-alt" | "wash" | "muted" | "deep-band" | "cta"
  /** Show turf motif decoration */
  motif?: boolean
  /** Band = top strip; full = whole section fill */
  motifCoverage?: TurfMotifCoverage
  motifVariant?: TurfMotifVariant
  motifIntensity?: "soft" | "medium" | "strong"
  /** Opt-in film grain on section background */
  texture?: boolean
  /** Stronger grain (pair with texture) */
  textureStrong?: boolean
  seam?: boolean
  /** Soft gradient hairline under the section top */
  seamFade?: boolean
}

export function SectionShell({
  children,
  className = "",
  tone = "canvas",
  motif = false,
  motifCoverage = "band",
  motifVariant = "contours",
  motifIntensity = "medium",
  texture = false,
  textureStrong = false,
  seam = false,
  seamFade = false,
}: SectionShellProps) {
  const toneClass =
    tone === "wash"
      ? "atm-wash"
      : tone === "canvas-alt"
        ? "atm-canvas-alt"
        : tone === "muted"
          ? "bg-[hsl(var(--atm-earth)/0.65)]"
          : tone === "deep-band"
            ? "atm-deep-band"
            : tone === "cta"
              ? "atm-cta-band text-primary-foreground"
              : "atm-canvas"

  const motifPosition =
    motifCoverage === "full"
      ? "pointer-events-none absolute inset-0 h-full w-full"
      : "pointer-events-none absolute inset-x-0 top-0 h-36 w-full md:h-44"

  return (
    <section className={`relative overflow-hidden ${toneClass} ${seam ? "atm-seam" : ""} ${className}`}>
      {seamFade && (
        <div className="atm-seam-fade absolute inset-x-0 top-0 z-[2]" aria-hidden />
      )}
      {motif && (
        <TurfMotif
          coverage={motifCoverage}
          variant={motifVariant}
          intensity={motifIntensity}
          className={motifPosition}
        />
      )}
      {texture && (
        <div
          className={`atm-grain ${textureStrong ? "atm-grain-strong" : ""}`}
          aria-hidden
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </section>
  )
}
