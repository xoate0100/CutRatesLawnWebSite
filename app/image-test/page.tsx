import { MediaFrame } from "@/components/media/media-frame"
import { listMediaSlots, mediaAlt, mediaSrc } from "@/lib/media"

const SAMPLE_SLOTS = [
  "services.mowing",
  "partners.google",
  "partners.yelp",
  "gallery.before",
  "gallery.after",
  "home.hero",
] as const

export default function ImageTestPage() {
  const allSlots = listMediaSlots()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Image Test Page</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Direct IMG via mediaSrc</h2>
          <img
            src={mediaSrc("services.mowing")}
            alt={mediaAlt("services.mowing", "Professional Mower")}
            width={400}
            height={300}
            className="border border-gray-300"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">MediaFrame</h2>
          <div className="w-[400px] border border-gray-300">
            <MediaFrame slot="services.mowing" aspect="4/3" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Sample slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_SLOTS.map((slot) => (
              <div key={slot} className="border border-gray-300 p-4">
                <h3 className="text-lg font-medium mb-2">{slot}</h3>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={mediaSrc(slot)}
                    alt={mediaAlt(slot, slot)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 break-all">{mediaSrc(slot)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">All media slots ({allSlots.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSlots.map((slot) => (
            <div key={slot} className="border border-gray-300 p-4">
              <h3 className="text-lg font-medium mb-2 break-all">{slot}</h3>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={mediaSrc(slot)}
                  alt={mediaAlt(slot, slot)}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 break-all">{mediaSrc(slot)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
