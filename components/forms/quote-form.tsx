"use client"

import type React from "react"

import { useState } from "react"
import { submitQuoteRequest } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/error-message"

interface FormState {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string
  serviceType: string
  propertySize: string
  message: string
  preferredContact: string
  preferredTime: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  propertyType?: string
  serviceType?: string
  form?: string
}

export function QuoteForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "",
    serviceType: "",
    propertySize: "",
    message: "",
    preferredContact: "email",
    preferredTime: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Property type is required"
    }

    if (!formData.serviceType) {
      newErrors.serviceType = "Service type is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await submitQuoteRequest(formData)

      if (response.success) {
        setSubmitSuccess(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          propertyType: "",
          serviceType: "",
          propertySize: "",
          message: "",
          preferredContact: "email",
          preferredTime: "",
        })
      } else {
        setSubmitError(response.message || "Failed to submit quote request. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting quote request:", error)
      setSubmitError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {submitSuccess ? (
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-2xl font-bold mb-2">Quote Request Received!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in our services. We'll review your request and get back to you with a custom
            quote as soon as possible.
          </p>
          <Button onClick={() => setSubmitSuccess(false)} className="bg-green-600 hover:bg-green-700">
            Submit Another Request
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && <ErrorMessage title="Form Submission Error" message={submitError} type="error" />}

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Contact Method
                </label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text Message</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time to Contact
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">No preference</option>
                  <option value="morning">Morning (8AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 8PM)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                      errors.zipCode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    errors.propertyType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select property type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="hoa">HOA/Apartment Complex</option>
                </select>
                {errors.propertyType && <p className="mt-1 text-sm text-red-500">{errors.propertyType}</p>}
              </div>

              <div>
                <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Size (if known)
                </label>
                <select
                  id="propertySize"
                  name="propertySize"
                  value={formData.propertySize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select property size</option>
                  <option value="small">Small (Less than 1/4 acre)</option>
                  <option value="medium">Medium (1/4 to 1/2 acre)</option>
                  <option value="large">Large (1/2 to 1 acre)</option>
                  <option value="xlarge">Extra Large (More than 1 acre)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Service Information</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                    errors.serviceType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select service type</option>
                  <option value="lawn-mowing">Lawn Mowing</option>
                  <option value="lawn-care">Lawn Care (Fertilization, Weed Control)</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="power-washing">Power Washing</option>
                  <option value="pest-control">Pest Control</option>
                  <option value="bundle">Service Bundle</option>
                  <option value="other">Other</option>
                </select>
                {errors.serviceType && <p className="mt-1 text-sm text-red-500">{errors.serviceType}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Please provide any additional details that will help us prepare your quote."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Submitting..." : "Request Quote"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
