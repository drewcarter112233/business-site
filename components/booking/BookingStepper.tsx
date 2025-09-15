"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, User, Calendar, ClipboardList, ClipboardCheck } from "lucide-react"

const steps = [
  { path: "/book", label: "Services", icon: CheckCircle },
  { path: "/book/summary", label: "Summary", icon: ClipboardList },
  { path: "/book/contact", label: "Contact", icon: User },
  { path: "/book/schedule", label: "Schedule", icon: Calendar },
  { path: "/book/confirmation", label: "Confirmation", icon: ClipboardCheck },
]

export const BookingStepper = () => {
  const pathname = usePathname()

  // Determine current step based on path
  let currentStep = 0
  if (pathname.startsWith("/book/services") || pathname.startsWith("/book/service")) {
    currentStep = 0
  } else if (pathname.startsWith("/book/summary")) {
    currentStep = 1
  } else if (pathname.startsWith("/book/contact")) {
    currentStep = 2
  } else if (pathname.startsWith("/book/schedule")) {
    currentStep = 3
  } else if (pathname.startsWith("/book/confirmation")) {
    currentStep = 4
  }

  return (
    <div className="mb-12 animate-in fade-in-0 slide-in-from-top-4 duration-700">
      <div className="relative flex justify-between items-center max-w-4xl mx-auto px-4">
        {/* Progress Line Background */}
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-slate-200 via-slate-200 to-slate-200 dark:from-slate-700 dark:via-slate-700 dark:to-slate-700 -translate-y-1/2 z-0">
          {/* Animated Progress Line */}
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0.0, 0.2, 1],
              delay: 0.2,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index <= currentStep
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <motion.div
              key={step.path}
              className="relative z-10 flex flex-col items-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1 + 0.3,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              {/* Step Circle */}
              <motion.div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 text-slate-400"
                } ${isCurrent ? "ring-4 ring-blue-200 dark:ring-blue-800 ring-opacity-50" : ""}`}
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulse animation for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Checkmark for completed steps */}
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Icon className="w-5 h-5" />
                )}

                {/* Shine effect for active steps */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "linear",
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                    }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <motion.span
                className={`mt-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 dark:text-slate-500"
                } ${isCurrent ? "font-semibold" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {step.label}
              </motion.span>

              {/* Progress indicator dots */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className="block sm:hidden mt-6 mx-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }}
          />
        </div>
      </div>
    </div>
  )
}
