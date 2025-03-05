import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"

interface CTASectionProps {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

export default function CTASection({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: CTASectionProps) {
  return (
    <section className="py-16 bg-green-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">{description}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={primaryButtonLink}>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              {primaryButtonText} <Calendar className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href={secondaryButtonLink}>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              {secondaryButtonText} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

