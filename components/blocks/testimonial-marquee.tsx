import { TESTIMONIALS, type TestimonialItem } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

function Card({ t }: { t: TestimonialItem }) {
  return (
    <blockquote className="w-[min(340px,80vw)] shrink-0 rounded-brand border border-line bg-white p-5 shadow-sm">
      <div className="text-sm text-amber-500" aria-label={`${t.rating ?? 5} stars`}>
        {"★".repeat(t.rating ?? 5)}
      </div>
      <p className="mt-2 text-[0.98rem] font-medium text-ink">&ldquo;{t.quote}&rdquo;</p>
      <footer className="mt-3 text-sm font-semibold text-sage">
        {t.name} · {t.area}
      </footer>
    </blockquote>
  )
}

export type TestimonialMarqueeProps = {
  items?: TestimonialItem[]
  className?: string
}

export function TestimonialMarquee({
  items = TESTIMONIALS,
  className,
}: TestimonialMarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div className={cn("overflow-hidden", className)} role="region" aria-label="Customer reviews">
      <div className="marquee-track gap-4 py-2 hover:[animation-play-state:paused]">
        {doubled.map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  )
}
