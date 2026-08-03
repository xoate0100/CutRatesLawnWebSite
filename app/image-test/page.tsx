import { IMAGES } from "@/lib/image-constants"

export default function ImageTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Image Test Page</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Direct IMG Tag</h2>
          <img
            src="https://storage.googleapis.com/site_photo_storage/images/equipment/professional-mower.jpg"
            alt="Professional Mower"
            width={400}
            height={300}
            className="border border-gray-300"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Using Constants with IMG Tag</h2>
          <img
            src={IMAGES.EQUIPMENT_MOWER || "/placeholder.jpg"}
            alt="Professional Mower"
            width={400}
            height={300}
            className="border border-gray-300"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Using Next.js Image Component</h2>
          <div className="relative w-[400px] h-[300px] border border-gray-300">
            <img
              src={IMAGES.EQUIPMENT_MOWER || "/placeholder.jpg"}
              alt="Professional Mower"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">All Images Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(IMAGES).map(([key, src]) => (
            <div key={key} className="border border-gray-300 p-4">
              <h3 className="text-lg font-medium mb-2">{key}</h3>
              <div className="relative h-48">
                <img src={src || "/placeholder.jpg"} alt={key} className="w-full h-full object-cover" />
              </div>
              <p className="mt-2 text-sm text-gray-500 break-all">{src}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
