import { PROCESS_STEPS, type ProcessStep } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export type ProcessStepsProps = {
  steps?: ProcessStep[]
  className?: string
}

export function ProcessSteps({ steps = PROCESS_STEPS, className }: ProcessStepsProps) {
  return (
    <ol className={cn("mt-8 grid gap-4 md:grid-cols-4", className)}>
      {steps.map((s) => (
        <li
          key={s.step}
          className="rounded-brand border border-line bg-white p-5"
        >
          <span className="font-display text-3xl font-extrabold text-lime">{s.step}</span>
          <h3 className="font-display mt-2 text-lg font-bold text-ink">{s.title}</h3>
          <p className="mt-1 text-sm text-sage">{s.description}</p>
        </li>
      ))}
    </ol>
  )
}
