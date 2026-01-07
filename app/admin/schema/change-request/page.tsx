"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function SchemaChangeRequestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    contentType: "",
    changeType: "",
    fieldName: "",
    fieldType: "",
    required: false,
    description: "",
    justification: "",
    frontendImpact: "",
    requestedBy: "",
    email: "",
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // In a real implementation, this would submit to an API endpoint
    // For now, we'll just simulate a submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitting(false)
    setSubmitted(true)

    // Redirect after a delay
    setTimeout(() => {
      router.push("/admin/schema")
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-green-600">Change Request Submitted</CardTitle>
            <CardDescription>Your schema change request has been submitted successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Your request will be reviewed by the development team. You will receive an email notification when the
              request is processed.
            </p>
            <p className="mt-4 text-gray-500">Redirecting to the schema monitor page...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Schema Change Request</h1>
      <p className="text-gray-600 mb-8">Request changes to Strapi content type schemas</p>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Schema changes can impact frontend components. Please provide detailed information about the requested change
          and its potential impact.
        </AlertDescription>
      </Alert>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Schema Change Request</CardTitle>
            <CardDescription>Fill out this form to request a change to a content type schema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select
                  required
                  value={formData.contentType}
                  onValueChange={(value) => handleSelectChange("contentType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="bundles">Bundles</SelectItem>
                    <SelectItem value="posts">Blog Posts</SelectItem>
                    <SelectItem value="faqs">FAQs</SelectItem>
                    <SelectItem value="testimonials">Testimonials</SelectItem>
                    <SelectItem value="service-areas">Service Areas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Change Type</Label>
                <RadioGroup
                  required
                  value={formData.changeType}
                  onValueChange={(value) => handleSelectChange("changeType", value)}
                  className="flex flex-col space-y-1 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="add" />
                    <Label htmlFor="add">Add new field</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="modify" id="modify" />
                    <Label htmlFor="modify">Modify existing field</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remove" id="remove" />
                    <Label htmlFor="remove">Remove field</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other change</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  name="fieldName"
                  value={formData.fieldName}
                  onChange={handleChange}
                  required={formData.changeType !== "other"}
                  placeholder="e.g., heroSection.backgroundImage"
                />
              </div>

              {formData.changeType === "add" || formData.changeType === "modify" ? (
                <>
                  <div>
                    <Label htmlFor="fieldType">Field Type</Label>
                    <Select
                      value={formData.fieldType}
                      onValueChange={(value) => handleSelectChange("fieldType", value)}
                      required={formData.changeType === "add" || formData.changeType === "modify"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="richtext">Rich Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="relation">Relation</SelectItem>
                        <SelectItem value="component">Component</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="required"
                      name="required"
                      checked={formData.required}
                      onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                    />
                    <Label htmlFor="required">Required field</Label>
                  </div>
                </>
              ) : null}

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the field and its purpose"
                  required
                />
              </div>

              <div>
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  name="justification"
                  value={formData.justification}
                  onChange={handleChange}
                  placeholder="Why is this change needed?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="frontendImpact">Frontend Impact</Label>
                <Textarea
                  id="frontendImpact"
                  name="frontendImpact"
                  value={formData.frontendImpact}
                  onChange={handleChange}
                  placeholder="How will this change impact frontend components?"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    name="requestedBy"
                    value={formData.requestedBy}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/schema")}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
