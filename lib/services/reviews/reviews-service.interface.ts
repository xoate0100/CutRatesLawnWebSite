export interface ReviewsServiceOptions {
  limit?: number
  minRating?: number
  maxRating?: number
}

export interface ReviewAuthor {
  name: string
  photoUrl?: string
  profileUrl?: string
}

export interface Review {
  author: ReviewAuthor
  rating: number
  text: string
  time: number
  source: "google" | "yelp" | "facebook" | "internal"
}

export interface ReviewsData {
  businessName: string
  overallRating: number
  totalReviews: number
  reviews: Review[]
  usingFallback: boolean
  message?: string
}

export interface ReviewsService {
  getReviews(options?: ReviewsServiceOptions): Promise<ReviewsData>
}
