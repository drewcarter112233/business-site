"use client"

import { useRouter } from "next/navigation"
import { BookingStepper } from "@/components/booking/BookingStepper"
import { useBookingStore } from "@/store/booking-store"
import { useState, useRef, ChangeEvent } from "react"
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

  const subtotal = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const tax = 0
  const total = subtotal + tax

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          addPhoto(event.target.result as string)
          setIsUploading(false)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleContinue = () => {
    router.push("/book/contact")
  }

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
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Selected Services
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""}{" "}
                    selected
                  </p>
                </div>
              </div>

              {selectedServices.length === 0 ? (
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
                    onClick={() => router.push("/book")}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Services</span>
                  </HoverButton>
                </FadeInDiv>
              ) : (
                <div className="space-y-4">
                  {selectedServices.map((service, index) => (
                    <FadeInDiv key={service.id} delay={0.5 + index * 0.1} className="group">
                      <HoverCard className="flex justify-between items-start p-6 bg-gradient-to-br from-slate-50/30 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-900/30 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg mb-2">
                            {service.name}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>Duration: {service.duration}</span>
                          </div>
                        </div>
                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            ${service.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            per service
                          </div>
                        </div>
                      </HoverCard>
                    </FadeInDiv>
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
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Additional Details
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Help us serve you better (optional)
                  </p>
                </div>
              </div>

              <FadeInDiv delay={0.7}>
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Describe any specific requirements, areas of focus, or special instructions for your cleaning service..."
                  className="w-full p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-xl mb-4 min-h-[180px] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {additionalDetails.length}/2000 characters
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-emerald-600 dark:text-emerald-400">
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
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Add Photos</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Visual references help us understand your needs better
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                  {photos.map((photo, index) => (
                    <ScaleIn
                      key={index}
                      delay={0.9 + index * 0.1}
                      className="relative aspect-square group"
                    >
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden relative">
                        <Image
                          src={photo}
                          alt={`Uploaded ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            onClick={() => removePhoto(index)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </ScaleIn>
                  ))}

                  {/* Upload Button */}
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
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </HoverCard>
                  </ScaleIn>
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
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Order Summary
                      </h3>
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
                        ${subtotal.toFixed(2)}
                      </span>
                    </FadeInDiv>

                    <FadeInDiv
                      delay={0.75}
                      className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span className="text-slate-600 dark:text-slate-400">Tax:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        ${tax.toFixed(2)}
                      </span>
                    </FadeInDiv>

                    <FadeInDiv
                      delay={0.8}
                      className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg"
                    >
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                    </FadeInDiv>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <FadeInDiv delay={0.85}>
                      <HoverButton
                        onClick={() => router.push("/book")}
                        className="w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 py-4 rounded-xl font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>ADD MORE SERVICES</span>
                      </HoverButton>
                    </FadeInDiv>

                    <FadeInDiv delay={0.9}>
                      <HoverButton
                        onClick={handleContinue}
                        disabled={selectedServices.length === 0}
                        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
                          selectedServices.length === 0
                            ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        <span>CONTINUE TO CONTACT</span>
                        <ArrowRight className="w-5 h-5" />
                      </HoverButton>
                    </FadeInDiv>
                  </div>

                  {selectedServices.length > 0 && (
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
