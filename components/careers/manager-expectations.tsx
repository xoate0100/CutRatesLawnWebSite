import { cn } from "@/lib/utils"

/** Reciprocal expectations — no fabricated manager identities. */
export function ManagerExpectationsCard({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-brand border border-line bg-white p-5 sm:p-6", className)}
      id="expectations"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-green">What success looks like here</p>
      <h3 className="font-display mt-1 text-2xl font-bold text-ink">Clear deal both ways.</h3>
      <p className="mt-2 text-sm text-sage">
        Named trainers and managers are confirmed at hire — we don’t publish placeholder people.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-brand bg-cream p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-forest">What we expect from you</p>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            <li>Show up ready for outdoor work</li>
            <li>Tell the truth about skills and availability</li>
            <li>Protect the property and ask before guessing</li>
            <li>Follow safety and quality standards</li>
          </ul>
        </div>
        <div className="rounded-brand bg-forest p-4 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-lime">What you can expect from us</p>
          <ul className="mt-3 space-y-2 text-sm text-white/90">
            <li>Pay and report details before you accept</li>
            <li>Paid hands-on training and PPE per policy</li>
            <li>A named person to ask when you’re stuck</li>
            <li>A visible skills path — openings permitting</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
