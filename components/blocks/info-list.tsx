import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type InfoListItem = {
  label: string
  value: ReactNode
  href?: string
}

export type InfoListProps = {
  items: InfoListItem[]
  className?: string
}

export function InfoList({ items, className }: InfoListProps) {
  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item) => (
        <li key={item.label} className="border-b border-line pb-4 last:border-0 last:pb-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-sage">{item.label}</p>
          {item.href ? (
            <a href={item.href} className="mt-1 block font-semibold text-ink hover:text-green">
              {item.value}
            </a>
          ) : (
            <p className="mt-1 font-semibold text-ink">{item.value}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
