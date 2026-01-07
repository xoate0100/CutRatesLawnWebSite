"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { validate, type ValidationResult } from "@/lib/schema-validator"

/**
 * Form validation hook
 * @param initialValues - Initial form values
 * @param validationSchema - Validation schema
 * @returns Form validation state and handlers
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<string, any>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  /**
   * Validates the form
   * @returns Validation result
   */
  const validateForm = useCallback((): ValidationResult => {
    const result = validate(values, validationSchema)
    
    // Convert validation errors to record
    const errorRecord: Record<string, string> = {}
    result.errors.forEach(error => {
      errorRecord[error.field] = error.message
    })
    
    setErrors(errorRecord)
    return result
  }, [values, validationSchema])
  
  /**
   * Handles input change
   * @param e - The change event
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }, [])
  
  /**
   * Handles input blur
   * @param e - The blur event
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))
    
    // Validate the field
    const result = validate({ [name]: values[name] }, { [name]: validationSchema[name] })
    
    // Update errors
    setErrors(prev => ({
      ...prev,
      [name]: result.errors.find(error => error.field === name)?.message || '',
    }))
  }, [values, validationSchema])
  
  /**
   * Handles form submission
   * @param onSubmit - Callback to handle form submission
   * @returns Form submission handler
   */
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) => async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Validate the form
      const result = validateForm()
      
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {}
      Object.keys(values).forEach(key => {
        allTouched[key] = true
      })
      setTouched(allTouched)
      
      // If the form is valid, submit it
      if (result.valid) {
        setIsSubmitting(true)
        
        try {
          await onSubmit(values)
        } catch (error) {
          console.error('Form submission error:', error)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [values, validateForm]
  )
  
  /**
   * Resets the form
   */
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})\
    setIsSubmitting(false)  => 
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false), [initialValues])
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateForm,
  }
}
