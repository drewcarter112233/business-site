"use client"

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  User,
  Calendar,
  ClipboardList,
  ClipboardCheck,
  ShoppingCart,
  ArrowRight,
  Clock,
} from "lucide-react"
import { useMemo } from "react"
import React from "react"

const steps = [
  {
    path: "/book",
    label: "Services",
    icon: ShoppingCart,
    description: "Choose your services",
  },
  {
    path: "/book/summary",
    label: "Summary",
    icon: ClipboardList,
    description: "Review your selection",
  },
  {
    path: "/book/contact",
    label: "Contact",
    icon: User,
    description: "Your information",
  },
  {
    path: "/book/schedule",
    label: "Schedule",
    icon: Calendar,
    description: "Pick date & time",
  },
  {
    path: "/book/confirmation",
    label: "Confirmation",
    icon: ClipboardCheck,
    description: "Booking complete",
  },
]

export const BookingStepper = () => {
  const pathname = usePathname()

  const currentStep = useMemo(() => {
    if (
      pathname.startsWith("/book/services") ||
      pathname.startsWith("/book/service") ||
      pathname === "/book"
    ) {
      return 0
    } else if (pathname.startsWith("/book/summary")) {
      return 1
    } else if (pathname.startsWith("/book/contact")) {
      return 2
    } else if (pathname.startsWith("/book/schedule")) {
      return 3
    } else if (pathname.startsWith("/book/confirmation")) {
      return 4
    }
    return 0
  }, [pathname])

  const progressPercentage = (currentStep / (steps.length - 1)) * 100

  return (
    <div className="mb-16 animate-in fade-in-0 slide-in-from-top-4 duration-700">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-2xl px-6 py-3 mb-4">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="w-px h-4 bg-blue-200 dark:bg-blue-700" />
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {steps[currentStep].label}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">{steps[currentStep].description}</p>
        </motion.div>

        {/* Desktop Stepper */}
        <div className="hidden lg:block relative">
          {/* Progress Line Background */}
          <div className="absolute top-1/2 left-20 right-20 h-1 bg-gradient-to-r from-slate-200 via-slate-200 to-slate-200 dark:from-slate-700 dark:via-slate-700 dark:to-slate-700 rounded-full -translate-y-1/2 z-0">
            {/* Animated Progress Line */}
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-sm relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.3,
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 1,
                }}
              />
            </motion.div>
          </div>

          {/* Steps */}
          <div className="relative z-10 flex justify-between items-start">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index <= currentStep
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep

              return (
                <motion.div
                  key={step.path}
                  className="flex flex-col items-center group max-w-40"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15 + 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  {/* Step Circle */}
                  <motion.div
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 mb-4 ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl shadow-blue-500/25"
                        : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 text-slate-400"
                    } ${
                      isCurrent ? "ring-4 ring-blue-200 dark:ring-blue-800/50 ring-opacity-60" : ""
                    }`}
                    whileHover={{
                      scale: 1.05,
                      y: -4,
                      transition: { duration: 0.2 },
                    }}
                    layoutId={`step-${index}`}
                  >
                    {/* Pulse Animation for Current Step */}
                    {isCurrent && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0, 0.3],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.div
                          className="absolute inset-2 rounded-xl bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.4, 0, 0.4],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                          }}
                        />
                      </>
                    )}

                    {/* Icon with Animation */}
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="completed"
                          initial={{ scale: 0, rotate: -180, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0, rotate: 180, opacity: 0 }}
                          transition={{
                            duration: 0.6,
                            ease: [0.68, -0.55, 0.265, 1.55],
                          }}
                        >
                          <CheckCircle2 className="w-7 h-7" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className={`w-7 h-7 ${isCurrent ? "animate-pulse" : ""}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Shine Effect for Active Steps */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-150%", "150%"] }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          repeatDelay: 4,
                          ease: "linear",
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Step Info */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.6 }}
                  >
                    <h4
                      className={`text-sm font-bold transition-all duration-300 mb-1 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      } ${isCurrent ? "text-base" : ""}`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Connection Arrow */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="absolute top-8 -right-6 text-slate-300 dark:text-slate-600"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: index < currentStep ? 1 : 0.3,
                        x: 0,
                      }}
                      transition={{ delay: index * 0.15 + 0.8 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Mobile Progress */}
        <div className="block lg:hidden">
          {/* Mobile Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-3">
              <span className="font-medium">Progress</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Current Step Card */}
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {steps[currentStep].label}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next Steps Preview */}
          {currentStep < steps.length - 1 && (
            <motion.div
              className="mt-4 p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>Next:</span>
                <div className="flex items-center gap-2">
                  {React.createElement(steps[currentStep + 1].icon, { className: "w-4 h-4" })}
                  <span>{steps[currentStep + 1].label}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
