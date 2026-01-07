import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact Us | Cut Rates Lawn Care",
  description: "Get in touch with our team for all your lawn care needs in Wichita, KS.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Office</CardTitle>
              <CardDescription>Visit or mail us</CardDescription>
            </CardHeader>
            <CardContent>
              <address className="not-italic">
                <p>PO BOX 407</p>
                <p>Valley Center, KS 67147</p>
                <p className="mt-4">
                  <strong>Phone:</strong> (316) 925-5050
                </p>
                <p>
                  <strong>Email:</strong> info@cutrateslawn.com
                </p>
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>When we're available</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <strong>Monday-Friday:</strong> 7:00 AM - 6:00 PM
                </li>
                <li>
                  <strong>Saturday:</strong> 8:00 AM - 4:00 PM
                </li>
                <li>
                  <strong>Sunday:</strong> Closed
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Emergency services available 24/7</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="rounded-lg overflow-hidden h-96 mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198059.49240377638!2d-97.47242121851333!3d37.69690616602997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87badb6ad27f182d%3A0x9396d5bf74d33d3e!2sWichita%2C%20KS!5e0!3m2!1sen!2sus!4v1648774533083!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
