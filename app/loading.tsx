import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="atm-wash min-h-[50vh] px-4 py-16">
      <div className="container mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-2/3 bg-primary/15" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-5/6 bg-muted" />
        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-lg bg-muted" />
          <Skeleton className="h-32 rounded-lg bg-muted" />
          <Skeleton className="h-32 rounded-lg bg-muted" />
        </div>
        <p className="pt-2 text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  )
}
