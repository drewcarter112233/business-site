"use client"

import { useRouter } from "next/navigation"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { useBookingStore } from "@/store/booking-store"
import { useFormValidation } from "@/hooks/useFormValidation"
import { CONTACT_FORM_RULES } from "@/store/validation-rules"
import { useState, useCallback, useMemo } from "react"
import {
  ArrowLeft,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Building,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react"
import {
  FadeInDiv,
  SlideInLeft,
  SlideInRight,
  HoverButton,
  HoverCard,
  AnimatedIcon,
} from "@/components/booking/framer"

export default function ContactPage() {
  const router = useRouter()
  const { setContactInfo } = useBookingStore()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const { errors, touched, validateForm, handleFieldValidation, setFieldTouched } =
    useFormValidation(CONTACT_FORM_RULES)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Validate field if it has been touched
      if (touched[name]) {
        handleFieldValidation(name, value)
      }
    },
    [touched, handleFieldValidation]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFieldTouched(name)
      handleFieldValidation(name, value)
    },
    [setFieldTouched, handleFieldValidation]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      // Mark all fields as touched
      Object.keys(CONTACT_FORM_RULES).forEach((field) => {
        setFieldTouched(field)
      })

      if (validateForm(formData)) {
        setContactInfo({
          ...formData,
          city: formData.city || "Albany",
          state: formData.state || "NY",
          zip: formData.zip || "12203",
        })
        router.push("/book/schedule")
      } else {
        // Scroll to first error
        const firstErrorField = Object.keys(errors).find((field) => errors[field] && touched[field])
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`)
          element?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    },
    [formData, validateForm, setContactInfo, router, errors, touched, setFieldTouched]
  )

  const getInputClassName = useMemo(
    () => (fieldName: string) => {
      const baseClass =
        "w-full p-4 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
      const hasError = touched[fieldName] && errors[fieldName]

      if (hasError) {
        return `${baseClass} border-red-300 dark:border-red-600 focus:ring-red-500/50 shadow-red-100 dark:shadow-red-900/20`
      }
      return `${baseClass} border-slate-200/50 dark:border-slate-700/50 focus:ring-blue-500/50 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm`
    },
    [touched, errors]
  )

  const ErrorMessage = ({ fieldName }: { fieldName: string }) => {
    if (!touched[fieldName] || !errors[fieldName]) return null

    return (
      <FadeInDiv
        delay={0.1}
        className="flex items-center mt-2 text-red-600 dark:text-red-400 text-sm bg-red-50/50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200/30 dark:border-red-700/30"
      >
        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
        {errors[fieldName]}
      </FadeInDiv>
    )
  }

  const requiredFields = useMemo(
    () =>
      Object.keys(formData).filter(
        (key) => key !== "unit" && formData[key as keyof typeof formData].trim() !== ""
      ).length,
    [formData]
  )

  const totalRequiredFields = Object.keys(CONTACT_FORM_RULES).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <SlideInLeft>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium mb-8 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
          >
            <AnimatedIcon>
              <ArrowLeft className="mr-2 h-5 w-5" />
            </AnimatedIcon>
            <span>Back to Summary</span>
          </button>
        </SlideInLeft>

        {/* Booking Stepper */}
        <BookingStepper />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <FadeInDiv
              delay={0.4}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Contact Details
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    We&apos;ll use this information to confirm your booking
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {/* Personal Information */}
                <FadeInDiv delay={0.5}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                        First name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("firstName")}
                        placeholder="James"
                      />
                      <ErrorMessage fieldName="firstName" />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                        Last name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("lastName")}
                        placeholder="Smith"
                      />
                      <ErrorMessage fieldName="lastName" />
                    </div>
                  </div>
                </FadeInDiv>

                {/* Contact Information */}
                <FadeInDiv delay={0.6}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                        Phone number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("phone")}
                        placeholder="(123) 456-7890"
                      />
                      <ErrorMessage fieldName="phone" />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                        E-mail address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("email")}
                        placeholder="you@example.com"
                      />
                      <ErrorMessage fieldName="email" />
                    </div>
                  </div>
                </FadeInDiv>

                {/* Service Address */}
                <FadeInDiv delay={0.7}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Service Address
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Where should we provide the cleaning service?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                        Street address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("address")}
                        placeholder="123 Main Street"
                      />
                      <ErrorMessage fieldName="address" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputClassName("city")}
                          placeholder="Albany"
                        />
                        <ErrorMessage fieldName="city" />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputClassName("state")}
                          placeholder="NY"
                        />
                        <ErrorMessage fieldName="state" />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputClassName("zip")}
                          placeholder="12203"
                        />
                        <ErrorMessage fieldName="zip" />
                      </div>
                    </div>
                  </div>
                </FadeInDiv>

                {/* Submit Button */}
                <FadeInDiv delay={0.8}>
                  <HoverButton
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>CONTINUE TO SCHEDULING</span>
                    <ArrowRight className="w-5 h-5" />
                  </HoverButton>
                </FadeInDiv>
              </form>
            </FadeInDiv>
          </div>

          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <SlideInRight delay={0.5}>
              <div className="sticky top-8">
                <div className="bg-gradient-to-br from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Progress
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Form completion</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Fields completed
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {requiredFields}/{totalRequiredFields}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(requiredFields / totalRequiredFields) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Help Section */}
                  <HoverCard className="p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl mt-6">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <Building className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Need help?</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Our team will review your information and contact you within 24 hours to
                      confirm your booking details.
                    </p>
                  </HoverCard>

                  {/* Security Notice */}
                  <div className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                    <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Your data is secure</span>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                      All information is encrypted and protected
                    </p>
                  </div>
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>

        {/* Footer */}
        <FadeInDiv delay={1.0} className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm bg-white/50 dark:bg-slate-800/50 px-6 py-3 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>
              Copyright &copy; {new Date().getFullYear()}{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">Web Nurture</span>
            </span>
          </div>
        </FadeInDiv>
      </div>
    </div>
  )
}
