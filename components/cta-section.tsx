import Link from "next/link"

interface CTAButtonProps {
  text: string
  url: string
  variant?: "primary" | "secondary"
}

interface CTASectionProps {
  data: {
    title?: string
    subtitle?: string
    primaryButton?: CTAButtonProps
    secondaryButton?: CTAButtonProps
    backgroundColor?: string
  }
  title?: string
  description?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export function CTASection({ data }: CTASectionProps) {
  const {
    title = "Ready to get started?",
    subtitle = "Contact us today for a free quote on your lawn care needs.",
    primaryButton = { text: "Get a Quote", url: "/quote" },
    secondaryButton = { text: "Learn More", url: "/services" },
    backgroundColor = "bg-green-600",
  } = data || {}

  return (
    <section className={`w-full ${backgroundColor} text-white py-16`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryButton && (
            <Link
              href={primaryButton.url}
              className="bg-white text-green-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              {primaryButton.text}
            </Link>
          )}
          {secondaryButton && (
            <Link
              href={secondaryButton.url}
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-green-600 transition-colors"
            >
              {secondaryButton.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default CTASection
