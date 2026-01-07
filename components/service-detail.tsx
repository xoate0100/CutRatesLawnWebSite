import type React from "react"
import { SafeHtml } from "@/components/safe-html"

interface ServiceDetailProps {
  service: any // Replace 'any' with a more specific type if possible
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service }) => {
  return (
    <div>
      {/* Service Title */}
      <h1>{service.attributes.title}</h1>

      {/* Service Content */}
      <SafeHtml html={service.attributes.content || ""} className="prose max-w-none" />

      {/* Add other service details here as needed */}
    </div>
  )
}

export default ServiceDetail
