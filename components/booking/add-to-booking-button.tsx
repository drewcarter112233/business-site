"use client"

import { Service } from "@/data/services-data"
import { useRouter } from "next/navigation"
import { useBookingStore } from "@/store/booking-store"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ArrowRight, Sparkles } from "lucide-react"
import { useState, useCallback } from "react"

interface AddToBookingButtonProps {
  service: Service
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
}

export function AddToBookingButton({
  service,
  variant = "primary",
  size = "lg",
  fullWidth = true,
}: AddToBookingButtonProps) {
  const router = useRouter()
  const { addService } = useBookingStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const sizeClasses = {
    sm: "py-3 px-6 text-sm",
    md: "py-4 px-7 text-base",
    lg: "py-5 px-8 text-lg",
  }

  const variantClasses = {
    primary: isAdded
      ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25",
    outline: isAdded
      ? "border-2 border-emerald-500 text-emerald-600 bg-emerald-50/80 backdrop-blur-sm"
      : "border-2 border-blue-500 text-blue-600 hover:bg-blue-50/80 backdrop-blur-sm",
    ghost: isAdded ? "text-emerald-600 bg-emerald-50/50" : "text-blue-600 hover:bg-blue-50/50",
  }

  const handleAddToBooking = useCallback(async () => {
    if (isLoading || isAdded) return

    setIsLoading(true)

    try {
      // Simulate API call with realistic timing
      await new Promise((resolve) => setTimeout(resolve, 800))

      addService(service)
      setIsAdded(true)

      // Auto-navigate after success state
      setTimeout(() => {
        router.push("/book/summary")
      }, 1200)
    } catch (error) {
      console.error("Failed to add service:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, isAdded, addService, service, router])

  return (
    <div className={`relative ${fullWidth ? "w-full" : "inline-block"}`}>
      {/* Success Particles Animation */}
      <AnimatePresence>
        {isAdded && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: `linear-gradient(45deg, 
                    hsl(${160 + i * 10}, 70%, 60%), 
                    hsl(${180 + i * 10}, 70%, 70%))`,
                }}
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + Math.cos((i / 12) * Math.PI * 2) * 100}%`,
                  y: `${50 + Math.sin((i / 12) * Math.PI * 2) * 100}%`,
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleAddToBooking}
        disabled={isLoading || isAdded}
        className={`
          relative ${fullWidth ? "w-full" : ""} ${sizeClasses[size]} 
          font-semibold rounded-2xl transition-all duration-300 
          overflow-hidden group disabled:cursor-not-allowed
          focus:outline-none focus:ring-4 focus:ring-blue-500/20
          ${variantClasses[variant]}
        `}
        whileHover={
          !isLoading && !isAdded
            ? {
                scale: 1.02,
                y: -2,
                boxShadow:
                  variant === "primary" ? "0 20px 40px -12px rgba(59, 130, 246, 0.4)" : undefined,
              }
            : {}
        }
        whileTap={!isLoading && !isAdded ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Animated Background Gradient */}
        {variant === "primary" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent"
            initial={{ x: "-100%", skewX: -15 }}
            animate={{
              x: isLoading ? ["100%", "100%", "-100%"] : "-100%",
            }}
            transition={{
              duration: 2,
              repeat: isLoading ? Infinity : 0,
              ease: "linear",
              repeatDelay: 0.5,
            }}
          />
        )}

        {/* Button Content */}
        <div className="relative flex items-center justify-center gap-3">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Adding to Cart...</span>
              </motion.div>
            ) : isAdded ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="flex items-center gap-3"
              >
                <span>Added Successfully!</span>
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-3"
              >
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                  <ShoppingCart className="w-5 h-5" />
                </motion.div>
                <span>Add to Cart</span>
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ripple Effect */}
        {!isLoading && !isAdded && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                variant === "primary"
                  ? "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{
              scale: 1,
              opacity: [0, 0.6, 0],
              transition: { duration: 0.5, ease: "easeOut" },
            }}
          />
        )}

        {/* Hover Glow Effect */}
        {variant === "primary" && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/0 via-indigo-600/0 to-purple-600/0 group-hover:from-blue-600/20 group-hover:via-indigo-600/20 group-hover:to-purple-600/20 transition-all duration-500" />
        )}
      </motion.button>

      {/* Floating Price Badge */}
      <motion.div
        className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        ${service.price}
      </motion.div>
    </div>
  )
}
