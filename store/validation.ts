// store/validation-store.ts
import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
  customValidator?: (value: string) => string | null
}

interface ValidationState {
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValidating: boolean
  rules: Record<string, ValidationRule>

  // Actions
  setRules: (rules: Record<string, ValidationRule>) => void
  validateField: (fieldName: string, value: string) => boolean
  validateForm: (formData: Record<string, string>) => boolean
  setFieldTouched: (fieldName: string) => void
  setFieldError: (fieldName: string, error: string) => void
  clearFieldError: (fieldName: string) => void
  clearAllErrors: () => void
  reset: () => void
}

export const useValidationStore = create<ValidationState>()(
  devtools(
    (set, get) => ({
      errors: {},
      touched: {},
      isValidating: false,
      rules: {},

      setRules: (rules) => set({ rules }),

      validateField: (fieldName, value) => {
        const { rules } = get()
        const rule = rules[fieldName]

        if (!rule) return true

        let error = ""

        // Required validation
        if (rule.required && !value.trim()) {
          error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
        }
        // Min length validation
        else if (rule.minLength && value.length < rule.minLength) {
          error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${
            rule.minLength
          } characters`
        }
        // Max length validation
        else if (rule.maxLength && value.length > rule.maxLength) {
          error = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be no more than ${
            rule.maxLength
          } characters`
        }
        // Pattern validation
        else if (rule.pattern && value && !rule.pattern.test(value)) {
          error = rule.message || `Invalid ${fieldName}`
        }
        // Custom validation
        else if (rule.customValidator) {
          const customError = rule.customValidator(value)
          if (customError) {
            error = customError
          }
        }

        set((state) => ({
          errors: {
            ...state.errors,
            [fieldName]: error,
          },
        }))

        return error === ""
      },

      validateForm: (formData) => {
        const { rules, validateField } = get()
        let isValid = true

        Object.keys(rules).forEach((fieldName) => {
          const fieldIsValid = validateField(fieldName, formData[fieldName] || "")
          if (!fieldIsValid) {
            isValid = false
          }
        })

        return isValid
      },

      setFieldTouched: (fieldName) =>
        set((state) => ({
          touched: {
            ...state.touched,
            [fieldName]: true,
          },
        })),

      setFieldError: (fieldName, error) =>
        set((state) => ({
          errors: {
            ...state.errors,
            [fieldName]: error,
          },
        })),

      clearFieldError: (fieldName) =>
        set((state) => ({
          errors: {
            ...state.errors,
            [fieldName]: "",
          },
        })),

      clearAllErrors: () => set({ errors: {} }),

      reset: () =>
        set({
          errors: {},
          touched: {},
          isValidating: false,
        }),
    }),
    {
      name: "validation-store",
    }
  )
)

// Hook for easier usage
export const useFormValidation = () => {
  const store = useValidationStore()

  const handleFieldChange = (fieldName: string, value: string) => {
    if (store.touched[fieldName]) {
      store.validateField(fieldName, value)
    }
  }

  const handleFieldBlur = (fieldName: string, value: string) => {
    store.setFieldTouched(fieldName)
    store.validateField(fieldName, value)
  }

  return {
    ...store,
    handleFieldChange,
    handleFieldBlur,
  }
}
