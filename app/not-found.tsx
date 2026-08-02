import { EmptyState } from "@/components/atmosphere/empty-state"

export default function NotFound() {
  return (
    <div className="atm-wash flex min-h-[60vh] items-center justify-center px-4 py-16">
      <EmptyState
        title="Page not found"
        description="The page you are looking for doesn't exist or has been moved."
        actionHref="/"
        actionLabel="Go Home"
      />
    </div>
  )
}
