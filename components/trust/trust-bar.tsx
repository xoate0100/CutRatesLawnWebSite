import { Check } from "lucide-react"
import { GoogleRatingBadge } from "@/components/trust/google-rating-badge"
import { KWCH_FEATURE } from "@/lib/press"
import { cn } from "@/lib/utils"

const CHIPS = ["No contracts", "Locally owned", "Same-day response"] as const

export function TrustBar({
  className,
  tone = "light",
}: {
  className?: string
  tone?: "light" | "on-dark"
}) {
  const onDark = tone === "on-dark"
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        className,
      )}
    >
      <GoogleRatingBadge tone={tone} />
      <a
        href={KWCH_FEATURE.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold",
          onDark
            ? "border-white/20 bg-white/10 text-white hover:bg-white/16"
            : "border-line bg-white text-ink hover:border-green",
        )}
      >
        {KWCH_FEATURE.label}
      </a>
      {CHIPS.map((chip) => (
        <span
          key={chip}
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold",
            onDark ? "text-white/80" : "text-sage",
          )}
        >
          <Check className="h-3.5 w-3.5 text-lime" strokeWidth={3} />
          {chip}
        </span>
      ))}
    </div>
  )
}
