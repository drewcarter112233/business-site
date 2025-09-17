"use client"

import { useState, useCallback, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Sparkles,
  Home,
  Building,
  Sofa,
  Square,
  Leaf,
} from "lucide-react"

// Type definitions
interface Service {
  id: string
  name: string
  description: string
  features: string[]
  price: string
  duration: string
  popularity: number
  icon: React.ComponentType<{ className?: string }>
  image: string
  color: {
    primary: string
    secondary: string
    bg: string
    border: string
  }
}

interface ServiceCardProps {
  service: Service
  index: number
  isPopular?: boolean
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// Sample services data
const SERVICES: Service[] = [
  {
    id: "house-cleaning",
    name: "House Cleaning",
    description: "Complete home cleaning service for a spotless living environment",
    features: ["Deep cleaning", "Eco-friendly products", "Flexible scheduling", "Insured staff"],
    price: "Starting at $120",
    duration: "2-4 hours",
    popularity: 95,
    icon: Home,
    image: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758114342/black-img_minize.jpg",
    color: {
      primary: "text-blue-600 dark:text-blue-400",
      secondary: "text-blue-500",
      bg: "from-blue-50/70 to-indigo-100/70 dark:from-blue-900/20 dark:to-indigo-800/20",
      border: "border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300/70",
    },
  },
  {
    id: "carpet-cleaning",
    name: "Carpet Cleaning",
    description: "Professional deep carpet cleaning using advanced steam cleaning technology",
    features: ["Steam cleaning", "Stain removal", "Pet odor elimination", "Fast drying"],
    price: "Starting at $80",
    duration: "1-3 hours",
    popularity: 88,
    icon: Sofa,
    image: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758114342/black-img_minize.jpg",
    color: {
      primary: "text-green-600 dark:text-green-400",
      secondary: "text-green-500",
      bg: "from-green-50/70 to-emerald-100/70 dark:from-green-900/20 dark:to-emerald-800/20",
      border: "border-green-200/50 dark:border-green-700/50 hover:border-green-300/70",
    },
  },
  {
    id: "office-cleaning",
    name: "Office Cleaning",
    description: "Professional commercial cleaning for productive work environments",
    features: ["Daily cleaning", "Sanitization", "Waste management", "Supply restocking"],
    price: "Custom pricing",
    duration: "After hours",
    popularity: 92,
    icon: Building,
    image: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758114342/black-img_minize.jpg",
    color: {
      primary: "text-purple-600 dark:text-purple-400",
      secondary: "text-purple-500",
      bg: "from-purple-50/70 to-violet-100/70 dark:from-purple-900/20 dark:to-violet-800/20",
      border: "border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300/70",
    },
  },
  {
    id: "window-cleaning",
    name: "Window Cleaning",
    description: "Crystal clear windows inside and out for maximum natural light",
    features: ["Interior & exterior", "Screen cleaning", "Sill wiping", "Streak-free finish"],
    price: "Starting at $60",
    duration: "1-2 hours",
    popularity: 76,
    icon: Square,
    image: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758114342/black-img_minize.jpg",
    color: {
      primary: "text-cyan-600 dark:text-cyan-400",
      secondary: "text-cyan-500",
      bg: "from-cyan-50/70 to-sky-100/70 dark:from-cyan-900/20 dark:to-sky-800/20",
      border: "border-cyan-200/50 dark:border-cyan-700/50 hover:border-cyan-300/70",
    },
  },
]

const ServiceCard = memo<ServiceCardProps>(({ service, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  return (
    <motion.article
      variants={cardVariants}
      custom={index}
      whileHover="hover"
      className="group relative h-full"
    >
      <div
        className={`relative h-full bg-gradient-to-br ${service.color.bg} rounded-2xl border ${service.color.border} backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/10 dark:group-hover:shadow-white/5 overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-white to-transparent" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-tr from-white to-transparent" />
        </div>

        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Service Image */}
          <div className="relative h-48 mb-6 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{
                scale: imageLoaded ? 1 : 1.1,
                opacity: imageLoaded ? 1 : 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={service.image}
                alt={`${service.name} service`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onLoad={handleImageLoad}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Service Icon Overlay */}
            <div className="absolute top-4 left-4">
              <div
                className={`w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/50 dark:border-slate-700/50`}
              >
                <service.icon className={`w-6 h-6 ${service.color.primary}`} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {service.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                {service.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                What&apos;s included:
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {service.features.slice(0, 3).map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400"
                  >
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {service.features.length > 3 && (
                  <div className="text-xs text-slate-500 dark:text-slate-500 ml-5">
                    +{service.features.length - 3} more features
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <span className="text-xs">Price:</span>
                </div>
                <div className={`text-sm font-bold ${service.color.primary}`}>{service.price}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">Duration:</span>
                </div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {service.duration}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <Link
              href={`/book/services/${service.id}`}
              className={`w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform group-hover:scale-105`}
            >
              <span>Book {service.name}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/5 dark:group-hover:from-blue-500/5 dark:group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none" />
      </div>
    </motion.article>
  )
})

ServiceCard.displayName = "ServiceCard"

const ServicesShowcase = memo(() => {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Services", icon: Sparkles },
    { id: "residential", name: "Residential", icon: Home },
    { id: "commercial", name: "Commercial", icon: Building },
  ]

  const getCategoryServices = useCallback((category: string) => {
    if (category === "all") return SERVICES
    if (category === "residential")
      return SERVICES.filter((s) =>
        ["house-cleaning", "carpet-cleaning", "window-cleaning", "deep-cleaning"].includes(s.id)
      )
    if (category === "commercial") return SERVICES.filter((s) => ["office-cleaning"].includes(s.id))
    if (category === "specialized")
      return SERVICES.filter((s) => ["post-construction"].includes(s.id))
    return SERVICES
  }, [])

  const filteredServices = getCategoryServices(selectedCategory)

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100/50 dark:bg-blue-900/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 dark:border-blue-700/50 mb-6">
            <Leaf className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Professional Services
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Our Cleaning{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            From routine maintenance to deep cleaning projects, we offer comprehensive solutions
            tailored to your specific needs with guaranteed satisfaction.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                  : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200/50 dark:border-slate-700/50"
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isPopular={service.popularity >= 90}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-500/10 dark:to-indigo-500/10 backdrop-blur-sm rounded-2xl border border-blue-200/50 dark:border-blue-700/50 p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    100% Satisfaction Guaranteed
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Licensed, insured, and fully bonded
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-center">
                Don&apos;t see exactly what you need? We offer custom cleaning solutions tailored to
                your specific requirements.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                  href="/book"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>Get Custom Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+15551234567"
                  className="flex items-center space-x-2 px-6 py-3 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Users className="w-4 h-4" />
                  <span>Speak with Expert</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
})

ServicesShowcase.displayName = "ServicesShowcase"

export default ServicesShowcase
