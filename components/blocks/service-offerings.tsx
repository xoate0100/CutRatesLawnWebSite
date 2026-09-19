import Link from "next/link"
import { MediaFrame } from "@/components/media/media-frame"
import type { ServiceOffering } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export function ServiceOfferings({
  offerings,
  className,
}: {
  offerings: ServiceOffering[]
  className?: string
}) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {offerings.map((item) => (
        <li
          key={item.id}
          className="overflow-hidden rounded-brand border border-line bg-white"
        >
          <MediaFrame slot={item.mediaSlot} aspect="16/10" className="rounded-none" />
          <div className="p-5">
            <h3 className="font-display text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm text-sage">{item.description}</p>
            <Link
              href={item.href}
              className="mt-3 inline-flex font-bold text-green"
            >
              Get a quote →
            </Link>
          </div>
        </li>
      ))}
    </ul>
  )
}
