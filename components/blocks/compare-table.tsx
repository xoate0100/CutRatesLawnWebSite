import { BUNDLES } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

const ROWS = [
  { feature: "Weekly mowing & edging", essentials: true, fullYard: true, estate: true },
  { feature: "Seasonal cleanup", essentials: true, fullYard: true, estate: true },
  { feature: "Text reminders", essentials: true, fullYard: true, estate: true },
  { feature: "Fertilization program", essentials: false, fullYard: true, estate: true },
  { feature: "Aeration & overseeding", essentials: false, fullYard: true, estate: true },
  { feature: "Landscape maintenance", essentials: false, fullYard: false, estate: true },
  { feature: "Priority scheduling", essentials: false, fullYard: false, estate: true },
] as const

function Cell({ ok }: { ok: boolean }) {
  return (
    <td className="px-3 py-3 text-center text-sm font-semibold">
      {ok ? <span className="text-green">✓</span> : <span className="text-sage/40">—</span>}
    </td>
  )
}

export type CompareTableProps = {
  className?: string
}

export function CompareTable({ className }: CompareTableProps) {
  const [essentials, fullYard, estate] = BUNDLES
  return (
    <div className={cn("mt-8 overflow-x-auto rounded-brand border border-line bg-white", className)}>
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-cream/60">
            <th className="px-4 py-3 text-sm font-bold text-sage">What&apos;s included</th>
            <th className="px-3 py-3 text-center text-sm font-bold">
              {essentials.name}
              <div className="text-xs font-semibold text-sage">from ${essentials.priceFrom}/mo</div>
            </th>
            <th className="px-3 py-3 text-center text-sm font-bold">
              {fullYard.name}
              <div className="text-xs font-semibold text-sage">from ${fullYard.priceFrom}/mo</div>
            </th>
            <th className="px-3 py-3 text-center text-sm font-bold">
              {estate.name}
              <div className="text-xs font-semibold text-sage">from ${estate.priceFrom}/mo</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.feature} className="border-b border-line last:border-0">
              <th scope="row" className="px-4 py-3 text-sm font-medium text-ink">
                {row.feature}
              </th>
              <Cell ok={row.essentials} />
              <Cell ok={row.fullYard} />
              <Cell ok={row.estate} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
