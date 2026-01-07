import { IMAGES } from "@/lib/image-constants"

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section with the team image */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        <img
          src={IMAGES.HERO_ABOUT || "/placeholder.svg"}
          alt="Cut Rates Lawn Care team planting a tree together"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Dedicated professionals committed to making your lawn the best it can be
            </p>
          </div>
        </div>
      </section>

      {/* About content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">About Cut Rates Lawn Care</h2>
            <p className="text-lg mb-6">
              Founded in 2015, Cut Rates Lawn Care has been providing exceptional lawn care services to homeowners and
              businesses in Wichita and surrounding areas. Our team of experienced professionals is dedicated to
              delivering high-quality results that exceed our customers' expectations.
            </p>
            <p className="text-lg mb-6">
              We take pride in our work and are committed to using the best equipment and techniques to ensure your lawn
              looks its best year-round. From regular maintenance to specialized treatments, we have the expertise to
              handle all your lawn care needs.
            </p>
            <p className="text-lg">
              Our mission is simple: to provide reliable, professional lawn care services at competitive rates, while
              building lasting relationships with our customers based on trust and satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member - Owner */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-80">
                <img
                  src={IMAGES.TEAM_OWNER || "/placeholder.svg"}
                  alt="Company Owner"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">John Smith</h3>
                <p className="text-green-600 font-medium mb-4">Owner & Founder</p>
                <p className="text-gray-600">
                  With over 15 years of experience in lawn care, John founded Cut Rates Lawn Care with a vision to
                  provide exceptional service at competitive rates.
                </p>
              </div>
            </div>

            {/* Team Member - Manager */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-80">
                <img
                  src={IMAGES.TEAM_MANAGER || "/placeholder.svg"}
                  alt="Operations Manager"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Sarah Johnson</h3>
                <p className="text-green-600 font-medium mb-4">Operations Manager</p>
                <p className="text-gray-600">
                  Sarah oversees all day-to-day operations, ensuring that every job is completed to our high standards
                  of quality and customer satisfaction.
                </p>
              </div>
            </div>

            {/* Team Member - Lead Technician */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-80">
                <img
                  src={IMAGES.TEAM_CREW || "/placeholder.svg"}
                  alt="Lead Technician"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Mike Thompson</h3>
                <p className="text-green-600 font-medium mb-4">Lead Technician</p>
                <p className="text-gray-600">
                  Mike brings technical expertise and attention to detail to every project, specializing in lawn
                  treatments and specialized care techniques.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
