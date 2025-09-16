"use client"

import { useRouter } from "next/navigation"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { useBookingStore } from "@/store/booking-store"
import { useState, useRef, ChangeEvent, useCallback, useMemo } from "react"
import {
  ArrowLeft,
  ShoppingCart,
  Upload,
  Plus,
  FileText,
  Calculator,
  Sparkles,
  Camera,
  Trash2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import {
  FadeInDiv,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  ScaleIn,
  AnimatedIcon,
  HoverButton,
  HoverCard,
} from "@/components/booking/framer"

interface Service {
  id: string | number
  name: string
  description: string
  duration?: string
  price: number
}

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
const MAX_PHOTOS = 10
const MAX_DETAILS_LENGTH = 2000

// Error messages
const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "File size must be less than 2MB",
  INVALID_FILE_TYPE: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
  MAX_PHOTOS_REACHED: `Maximum ${MAX_PHOTOS} photos allowed`,
  UPLOAD_ERROR: "Error uploading image. Please try again.",
} as const

// Memoized service item component for better performance
const ServiceItem = ({ service, index }: { service: Service; index: number }) => (
  <FadeInDiv key={service.id} delay={0.5 + index * 0.1} className="group">
    <HoverCard className="flex justify-between items-start p-6 bg-gradient-to-br from-slate-50/30 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-900/30 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
      <div className="flex-1">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg mb-2">
          {service.name}
        </h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{service.description}</p>
        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Duration: {service.duration}</span>
        </div>
      </div>
      <div className="text-right ml-6">
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          ${service.price.toFixed(2)}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">per service</div>
      </div>
    </HoverCard>
  </FadeInDiv>
)

// Memoized photo thumbnail component
const PhotoThumbnail = ({
  photo,
  index,
  onRemove,
}: {
  photo: string
  index: number
  onRemove: (index: number) => void
}) => (
  <ScaleIn
    key={`photo-${index}`}
    delay={0.9 + index * 0.1}
    className="relative aspect-square group"
  >
    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden relative">
      <Image
        src={photo}
        alt={`Uploaded ${index + 1}`}
        fill
        sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.67vw, 12.5vw"
        className="object-cover transition-transform duration-200 group-hover:scale-105"
        priority={index < 4} // Only prioritize first 4 images
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <button
          onClick={() => onRemove(index)}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
          aria-label={`Remove photo ${index + 1}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </ScaleIn>
)

export default function SummaryPage() {
  const router = useRouter()
  const {
    selectedServices,
    additionalDetails,
    setAdditionalDetails,
    photos,
    addPhoto,
    removePhoto,
  } = useBookingStore()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Memoized calculations to prevent unnecessary re-renders
  const pricing = useMemo(() => {
    const subtotal = selectedServices.reduce((sum, service) => sum + service.price, 0)
    const tax = 0 // You might want to calculate this based on location
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [selectedServices])

  // Memoized service count
  const serviceCount = useMemo(() => selectedServices.length, [selectedServices])

  // File validation utility
  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > MAX_FILE_SIZE) {
        return ERROR_MESSAGES.FILE_TOO_LARGE
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return ERROR_MESSAGES.INVALID_FILE_TYPE
      }

      if (photos.length >= MAX_PHOTOS) {
        return ERROR_MESSAGES.MAX_PHOTOS_REACHED
      }

      return null
    },
    [photos.length]
  )

  // Optimized file upload handler with proper error handling
  const handleFileUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return

      const file = files[0]
      setUploadError(null)

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setUploadError(validationError)
        return
      }

      setIsUploading(true)

      try {
        const reader = new FileReader()

        reader.onload = (event) => {
          if (event.target?.result) {
            addPhoto(event.target.result as string)
            setIsUploading(false)
            // Clear the input to allow re-uploading the same file
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }
        }

        reader.onerror = () => {
          setUploadError(ERROR_MESSAGES.UPLOAD_ERROR)
          setIsUploading(false)
        }

        reader.readAsDataURL(file)
      } catch (error) {
        setUploadError(ERROR_MESSAGES.UPLOAD_ERROR)
        setIsUploading(false)
        console.error("File upload error:", error)
      }
    },
    [addPhoto, validateFile]
  )

  // Optimized navigation handlers
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleContinue = useCallback(() => {
    router.push("/book/contact")
  }, [router])

  const handleAddServices = useCallback(() => {
    router.push("/book")
  }, [router])

  // Optimized photo removal with error clearing
  const handleRemovePhoto = useCallback(
    (index: number) => {
      removePhoto(index)
      if (uploadError === ERROR_MESSAGES.MAX_PHOTOS_REACHED) {
        setUploadError(null)
      }
    },
    [removePhoto, uploadError]
  )

  // Debounced details update (you might want to implement debouncing)
  const handleDetailsChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setAdditionalDetails(e.target.value)
    },
    [setAdditionalDetails]
  )

  const canContinue = serviceCount > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <SlideInLeft>
          <button
            onClick={handleBack}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium mb-8 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group"
            aria-label="Go back to services"
          >
            <AnimatedIcon>
              <ArrowLeft className="mr-2 h-5 w-5" />
            </AnimatedIcon>
            <span>Back to Services</span>
          </button>
        </SlideInLeft>

        {/* Header Section */}
        <FadeInUp delay={0.1} className="text-center mb-8">
          <ScaleIn
            delay={0.2}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Booking Summary</span>
          </ScaleIn>

          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AB Carpet Cleaning
            </span>
          </h1>

          <FadeInDiv delay={0.3} className="text-lg text-slate-600 dark:text-slate-400">
            Review your selected services and add any additional details
          </FadeInDiv>
        </FadeInUp>

        {/* Booking Stepper */}
        <BookingStepper />

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Services & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Selected Services Card */}
            <FadeInDiv
              delay={0.4}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50"
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
                    {serviceCount} service{serviceCount !== 1 ? "s" : ""} selected
                  </p>
                </div>
              </div>

              {serviceCount === 0 ? (
                <FadeInDiv
                  delay={0.5}
                  className="text-center py-12 px-6 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-slate-200/30 dark:border-slate-700/30"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                    No services added yet
                  </p>
                  <HoverButton
                    onClick={handleAddServices}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Services</span>
                  </HoverButton>
                </FadeInDiv>
              ) : (
                <div className="space-y-4">
                  {selectedServices.map((service, index) => (
                    <ServiceItem key={service.id} service={service} index={index} />
                  ))}
                </div>
              )}
            </FadeInDiv>

            {/* Additional Details Card */}
            <FadeInDiv
              delay={0.6}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Additional Details
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Help us serve you better (optional)
                  </p>
                </div>
              </div>

              <FadeInDiv delay={0.7}>
                <textarea
                  value={additionalDetails}
                  onChange={handleDetailsChange}
                  placeholder="Describe any specific requirements, areas of focus, or special instructions for your cleaning service..."
                  className="w-full p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-xl mb-4 min-h-[180px] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  maxLength={MAX_DETAILS_LENGTH}
                  aria-describedby="details-counter details-saved"
                />
                <div className="flex justify-between items-center mb-6">
                  <p id="details-counter" className="text-sm text-slate-500 dark:text-slate-400">
                    {additionalDetails.length}/{MAX_DETAILS_LENGTH} characters
                  </p>
                  <div
                    id="details-saved"
                    className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Auto-saved</span>
                  </div>
                </div>
              </FadeInDiv>

              {/* Photo Upload Section */}
              <FadeInDiv delay={0.8}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Photos</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Visual references help us understand your needs better (Max 2MB each)
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{uploadError}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                  {photos.map((photo, index) => (
                    <PhotoThumbnail
                      key={`photo-${index}`}
                      photo={photo}
                      index={index}
                      onRemove={handleRemovePhoto}
                    />
                  ))}

                  {/* Upload Button */}
                  {photos.length < MAX_PHOTOS && (
                    <ScaleIn delay={0.9} className="aspect-square">
                      <HoverCard
                        className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm transition-all duration-200"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploading ? (
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-1" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Add</span>
                          </>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          onChange={handleFileUpload}
                          aria-label="Upload photo"
                        />
                      </HoverCard>
                    </ScaleIn>
                  )}
                </div>

                {photos.length > 0 && (
                  <FadeInDiv
                    delay={1.0}
                    className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30"
                  >
                    <div className="flex items-center space-x-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
                      </span>
                    </div>
                  </FadeInDiv>
                )}
              </FadeInDiv>
            </FadeInDiv>
          </div>

          {/* Right Column - Pricing Summary */}
          <div className="lg:col-span-1">
            <SlideInRight delay={0.6}>
              <div className="sticky top-8">
                <div className="bg-gradient-to-br from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                      <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Order Summary
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Pricing breakdown
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <FadeInDiv
                      delay={0.7}
                      className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        ${pricing.subtotal.toFixed(2)}
                      </span>
                    </FadeInDiv>

                    <FadeInDiv
                      delay={0.75}
                      className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span className="text-slate-600 dark:text-slate-400">Tax:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        ${pricing.tax.toFixed(2)}
                      </span>
                    </FadeInDiv>

                    <FadeInDiv
                      delay={0.8}
                      className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg"
                    >
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold">${pricing.total.toFixed(2)}</span>
                    </FadeInDiv>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <FadeInDiv delay={0.85}>
                      <HoverButton
                        onClick={handleAddServices}
                        className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 py-4 rounded-xl font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>ADD MORE SERVICES</span>
                      </HoverButton>
                    </FadeInDiv>

                    <FadeInDiv delay={0.9}>
                      <HoverButton
                        onClick={handleContinue}
                        disabled={!canContinue}
                        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
                          !canContinue
                            ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                        aria-label="Continue to contact information"
                      >
                        <span>CONTINUE TO CONTACT</span>
                        <ArrowRight className="w-5 h-5" />
                      </HoverButton>
                    </FadeInDiv>
                  </div>

                  {canContinue && (
                    <FadeInDiv
                      delay={0.95}
                      className="mt-6 p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl"
                    >
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Free consultation included</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mt-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Satisfaction guaranteed</span>
                      </div>
                    </FadeInDiv>
                  )}
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>

        {/* Footer */}
        <FadeInDiv delay={1.0} className="text-center">
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
