import { ServiceCard } from "@/components/service-card"
import { getAllServices } from "@/lib/api-helpers"

export async function ServicesList() {
  const { data: services } = await getAllServices()

  // Group services by category
  const categories = {
    lawnMowing: services.filter(
      (service) =>
        service.attributes.title.toLowerCase().includes("mowing") ||
        service.attributes.title.toLowerCase().includes("lawn service"),
    ),
    lawnCare: services.filter(
      (service) =>
        service.attributes.title.toLowerCase().includes("fertilization") ||
        service.attributes.title.toLowerCase().includes("aeration") ||
        service.attributes.title.toLowerCase().includes("weed control") ||
        service.attributes.title.toLowerCase().includes("lawn treatment"),
    ),
    irrigation: services.filter(
      (service) =>
        service.attributes.title.toLowerCase().includes("irrigation") ||
        service.attributes.title.toLowerCase().includes("sprinkler"),
    ),
    seasonal: services.filter(
      (service) =>
        service.attributes.title.toLowerCase().includes("cleanup") ||
        service.attributes.title.toLowerCase().includes("snow") ||
        service.attributes.title.toLowerCase().includes("fall") ||
        service.attributes.title.toLowerCase().includes("spring"),
    ),
    other: services.filter(
      (service) =>
        !service.attributes.title.toLowerCase().includes("mowing") &&
        !service.attributes.title.toLowerCase().includes("lawn service") &&
        !service.attributes.title.toLowerCase().includes("fertilization") &&
        !service.attributes.title.toLowerCase().includes("aeration") &&
        !service.attributes.title.toLowerCase().includes("weed control") &&
        !service.attributes.title.toLowerCase().includes("lawn treatment") &&
        !service.attributes.title.toLowerCase().includes("irrigation") &&
        !service.attributes.title.toLowerCase().includes("sprinkler") &&
        !service.attributes.title.toLowerCase().includes("cleanup") &&
        !service.attributes.title.toLowerCase().includes("snow") &&
        !service.attributes.title.toLowerCase().includes("fall") &&
        !service.attributes.title.toLowerCase().includes("spring"),
    ),
  }

  // Featured services (first 3 from each category)
  const featuredServices = [
    ...categories.lawnMowing.slice(0, 2),
    ...categories.lawnCare.slice(0, 2),
    ...categories.irrigation.slice(0, 1),
    ...categories.seasonal.slice(0, 1),
  ]

  return (
    <div className="space-y-12">
      {/* Featured Services */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Featured Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} featured={index === 0 || index === 3} />
          ))}
        </div>
      </div>

      {/* Lawn Mowing Services */}
      {categories.lawnMowing.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Lawn Mowing Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.lawnMowing.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Lawn Care Treatments */}
      {categories.lawnCare.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Lawn Care Treatments</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.lawnCare.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Irrigation Services */}
      {categories.irrigation.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Irrigation Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.irrigation.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Services */}
      {categories.seasonal.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Seasonal Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.seasonal.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Other Services */}
      {categories.other.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Additional Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.other.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
