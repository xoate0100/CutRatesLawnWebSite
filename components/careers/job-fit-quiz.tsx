"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CAREERS_ROLES, type CareersRoleId } from "@/lib/careers/fact-registry"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Answers = {
  outdoors: boolean | null
  equipment: boolean | null
  customers: boolean | null
  variety: "route" | "projects" | null
  interest: "equipment" | "turf" | "pest" | "leadership" | "irrigation" | null
  license: boolean | null
}

const QUESTIONS: {
  key: keyof Answers
  prompt: string
  options: { label: string; value: Answers[keyof Answers] }[]
}[] = [
  {
    key: "outdoors",
    prompt: "Do you like working outdoors most days?",
    options: [
      { label: "Yes", value: true },
      { label: "Not really", value: false },
    ],
  },
  {
    key: "equipment",
    prompt: "Have you used powered outdoor equipment?",
    options: [
      { label: "Yes / some", value: true },
      { label: "Not yet", value: false },
    ],
  },
  {
    key: "customers",
    prompt: "Are you comfortable talking with customers on site?",
    options: [
      { label: "Yes", value: true },
      { label: "Prefer less", value: false },
    ],
  },
  {
    key: "variety",
    prompt: "Do you prefer repeating a route or changing project sites?",
    options: [
      { label: "Routes", value: "route" },
      { label: "Projects", value: "projects" },
    ],
  },
  {
    key: "interest",
    prompt: "What would you want to learn first?",
    options: [
      { label: "Equipment", value: "equipment" },
      { label: "Turf", value: "turf" },
      { label: "Pest", value: "pest" },
      { label: "Irrigation", value: "irrigation" },
      { label: "Leadership", value: "leadership" },
    ],
  },
  {
    key: "license",
    prompt: "Do you have a valid driver’s license (if a role needs it)?",
    options: [
      { label: "Yes", value: true },
      { label: "No / not yet", value: false },
    ],
  },
]

function recommend(a: Answers): { id: CareersRoleId; why: string }[] {
  const out: { id: CareersRoleId; why: string }[] = []
  if (a.interest === "pest" || a.interest === "turf") {
    out.push({
      id: "pest-turf-tech",
      why: "You asked about technical outdoor learning — turf/pest paths fit that interest.",
    })
  }
  if (a.variety === "route" || a.customers === true) {
    out.push({
      id: "service-professional",
      why: "Route rhythm and customer-facing work line up with Service Professional openings.",
    })
  }
  out.push({
    id: "landscape-crew",
    why: "Entry Landscape Crew Member is the clearest start when you want outdoor work and paid training.",
  })
  // unique
  const seen = new Set<string>()
  return out.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true))).slice(0, 2)
}

export function JobFitQuiz({ className }: { className?: string }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    outdoors: null,
    equipment: null,
    customers: null,
    variety: null,
    interest: null,
    license: null,
  })
  const done = step >= QUESTIONS.length
  const recs = useMemo(() => (done ? recommend(answers) : []), [done, answers])

  return (
    <div className={cn("rounded-brand border border-line bg-white p-5 sm:p-6", className)} id="job-fit">
      <p className="text-xs font-bold uppercase tracking-wider text-green">Job fit</p>
      <h3 className="font-display mt-1 text-2xl font-bold text-ink">Which Cut Rates job fits me?</h3>
      <p className="mt-2 text-sm text-sage">
        A navigation aid — not a hiring screen. We never ask protected-class questions here.
      </p>

      {!done ? (
        <div className="mt-5">
          <p className="text-xs font-bold text-sage">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-cream"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={QUESTIONS.length}
          >
            <div
              className="h-full bg-lime transition-all"
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-lg font-semibold text-ink">{QUESTIONS[step].prompt}</p>
          <div className="mt-4 flex flex-col gap-2">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                className="rounded-brand border border-line px-4 py-3 text-left font-semibold hover:border-forest hover:bg-cream"
                onClick={() => {
                  const key = QUESTIONS[step].key
                  setAnswers((prev) => ({ ...prev, [key]: opt.value }))
                  setStep((s) => s + 1)
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {recs.map((r) => {
            const role = CAREERS_ROLES.find((x) => x.id === r.id)!
            return (
              <div key={r.id} className="rounded-brand border border-line bg-cream p-4">
                <p className="font-display text-lg font-bold text-forest">{role.title}</p>
                <p className="mt-1 text-sm text-ink">{r.why}</p>
                <p className="mt-2 text-sm text-sage">Experience not required for every opening — check the card.</p>
                <Button asChild variant="lime" size="sm" className="mt-3">
                  <Link href={`#job-${r.id}`}>View job card</Link>
                </Button>
              </div>
            )
          })}
          <button
            type="button"
            className="text-sm font-semibold text-green underline"
            onClick={() => {
              setStep(0)
              setAnswers({
                outdoors: null,
                equipment: null,
                customers: null,
                variety: null,
                interest: null,
                license: null,
              })
            }}
          >
            Retake quiz
          </button>
        </div>
      )}
    </div>
  )
}
