"use client"

import { useState, useEffect, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, Mail, Clock, Star, Shield, ChevronDown, Sparkles } from "lucide-react"

// Type definitions
interface NavItem {
  label: string
  href: string
  hasDropdown?: boolean
  dropdownItems?: { label: string; href: string; description?: string }[]
}

interface ContactInfo {
  phone: string
  email: string
  address: string
  hours: string
}

// Animation variants
const mobileMenuVariants = {
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
}

const dropdownVariants = {
  closed: { opacity: 0, y: -10, scale: 0.95 },
  open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
}

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.1, duration: 0.3 },
  }),
}

// Sample data - replace with your actual data
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    hasDropdown: true,
    dropdownItems: [
      {
        label: "Carpet Cleaning",
        href: "/services/carpet-cleaning",
        description: "Deep carpet restoration",
      },
      {
        label: "House Cleaning",
        href: "/services/house-cleaning",
        description: "Complete home cleaning",
      },
      {
        label: "Office Cleaning",
        href: "/services/office-cleaning",
        description: "Professional workspace cleaning",
      },
      {
        label: "Window Cleaning",
        href: "/services/window-cleaning",
        description: "Crystal clear windows",
      },
    ],
  },
  { label: "About", href: "/about" },
]

const CONTACT_INFO: ContactInfo = {
  phone: "(555) 123-4567",
  email: "info@webnurture.com",
  address: "123 Business Ave, City, ST 12345",
  hours: "Mon-Fri: 8AM-6PM",
}

const Navbar = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false)
      setActiveDropdown(null)
    }
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white text-xs py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-3 h-3" />
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="hover:text-blue-200 transition-colors"
              >
                {CONTACT_INFO.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3 h-3" />
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-blue-200 transition-colors"
              >
                {CONTACT_INFO.email}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>{CONTACT_INFO.hours}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-300" />
              <span className="text-yellow-300 font-medium">4.9</span>
              <span>/5 Reviews</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Licensed & Insured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-200/50 dark:border-slate-700/50"
            : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl blur-sm opacity-50 -z-10 group-hover:opacity-75 transition-opacity duration-300" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Web Nurture
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                    Professional Cleaning
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative group">
                  {item.hasDropdown ? (
                    <>
                      <button
                        className="flex items-center space-x-1 px-4 py-2 text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm py-2 z-50"
                            onMouseEnter={() => setActiveDropdown(item.label)}
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                              >
                                <div className="font-medium">{dropdownItem.label}</div>
                                {dropdownItem.description && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {dropdownItem.description}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden lg:inline">{CONTACT_INFO.phone}</span>
                </a>
                <Link
                  href="/book"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  Book Now
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="lg:hidden overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-4 space-y-2">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.label}
                      variants={navItemVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                    >
                      {item.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => handleDropdownToggle(item.label)}
                            className="w-full flex items-center justify-between px-4 py-3 text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200 rounded-lg"
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                activeDropdown === item.label ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === item.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-4 space-y-1 overflow-hidden"
                              >
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.href}
                                    href={dropdownItem.href}
                                    className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200 rounded-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {dropdownItem.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="block px-4 py-3 text-slate-700 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  {/* Mobile CTA */}
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3">
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="flex items-center space-x-3 px-4 py-3 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-200 rounded-lg"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{CONTACT_INFO.phone}</span>
                    </a>
                    <Link
                      href="/book"
                      className="block mx-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-center rounded-lg shadow-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  )
})

Navbar.displayName = "Navbar"

export default Navbar
