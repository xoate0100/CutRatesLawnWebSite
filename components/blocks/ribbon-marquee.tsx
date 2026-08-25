import { RIBBON_ITEMS } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export type RibbonMarqueeProps = {
  items?: string[]
  className?: string
}

export function RibbonMarquee({ items = RIBBON_ITEMS, className }: RibbonMarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div
      className={cn(
        "marquee overflow-hidden border-y-[3px] border-forest-2 bg-lime text-forest-2",
        className,
      )}
      aria-hidden
    >
      <div className="marquee-track-fast font-display py-2 text-[clamp(1.15rem,4vw,1.5rem)] font-extrabold uppercase tracking-[0.01em]">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex shrink-0 items-center gap-6 px-3">
            {item}
            <span className="text-forest-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
