import { MediaFrame } from "@/components/media/media-frame"
import { TEAM, type TeamMember } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export type TeamGridProps = {
  members?: TeamMember[]
  className?: string
}

export function TeamGrid({ members = TEAM, className }: TeamGridProps) {
  return (
    <ul className={cn("mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {members.map((m) => (
        <li key={m.mediaSlot} className="overflow-hidden rounded-brand border border-line bg-white">
          <MediaFrame slot={m.mediaSlot} aspect="4/5" treatments={["duotone"]} />
          <div className="p-4">
            <h3 className="font-display text-lg font-bold">{m.name}</h3>
            <p className="text-sm font-semibold text-sage">{m.role}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
