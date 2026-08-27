import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CAREERS_ROLES, formatPayCardLine, type CareersRoleFact } from "@/lib/careers/fact-registry"
import { cn } from "@/lib/utils"

const BADGE: Record<string, string> = {
  "landscape-crew": "Entry level",
  "service-professional": "Multi-skill",
  "pest-turf-tech": "Licensed / trainable",
}

function JobCard({ role }: { role: CareersRoleFact }) {
  return (
    <article
      id={`job-${role.id}`}
      className="flex h-full flex-col rounded-brand border border-line bg-white p-6 shadow-sm"
    >
      <span className="w-fit rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest">
        {BADGE[role.id] ?? "Field role"}
      </span>
      <h3 className="font-display mt-3 text-xl font-bold text-ink">{role.title}</h3>
      <p className="mt-2 text-sm font-semibold text-forest">{formatPayCardLine(role)}</p>
      <p className="mt-1 text-sm text-sage">
        {role.market} · {role.typicalDays}
      </p>
      <hr className="my-4 border-line" />
      <ul className="space-y-2 text-sm text-ink">
        <li>{role.experienceRequired}</li>
        <li>{role.coreDuties.slice(0, 2).join(" · ")}</li>
        <li>
          {role.trainingPaid ? "Paid training" : "Training details at hire"} · tools + required PPE
        </li>
      </ul>
      <div className="mt-auto pt-6">
        <Button asChild variant="lime" className="w-full sm:w-auto">
          <Link href={`/careers/apply?job=${role.id}`}>Apply — no résumé</Link>
        </Button>
      </div>
    </article>
  )
}

export function OpenJobCards({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)} id="jobs">
      {CAREERS_ROLES.map((role) => (
        <JobCard key={role.id} role={role} />
      ))}
    </div>
  )
}
