"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { subscribeToNewsletter } from "@/lib/api"

interface NewsletterFormProps {
  title?: string
  description?: string
  className?: string
}

export default function NewsletterForm({
  title = "Subscribe to Our Newsletter",
  description = "Get the latest lawn care tips and exclusive offers delivered to your inbox.",
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error")
      setMessage("Please enter a valid email address.")
      return
    }

    setStatus("loading")

    try {
      const result = await subscribeToNewsletter({ email })

      if (result.success) {
        setStatus("success")
        setMessage("Thank you for subscribing to our newsletter!")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(result.message || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      setStatus("error")
      setMessage("An unexpected error occurred. Please try again later.")
    }
  }

  return (
    <div className={className}>
      {title && <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>}
      {description && <p className="mb-6 text-center">{description}</p>}

      {status === "success" ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={status === "error" ? "border-red-500" : ""}
              disabled={status === "loading"}
              required
            />
            {status === "error" && (
              <div className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{message}</span>
              </div>
            )}
          </div>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
