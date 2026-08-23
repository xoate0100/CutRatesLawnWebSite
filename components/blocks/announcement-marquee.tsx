import { ANNOUNCEMENT_ITEMS } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export type AnnouncementMarqueeProps = {
  items?: string[]
  className?: string
}

export function AnnouncementMarquee({
  items = ANNOUNCEMENT_ITEMS,
  className,
}: AnnouncementMarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div
      className={cn(
        "overflow-hidden border-b border-line-lt bg-forest-2 text-lime",
        className,
      )}
      role="region"
      aria-label="Announcements"
    >
      <div className="marquee-track gap-10 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em]">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center gap-10 px-2">
            {item}
            <span aria-hidden className="opacity-50">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
