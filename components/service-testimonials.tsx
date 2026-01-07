import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"

interface Testimonial {
  id: number
  attributes: {
    name: string
    comment: string
    rating: number
    createdAt: string
  }
}

interface ServiceTestimonialsProps {
  testimonials: Testimonial[]
  serviceTitle?: string
  className?: string
}

export function ServiceTestimonials({ testimonials, serviceTitle, className }: ServiceTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h2 className="mb-6 text-2xl font-bold">
        {serviceTitle ? `What Customers Say About Our ${serviceTitle} Service` : "Customer Testimonials"}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { name, comment, rating, createdAt } = testimonial.attributes

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{formatRelativeTime(createdAt)}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{comment}</p>
      </CardContent>
    </Card>
  )
}
