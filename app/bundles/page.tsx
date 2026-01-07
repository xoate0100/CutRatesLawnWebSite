import type { Metadata } from "next"
import { getAllBundles } from "@/lib/api"
import { BundlesList } from "@/components/bundles-list"
import { ApiErrorFallback } from "@/components/api-error-fallback"

export const metadata: Metadata = {
  title: "Service Bundles | Cut Rates Lawn Care",
  description:
    "Explore our lawn care and landscaping service bundles designed to save you money while keeping your property looking its best.",
}

export default async function BundlesPage() {
  try {
    // Pre-fetch bundles for server rendering
    await getAllBundles()

    return (
      <main className="container py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Service Bundles</h1>
          <p className="text-xl text-muted-foreground">
            Explore our carefully designed service bundles that provide comprehensive lawn care at discounted rates.
          </p>
        </div>

        <BundlesList />
      </main>
    )
  } catch (error) {
    console.error("Error in bundles page:", error)
    return (
      <main className="container py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Service Bundles</h1>
          <p className="text-xl text-muted-foreground">
            Explore our carefully designed service bundles that provide comprehensive lawn care at discounted rates.
          </p>
        </div>

        <ApiErrorFallback error={error instanceof Error ? error : new Error("Failed to load bundles")} />
      </main>
    )
  }
}
