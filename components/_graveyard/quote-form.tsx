"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { submitQuoteRequest } from "@/lib/api-helpers"
import { services } from "@/lib/static-data"
import { CheckCircle, Loader2, Shield, Clock, Calendar } from "lucide-react"

interface QuoteFormProps {
  defaultServiceType?: string
  serviceOptions?: { value: string; label: string }[]
  className?: string
}

export function QuoteForm({ defaultServiceType, serviceOptions, className = "" }: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      serviceType: defaultServiceType || "",
      propertySize: "",
      message: "",
    },
  })

  // Generate service options if not provided
  const allServiceOptions =
    serviceOptions ||
    services.data.map((service) => ({
      value: service.attributes.slug,
      label: service.attributes.title,
    }))

  const propertySizeOptions = [
    { value: "small", label: "Small (Less than 5,000 sq ft)" },
    { value: "medium", label: "Medium (5,000 - 10,000 sq ft)" },
    { value: "large", label: "Large (10,000 - 20,000 sq ft)" },
    { value: "x-large", label: "Extra Large (More than 20,000 sq ft)" },
  ]

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await submitQuoteRequest(data)
      if (response.success) {
        setIsSubmitted(true)
        reset()
      } else {
        setError(response.message || "Failed to submit quote request. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting quote request:", err)
      setError("An unexpected error occurred. Please try again or call us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`p-6 bg-green-50 rounded-lg text-center ${className}`}>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700 mb-6">
          Your quote request has been submitted successfully. We'll contact you within 2 hours to discuss your lawn care
          needs.
        </p>
        <div className="flex flex-col gap-4">
          <p className="font-medium">Need immediate assistance?</p>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <a href="tel:3165551234">Call Us: (316) 555-1234</a>
          </Button>
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Submit Another Request
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border bg-card p-6 shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Request a Free Quote</h2>
        <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
          <Clock className="mr-1 h-3.5 w-3.5" />
          Response in 2 hours
        </Badge>
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <Badge variant="outline" className="bg-gray-50">
          <Shield className="mr-1 h-3.5 w-3.5 text-green-600" />
          No obligation
        </Badge>
        <Badge variant="outline" className="bg-gray-50">
          <CheckCircle className="mr-1 h-3.5 w-3.5 text-green-600" />
          Free estimate
        </Badge>
        <Badge variant="outline" className="bg-gray-50">
          <Calendar className="mr-1 h-3.5 w-3.5 text-green-600" />
          Same-week service
        </Badge>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              placeholder="John Smith"
              {...register("name", { required: "Name is required" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message?.toString()}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message?.toString()}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              placeholder="(316) 555-1234"
              {...register("phone", { required: "Phone number is required" })}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message?.toString()}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Property Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="address"
              placeholder="123 Main St, Valley Center, KS"
              {...register("address", { required: "Address is required" })}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message?.toString()}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium mb-1">
              Service Type <span className="text-red-500">*</span>
            </label>
            <Select defaultValue={defaultServiceType || ""} onValueChange={(value) => setValue("serviceType", value)}>
              <SelectTrigger id="serviceType" className={errors.serviceType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {allServiceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceType && (
              <p className="mt-1 text-sm text-red-500">{errors.serviceType.message?.toString()}</p>
            )}
          </div>

          <div>
            <label htmlFor="propertySize" className="block text-sm font-medium mb-1">
              Property Size <span className="text-red-500">*</span>
            </label>
            <Select defaultValue="" onValueChange={(value) => setValue("propertySize", value)}>
              <SelectTrigger id="propertySize" className={errors.propertySize ? "border-red-500" : ""}>
                <SelectValue placeholder="Select property size" />
              </SelectTrigger>
              <SelectContent>
                {propertySizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertySize && (
              <p className="mt-1 text-sm text-red-500">{errors.propertySize.message?.toString()}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Additional Information
          </label>
          <Textarea
            id="message"
            placeholder="Tell us more about your lawn care needs..."
            rows={4}
            {...register("message")}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Request Quote"
            )}
          </Button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            By submitting this form, you agree to be contacted about our services.
          </p>
          <p className="text-sm text-green-600 font-medium">
            <Calendar className="inline h-3.5 w-3.5 mr-1" />
            Limited slots available this week - request now!
          </p>
        </div>
      </form>
    </div>
  )
}
