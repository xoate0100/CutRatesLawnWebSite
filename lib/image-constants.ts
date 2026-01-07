// Base URL for Google Cloud Storage bucket
const CLOUD_STORAGE_BASE_URL = "https://storage.googleapis.com/site_photo_storage"

export const IMAGES = {
  // Hero images
  HERO_HOME: `${CLOUD_STORAGE_BASE_URL}/images/hero/home-hero.jpg`,
  HERO_SERVICES: `${CLOUD_STORAGE_BASE_URL}/images/hero/services-hero.jpg`,
  HERO_ABOUT: `${CLOUD_STORAGE_BASE_URL}/images/hero/about-hero.jpg`,
  HERO_CONTACT: `${CLOUD_STORAGE_BASE_URL}/images/hero/contact-hero.jpg`,

  // Service images
  SERVICE_MOWING: `${CLOUD_STORAGE_BASE_URL}/images/services/lawn-mowing.jpg`,
  SERVICE_FERTILIZATION: `${CLOUD_STORAGE_BASE_URL}/images/services/fertilization.jpg`,
  SERVICE_WEED_CONTROL: `${CLOUD_STORAGE_BASE_URL}/images/services/weed-control.jpg`,
  SERVICE_AERATION: `${CLOUD_STORAGE_BASE_URL}/images/services/aeration.jpg`,
  SERVICE_CLEANUP: `${CLOUD_STORAGE_BASE_URL}/images/services/cleanup.jpg`,

  // Testimonial images
  TESTIMONIAL_1: `${CLOUD_STORAGE_BASE_URL}/images/testimonials/customer-1.jpg`,
  TESTIMONIAL_2: `${CLOUD_STORAGE_BASE_URL}/images/testimonials/customer-2.jpg`,
  TESTIMONIAL_3: `${CLOUD_STORAGE_BASE_URL}/images/testimonials/customer-3.jpg`,

  // Team images
  TEAM_OWNER: `${CLOUD_STORAGE_BASE_URL}/images/team/owner.jpg`,
  TEAM_MANAGER: `${CLOUD_STORAGE_BASE_URL}/images/team/manager.jpg`,
  TEAM_CREW: `${CLOUD_STORAGE_BASE_URL}/images/team/crew.jpg`,

  // Logo and branding
  LOGO: `${CLOUD_STORAGE_BASE_URL}/images/branding/logo.svg`,
  LOGO_WHITE: `${CLOUD_STORAGE_BASE_URL}/images/branding/logo-white.svg`,

  // Partners and credentials
  PARTNER_KWCH: `${CLOUD_STORAGE_BASE_URL}/images/partners/kwch-logo.png`,
  PARTNER_GOOGLE: `${CLOUD_STORAGE_BASE_URL}/images/partners/google-reviews.png`,
  PARTNER_YELP: `${CLOUD_STORAGE_BASE_URL}/images/partners/yelp-logo.png`,

  // Equipment and process
  EQUIPMENT_MOWER: `${CLOUD_STORAGE_BASE_URL}/images/equipment/professional-mower.jpg`,
  EQUIPMENT_SPREADER: `${CLOUD_STORAGE_BASE_URL}/images/equipment/spreader.jpg`,

  // Before/After
  BEFORE_AFTER_1: `${CLOUD_STORAGE_BASE_URL}/images/results/before-after-1.jpg`,
  BEFORE_AFTER_2: `${CLOUD_STORAGE_BASE_URL}/images/results/before-after-2.jpg`,
}

// Function to get image path
export const getImagePath = (key: keyof typeof IMAGES): string => {
  return IMAGES[key]
}

// Function to get placeholder image
export const getPlaceholderImage = (width: number, height: number, text?: string): string => {
  return `/placeholder.svg?height=${height}&width=${width}${text ? `&text=${encodeURIComponent(text)}` : ""}`
}

// Function to check if an image exists (client-side only)
export const checkImageExists = async (url: string): Promise<boolean> => {
  if (typeof window === "undefined") return true

  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error("Error checking image:", error)
    return false
  }
}
