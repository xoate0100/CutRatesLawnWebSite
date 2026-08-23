import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUNDLES, type BundleItem } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export type BundleCardProps = {
  bundle: BundleItem
  className?: string
}

export function BundleCard({ bundle, className }: BundleCardProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-brand border border-line bg-white p-6 shadow-sm",
        bundle.popular && "border-2 border-forest shadow-brand",
        className,
      )}
    >
      {bundle.popular ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-forest-2">
          Most popular
        </span>
      ) : null}
      <h3 className="font-display text-xl font-bold">{bundle.name}</h3>
      <div className="mt-2 font-display text-4xl font-extrabold text-forest">
        ${bundle.priceFrom}
        <small className="ml-1 text-base font-semibold text-sage">{bundle.period}</small>
      </div>
      <ul className="mt-4 flex-1 space-y-2.5">
        {bundle.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm font-medium text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" strokeWidth={3} />
            {f}
          </li>
        ))}
      </ul>
      <Button asChild variant={bundle.popular ? "lime" : "dark"} className="mt-6 w-full">
        <Link href={bundle.href}>Choose {bundle.name}</Link>
      </Button>
    </article>
  )
}

export function BundleCards({
  bundles = BUNDLES,
  className,
}: {
  bundles?: BundleItem[]
  className?: string
}) {
  return (
    <div className={cn("mt-8 grid gap-4 md:grid-cols-3", className)}>
      {bundles.map((b) => (
        <BundleCard key={b.id} bundle={b} />
      ))}
    </div>
  )
}
