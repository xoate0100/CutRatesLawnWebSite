export const fallbackData = {
  homePage: {
    data: {
      id: 1,
      attributes: {
        createdAt: "2023-01-01T00:00:00.000Z",
        updatedAt: "2023-01-01T00:00:00.000Z",
        publishedAt: "2023-01-01T00:00:00.000Z",
        hero: {
          id: 1,
          title: "Professional Lawn Care Services",
          description: "Quality lawn maintenance at affordable rates. We keep your lawn looking its best year-round.",
          ctaText: "Get a Free Quote",
          ctaLink: "/contact",
          image: {
            data: null,
          },
        },
        features: {
          id: 1,
          title: "Our Services",
          description: "We offer a wide range of lawn care services to keep your property looking its best.",
          featureList: [
            {
              id: 1,
              title: "Lawn Mowing",
              description: "Regular mowing to keep your lawn healthy and looking great.",
              icon: "scissors",
            },
            {
              id: 2,
              title: "Edging & Trimming",
              description: "Clean edges and trimmed areas for a polished look.",
              icon: "ruler",
            },
            {
              id: 3,
              title: "Fertilization",
              description: "Proper nutrients to keep your lawn green and healthy.",
              icon: "sprout",
            },
            {
              id: 4,
              title: "Weed Control",
              description: "Effective weed management to protect your lawn.",
              icon: "ban",
            },
          ],
        },
        testimonials: {
          id: 1,
          title: "What Our Customers Say",
          description: "Don't just take our word for it. Here's what our satisfied customers have to say.",
          testimonialList: [
            {
              id: 1,
              name: "John Smith",
              role: "Homeowner",
              content:
                "CutRates Lawn has been maintaining my property for over a year now. Their service is reliable and my lawn has never looked better!",
              rating: 5,
              image: {
                data: null,
              },
            },
            {
              id: 2,
              name: "Sarah Johnson",
              role: "Business Owner",
              content:
                "As a business owner, I need my property to look professional. CutRates delivers consistent quality service every time.",
              rating: 5,
              image: {
                data: null,
              },
            },
            {
              id: 3,
              name: "Michael Brown",
              role: "Homeowner",
              content:
                "I've tried several lawn services, but CutRates is by far the best. Great service at a great price!",
              rating: 4,
              image: {
                data: null,
              },
            },
          ],
        },
        services: {
          id: 1,
          title: "Our Lawn Care Packages",
          description: "Choose the perfect lawn care package for your needs and budget.",
          serviceList: [
            {
              id: 1,
              title: "Basic Package",
              description: "Weekly mowing, trimming, and blowing.",
              price: "$99",
              period: "per month",
              features: ["Weekly Mowing", "String Trimming", "Edging", "Cleanup"],
              isPopular: false,
              ctaText: "Get Started",
              ctaLink: "/contact",
            },
            {
              id: 2,
              title: "Standard Package",
              description: "Everything in Basic plus fertilization and weed control.",
              price: "$149",
              period: "per month",
              features: ["Everything in Basic", "Fertilization", "Weed Control", "Seasonal Cleanup"],
              isPopular: true,
              ctaText: "Get Started",
              ctaLink: "/contact",
            },
            {
              id: 3,
              title: "Premium Package",
              description: "Complete lawn care solution for the perfect lawn.",
              price: "$199",
              period: "per month",
              features: ["Everything in Standard", "Aeration", "Overseeding", "Pest Control", "Unlimited Support"],
              isPopular: false,
              ctaText: "Get Started",
              ctaLink: "/contact",
            },
          ],
        },
        cta: {
          id: 1,
          title: "Ready for a Beautiful Lawn?",
          description: "Contact us today for a free quote and consultation.",
          primaryButtonText: "Get a Free Quote",
          primaryButtonLink: "/contact",
          secondaryButtonText: "Learn More",
          secondaryButtonLink: "/services",
          background: {
            data: null,
          },
        },
      },
    },
    meta: {},
  },
}
