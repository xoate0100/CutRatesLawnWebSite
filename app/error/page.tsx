import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { reason?: string }
}) {
  const reason = searchParams?.reason || "unknown"

  let title = "Something went wrong"
  let message = "We encountered an error while processing your request."

  if (reason === "configuration") {
    title = "Configuration Error"
    message = "The application is missing required environment variables. Please contact the administrator."
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">{title}</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">{message}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
