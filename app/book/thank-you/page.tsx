"use client"

import { CheckCircle, Home, Calendar, Phone, Mail, Sparkles, Star, Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FadeInDiv, FadeInUp, ScaleIn, HoverButton, HoverCard } from "@/components/booking/framer"

export default function ThankYouPage() {
  const [bookingId, setBookingId] = useState<string | null>(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setBookingId(params.get("id"))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          {/* Success Icon */}
          <FadeInDiv delay={0.1} className="flex justify-center mb-8">
            <ScaleIn delay={0.2}>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                  <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
                {/* Animated Ring */}
                <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-emerald-300/30 animate-ping" />
                <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-emerald-400/50" />
              </div>
            </ScaleIn>
          </FadeInDiv>

          {/* Main Heading */}
          <FadeInUp delay={0.3} className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Thank You!
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <ScaleIn key={i} delay={0.4 + i * 0.1}>
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                </ScaleIn>
              ))}
            </div>
          </FadeInUp>

          {/* Success Message */}
          <FadeInDiv delay={0.6} className="mb-12">
            {bookingId ? (
              <>
                <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Your booking was successful! We&apos;re excited to provide you with exceptional
                  cleaning service.
                </p>
                <ScaleIn delay={0.8}>
                  <div className="bg-gradient-to-br from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-lg max-w-md mx-auto mb-8">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        Booking Confirmation
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        Your booking ID:
                      </p>
                      <p className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-lg">
                        {bookingId}
                      </p>
                    </div>
                  </div>
                </ScaleIn>
              </>
            ) : (
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                Your booking was successful! We&apos;ll contact you shortly to confirm all the
                details and answer any questions you may have.
              </p>
            )}
          </FadeInDiv>

          {/* What Happens Next */}
          <FadeInDiv delay={1.0} className="mb-12">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                  <Heart className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  What Happens Next?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ScaleIn delay={1.1}>
                  <HoverCard className="text-center p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Email Confirmation
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You&apos;ll receive a detailed confirmation email within 15 minutes
                    </p>
                  </HoverCard>
                </ScaleIn>

                <ScaleIn delay={1.2}>
                  <HoverCard className="text-center p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Courtesy Call
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      We&apos;ll call you 30 minutes before our arrival
                    </p>
                  </HoverCard>
                </ScaleIn>

                <ScaleIn delay={1.3}>
                  <HoverCard className="text-center p-6 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Professional Service
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Our expert team will arrive ready to exceed your expectations
                    </p>
                  </HoverCard>
                </ScaleIn>
              </div>
            </div>
          </FadeInDiv>

          {/* Contact Information */}
          <FadeInDiv delay={1.4} className="mb-12">
            <div className="bg-gradient-to-r from-slate-50/70 to-slate-100/70 dark:from-slate-800/70 dark:to-slate-900/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Need to make changes or have questions?
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">(123) 456-7891</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold">contact@abcarpetcleaning.com</span>
                </div>
              </div>
            </div>
          </FadeInDiv>

          {/* Action Buttons */}
          <FadeInDiv
            delay={1.5}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link href="/">
              <HoverButton className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                <Home className="w-5 h-5" />
                <span>Return to Homepage</span>
              </HoverButton>
            </Link>

            <Link href="/book">
              <HoverButton className="inline-flex items-center space-x-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-lg">
                <Calendar className="w-5 h-5" />
                <span>Book Another Service</span>
              </HoverButton>
            </Link>
          </FadeInDiv>

          {/* Testimonial Quote */}
          <FadeInDiv delay={1.6} className="mt-16 mb-8">
            <div className="max-w-2xl mx-auto">
              <blockquote className="text-lg italic text-slate-600 dark:text-slate-400 mb-4">
                &quot;AB Carpet Cleaning exceeded our expectations! Professional, thorough, and
                incredibly friendly. Our home has never looked better!&quot;
              </blockquote>
              <div className="flex items-center justify-center space-x-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                  - Sarah M., Albany NY
                </span>
              </div>
            </div>
          </FadeInDiv>

          {/* Social Proof */}
          <FadeInDiv delay={1.7} className="mb-8">
            <div className="flex items-center justify-center space-x-8 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  4.9★
                </div>
                <div className="text-sm">Average Rating</div>
              </div>
              <div className="w-px h-8 bg-slate-300 dark:bg-slate-600" />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">5</div>
                <div className="text-sm">Years Experience</div>
              </div>
            </div>
          </FadeInDiv>
        </div>

        {/* Footer */}
        <FadeInDiv delay={1.8} className="text-center">
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
