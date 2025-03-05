import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import CTASection from "@/components/cta-section"

const faqCategories = [
  {
    category: "Services",
    questions: [
      {
        question: "What services do you offer?",
        answer:
          "We offer a wide range of services including lawn mowing, fertilization, weed control, pest control, landscaping, snow removal, and more. Check our services page for a full list.",
      },
      {
        question: "How often should I have my lawn mowed?",
        answer:
          "The frequency of mowing depends on various factors such as grass type, season, and growth rate. Generally, we recommend mowing once a week during the growing season.",
      },
      {
        question: "Do you offer organic lawn care options?",
        answer:
          "Yes, we offer organic lawn care options. These use natural, environmentally friendly products to maintain your lawn. Contact us for more details.",
      },
    ],
  },
  {
    category: "Scheduling and Pricing",
    questions: [
      {
        question: "How do I schedule a service?",
        answer:
          "You can easily schedule a service through our website, by phone, or via our mobile app. Choose your preferred service and select an available time slot.",
      },
      {
        question: "What is your pricing structure?",
        answer:
          "Our pricing varies depending on the service and the size of your property. We offer both one-time services and recurring service plans. Check our pricing page for more details or contact us for a custom quote.",
      },
      {
        question: "Do you offer any discounts or promotions?",
        answer:
          "Yes, we regularly offer seasonal promotions and discounts for new customers. We also have a referral program where you can earn credits for referring friends and family.",
      },
    ],
  },
  {
    category: "Policies and Procedures",
    questions: [
      {
        question: "What is your cancellation policy?",
        answer:
          "We understand that plans can change. We ask for at least 24 hours notice for cancellations. Cancellations made with less than 24 hours notice may be subject to a cancellation fee.",
      },
      {
        question: "Are your services guaranteed?",
        answer:
          "Yes, we stand behind our work with a 100% satisfaction guarantee. If you're not completely satisfied with our service, we'll make it right.",
      },
      {
        question: "Are your technicians licensed and insured?",
        answer:
          "Absolutely. All our technicians are fully licensed, insured, and undergo regular training to stay up-to-date with the latest industry standards and practices.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Find answers to common questions about our services, scheduling, and policies.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {faqCategories.map((category, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        <CTASection
          title="Still Have Questions?"
          description="Our team is here to help. Contact us for personalized assistance."
          primaryButtonText="Contact Us"
          primaryButtonLink="/contact"
          secondaryButtonText="View Services"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

