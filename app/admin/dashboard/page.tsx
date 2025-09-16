"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { listBookings, updateBookingStatus, getPhotoUrl, deleteBooking } from "@/lib/appwrite"
import { format } from "date-fns"
import Image from "next/image"
import { Phone, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { BookingDocument } from "@/lib/appwrite"
import { useRouter } from "next/navigation"

interface ParsedContact {
  name?: string
  email?: string
  phone?: string
  address?: string
  unit?: string
  city?: string
  state?: string
  zip?: string
}

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onNavigate: (index: number) => void
}

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  bookingId: string
  customerName: string
}

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  bookingId,
  customerName,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Delete Booking
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 dark:text-slate-300 mb-2">
            Are you sure you want to delete the booking for:
          </p>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{customerName}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">ID: {bookingId.slice(-8)}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function ImageModal({ isOpen, onClose, images, currentIndex, onNavigate }: ImageModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1)
      } else if (e.key === "ArrowRight") {
        onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [isOpen, currentIndex, images.length, onClose, onNavigate])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1)}
              className="absolute left-6 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0)}
              className="absolute right-6 z-20 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Container */}
        <div className="relative w-[90vw] h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex justify-center items-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={getPhotoUrl(images[currentIndex])}
            alt={`Photo ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="h-full object-contain"
            onLoad={() => setIsLoading(false)}
            priority
          />
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        )}

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-2 bg-black/50 p-2 rounded-xl backdrop-blur-sm max-w-sm overflow-x-auto">
              {images.map((imageId, index) => (
                <button
                  key={imageId}
                  onClick={() => onNavigate(index)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? "border-white scale-110"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <Image
                    src={getPhotoUrl(imageId)}
                    alt={`Thumbnail ${index + 1}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refresh, setRefresh] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean
    images: string[]
    currentIndex: number
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  })
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    bookingId: string
    customerName: string
  }>({
    isOpen: false,
    bookingId: "",
    customerName: "",
  })

  const parseContactJson = useCallback((contactArr: string[]): ParsedContact => {
    if (!contactArr || !Array.isArray(contactArr) || contactArr.length === 0) return {}

    try {
      return JSON.parse(contactArr[0])
    } catch {
      const result: ParsedContact = {}
      const fieldMapping = [
        "name",
        "email",
        "phone",
        "address",
        "unit",
        "city",
        "state",
        "zip",
      ] as const

      contactArr.forEach((value, index) => {
        if (value && value.trim() && fieldMapping[index]) {
          result[fieldMapping[index]] = value.trim()
        }
      })

      return result
    }
  }, [])

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const contact = parseContactJson(booking.contact)
      const searchLower = searchQuery.toLowerCase()

      const matchesSearch =
        !searchQuery ||
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.phone?.toLowerCase().includes(searchLower) ||
        booking.$id.toLowerCase().includes(searchLower)

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [bookings, searchQuery, statusFilter, parseContactJson])

  const displayedBookings = showAll ? filteredBookings : filteredBookings.slice(0, 4)

  const stats = useMemo(() => {
    const total = bookings.length
    const confirmed = bookings.filter((b) => b.status === "confirmed").length
    const pending = bookings.filter((b) => b.status === "pending").length
    const cancelled = bookings.filter((b) => b.status === "cancelled").length
    const revenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.total_amount, 0)

    return { total, confirmed, pending, cancelled, revenue }
  }, [bookings])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const bookingsData = await listBookings()
        setBookings(bookingsData)
        setError("")
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError("Failed to fetch bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [refresh])

  const handleUpdateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      await updateBookingStatus(id, status)
      setRefresh((prev) => prev + 1)
    } catch (err) {
      console.error("Error in updating booking status:", err)
      setError("Failed to update booking status")
    }
  }

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBooking(id)
      setRefresh((prev) => prev + 1)
      setDeleteModal({ isOpen: false, bookingId: "", customerName: "" })
    } catch (err) {
      console.error("Error in deleting booking", err)
      setError("Failed to delete booking")
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setRefresh((prev) => prev + 1)
      setIsRefreshing(false)
    }, 500)
  }

  const openImageModal = (images: string[], index: number) => {
    setImageModal({
      isOpen: true,
      images,
      currentIndex: index,
    })
  }

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      images: [],
      currentIndex: 0,
    })
  }

  const navigateImage = (index: number) => {
    setImageModal((prev) => ({
      ...prev,
      currentIndex: index,
    }))
  }

  const openDeleteModal = (bookingId: string, customerName: string) => {
    setDeleteModal({
      isOpen: true,
      bookingId,
      customerName,
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      bookingId: "",
      customerName: "",
    })
  }

  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin") // back to login page
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Loading Dashboard
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Fetching your bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Connection Error
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Unable to load dashboard</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-5xl font-bold sm:h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Booking Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                  Manage and track all your bookings efficiently
                </p>
              </div>
              <div className="flex items-center justify-center gap-10">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
                >
                  <svg
                    className={`w-5 h-5 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-600 hover:to-red-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Bookings",
                value: stats.total,
                icon: "📋",
                color: "blue",
                bgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
              },
              {
                label: "Confirmed",
                value: stats.confirmed,
                icon: "✅",
                color: "emerald",
                bgClass: "bg-gradient-to-br from-emerald-500 to-emerald-600",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: "⏳",
                color: "amber",
                bgClass: "bg-gradient-to-br from-amber-500 to-amber-600",
              },
              {
                label: "Revenue",
                value: `$${stats.revenue.toFixed(2)}`,
                icon: "💰",
                color: "purple",
                bgClass: "bg-gradient-to-br from-purple-500 to-purple-600",
              },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 ${stat.bgClass} rounded-xl text-white text-xl shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-colors duration-200 backdrop-blur-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="lg:w-48 w-[150px] px-1">
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-3 px-4  bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-slate-100 transition-colors duration-200 backdrop-blur-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>
                Showing {displayedBookings.length} of {filteredBookings.length} bookings
              </span>
              {searchQuery && <span>Filtered by: &quot;{searchQuery}&quot;</span>}
            </div>
          </div>

          {/* Bookings Grid */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-12 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {searchQuery || statusFilter !== "all"
                  ? "No matching bookings"
                  : "No bookings found"}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                  : "New bookings will appear here when they're created."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {displayedBookings.map((booking, index) => {
                  const contact = parseContactJson(booking.contact)
                  const cleanName = contact?.name?.split(":")[1] || contact?.name || "Unknown"
                  const cleanEmail = contact?.email?.split(":")[1] || contact?.email || "No email"
                  const cleanPhone = contact?.phone?.split(":")[1] || contact?.phone || "No phone"
                  const cleanAddress =
                    contact?.address?.split(":")[1] || contact?.address || "No address"
                  const cleanCity = contact?.city?.split(":")[1] || contact?.address || "No City"
                  const cleanState = contact?.state?.split(":")[1] || contact?.address || "No State"
                  const cleanZip = contact?.zip?.split(":")[1] || contact?.address || "No Zip"

                  return (
                    <div
                      key={booking.$id}
                      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => openDeleteModal(booking.$id, cleanName)}
                        className="absolute top-4 right-4 z-10 p-2 bg-red-100/80 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                        title="Delete booking"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Booking Header */}
                      <div className="p-6 border-b border-slate-100/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-700/50 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0 pr-12">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                  {cleanName[0]?.toUpperCase() || "U"}
                                </span>
                              </div>
                              <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                  {cleanName}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400">{cleanEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" /> {cleanPhone}
                              </div>
                              <div className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                  />
                                </svg>
                                ID: {booking.$id.slice(-8)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                                booking.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                  : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="p-6 space-y-4">
                        {/* Date & Time */}
                        <div className="bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                Scheduled
                              </p>
                              <p className="text-slate-600 dark:text-slate-400">
                                {format(new Date(booking.arrival_date), "MMM dd, yyyy")} at{" "}
                                {booking.arrival_time}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/70 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                Location
                              </p>
                              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                {cleanAddress}, {cleanCity}, {cleanState} {cleanZip}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Services */}
                        <div className="bg-gradient-to-br from-purple-50/70 to-purple-100/70 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                Services ({booking.services.length})
                              </p>
                              <div className="space-y-2">
                                {booking.services.slice(0, 2).map((service, index) => {
                                  return (
                                    <div
                                      key={`${service.id}-${index}`}
                                      className="flex justify-between items-center py-2 px-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-600/50 shadow-sm backdrop-blur-sm"
                                    >
                                      <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                                        {service.name}
                                      </span>
                                      <span className="font-bold text-slate-900 dark:text-slate-100">
                                        ${service.price}
                                      </span>
                                    </div>
                                  )
                                })}
                                {booking.services.length > 2 && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 text-center py-1">
                                    +{booking.services.length - 2} more services
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 pt-3 border-t border-purple-200/50 dark:border-purple-700/50">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-slate-900 dark:text-slate-100">
                                    Total Amount
                                  </span>
                                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    ${booking.total_amount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Details */}
                        {booking.additional_details && (
                          <div className="bg-gradient-to-br from-orange-50/70 to-orange-100/70 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50 backdrop-blur-sm">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-orange-500 rounded-lg shadow-sm">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                  Additional Details
                                </p>
                                <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm">
                                  {booking.additional_details}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Photos Preview */}
                        {booking.photos && booking.photos.length > 0 && (
                          <div className="bg-gradient-to-br from-pink-50/70 to-pink-100/70 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-4 border border-pink-200/50 dark:border-pink-700/50 backdrop-blur-sm">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-pink-500 rounded-lg shadow-sm">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                  Photos ({booking.photos.length})
                                </p>
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                  {booking.photos
                                    .slice(0, 4)
                                    .map((photoId: string, photoIndex: number) => (
                                      <div
                                        key={photoId}
                                        className="flex-shrink-0 group aspect-square w-16 h-16 relative border-2 border-slate-200/50 dark:border-slate-600/50 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
                                        onClick={() => openImageModal(booking.photos, photoIndex)}
                                      >
                                        <Image
                                          src={getPhotoUrl(photoId)}
                                          alt={`Preview ${photoId}`}
                                          fill
                                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                                          sizes="64px"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                          </svg>
                                        </div>
                                      </div>
                                    ))}
                                  {booking.photos.length > 4 && (
                                    <div
                                      className="flex-shrink-0 w-16 h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-300/50 dark:hover:bg-slate-600/50 transition-colors duration-200"
                                      onClick={() => openImageModal(booking.photos, 4)}
                                    >
                                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                        +{booking.photos.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                          {booking.status !== "confirmed" && (
                            <button
                              onClick={() => handleUpdateStatus(booking.$id, "confirmed")}
                              className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group text-sm"
                            >
                              <svg
                                className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Confirm
                            </button>
                          )}
                          {booking.status !== "cancelled" && (
                            <button
                              onClick={() => handleUpdateStatus(booking.$id, "cancelled")}
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group text-sm"
                            >
                              <svg
                                className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Cancel
                            </button>
                          )}
                        </div>

                        {/* Created At */}
                        <div className="flex items-center justify-center pt-3">
                          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs bg-slate-50/50 dark:bg-slate-700/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>
                              Created {format(new Date(booking.$createdAt), "MMM dd, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* See More Button */}
              {filteredBookings.length > 4 && (
                <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {showAll ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                        Show Less
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                        See More ({filteredBookings.length - 4} remaining)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm bg-white/50 dark:bg-slate-800/50 px-6 py-3 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Dashboard powered by Web Nurture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        images={imageModal.images}
        currentIndex={imageModal.currentIndex}
        onNavigate={navigateImage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDeleteBooking(deleteModal.bookingId)}
        bookingId={deleteModal.bookingId}
        customerName={deleteModal.customerName}
      />
    </>
  )
}
