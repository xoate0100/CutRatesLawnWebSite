"use client"

import { FormContainer } from "./form-container"
import { useState } from "react"

interface ContactFormValues {
  name: string
  email: string
  message: string
}

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  message: "",
}

const formSchema = {
  name: (value: string) => {
    if (!value.trim()) return "Name is required"
    return true
  },
  email: (value: string) => {
    if (!value.trim()) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format"
    return true
  },
  message: (value: string) => {
    if (!value.trim()) return "Message is required"
    if (value.length < 10) return "Message must be at least 10 characters"
    return true
  },
}

export function ContactForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSuccess = () => {
    setSubmitSuccess(true)
  }

  if (submitSuccess) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-green-800">Thank you for your message!</h3>
        <p className="mt-2 text-green-700">We'll get back to you as soon as possible.</p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={() => setSubmitSuccess(false)}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <FormContainer<ContactFormValues>
      initialValues={initialValues}
      endpoint="/api/contact"
      schema={formSchema}
      onSuccess={handleSuccess}
    >
      {({ values, errors, isSubmitting, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              value={values.message}
              onChange={(e) => handleChange("message", e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.form}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </FormContainer>
  )
}
