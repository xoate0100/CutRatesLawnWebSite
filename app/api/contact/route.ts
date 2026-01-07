import { type NextRequest, NextResponse } from "next/server"
import { container } from "@/lib/di/container"
import { type LoggerService, LOGGER_SERVICE_TOKEN } from "@/lib/services/logger/logger-service.interface"
import { initializeServices } from "@/lib/services/service-registry"

// Initialize services
initializeServices()

export async function POST(request: NextRequest) {
  const logger = container.get<LoggerService>(LOGGER_SERVICE_TOKEN)

  try {
    const data = await request.json()

    // Log the contact form submission
    logger.info("Contact form submission received", { data })

    // Here you would typically send an email or store in a database
    // For this example, we'll just simulate a successful submission

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ success: true, message: "Contact form submitted successfully" })
  } catch (error) {
    logger.error("Error processing contact form", error)

    return NextResponse.json({ success: false, message: "Failed to process contact form" }, { status: 500 })
  }
}
