import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TurfMotif } from "@/components/atmosphere/turf-motif"

type EmptyStateProps = {
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
}

export function EmptyState({
  title,
  description,
  actionHref = "/",
  actionLabel = "Go Home",
}: EmptyStateProps) {
  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-lg border bg-card px-8 py-10 text-center atm-elev-1">
      <TurfMotif className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full text-primary opacity-30" />
      <h2 className="relative text-2xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="relative mt-3 text-muted-foreground">{description}</p>}
      {actionHref && (
        <div className="relative mt-6">
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
