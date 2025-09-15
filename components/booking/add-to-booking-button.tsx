"use client"

import { Service } from "@/data/services-data"
import { useRouter } from "next/navigation"
import { useBookingStore } from "@/store/booking-store"
import { motion } from "framer-motion"
import { ShoppingCart, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"

interface AddToBookingButtonProps {
  service: Service
}

export function AddToBookingButton({ service }: AddToBookingButtonProps) {
  const router = useRouter()
  const { addService } = useBookingStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToBooking = async () => {
    setIsLoading(true)

    // Add service to booking store
    addService(service)

    // Show success state briefly
    setTimeout(() => {
      setIsAdded(true)
      setIsLoading(false)

      // Navigate after brief delay to show success state
      setTimeout(() => {
        router.push("/book/summary")
      }, 800)
    }, 600)
  }

  return (
    <div className="relative">
      {/* Success Particles */}
      {isAdded && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
              initial={{
                x: "50%",
                y: "50%",
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <motion.button
        onClick={handleAddToBooking}
        disabled={isLoading || isAdded}
        className={`relative w-full py-6 px-8 text-lg font-bold rounded-2xl transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-2xl ${
          isAdded
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        } ${isLoading ? "cursor-not-allowed" : ""}`}
        whileHover={{
          scale: isLoading || isAdded ? 1 : 1.02,
          y: isLoading || isAdded ? 0 : -2,
        }}
        whileTap={{ scale: isLoading || isAdded ? 1 : 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        {/* Background Gradient Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{
            x: isLoading ? "100%" : "-100%",
          }}
          transition={{
            duration: 1.5,
            repeat: isLoading ? Infinity : 0,
            ease: "linear",
          }}
        />

        {/* Button Content */}
        <div className="relative flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <motion.div
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span>Adding to Booking...</span>
            </>
          ) : isAdded ? (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.3, ease: "backOut" }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <span>Added Successfully!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span>Add to Booking</span>
              <motion.div
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.div>
            </>
          )}
        </div>

        {/* Ripple Effect on Click */}
        {!isLoading && !isAdded && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-2xl"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 1, opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}
      </motion.button>
    </div>
  )
}
