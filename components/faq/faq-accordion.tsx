"use client"

import { useState } from "react"
import type { FAQType } from "@/lib/types"

interface FAQAccordionProps {
  faqs: FAQType[]
  className?: string
}

export function FAQAccordion({ faqs, className = "" }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleFAQ(index)}
            className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset transition-colors"
            aria-expanded={openIndex === index}
            aria-controls={`faq-content-${index}`}
          >
            <h3 className="font-medium text-gray-900">{faq.attributes.question}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transition-transform ${openIndex === index ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            id={`faq-content-${index}`}
            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96" : "max-h-0"}`}
            aria-hidden={openIndex !== index}
          >
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-gray-700">{faq.attributes.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
