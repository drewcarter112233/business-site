"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { memo, useMemo } from "react"

// Type definitions
interface ServiceCategoryCardProps {
  id: string
  name: string
  description: string
  index?: number
  className?: string
  "aria-label"?: string
}

interface CategoryStyle {
  gradient: string
  bgGradient: string
  borderColor: string
  icon: string
  accentColor: string
}

// Animation variants for better performance
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: [0.4, 0.0, 0.2, 1],
    },
  }),
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
  },
}

const arrowVariants: Variants = {
  hover: { x: 4, transition: { duration: 0.2 } },
}

const shineVariants: Variants = {
  hover: {
    x: ["-100%", "200%"],
    transition: { duration: 1.5, ease: "easeInOut" },
  },
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "carpet-cleaning": {
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20",
    borderColor:
      "border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300/70 dark:hover:border-blue-600/70",
    accentColor: "text-blue-600 dark:text-blue-400",
    icon: "",
  },
} as const

const DEFAULT_STYLE: CategoryStyle = {
  gradient: "from-blue-500 to-indigo-600",
  bgGradient: "from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20",
  borderColor:
    "border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300/70 dark:hover:border-blue-600/70",
  accentColor: "text-blue-600 dark:text-blue-400",
  icon: "",
}

export const ServiceCategoryCard = memo<ServiceCategoryCardProps>(
  ({ id, name, description, index = 0, className = "", "aria-label": ariaLabel }) => {
    const categoryStyle = useMemo(() => CATEGORY_STYLES[id] || DEFAULT_STYLE, [id])

    const truncatedDescription = useMemo(() => {
      if (description.length <= 100) return description
      return description.substring(0, 97) + "..."
    }, [description])

    const accessibleLabel = ariaLabel || `View ${name} services - ${description}`

    return (
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        custom={index}
        className={`group flex flex-col h-full ${className}`}
        role="article"
      >
        <Link
          href={`/book/services/${id}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl h-full"
          aria-label={accessibleLabel}
        >
          <div
            className={`
              relative overflow-hidden rounded-2xl border p-8 h-full flex flex-col 
              bg-gradient-to-br ${categoryStyle.bgGradient} ${categoryStyle.borderColor}
              backdrop-blur-sm transition-all duration-300 
              group-hover:shadow-xl group-hover:shadow-black/10
              dark:group-hover:shadow-white/5
            `}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" aria-hidden="true">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-white to-transparent" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-tr from-white to-transparent" />
            </div>

            {/* Shine Effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              aria-hidden="true"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                variants={shineVariants}
              />
            </div>

            <div className="relative z-10 flex flex-col flex-grow">
              {/* Content */}
              <div className="space-y-3 flex-grow">
                <h2
                  className="
                    text-xl font-bold text-slate-900 dark:text-slate-100 
                    group-hover:text-blue-600 dark:group-hover:text-blue-400 
                    transition-colors duration-300
                  "
                >
                  {name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm line-clamp-2">
                  {truncatedDescription}
                </p>
              </div>
              {/* Footer (sticks at bottom) */}
              <footer className="flex items-center justify-between mt-4 pt-2">
                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  <span>Professional Service</span>
                </div>

                <motion.div
                  className={`flex items-center text-sm font-medium ${categoryStyle.accentColor} group-hover:opacity-80 transition-opacity duration-200`}
                  variants={arrowVariants}
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </footer>
            </div>

            {/* Hover Glow Effect */}
            <div
              className="
                absolute inset-0 rounded-2xl opacity-0 
                bg-gradient-to-br from-white/0 to-white/0
                group-hover:from-white/5 group-hover:to-white/5
                dark:group-hover:from-blue-500/5 dark:group-hover:to-indigo-500/5
                transition-all duration-500 pointer-events-none
              "
              aria-hidden="true"
            />
          </div>
        </Link>
      </motion.article>
    )
  }
)

ServiceCategoryCard.displayName = "ServiceCategoryCard"
export default ServiceCategoryCard
