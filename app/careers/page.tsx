import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHead } from "@/components/ui/section-head"
import { MediaFrame } from "@/components/media/media-frame"
import { CareersLangToggle } from "@/components/careers/lang-toggle"
import { OpenJobCards } from "@/components/careers/job-cards"
import { PaycheckEstimator } from "@/components/careers/paycheck-estimator"
import { SchedulePreview } from "@/components/careers/schedule-preview"
import { CareerPathSimulator } from "@/components/careers/career-path"
import { FirstDayPreview } from "@/components/careers/first-day-preview"
import { JobFitQuiz } from "@/components/careers/job-fit-quiz"
import { ManagerExpectationsCard } from "@/components/careers/manager-expectations"
import { CareersApplyForm } from "@/components/careers/apply-form"
import { pageWrap } from "@/lib/layout"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Careers",
  description:
    "Field careers at Cut Rates Lawn Care in Wichita, KS — clear pay confirmation before you accept, paid training, and a visible path up.",
}

const TRUST = [
  {
    n: "01",
    title: "Your starting pay",
    body: "Confirmed before you accept — ranges publish here only after Ops/HR verifies them.",
  },
  {
    n: "02",
    title: "Where you report",
    body: "Valley Center yard. Exact address and report time confirmed before day one.",
  },
  {
    n: "03",
    title: "Your normal schedule",
    body: "Typical days, early start, overtime only when the work requires it, seasonal mix.",
  },
  {
    n: "04",
    title: "What we provide",
    body: "Required PPE per policy, commercial tools after checkoff, travel to sites when assigned.",
  },
  {
    n: "05",
    title: "Who trains you",
    body: "A named lead or supervisor — confirmed at hire. Not “figure it out.”",
  },
  {
    n: "06",
    title: "What the work is really like",
    body: "Physical outdoor work, weather, powered equipment, and clear quality standards.",
  },
] as const

const NINETY = [
  {
    badge: "Before day 1",
    text: "Where to report · start time · clothing/footwear · contact for problems",
  },
  {
    badge: "First shift",
    text: "PPE · heat/weather · danger zones · timekeeping · crew communication",
  },
  {
    badge: "First week",
    text: "Tools · fueling/charging · loading/unloading · property protection",
  },
  {
    badge: "First month",
    text: "Mowing patterns · quality standards · inspection · route workflow",
  },
  {
    badge: "Next steps",
    text: "Equipment qualification · specialist modules · crew-lead readiness",
  },
] as const

export default function CareersPage() {
  return (
    <div className="bg-paper">
      {/* Hero — Figma Careers Portal */}
      <section className="grain relative overflow-hidden bg-forest text-white">
        <div className={cn(pageWrap, "py-4")}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-white/80" aria-label="Careers">
              <a href="#jobs" className="hover:text-lime">
                Jobs
              </a>
              <a href="#tools" className="hover:text-lime">
                Why Cut Rates
              </a>
              <a href="#path" className="hover:text-lime">
                Career Path
              </a>
              <a href="#first-day" className="hover:text-lime">
                What to Expect
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <CareersLangToggle />
              <Button asChild variant="lime" size="sm">
                <a href="#jobs">See open jobs</a>
              </Button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            pageWrap,
            "grid items-center gap-10 py-[clamp(2rem,5vw,4rem)] lg:grid-cols-2",
          )}
        >
          <div className="min-w-0">
            <p className="inline-flex rounded-full bg-lime/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime">
              Field careers · Wichita, KS
            </p>
            <h1 className="font-display mt-4 text-[clamp(2rem,6.5vw,3.75rem)] font-extrabold uppercase leading-[1.05] tracking-tight">
              Good work. Clear pay. Build skills outdoors.
            </h1>
            <p className="mt-4 max-w-[42ch] text-base text-white/80 sm:text-lg">
              Frontline lawn, landscape, and technician jobs built around clear expectations, paid training, and a
              visible path to more responsibility.
            </p>
            <ul className="mt-5 flex flex-col gap-2 text-sm font-semibold text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-5">
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-lime" aria-hidden />
                Pay confirmed before you accept
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-lime" aria-hidden />
                No résumé for entry-level
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-lime" aria-hidden />
                Paid hands-on training
              </li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="lime">
                <a href="#jobs">See jobs near me</a>
              </Button>
              <Button asChild variant="ghost" className="border-white text-white">
                <a href="#apply">Aplicar en Español</a>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/65">
              Short application on your phone. No account creation required.
            </p>
          </div>

          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-brand-lg border border-white/15 bg-forest-2">
              <p className="px-5 pt-5 text-xs font-bold uppercase tracking-wider text-lime">
                Real crew. Real morning.
              </p>
              <MediaFrame
                slot="careers.hero"
                aspect="16/10"
                className="mt-3 rounded-none border-0"
                sizes="(max-width: 1024px) 92vw, 48vw"
                priority
              />
              <div className="border-t border-white/10 bg-white px-5 py-4 text-ink">
                <p className="text-xs font-bold uppercase tracking-wider text-forest">
                  What you’ll know before you say yes
                </p>
                <p className="mt-1 text-sm text-sage">
                  Pay · report location · normal schedule · gear provided · who trains you
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Truth strip */}
      <section className="bg-lime text-forest">
        <div
          className={cn(
            pageWrap,
            "flex flex-col gap-2 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2",
          )}
        >
          <p className="font-display text-sm font-extrabold uppercase tracking-wide sm:text-base">
            The deal should be clear before day one.
          </p>
          <p className="text-sm font-semibold sm:text-base">
            Here’s the work. Here’s the pay. Here’s when and where. Here’s how you move up.
          </p>
        </div>
      </section>

      {/* Open jobs */}
      <section className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
        <SectionHead
          eyebrow="Open field jobs"
          title="Find the job that fits what you can do now — and what you want to learn next."
          description="Every card answers practical questions first: pay status, schedule, location, experience, and what happens next."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {["Wichita, KS", "Entry-level + skilled", "Full-time field roles", "EN | ES"].map((b) => (
            <span
              key={b}
              className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-bold text-forest"
            >
              {b}
            </span>
          ))}
        </div>
        <OpenJobCards className="mt-8" />
        <p className="mt-6 max-w-[70ch] text-sm text-sage">
          Starting pay amounts publish on cards only after Ops/HR verifies them. Until then each card states that pay is
          confirmed before you accept.
        </p>
      </section>

      {/* Interactive tools */}
      <section id="tools" className="bg-cream">
        <div className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
          <SectionHead
            eyebrow="Try before you apply"
            title="See pay, schedule, and fit — then decide."
            description="Tools use planning examples or verified facts only. Gross pay is never shown as take-home."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <PaycheckEstimator />
            <SchedulePreview />
            <JobFitQuiz />
            <FirstDayPreview />
          </div>
        </div>
      </section>

      {/* Career path (static Figma steps + interactive simulator) */}
      <section className="bg-paper">
        <div className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
          <SectionHead
            eyebrow="A path you can see"
            title="Start where you are. Move up by proving skills."
            description="Promotion is competency-based and subject to openings — not vague promises tied to time served."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                t: "Crew Member I",
                d: "Safety · timekeeping · hand tools · site cleanup",
              },
              {
                n: "02",
                t: "Operator / Crew II",
                d: "Mower · trimmer · blower · inspection · property protection",
              },
              {
                n: "03",
                t: "Crew Lead Ready",
                d: "Brief crew · document quality · coach safely · communicate issues",
              },
              {
                n: "04",
                t: "Specialist / Supervisor",
                d: "Technical license or leadership · quality · retention · safety",
              },
            ].map((s) => (
              <li key={s.n} className="rounded-brand bg-forest p-5 text-white">
                <span className="font-display text-sm font-bold text-lime">{s.n}</span>
                <p className="font-display mt-2 text-lg font-bold">{s.t}</p>
                <p className="mt-2 text-sm text-white/75">{s.d}</p>
              </li>
            ))}
          </ol>
          <CareerPathSimulator className="mt-8" />
        </div>
      </section>

      {/* Trust grid */}
      <section className="bg-cream">
        <div className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
          <SectionHead
            eyebrow="No mystery job offer"
            title="What you’ll know before you say yes."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map((t) => (
              <div key={t.n} className="rounded-brand border border-line bg-white p-5">
                <span className="font-display text-sm font-bold text-lime-2">{t.n}</span>
                <h3 className="font-display mt-2 text-lg font-bold text-ink">{t.title}</h3>
                <p className="mt-2 text-sm text-sage">{t.body}</p>
              </div>
            ))}
          </div>
          <ManagerExpectationsCard className="mt-8" />
        </div>
      </section>

      {/* Training / 90 days */}
      <section className="bg-paper">
        <div
          className={`${pageWrap} grid gap-10 py-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-2`}
        >
          <div>
            <SectionHead
              eyebrow="Trained before you’re expected to know"
              title="Safety isn’t a slogan. It’s how the work gets taught."
              description="Field work includes powered equipment, heat/weather, chemicals where applicable, vehicles, noise, and property-protection risks."
            />
            <ul className="mt-6 space-y-3 text-sm font-semibold text-ink">
              {[
                "Required PPE provided according to company policy",
                "Hands-on equipment training and competency checkoffs",
                "First-shift safety + emergency reporting orientation",
                "Short recurring safety talks tied to real work",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-lime" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-brand border border-line bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-green">Your first 90 days</p>
            <ul className="mt-4 space-y-4">
              {NINETY.map((m) => (
                <li key={m.badge} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                  <span className="w-fit shrink-0 rounded-full bg-cream px-3 py-1 text-xs font-bold text-forest">
                    {m.badge}
                  </span>
                  <span className="text-sm text-ink">{m.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Short application */}
      <section className="bg-forest text-white">
        <div className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
          <SectionHead
            tone="on-dark"
            eyebrow="The short application"
            title="Enough information to decide the next step. Nothing you don’t need yet."
            description="Name → mobile → ZIP → preferred job → availability → can you reach report location/start time → optional experience → language."
          />
          <div className="mt-8 max-w-2xl">
            <CareersApplyForm className="border-0" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="ghost" className="border-white text-white">
              <a href={`sms:${siteConfig.phone.e164}?&body=${encodeURIComponent("I'd like info on Cut Rates field jobs")}`}>
                Text me this job
              </a>
            </Button>
            <Button asChild variant="ghost" className="border-white/50 text-white/90">
              <a href={`tel:${siteConfig.phone.e164}`}>Call {siteConfig.phone.display}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Careers footer strip */}
      <footer className="border-t border-line bg-paper">
        <div
          className={cn(
            pageWrap,
            "flex flex-col gap-4 py-10 sm:flex-row sm:items-end sm:justify-between",
          )}
        >
          <div>
            <p className="font-display text-lg font-bold text-forest">Cut Rates Lawn Care</p>
            <p className="mt-1 text-sm text-sage">Clear expectations. Skilled work. A path forward.</p>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-sage">
            <li>
              <Link href="/privacy" className="hover:text-forest">
                Applicant privacy
              </Link>
            </li>
            <li>
              <span title="Equal employment opportunity — full statement with hiring entity">EEO</span>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}?subject=Accommodation%20request`} className="hover:text-forest">
                Disability / accommodation
              </a>
            </li>
            <li>
              <Link href="/terms" className="hover:text-forest">
                SMS terms
              </Link>
            </li>
            <li>
              <span title="Hiring entity details confirmed by Ops/HR">Hiring entity</span>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
