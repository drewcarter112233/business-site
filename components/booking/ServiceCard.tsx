"use client"

import { Service } from "@/data/services-data"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Eye,
  Info,
  Star,
  ArrowRight,
} from "lucide-react"

interface ServiceCardProps {
  service: Service
  index?: number
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      whileHover={{ y: -4 }}
    >
      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Link href={`/book/service/${service.id}`} className="group/link">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors duration-300 mb-2">
                {service.name}
              </h3>
            </Link>

            {/* Rating Stars */}
            <div className="flex items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">(4.9)</span>
            </div>
          </div>

          {/* Price Badge */}
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 px-4 py-2 rounded-xl backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {service.price.toFixed(2)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Duration Badge */}
        {service.duration && (
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-700/50 px-3 py-1.5 rounded-lg text-sm text-emerald-700 dark:text-emerald-400 mb-4 backdrop-blur-sm">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{service.duration}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group/expand"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Info className="w-4 h-4" />
            <span>{expanded ? "Show Less" : "Show More"}</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 transform group-hover/expand:scale-110 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 transform group-hover/expand:scale-110 transition-transform duration-200" />
            )}
          </motion.button>

          <Link href={`/book/service/${service.id}`}>
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group/button"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
              <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-200" />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 backdrop-blur-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          >
            <div className="p-6 space-y-4">
              {/* Additional Duration Info */}
              {service.duration && (
                <motion.div
                  className="bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        Service Duration
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Estimated time: {service.duration}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Disclaimer */}
              {service.disclaimer && (
                <motion.div
                  className="bg-gradient-to-br from-amber-50/70 to-orange-100/70 dark:from-amber-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Important Information
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        {service.disclaimer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Features List */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  "Professional Equipment",
                  "Eco-Friendly Products",
                  "Satisfaction Guaranteed",
                  "Insured & Bonded",
                ].map((feature, idx) => (
                  <motion.div
                    key={feature}
                    className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
