import type { ReviewsService } from "./reviews-service.interface"
import { GoogleReviewsService } from "./google-reviews-service"

export class ReviewsServiceFactory {
  static createGoogleReviewsService(): ReviewsService {
    return new GoogleReviewsService()
  }

  // In the future, we could add more services like:
  // static createYelpReviewsService(): ReviewsService
  // static createFacebookReviewsService(): ReviewsService
}
