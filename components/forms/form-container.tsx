"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import { useService } from "@/lib/di/context"
import { type FormService, FORM_SERVICE_TOKEN } from "@/lib/services/form/form-service.interface"
import { type LoggerService, LOGGER_SERVICE_TOKEN } from "@/lib/services/logger/logger-service.interface"

interface FormContainerProps<T> {
  initialValues: T
  endpoint: string
  schema: Record<string, (value: any) => boolean | string>
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  children: (props: FormRenderProps<T>) => ReactNode
}

interface FormRenderProps<T> {
  values: T
  errors: Record<string, string>
  isSubmitting: boolean
  isSubmitted: boolean
  handleChange: (name: keyof T, value: any) => void
  handleSubmit: (e: FormEvent) => void
}

/**
 * Container component for forms
 */
export function FormContainer<T extends Record<string, any>>({
  initialValues,
  endpoint,
  schema,
  onSuccess,
  onError,
  children,
}: FormContainerProps<T>) {
  const formService = useService<FormService>(FORM_SERVICE_TOKEN)
  const logger = useService<LoggerService>(LOGGER_SERVICE_TOKEN)

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as string]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate the form
    const validationResult = formService.validate(values, schema)

    if (!validationResult.valid) {
      setErrors(validationResult.errors)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await formService.submit(endpoint, values)
      setIsSubmitted(true)

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      logger.error("Form submission error", error)

      if (error instanceof Error) {
        setErrors({ form: error.message })

        if (onError) {
          onError(error)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderProps: FormRenderProps<T> = {
    values,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
  }

  return <>{children(renderProps)}</>
}
