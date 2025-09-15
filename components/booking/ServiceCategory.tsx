"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

interface ServiceCategoryCardProps {
  id: string
  name: string
  description: string
  index?: number
}

export function ServiceCategoryCard({
  id,
  name,
  description,
  index = 0,
}: ServiceCategoryCardProps) {
  // Get category-specific gradient and icon
  const getCategoryStyle = (categoryId: string) => {
    switch (categoryId) {
      case "carpet-cleaning":
        return {
          gradient: "from-blue-500 to-indigo-600",
          bgGradient:
            "from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20",
          borderColor: "border-blue-200/50 dark:border-blue-700/50",
          icon: "🧽",
        }
      case "additional-cleaning":
        return {
          gradient: "from-emerald-500 to-teal-600",
          bgGradient:
            "from-emerald-50/70 to-teal-100/70 dark:from-emerald-900/20 dark:to-teal-800/20",
          borderColor: "border-emerald-200/50 dark:border-emerald-700/50",
          icon: "✨",
        }
      case "custom-services":
        return {
          gradient: "from-purple-500 to-pink-600",
          bgGradient:
            "from-purple-50/70 to-pink-100/70 dark:from-purple-900/20 dark:to-pink-800/20",
          borderColor: "border-purple-200/50 dark:border-purple-700/50",
          icon: "🎯",
        }
      default:
        return {
          gradient: "from-slate-500 to-slate-600",
          bgGradient:
            "from-slate-50/70 to-slate-100/70 dark:from-slate-900/20 dark:to-slate-800/20",
          borderColor: "border-slate-200/50 dark:border-slate-700/50",
          icon: "🔧",
        }
    }
  }

  const style = getCategoryStyle(id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/book/services/${id}`} className="block">
        <div
          className={`relative bg-gradient-to-br ${style.bgGradient} backdrop-blur-sm rounded-2xl p-6 border ${style.borderColor} transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10 overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-white to-transparent" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-tr from-white to-transparent" />
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="relative z-10">
            {/* Header with Icon */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white text-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                {style.icon}
              </div>

              <motion.div
                className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 15 }}
              >
                <ArrowRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {name}
            </h2>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm mb-4 line-clamp-2">
              {description}
            </p>

            {/* Interactive Elements */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                <Sparkles className="w-3 h-3" />
                <span>Professional Service</span>
              </div>

              <motion.div
                className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Explore
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
              </motion.div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  )
}
