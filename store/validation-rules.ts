// utils/validation-rules.ts
// Import your existing regex patterns
// import { YOUR_REGEX_PATTERNS } from './your-regex-file'

// Example regex patterns - replace with your actual patterns
export const REGEX_PATTERNS = {
  name: /^[a-zA-Z\s'-]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$|^[\(]?[\d]{3}[\)]?[\s\-]?[\d]{3}[\s\-]?[\d]{4}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  state: /^[A-Z]{2}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
}

// Define validation rules using your regex patterns
export const CONTACT_FORM_RULES = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: REGEX_PATTERNS.name,
    message: "First name must contain only letters, spaces, hyphens, and apostrophes",
  },
  lastName: {
    required: true,
    minLength: 2,
    pattern: REGEX_PATTERNS.name,
    message: "Last name must contain only letters, spaces, hyphens, and apostrophes",
  },
  phone: {
    required: true,
    pattern: REGEX_PATTERNS.phone,
    message: "Please enter a valid phone number",
  },
  email: {
    required: true,
    pattern: REGEX_PATTERNS.email,
    message: "Please enter a valid email address",
  },
  address: {
    required: true,
    minLength: 5,
    message: "Please enter a valid street address",
  },
  city: {
    required: true,
    minLength: 2,
    pattern: REGEX_PATTERNS.name,
    message: "City must contain only letters, spaces, hyphens, and apostrophes",
  },
  state: {
    required: true,
    pattern: REGEX_PATTERNS.state,
    message: "State must be a 2-letter abbreviation (e.g., NY)",
  },
  zip: {
    required: true,
    pattern: REGEX_PATTERNS.zipCode,
    message: "ZIP code must be in format 12345 or 12345-6789",
  },
}
