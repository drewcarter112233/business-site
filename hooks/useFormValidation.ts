// hooks/useFormValidation.ts
import { useState } from "react"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
  customValidator?: (value: string) => string | null
}

export function useFormValidation(rules: Record<string, ValidationRule>) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string) => {
    const rule = rules[name]
    if (!rule) return ""

    if (rule.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${
        rule.minLength
      } characters`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${
        rule.maxLength
      } characters`
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      return rule.message || `Invalid ${name}`
    }

    if (rule.customValidator && value) {
      const customError = rule.customValidator(value)
      if (customError) {
        return customError
      }
    }

    return ""
  }

  const validateForm = (formData: Record<string, string>) => {
    const newErrors: Record<string, string> = {}

    Object.keys(rules).forEach((field) => {
      const error = validateField(field, formData[field] || "")
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldValidation = (name: string, value: string) => {
    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
    return error === ""
  }

  const setFieldTouched = (name: string) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const clearErrors = () => {
    setErrors({})
    setTouched({})
  }

  return {
    errors,
    touched,
    validateForm,
    handleFieldValidation,
    setFieldTouched,
    clearErrors,
  }
}
