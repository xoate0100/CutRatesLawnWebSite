"use client"

import { useMemo, useState } from "react"
import { MediaFrame } from "@/components/media/media-frame"
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export type GalleryProps = {
  items?: GalleryItem[]
  className?: string
}

export function Gallery({ items = GALLERY_ITEMS, className }: GalleryProps) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  )
  const [filter, setFilter] = useState("All")
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter)

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery filters">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={filter === cat}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-bold transition-colors",
              filter === cat
                ? "border-forest bg-forest text-white"
                : "border-line bg-white text-ink hover:border-green",
            )}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.id} className="overflow-hidden rounded-brand border border-line bg-white">
            <div className="grid grid-cols-2">
              <MediaFrame slot={item.beforeSlot} aspect="1/1" className="rounded-none" />
              <MediaFrame slot={item.afterSlot} aspect="1/1" className="rounded-none" />
            </div>
            <div className="p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-sage">{item.category}</p>
              <h3 className="font-display mt-1 text-lg font-bold">{item.title}</h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
