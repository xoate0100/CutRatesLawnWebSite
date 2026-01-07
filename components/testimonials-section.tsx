"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Section, SectionHeader } from "@/components/section"
import { TestimonialCard } from "@/components/testimonial-card"
import { getAllTestimonials, getTestimonialsByService, type TestimonialType } from "@/lib/api"
import { LoadingState } from "@/components/loading-state"
import { ErrorMessage } from "@/components/error-message"

interface TestimonialsSectionProps {
  serviceSlug?: string
  title?: string
  description?: string
  background?: "white" | "light" | "primary"
}

export function TestimonialsSection({
  serviceSlug,
  title = "What Our Customers Say",
  description = "Hear from our satisfied customers about their experience with Cut Rates Lawn Care.",
  background = "light",
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true)

        const data = serviceSlug ? await getTestimonialsByService(serviceSlug) : await getAllTestimonials()

        setTestimonials(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching testimonials:", err)
        setError(err instanceof Error ? err : new Error("Failed to fetch testimonials"))
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [serviceSlug])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  // Calculate visible testimonials (3 on desktop, 1 on mobile)
  const visibleTestimonials =
    testimonials.length > 0
      ? [
          testimonials[currentIndex],
          testimonials[(currentIndex + 1) % testimonials.length],
          testimonials[(currentIndex + 2) % testimonials.length],
        ]
      : []

  return (
    <Section background={background}>
      <SectionHeader title={title} description={description} />

      {loading ? (
        <LoadingState message="Loading testimonials..." />
      ) : error ? (
        <ErrorMessage
          title="Error Loading Testimonials"
          message="We're having trouble loading our customer testimonials. Please try again later."
          type="warning"
        />
      ) : testimonials.length === 0 ? (
        <p className="text-center text-gray-600">No testimonials available at this time.</p>
      ) : (
        <div className="mt-8">
          {/* Desktop Testimonials (3 columns) */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </div>

          {/* Mobile Testimonial (Single) */}
          <div className="md:hidden">
            <TestimonialCard testimonial={visibleTestimonials[0]} />
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </Section>
  )
}
