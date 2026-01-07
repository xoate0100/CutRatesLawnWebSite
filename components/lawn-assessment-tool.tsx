"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function LawnAssessmentTool() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    lawnSize: "",
    grassCondition: "",
    mainConcern: "",
    serviceFrequency: "",
  })
  const [result, setResult] = useState<string | null>(null)
  const [recommendation, setRecommendation] = useState<string | null>(null)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleAnswer = (question: string, answer: string) => {
    setAnswers({ ...answers, [question]: answer })
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Calculate result based on answers
      calculateResult()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const calculateResult = () => {
    // Simple logic to determine recommendation based on answers
    const { lawnSize, grassCondition, mainConcern, serviceFrequency } = answers

    if (mainConcern === "weeds") {
      setResult("Weed Control")
      setRecommendation("weed-control")
    } else if (mainConcern === "thin-grass") {
      setResult("Lawn Fertilization")
      setRecommendation("lawn-fertilization")
    } else if (mainConcern === "appearance") {
      setResult("Lawn Mowing")
      setRecommendation("lawn-mowing")
    } else if (grassCondition === "poor") {
      setResult("Premium Lawn Care Package")
      setRecommendation("premium-lawn-care")
    } else if (serviceFrequency === "weekly" && lawnSize === "large") {
      setResult("Basic Lawn Care Package")
      setRecommendation("basic-lawn-care")
    } else {
      setResult("Seasonal Cleanup Package")
      setRecommendation("seasonal-cleanup")
    }
  }

  const resetAssessment = () => {
    setStep(1)
    setAnswers({
      lawnSize: "",
      grassCondition: "",
      mainConcern: "",
      serviceFrequency: "",
    })
    setResult(null)
    setRecommendation(null)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        {result ? (
          <div className="text-center">
            <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Your Recommended Service</h3>
            <p className="text-xl text-green-600 font-semibold mb-4">{result}</p>
            <p className="mb-6 text-gray-600">
              Based on your answers, we recommend our {result} service for your lawn. This will address your main
              concerns and help you achieve a healthier, more beautiful lawn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <Link href={`/services/${recommendation}`}>View Service Details</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href={`/quote?service=${recommendation}`}>Request a Quote</Link>
              </Button>
              <Button variant="outline" onClick={resetAssessment}>
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Question {step} of {totalSteps}
                </span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {step === 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4">What is the approximate size of your lawn?</h3>
                <RadioGroup
                  value={answers.lawnSize}
                  onValueChange={(value) => handleAnswer("lawnSize", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="lawn-small" />
                    <Label htmlFor="lawn-small">Small (Less than 5,000 sq ft)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="lawn-medium" />
                    <Label htmlFor="lawn-medium">Medium (5,000 - 10,000 sq ft)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="lawn-large" />
                    <Label htmlFor="lawn-large">Large (10,000 - 20,000 sq ft)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="x-large" id="lawn-x-large" />
                    <Label htmlFor="lawn-x-large">Extra Large (More than 20,000 sq ft)</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold mb-4">How would you describe the current condition of your lawn?</h3>
                <RadioGroup
                  value={answers.grassCondition}
                  onValueChange={(value) => handleAnswer("grassCondition", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="condition-excellent" />
                    <Label htmlFor="condition-excellent">Excellent - Lush, green, and healthy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="condition-good" />
                    <Label htmlFor="condition-good">Good - Mostly healthy with a few problem areas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="condition-fair" />
                    <Label htmlFor="condition-fair">Fair - Several issues but generally okay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="condition-poor" />
                    <Label htmlFor="condition-poor">Poor - Multiple problems, needs significant improvement</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-bold mb-4">What is your main concern with your lawn?</h3>
                <RadioGroup
                  value={answers.mainConcern}
                  onValueChange={(value) => handleAnswer("mainConcern", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weeds" id="concern-weeds" />
                    <Label htmlFor="concern-weeds">Weeds</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="thin-grass" id="concern-thin" />
                    <Label htmlFor="concern-thin">Thin or patchy grass</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="appearance" id="concern-appearance" />
                    <Label htmlFor="concern-appearance">Overall appearance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintenance" id="concern-maintenance" />
                    <Label htmlFor="concern-maintenance">Maintenance time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pests" id="concern-pests" />
                    <Label htmlFor="concern-pests">Pests or diseases</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-xl font-bold mb-4">How often would you like lawn care service?</h3>
                <RadioGroup
                  value={answers.serviceFrequency}
                  onValueChange={(value) => handleAnswer("serviceFrequency", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="frequency-weekly" />
                    <Label htmlFor="frequency-weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="biweekly" id="frequency-biweekly" />
                    <Label htmlFor="frequency-biweekly">Bi-weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="frequency-monthly" />
                    <Label htmlFor="frequency-monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="seasonal" id="frequency-seasonal" />
                    <Label htmlFor="frequency-seasonal">Seasonal (spring, summer, fall)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-time" id="frequency-one-time" />
                    <Label htmlFor="frequency-one-time">One-time service</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !answers.lawnSize) ||
                  (step === 2 && !answers.grassCondition) ||
                  (step === 3 && !answers.mainConcern) ||
                  (step === 4 && !answers.serviceFrequency)
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {step === totalSteps ? "Get Results" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
