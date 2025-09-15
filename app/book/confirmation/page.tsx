"use client"

import { useBookingStore } from "@/store/booking-store"
import { useRouter } from "next/navigation"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { useState, useCallback, useMemo, useEffect } from "react"
import Image from "next/image"
import { format } from "date-fns"
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Camera,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react"
import {
  FadeInDiv,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  HoverButton,
  HoverCard,
  AnimatedIcon,
} from "@/components/booking/framer"

const parseContactInfo = (info: string[]) => {
  const map: Record<string, string> = {}
  info.forEach((entry) => {
    const [key, value] = entry.split(":")
    map[key] = value
  })
  return map
}

export default function ConfirmationPage() {
  const router = useRouter()
  const {
    selectedServices,
    contactInfo,
    arrivalWindow,
    additionalDetails,
    photos,
    submitBooking,
    reset,
    rehydrated, // ADDED: Get rehydration status from store
  } = useBookingStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const subtotal = useMemo(
    () => selectedServices?.reduce((sum, service) => sum + service.price, 0) || 0,
    [selectedServices]
  )

  const tax = 0
  const total = subtotal + tax

  const handleConfirmBooking = useCallback(async () => {
    setIsSubmitting(true)
    setError("")

    try {
      const bookingId = await submitBooking()
      reset()
      router.push(`/book/thank-you?id=${bookingId}`)
    } catch (err) {
      console.error("Error submitting booking:", err)
      setError("Failed to submit booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [submitBooking, reset, router])

  if (!mounted || !rehydrated) {
    // UPDATED: Check rehydration status
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!contactInfo || !arrivalWindow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Please wait while we fetch your booking details
            </h3>
          </div>
        </div>
      </div>
    )
  }

  const parsedContact = parseContactInfo(contactInfo)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <SlideInLeft>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium mb-8 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
          >
            <AnimatedIcon>
              <ArrowLeft className="mr-2 h-5 w-5" />
            </AnimatedIcon>
            <span>Back to Schedule</span>
          </button>
        </SlideInLeft>

        {/* Header Section */}
        <FadeInUp delay={0.1} className="text-center mb-8">
          <ScaleIn
            delay={0.2}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 px-4 py-2 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Ready to Confirm</span>
          </ScaleIn>

          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              HOFFMAN CLEANING
            </span>
          </h1>

          <FadeInDiv delay={0.3} className="text-lg text-slate-600 dark:text-slate-400">
            Review your booking details and confirm your appointment
          </FadeInDiv>
        </FadeInUp>

        {/* Booking Stepper */}
        <BookingStepper />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Summary */}
            <FadeInDiv
              delay={0.4}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Selected Services
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedServices?.length || 0} service
                    {(selectedServices?.length || 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {selectedServices?.map((service, index) => (
                  <ScaleIn key={service.id} delay={0.5 + index * 0.1}>
                    <HoverCard className="flex justify-between items-start p-6 bg-gradient-to-br from-slate-50/30 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-900/30 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg mb-2">
                          {service.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {service.duration}</span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          ${service.price.toFixed(2)}
                        </div>
                      </div>
                    </HoverCard>
                  </ScaleIn>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-slate-600 dark:text-slate-400">Tax:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </FadeInDiv>

            {/* Appointment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FadeInDiv delay={0.6}>
                <HoverCard className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Appointment Time
                    </h3>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                    <p className="font-semibold text-purple-700 dark:text-purple-300 text-lg mb-1">
                      {format(arrivalWindow.date, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="font-bold text-purple-800 dark:text-purple-200 text-xl">
                      {arrivalWindow.time}
                    </p>
                  </div>
                </HoverCard>
              </FadeInDiv>

              <FadeInDiv delay={0.7}>
                <HoverCard className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Service Location
                    </h3>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                    <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                      {parsedContact.address}
                      {parsedContact.unit && `, ${parsedContact.unit}`}
                    </p>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400">
                      {parsedContact.city}, {parsedContact.state} {parsedContact.zip}
                    </p>
                  </div>
                </HoverCard>
              </FadeInDiv>
            </div>

            {/* Contact Information */}
            <FadeInDiv
              delay={0.8}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Contact Details
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    We&apos;ll use these details to confirm your appointment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Name</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {parsedContact.firstName} {parsedContact.lastName}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Phone</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {parsedContact.phone}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {parsedContact.email}
                  </p>
                </div>
              </div>
            </FadeInDiv>

            {/* Additional Details */}
            {additionalDetails && (
              <FadeInDiv
                delay={0.9}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-white shadow-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Additional Details
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Special instructions for our team
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200/30 dark:border-orange-700/30">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {additionalDetails}
                  </p>
                </div>
              </FadeInDiv>
            )}

            {/* Photos */}
            {photos && photos.length > 0 && (
              <FadeInDiv
                delay={1.0}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Reference Photos
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      {photos?.length || 0} photo{(photos?.length || 0) !== 1 ? "s" : ""} uploaded
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
                  {photos?.map((photo, index) => (
                    <ScaleIn key={index} delay={1.1 + index * 0.05}>
                      <HoverCard className="aspect-square group">
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden relative shadow-sm">
                          <Image
                            src={photo}
                            alt={`Reference ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                        </div>
                      </HoverCard>
                    </ScaleIn>
                  ))}
                </div>
              </FadeInDiv>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SlideInRight delay={0.5}>
              <div className="sticky top-8 space-y-6">
                {/* Confirmation Card */}
                <div className="bg-gradient-to-br from-emerald-50/70 to-teal-100/70 dark:from-emerald-900/20 dark:to-teal-800/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Ready to Book
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Confirm your appointment
                      </p>
                    </div>
                  </div>

                  <HoverButton
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-semibold text-lg mb-4 transition-all duration-200 ${
                      isSubmitting
                        ? "bg-slate-400 dark:bg-slate-600 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "CONFIRM BOOKING"
                    )}
                  </HoverButton>

                  {error && (
                    <FadeInDiv className="p-4 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-200/30 dark:border-red-700/30">
                      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    </FadeInDiv>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <Shield className="w-4 h-4" />
                      <span>Secure booking process</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Satisfaction guaranteed</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <Clock className="w-4 h-4" />
                      <span>Flexible rescheduling</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <HoverCard className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Payment</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Payment will be collected after service completion. We accept cash, check, and
                    all major credit cards.
                  </p>
                </HoverCard>
              </div>
            </SlideInRight>
          </div>
        </div>

        {/* Footer */}
        <FadeInDiv delay={1.3} className="text-center mt-12">
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
