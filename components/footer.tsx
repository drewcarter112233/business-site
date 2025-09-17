"use client"

import { memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Heart, Calendar } from "lucide-react"

interface SocialLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

interface Certification {
  name: string
  logo: string
  description: string
}

// Performance-optimized animation variants
const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.1,
    y: -2,
    transition: { duration: 0.2 },
  },
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com/webnurture",
    icon: Facebook,
    color: "hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/webnurture",
    icon: Instagram,
    color: "hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/webnurture",
    icon: Twitter,
    color: "hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/webnurture",
    icon: Linkedin,
    color: "hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@webnurture",
    icon: Youtube,
    color: "hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
  },
]

const CERTIFICATIONS: Certification[] = [
  {
    name: "Better Business Bureau",
    logo: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758098350/gradient_hcqmf4.png",
    description: "A+ BBB Rating",
  },
  {
    name: "IICRC Certified",
    logo: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758098350/gradient_hcqmf4.png",
    description: "Industry Certified",
  },
  {
    name: "Green Seal",
    logo: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758098350/gradient_hcqmf4.png",
    description: "Eco-Friendly",
  },
  {
    name: "Insured & Bonded",
    logo: "https://res.cloudinary.com/daxqkfjtr/image/upload/v1758098350/gradient_hcqmf4.png",
    description: "Fully Protected",
  },
]

const Footer = memo(() => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(180deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <motion.div
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10"
      >
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
          {/* Certifications */}
          <motion.div
            variants={sectionVariants}
            className="mt-12 pt-8 border-t border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-6 text-center">
              Trusted & Certified
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {CERTIFICATIONS.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  variants={socialVariants}
                  custom={index}
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="relative w-20 h-15 bg-slate-800 rounded-lg p-2 group-hover:bg-slate-700 transition-colors duration-200">
                    <Image
                      src={cert.logo}
                      alt={cert.name}
                      fill
                      className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-slate-300">{cert.name}</div>
                    <div className="text-xs text-slate-400">{cert.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={sectionVariants} className="mt-8 pt-8 border-t border-slate-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 text-sm">Follow us:</span>
                <div className="flex items-center space-x-3">
                  {SOCIAL_LINKS.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialVariants}
                      whileHover="hover"
                      custom={index}
                      className={`w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 transition-all duration-200 ${social.color}`}
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Proudly serving since 2009</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Book online 24/7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={sectionVariants}
          className="border-t border-slate-700/50 bg-slate-950/50"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span>Copyright © {currentYear}</span>
                <Link
                  href="/"
                  className="font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Web Nurture
                </Link>
                <span>• All rights reserved.</span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-400">
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <div className="flex items-center space-x-1">
                  <span>Made with</span>
                  <Heart className="w-3 h-3 text-red-400" />
                  <span>for our community</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
})

Footer.displayName = "Footer"

export default Footer
