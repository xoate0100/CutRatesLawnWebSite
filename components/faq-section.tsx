import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion-native"
import { getFAQs } from "@/lib/api"
import ErrorState from "@/components/error-state"

interface FAQSectionProps {
  category?: string
  limit?: number
  title?: string
}

export default async function FAQSection({
  category,
  limit = 5,
  title = "Frequently Asked Questions",
}: FAQSectionProps) {
  try {
    const faqs = await getFAQs(category, limit)

    if (!faqs || faqs.length === 0) {
      return null
    }

    return (
      <div className="w-full">
        {title && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-value={`item-${index}`}>
              <AccordionTrigger>{faq.attributes.question}</AccordionTrigger>
              <AccordionContent>{faq.attributes.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return <ErrorState message="Failed to load FAQ content. Please try again later." />
  }
}
