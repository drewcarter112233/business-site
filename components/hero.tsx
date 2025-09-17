"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion, type Variants } from "framer-motion"
import {
  Star,
  Shield,
  Clock,
  Phone,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Award,
  Users,
  MapPin,
  ChevronDown,
} from "lucide-react"

// Type definitions
interface Statistic {
  id: string
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface Feature {
  id: string
  text: string
  icon: React.ComponentType<{ className?: string }>
}

interface TestimonialQuote {
  id: string
  text: string
  author: string
  location: string
  rating: number
}

// Performance-optimized animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
}

const childVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const floatingVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 1, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

// Sample data
const STATISTICS: Statistic[] = [
  { id: "customers", value: "5,000+", label: "Happy Customers", icon: Users },
  { id: "experience", value: "15+", label: "Years Experience", icon: Award },
  { id: "rating", value: "4.9★", label: "Average Rating", icon: Star },
  { id: "locations", value: "50+", label: "Service Areas", icon: MapPin },
]

const KEY_FEATURES: Feature[] = [
  { id: "licensed", text: "Licensed & Insured", icon: Shield },
  { id: "guarantee", text: "100% Satisfaction Guarantee", icon: CheckCircle },
  { id: "response", text: "24-Hour Response Time", icon: Clock },
  { id: "eco", text: "Eco-Friendly Products", icon: Sparkles },
]

const TESTIMONIAL: TestimonialQuote = {
  id: "featured",
  text: "Outstanding service! They transformed our carpets and made our home feel brand new.",
  author: "Sarah Johnson",
  location: "Downtown Client",
  rating: 5,
}

const HeroSection = memo(() => {
  const [mounted, setMounted] = useState(false)

  // Handle mounting for Next.js SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCallClick = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = "tel:+15551234567"
    }
  }, [])

  const handleQuoteClick = useCallback(() => {
    if (typeof window !== "undefined") {
      const bookingSection = document.getElementById("booking")
      if (bookingSection) {
        bookingSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      } else {
        // Fallback scroll
        window.scrollTo({
          top: window.innerHeight,
          behavior: "smooth",
        })
      }
    }
  }, [])

  const handleScrollDown = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      })
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center opacity-0">
            <h1 className="text-7xl font-bold mb-6">Professional Cleaning</h1>
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-800/60">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Floating Gradient Orbs */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl opacity-60"
        />

        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full blur-3xl opacity-40"
        />

        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl opacity-30"
        />

        {/* Animated Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, transparent 0px, rgba(59,130,246,0.1) 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Trust Badge */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200/40 dark:border-blue-700/40 shadow-sm hover:shadow-md transition-all duration-300 mb-8"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                >
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                </motion.div>
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1">
              #1 Rated Cleaning Service
            </span>
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full ml-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-slate-50 leading-[1.1] tracking-tight mb-6">
              Professional{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 bg-clip-text text-transparent">
                  Cleaning
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
              <br />
              <span className="text-slate-600 dark:text-slate-300 font-medium">You Can Trust</span>
            </h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Transform your space with our expert cleaning services. Licensed, insured, and
              committed to delivering spotless results that exceed expectations.
            </motion.p>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div
            variants={staggerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10"
          >
            {KEY_FEATURES.map((feature) => (
              <motion.div
                key={feature.id}
                variants={childVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 group cursor-pointer"
              >
                <motion.div
                  className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-center sm:text-left">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12"
          >
            <motion.button
              onClick={handleQuoteClick}
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg overflow-hidden min-w-[200px]"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "200%" }}
                transition={{ duration: 0.6 }}
              />
              <div className="relative flex items-center justify-center gap-2">
                <span>Get Free Quote</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.button>

            <motion.button
              onClick={handleCallClick}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-6 py-4 text-slate-700 dark:text-slate-200 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-xl backdrop-blur-sm border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50 min-w-[200px] justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Phone className="w-5 h-5" />
              </motion.div>
              <span>(555) 123-4567</span>
            </motion.button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={staggerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-200/50 dark:border-slate-600/30"
          >
            {STATISTICS.map((stat, index) => (
              <motion.div
                key={stat.id}
                variants={childVariants}
                whileHover={{
                  y: -5,
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                className="group text-center space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <motion.div
                    className="p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
                <motion.div
                  className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div variants={itemVariants} className="mt-12 max-w-2xl mx-auto">
            <motion.div
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/40 dark:border-slate-700/40 shadow-sm"
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2 + i * 0.1, duration: 0.3 }}
                  >
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                  </motion.div>
                ))}
              </div>
              <blockquote className="text-slate-700 dark:text-slate-200 italic mb-4 text-lg">
                &quot;{TESTIMONIAL.text}&quot;
              </blockquote>
              <cite className="text-sm font-medium text-slate-600 dark:text-slate-300">
                — {TESTIMONIAL.author}, {TESTIMONIAL.location}
              </cite>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
          onClick={handleScrollDown}
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-xs font-medium uppercase tracking-wide">Scroll Down</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
})

HeroSection.displayName = "HeroSection"

export default HeroSection
