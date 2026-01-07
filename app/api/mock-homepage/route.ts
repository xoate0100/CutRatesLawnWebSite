import { NextResponse } from "next/server"

export async function GET() {
  // Mock homepage data
  const mockData = {
    data: {
      id: 1,
      attributes: {
        hero: {
          title: "Cut Rates Lawn Care",
          subtitle: "Professional lawn care services for your home or business",
          ctaButton: {
            text: "Get a Quote",
            url: "/quote",
          },
        },
        serviceList: {
          data: [
            {
              id: 1,
              attributes: {
                title: "Lawn Mowing",
                description: "Regular lawn mowing services to keep your yard looking its best.",
                slug: "/services/lawn-mowing",
              },
            },
            {
              id: 2,
              attributes: {
                title: "Landscaping",
                description: "Professional landscaping services to enhance your property's appearance.",
                slug: "/services/landscaping",
              },
            },
            {
              id: 3,
              attributes: {
                title: "Pest Control",
                description: "Effective pest control solutions for your lawn and garden.",
                slug: "/services/pest-control",
              },
            },
          ],
        },
        cta: {
          title: "Ready to Get Started?",
          description: "Contact us today to schedule your lawn care service or get a free quote.",
          primaryButtonText: "Contact Us",
          primaryButtonLink: "/contact",
          secondaryButtonText: "Get a Quote",
          secondaryButtonLink: "/quote",
        },
      },
    },
  }

  return NextResponse.json(mockData)
}
