"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, Star } from "lucide-react"
import { submitTestimonial } from "@/lib/api"

interface TestimonialFormData {
  name: string
  email: string
  role?: string
  rating: number
  comment: string
}

interface FormErrors {
  name?: string
  email?: string
  rating?: string
  comment?: string
  general?: string
}

export default function TestimonialForm() {
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: "",
    email: "",
    role: "",
    rating: 5,
    comment: "",
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined })
    }
  }

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating })

    // Clear error when user selects a rating
    if (formErrors.rating) {
      setFormErrors({ ...formErrors, rating: undefined })
    }
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = "Name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format"
      isValid = false
    }

    if (!formData.comment.trim()) {
      errors.comment = "Please share your experience"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const result = await submitTestimonial(formData)

      if (result.success) {
        setSubmitSuccess(true)
        // Reset form
        setFormData({
          name: "",
          email: "",
          role: "",
          rating: 5,
          comment: "",
        })
      } else {
        setSubmitError(result.message || "Failed to submit testimonial. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error)
      setSubmitError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Thank You for Your Feedback!</CardTitle>
          <CardDescription>
            Your testimonial has been submitted successfully. We appreciate you taking the time to share your experience
            with us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 p-4 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span>Your testimonial will be reviewed and published on our website soon.</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setSubmitSuccess(false)}>Submit Another Testimonial</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>We value your feedback! Please share your experience with our services.</CardDescription>
      </CardHeader>
      <CardContent>
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{submitError}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={formErrors.email ? "border-red-500" : ""}
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            <p className="text-xs text-gray-500 mt-1">Your email will not be published.</p>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role/Title (Optional)
            </label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Homeowner, Business Owner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Your Experience <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className={formErrors.comment ? "border-red-500" : ""}
            />
            {formErrors.comment && <p className="text-red-500 text-sm mt-1">{formErrors.comment}</p>}
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Testimonial"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
