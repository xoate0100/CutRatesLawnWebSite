import Link from "next/link"
import { MediaFrame } from "@/components/media/media-frame"
import { Tag } from "@/components/ui/tag"
import { SERVICES, type ServiceItem } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

export function ServiceCard({
  service,
  className,
}: {
  service: ServiceItem
  className?: string
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-brand border border-line bg-white transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-brand",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <MediaFrame
          slot={service.mediaSlot}
          treatments={["duotone"]}
          aspect="16/10"
          className="h-full rounded-none [&_img]:duration-500 group-hover:[&_img]:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {service.priceLabel ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-lime px-2.5 py-1 text-[0.78rem] font-bold text-forest-2">
            {service.priceLabel}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h3 className="font-display text-[1.28rem] font-bold">{service.title}</h3>
        <p className="mt-1.5 text-[0.94rem] text-sage">{service.description}</p>
        <Link
          href={service.href}
          className="mt-3 inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-green"
        >
          Learn more <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  )
}

export function FeatureCard({
  service,
  className,
}: {
  service: ServiceItem
  className?: string
}) {
  return (
    <article
      className={cn(
        "group relative grid overflow-hidden rounded-brand border border-line bg-white transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-brand md:col-span-2 md:grid-cols-[1.1fr_1fr]",
        className,
      )}
    >
      <div className="relative min-h-[220px] md:h-auto md:min-h-[280px]">
        <MediaFrame
          slot={service.mediaSlot}
          treatments={["stripe", "grain"]}
          fill
          className="absolute inset-0 rounded-none"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-col justify-center p-7">
        {service.tag ? <Tag className="mb-3 self-start">{service.tag}</Tag> : null}
        <h3 className="font-display text-[1.7rem] font-bold">{service.title}</h3>
        <p className="mt-2 text-sage">{service.description}</p>
        <Link
          href={service.href}
          className="mt-4 inline-flex items-center gap-1.5 font-bold text-green"
        >
          Explore landscaping <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  )
}

export type ServiceGridProps = {
  services?: ServiceItem[]
  className?: string
}

export function ServiceGrid({ services = SERVICES, className }: ServiceGridProps) {
  const featured = services.find((s) => s.featured) ?? services[0]
  const rest = services.filter((s) => s.id !== featured.id)

  return (
    <div className={cn("mt-8 grid gap-4 md:grid-cols-3", className)}>
      <FeatureCard service={featured} />
      {rest.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
