import Link from "next/link"
import { GOOGLE_MAPS_URL, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "@/lib/google-reviews"
import { cn } from "@/lib/utils"

export function GoogleRatingBadge({
  className,
  tone = "light",
}: {
  className?: string
  tone?: "light" | "on-dark"
}) {
  const onDark = tone === "on-dark"
  return (
    <Link
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold",
        onDark
          ? "border-white/20 bg-white/10 text-white hover:bg-white/16"
          : "border-line bg-white text-ink hover:border-green",
        className,
      )}
      aria-label={`${GOOGLE_RATING} out of 5 stars from ${GOOGLE_REVIEW_COUNT} Google reviews`}
    >
      <span className="text-amber-400" aria-hidden>
        ★
      </span>
      <span>{GOOGLE_RATING}</span>
      <span className={onDark ? "text-white/70" : "text-sage"}>
        Google · {GOOGLE_REVIEW_COUNT} reviews
      </span>
    </Link>
  )
}
