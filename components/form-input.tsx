"use client"

import type React from "react"
import { safeJSX } from "@/lib/text-utils"

interface FormInputProps {
  id: string
  name: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  className?: string
  error?: string
}

export function FormInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
  error,
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {safeJSX(label)}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"} ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{safeJSX(error)}</p>}
    </div>
  )
}
