import { formatDistanceToNow } from "date-fns"
import { ExternalLink, User } from "lucide-react"
import type { Review } from "@/lib/services/reviews/reviews-service.interface"

interface ReviewCardProps {
  review: Review
  businessName?: string
  className?: string
}

export function ReviewCard({ review, businessName = "Cut Rates Lawn Care", className = "" }: ReviewCardProps) {
  // Convert timestamp to relative time (e.g., "2 months ago")
  const relativeTime = formatDistanceToNow(new Date(review.time * 1000), { addSuffix: true })

  // Truncate long review text
  const truncatedText = review.text.length > 200 ? `${review.text.substring(0, 200)}...` : review.text

  // Get source logo
  const getSourceLogo = () => {
    switch (review.source) {
      case "google":
        return "https://storage.googleapis.com/site_photo_storage/images/partners/google-reviews.png"
      case "yelp":
        return "https://storage.googleapis.com/site_photo_storage/images/partners/yelp-logo.png"
      case "facebook":
        return "/placeholder.jpg?height=20&width=60"
      default:
        return ""
    }
  }

  return (
    <div
      className={`bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start gap-3 mb-3">
        {review.author.photoUrl ? (
          <img
            src={review.author.photoUrl || "/placeholder.jpg"}
            alt={`${review.author.name}'s profile`}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
        )}

        <div>
          <div className="font-medium">{review.author.name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span>{relativeTime}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
            <span>for {businessName}</span>
          </div>
        </div>
      </div>

      <div className="flex mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>

      <p className="text-gray-700 text-sm mb-3">{truncatedText}</p>

      {review.author.profileUrl && (
        <a
          href={review.author.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-blue-600 hover:underline"
        >
          View on {review.source.charAt(0).toUpperCase() + review.source.slice(1)}{" "}
          <ExternalLink className="ml-1 w-3 h-3" />
        </a>
      )}

      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center">
        <div className="flex items-center">
          <img src={getSourceLogo() || "/placeholder.jpg"} alt={`${review.source} Review`} className="h-4" />
          <span className="text-xs text-gray-500 ml-1">Verified Review</span>
        </div>
      </div>
    </div>
  )
}
