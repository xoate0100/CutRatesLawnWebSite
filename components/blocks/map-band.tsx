import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

export type MapBandProps = {
  className?: string
  title?: string
  description?: string
}

export function MapBand({
  className,
  title = "Find us in Valley Center",
  description = "Serving Wichita to Kansas City — stop by or request a quote online.",
}: MapBandProps) {
  const mapsSrc = `https://www.google.com/maps?q=${siteConfig.address.mapsQuery}&output=embed`

  return (
    <section className={cn("overflow-hidden rounded-brand border border-line bg-cream", className)}>
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
          <p className="mt-2 text-sage">{description}</p>
          <p className="mt-4 font-semibold text-ink">{siteConfig.address.full}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${siteConfig.address.mapsQuery}`}
            className="mt-3 inline-flex font-bold text-green"
            target="_blank"
            rel="noreferrer"
          >
            Open in Maps →
          </a>
        </div>
        <div className="relative min-h-[260px] bg-muted">
          <iframe
            title="Cut Rates Lawn Care location map"
            src={mapsSrc}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
