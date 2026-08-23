import Link from "next/link"
import { SERVICE_AREAS, type AreaItem } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export type AreaChipsProps = {
  areas?: AreaItem[]
  className?: string
}

export function AreaChips({ areas = SERVICE_AREAS, className }: AreaChipsProps) {
  return (
    <ul className={cn("mt-6 flex flex-wrap gap-2.5", className)}>
      {areas.map((area) => (
        <li key={area.slug}>
          <Link
            href={area.href}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-green hover:bg-cream"
          >
            <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_0_3px_rgba(200,241,53,0.25)]" />
            {area.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
