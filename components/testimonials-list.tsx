import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { testimonials } from "@/lib/static-data"
import { Star } from "lucide-react"

interface TestimonialsListProps {
  limit?: number
}

export function TestimonialsList({ limit }: TestimonialsListProps) {
  // Limit the number of testimonials if specified
  const displayedTestimonials = testimonials.slice(0, limit || testimonials.length)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayedTestimonials.map((testimonial, index) => (
        <Card key={index} className="h-full">
          <CardContent className="pt-6">
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="italic mb-4">"{testimonial.text}"</p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={testimonial.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
