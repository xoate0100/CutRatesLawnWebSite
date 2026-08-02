import { TurfMotif } from "@/components/atmosphere/turf-motif"

type SectionShellProps = {
  children: React.ReactNode
  className?: string
  tone?: "canvas" | "wash" | "muted" | "cta"
  motif?: boolean
  seam?: boolean
}

export function SectionShell({
  children,
  className = "",
  tone = "canvas",
  motif = false,
  seam = false,
}: SectionShellProps) {
  const toneClass =
    tone === "wash"
      ? "atm-wash"
      : tone === "muted"
        ? "bg-muted/60"
        : tone === "cta"
          ? "atm-cta-band text-primary-foreground"
          : "atm-canvas"

  return (
    <section className={`relative ${toneClass} ${seam ? "atm-seam" : ""} ${className}`}>
      {motif && (
        <TurfMotif className="pointer-events-none absolute inset-x-0 top-0 h-28 w-full text-primary opacity-40" />
      )}
      <div className="relative z-[1]">{children}</div>
    </section>
  )
}
