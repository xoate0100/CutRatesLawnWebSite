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
        "overflow-hidden border-y-[3px] border-forest-2 bg-lime text-forest-2",
        className,
      )}
      aria-hidden
    >
      <div className="marquee-track-fast font-display py-2 text-2xl font-extrabold uppercase tracking-[0.01em]">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-6 px-3">
            {item}
            <span className="text-forest-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
