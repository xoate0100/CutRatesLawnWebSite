export const heroContent = {
  title: "Professional Lawn Care Services in Wichita",
  description:
    "Transform your lawn into the envy of the neighborhood with our professional lawn care services. Affordable, reliable, and tailored to your needs.",
  image: "/placeholder.svg?height=400&width=600&text=Beautiful+Lawn",
}

export const featuresContent = {
  title: "Why Choose Cut Rates Lawn Care?",
  features: [
    {
      title: "Professional Service",
      description: "Our team of experienced professionals delivers high-quality lawn care services.",
    },
    {
      title: "Affordable Pricing",
      description: "Competitive rates with no hidden fees. Get more value for your money.",
    },
    {
      title: "Reliable & Timely",
      description: "We show up when promised and complete the job efficiently.",
    },
    {
      title: "Satisfaction Guaranteed",
      description: "We're not happy until you're happy with the results.",
    },
  ],
}

export const ctaContent = {
  title: "Ready to Transform Your Lawn?",
  description: "Contact us today to schedule a service or request a free quote.",
  primaryButtonText: "Call Now",
  secondaryButtonText: "Get a Quote",
  secondaryButtonLink: "/quote",
}

export const companyInfo = {
  name: "Cut Rates Lawn Care",
  phone: "(316) 555-1234",
  email: "info@cutrateslawn.com",
  address: "123 Main St, Valley Center, KS 67147",
  hours: {
    weekdays: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed",
  },
  social: {
    facebook: "https://facebook.com/cutrateslawn",
    instagram: "https://instagram.com/cutrateslawn",
    twitter: "https://twitter.com/cutrateslawn",
  },
  serviceAreas: ["Valley Center", "Wichita", "Park City", "Kechi", "Maize", "Bel Aire", "Andover", "Derby"],
}

export const services = {
  data: [
    {
      id: 1,
      attributes: {
        title: "Lawn Mowing",
        slug: "lawn-mowing",
        shortDescription: "Professional lawn mowing service to keep your yard looking its best.",
        description:
          "Our professional lawn mowing service ensures your lawn maintains a clean, manicured appearance. We use commercial-grade equipment to provide precise cuts at the optimal height for your grass type, promoting healthy growth and a beautiful appearance.",
        price: 35,
        priceUnit: "per visit",
        image: "/placeholder.svg?height=300&width=400&text=Lawn+Mowing",
        featured: true,
        benefits: [
          "Precise cutting at optimal height",
          "Edge trimming included",
          "Clipping cleanup",
          "Flexible scheduling options",
          "Commercial-grade equipment",
        ],
        faqs: [
          {
            question: "How often should I have my lawn mowed?",
            answer:
              "During the growing season, most lawns benefit from weekly mowing. In slower growth periods, every 10-14 days may be sufficient.",
          },
          {
            question: "Do I need to be home during the service?",
            answer: "No, as long as we have access to your yard, you don't need to be present during the service.",
          },
          {
            question: "What happens in case of rain?",
            answer:
              "If it rains on your scheduled day, we'll reschedule for the next available day, weather permitting.",
          },
        ],
      },
    },
    {
      id: 2,
      attributes: {
        title: "Lawn Fertilization",
        slug: "lawn-fertilization",
        shortDescription: "Nourish your lawn with our professional fertilization service.",
        description:
          "Our lawn fertilization service provides essential nutrients to promote healthy grass growth, enhance color, and improve resistance to disease and drought. We use high-quality, slow-release fertilizers tailored to your lawn's specific needs and the local climate.",
        price: 75,
        priceUnit: "per application",
        image: "/placeholder.svg?height=300&width=400&text=Lawn+Fertilization",
        featured: true,
        benefits: [
          "Custom fertilizer blends",
          "Promotes thicker, greener grass",
          "Improves disease resistance",
          "Environmentally responsible products",
          "Scheduled program available",
        ],
        faqs: [
          {
            question: "How many fertilizer applications does my lawn need?",
            answer: "Most lawns benefit from 4-6 applications per year, spaced throughout the growing season.",
          },
          {
            question: "Is the fertilizer safe for pets and children?",
            answer: "Yes, but we recommend keeping pets and children off the lawn for 24 hours after application.",
          },
          {
            question: "Will fertilization help with weeds?",
            answer:
              "While fertilization primarily feeds your lawn, a healthier lawn naturally resists weed invasion. For direct weed control, consider our weed control service.",
          },
        ],
      },
    },
    {
      id: 3,
      attributes: {
        title: "Weed Control",
        slug: "weed-control",
        shortDescription: "Eliminate unwanted weeds and keep your lawn looking pristine.",
        description:
          "Our weed control service targets and eliminates broadleaf weeds, crabgrass, and other invasive plants that can detract from your lawn's appearance. We use selective herbicides that target weeds without harming your grass, applied by trained technicians.",
        price: 65,
        priceUnit: "per application",
        image: "/placeholder.svg?height=300&width=400&text=Weed+Control",
        featured: true,
        benefits: [
          "Targets broadleaf weeds and crabgrass",
          "Pre-emergent and post-emergent treatments",
          "Selective herbicides protect your grass",
          "Customized treatment plan",
          "Trained application technicians",
        ],
        faqs: [
          {
            question: "How soon will I see results?",
            answer: "Most weeds will begin to wilt within 2-3 days, with complete die-off within 1-2 weeks.",
          },
          {
            question: "How many treatments are needed?",
            answer:
              "For optimal results, we recommend 3-4 treatments per year, including pre-emergent applications in early spring.",
          },
          {
            question: "Is weed control safe for the environment?",
            answer:
              "We use EPA-approved products applied by trained technicians to minimize environmental impact while effectively controlling weeds.",
          },
        ],
      },
    },
    {
      id: 4,
      attributes: {
        title: "Aeration",
        slug: "aeration",
        shortDescription: "Improve soil health and grass growth with lawn aeration.",
        description:
          "Our core aeration service reduces soil compaction by removing small plugs of soil from your lawn, allowing air, water, and nutrients to reach the root zone more effectively. This promotes deeper root growth, improved drought resistance, and overall lawn health.",
        price: 120,
        priceUnit: "per service",
        image: "/placeholder.svg?height=300&width=400&text=Aeration",
        featured: false,
        benefits: [
          "Reduces soil compaction",
          "Improves nutrient absorption",
          "Enhances water penetration",
          "Promotes stronger root development",
          "Prepares lawn for overseeding",
        ],
        faqs: [
          {
            question: "When is the best time to aerate?",
            answer:
              "For cool-season grasses, early fall or spring is ideal. For warm-season grasses, late spring to early summer is best.",
          },
          {
            question: "How often should I aerate my lawn?",
            answer:
              "Most lawns benefit from annual aeration, but lawns with heavy clay soil or high traffic may need it twice a year.",
          },
          {
            question: "Should I water my lawn before aeration?",
            answer:
              "Yes, watering your lawn 1-2 days before aeration helps the aerator penetrate the soil more effectively.",
          },
        ],
      },
    },
    {
      id: 5,
      attributes: {
        title: "Overseeding",
        slug: "overseeding",
        shortDescription: "Fill in bare spots and improve lawn density with overseeding.",
        description:
          "Our overseeding service introduces new grass seed into your existing lawn to improve density, enhance color, and fill in bare or thin areas. We use premium grass seed varieties selected for your specific lawn conditions and local climate.",
        price: 85,
        priceUnit: "per 1,000 sq ft",
        image: "/placeholder.svg?height=300&width=400&text=Overseeding",
        featured: false,
        benefits: [
          "Fills in bare or thin areas",
          "Introduces improved grass varieties",
          "Increases lawn density",
          "Enhances resistance to disease and pests",
          "Improves overall lawn appearance",
        ],
        faqs: [
          {
            question: "When is the best time to overseed?",
            answer: "Early fall is ideal for cool-season grasses, while late spring is best for warm-season grasses.",
          },
          {
            question: "Should I aerate before overseeding?",
            answer:
              "Yes, aeration before overseeding improves seed-to-soil contact and germination rates. We offer a combined aeration and overseeding service.",
          },
          {
            question: "How long until I see results?",
            answer:
              "Depending on conditions, you should see new grass seedlings within 7-21 days, with noticeable improvement in 4-6 weeks.",
          },
        ],
      },
    },
    {
      id: 6,
      attributes: {
        title: "Seasonal Cleanup",
        slug: "seasonal-cleanup",
        shortDescription: "Prepare your lawn for the changing seasons with our cleanup service.",
        description:
          "Our seasonal cleanup service removes leaves, debris, and thatch from your lawn to prevent disease, improve air circulation, and enhance appearance. We offer spring and fall cleanup services to prepare your lawn for the growing season or winter dormancy.",
        price: 150,
        priceUnit: "per service",
        image: "/placeholder.svg?height=300&width=400&text=Seasonal+Cleanup",
        featured: false,
        benefits: [
          "Removes leaves and debris",
          "Prevents lawn disease",
          "Improves air circulation",
          "Prepares lawn for seasonal changes",
          "Includes bed cleanup and edging",
        ],
        faqs: [
          {
            question: "What's included in a seasonal cleanup?",
            answer:
              "Our cleanup includes leaf removal, light dethatching, bed cleaning, edge trimming, and debris removal.",
          },
          {
            question: "How often should I schedule a cleanup?",
            answer: "Most lawns benefit from at least two cleanups per year - one in spring and one in fall.",
          },
          {
            question: "Can you handle large properties?",
            answer:
              "Yes, we have the equipment and team to handle properties of all sizes, from small residential yards to large estates.",
          },
        ],
      },
    },
  ],
}

export const bundles = {
  data: [
    {
      id: 1,
      attributes: {
        title: "Basic Lawn Care Package",
        slug: "basic-lawn-care",
        description: "Essential lawn care services for a healthy, attractive lawn.",
        price: 125,
        frequency: "monthly",
        originalPrice: 155,
        discount: 20,
        image: "/placeholder.svg?height=300&width=400&text=Basic+Package",
        featured: true,
        popular: false,
        services: [
          "Bi-weekly lawn mowing",
          "Trimming and edging",
          "Seasonal fertilization (4x/year)",
          "Basic weed control (3x/year)",
        ],
        notIncluded: ["Aeration", "Overseeding", "Pest control"],
      },
    },
    {
      id: 2,
      attributes: {
        title: "Premium Lawn Care Package",
        slug: "premium-lawn-care",
        description: "Comprehensive lawn care for the perfect lawn year-round.",
        price: 195,
        frequency: "monthly",
        originalPrice: 245,
        discount: 20,
        image: "/placeholder.svg?height=300&width=400&text=Premium+Package",
        featured: true,
        popular: true,
        services: [
          "Weekly lawn mowing",
          "Trimming and edging",
          "Premium fertilization program (6x/year)",
          "Complete weed control (4x/year)",
          "Annual aeration",
          "Annual overseeding",
        ],
        notIncluded: ["Pest control"],
      },
    },
    {
      id: 3,
      attributes: {
        title: "Seasonal Cleanup Package",
        slug: "seasonal-cleanup",
        description: "Prepare your lawn for seasonal changes with our cleanup services.",
        price: 275,
        frequency: "per season",
        originalPrice: 325,
        discount: 15,
        image: "/placeholder.svg?height=300&width=400&text=Seasonal+Package",
        featured: true,
        popular: false,
        services: [
          "Thorough leaf removal",
          "Bed cleanup and mulching",
          "Shrub and hedge trimming",
          "Lawn dethatching",
          "Debris removal and disposal",
        ],
        notIncluded: ["Regular mowing", "Fertilization", "Weed control"],
      },
    },
  ],
}

export const testimonials = [
  {
    name: "John Smith",
    location: "Valley Center, KS",
    rating: 5,
    text: "Cut Rates Lawn Care has been maintaining my lawn for two years now, and I couldn't be happier with their service. My lawn has never looked better!",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
  },
  {
    name: "Sarah Johnson",
    location: "Wichita, KS",
    rating: 5,
    text: "I've tried several lawn care companies in the past, but none compare to Cut Rates. They're reliable, affordable, and do exceptional work.",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
  },
  {
    name: "Michael Brown",
    location: "Park City, KS",
    rating: 4,
    text: "Great service at a reasonable price. They're always on time and my lawn looks fantastic. Would definitely recommend to friends and family.",
    avatar: "/placeholder.svg?height=40&width=40&text=MB",
  },
  {
    name: "Jennifer Davis",
    location: "Kechi, KS",
    rating: 5,
    text: "The Premium Lawn Care Package has transformed my yard completely. Worth every penny for the professional results and time saved.",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
  },
  {
    name: "Robert Wilson",
    location: "Wichita, KS",
    rating: 5,
    text: "Prompt, professional, and perfect results every time. My neighbors are always asking who takes care of my lawn!",
    avatar: "/placeholder.svg?height=40&width=40&text=RW",
  },
  {
    name: "Lisa Martinez",
    location: "Andover, KS",
    rating: 4,
    text: "Cut Rates has been maintaining our large property for over a year. Their attention to detail and consistent quality is impressive.",
    avatar: "/placeholder.svg?height=40&width=40&text=LM",
  },
]

export const faqs = [
  {
    question: "How often should I mow my lawn?",
    answer:
      "During the growing season, most lawns benefit from weekly mowing. In slower growth periods, every 10-14 days may be sufficient.",
  },
  {
    question: "What's the best height to cut my grass?",
    answer:
      "For most cool-season grasses, 2.5-3.5 inches is ideal. Warm-season grasses can be cut slightly shorter at 1.5-2.5 inches.",
  },
  {
    question: "When should I fertilize my lawn?",
    answer:
      "The best times to fertilize cool-season grasses are early spring, late spring, early fall, and late fall. Warm-season grasses benefit most from fertilization in late spring and summer.",
  },
  {
    question: "How much does lawn care service cost?",
    answer:
      "Our lawn care services start at $35 per visit for basic mowing. Package prices vary based on lawn size and services included. Contact us for a personalized quote.",
  },
  {
    question: "Do you offer organic lawn care options?",
    answer:
      "Yes, we offer organic and eco-friendly lawn care options. These use natural products and methods to maintain your lawn while minimizing environmental impact.",
  },
  {
    question: "How do I know if my lawn needs aeration?",
    answer:
      "Signs that your lawn needs aeration include water pooling, thin grass, compacted soil that's hard to penetrate, and excessive thatch buildup.",
  },
]
