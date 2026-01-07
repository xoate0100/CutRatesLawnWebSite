import { QuoteForm } from "@/components/quote-form"
import { companyInfo } from "@/lib/static-data"
import { Phone, Clock, MapPin, CheckCircle } from "lucide-react"

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Request a Free Quote</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fill out the form below to request a free, no-obligation quote for your lawn care needs. We'll get back to
            you within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <QuoteForm />
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">{companyInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Business Hours</h3>
                    <p className="text-muted-foreground">{companyInfo.hours}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">{companyInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Why Request a Quote</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Get an accurate price for your specific needs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>No obligation to purchase</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Receive professional recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Fast response within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Customized service plans available</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-bold mb-4 text-green-800">Need Immediate Assistance?</h2>
              <p className="text-green-700 mb-4">Call us directly for immediate assistance or to schedule a service.</p>
              <a
                href={`tel:${companyInfo.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium"
              >
                <Phone className="mr-2 h-5 w-5" />
                {companyInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
