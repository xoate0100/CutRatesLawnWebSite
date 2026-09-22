/**
 * Published Google reputation for Cut Rates Lawn Care.
 * Live Places data is preferred when GOOGLE_PLACES_API_KEY is set;
 * these 5-star quotes are the production fallback (from the current Google listing).
 */
export const GOOGLE_RATING = 4.8
export const GOOGLE_REVIEW_COUNT = 32
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/hzNhwvqRi3TMVGTE8"
export const GOOGLE_RATING_LABEL = `${GOOGLE_RATING}★ Google`

export type CuratedGoogleReview = {
  author_name: string
  rating: 5
  relative_time_description: string
  text: string
  profile_photo_url: string
  time: number
}

/** Five-star Google reviews with usable copy — used for rotators sitewide. */
export const FIVE_STAR_GOOGLE_REVIEWS: CuratedGoogleReview[] = [
  {
    author_name: "Mason Burns",
    rating: 5,
    relative_time_description: "recently",
    text: "Joe with Cut Rates did a fantastic job on our yard. The guy can mow a yard with the best of em.",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1758009600,
  },
  {
    author_name: "Matthew Ankenbrandt",
    rating: 5,
    relative_time_description: "a year ago",
    text: "Cut Rates did a phenomenal job. Communication was top notch. Would highly recommend.",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1725148800,
  },
  {
    author_name: "Austin Lochmann",
    rating: 5,
    relative_time_description: "a year ago",
    text: "Best lawn service I’ve ever used.",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1722556800,
  },
  {
    author_name: "Mike Schaplowsky",
    rating: 5,
    relative_time_description: "3 years ago",
    text: "Couldn't ask for anything more! Great rates, great work ethic, and when the job wasn't quite done the way we wanted it done the first time, they agreed to come back out and redo it at no extra cost! Would definitely recommend for future work.",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1630454400,
  },
  {
    author_name: "Joel Atherton",
    rating: 5,
    relative_time_description: "3 years ago",
    text: "Chris and his crew are awesome! They always do a great job and leave the place nice and clean!",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1627862400,
  },
  {
    author_name: "Nicholas Lewis",
    rating: 5,
    relative_time_description: "3 years ago",
    text: "Great company with a standup and trustworthy owner! Had a great experience! Highly recommend!!",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1625270400,
  },
  {
    author_name: "Elizabeth Petrakis",
    rating: 5,
    relative_time_description: "3 years ago",
    text: "The best company in the area. Has tradition and quality that exceeds anyone comparable.",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1622678400,
  },
  {
    author_name: "Gabe Phillips",
    rating: 5,
    relative_time_description: "3 years ago",
    text: "Fast and reliable. Also very flexible hours and friendly crew.",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1620086400,
  },
  {
    author_name: "Kyle Ewy",
    rating: 5,
    relative_time_description: "3 years ago",
    text: "Fast, courteous, fairly priced!",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1617494400,
  },
  {
    author_name: "Zach Castor",
    rating: 5,
    relative_time_description: "3 years ago",
    text: "Quality lawn care, quality folks!",
    profile_photo_url: "/placeholder.svg?height=50&width=50",
    time: 1614902400,
  },
]

export function fiveStarOnly<T extends { rating: number }>(reviews: T[]): T[] {
  return reviews.filter((r) => r.rating >= 5)
}
