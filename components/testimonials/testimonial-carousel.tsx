"use client"

import { useState, useEffect, useCallback } from "react"
import type { TestimonialType } from "@/lib/types"
import { getSafeImageUrl } from "@/lib/image-utils"

interface TestimonialCarouselProps {
  testimonials: TestimonialType[]
  autoplay?: boolean
  interval?: number
  className?: string
}

export function TestimonialCarousel({
  testimonials,
  autoplay = true,
  interval = 5000,
  className = "",
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  const goToTestimonial = (index: number) => {
    setActiveIndex(index)
  }

  useEffect(() => {
    if (!autoplay) return

    const timer = setInterval(() => {
      nextTestimonial()
    }, interval)

    return () => clearInterval(timer)
  }, [autoplay, interval, nextTestimonial])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 p-6 bg-white">
              <div className="flex flex-col items-center text-center">
                {testimonial.attributes.image && (
                  <div className="mb-4">
                    <img
                      src={getSafeImageUrl(testimonial.attributes.image) || "/placeholder.svg?height=80&width=80"}
                      alt={testimonial.attributes.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                      width={80}
                      height={80}
                    />
                  </div>
                )}

                <div className="mb-4">
                  {Array.from({ length: testimonial.attributes.rating || 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline-block text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-700 italic mb-4">"{testimonial.attributes.quote}"</blockquote>

                <div>
                  <p className="font-bold text-gray-900">{testimonial.attributes.name}</p>
                  {(testimonial.attributes.role || testimonial.attributes.company) && (
                    <p className="text-gray-600 text-sm">
                      {testimonial.attributes.role}
                      {testimonial.attributes.role && testimonial.attributes.company && ", "}
                      {testimonial.attributes.company}
                    </p>
                  )}
                </div>

                {testimonial.attributes.service?.data && (
                  <div className="mt-4">
                    <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {testimonial.attributes.service.data.attributes?.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevTestimonial}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        aria-label="Previous testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextTestimonial}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        aria-label="Next testimonial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToTestimonial(index)}
            className={`h-2 w-2 mx-1 rounded-full focus:outline-none ${
              index === activeIndex ? "bg-green-600" : "bg-gray-300"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
            aria-current={index === activeIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  )
}
