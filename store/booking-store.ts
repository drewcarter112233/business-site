import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import { devtools } from "zustand/middleware"
import { createBooking, type BookingData } from "@/lib/appwrite"

export interface Service {
  id: string
  name: string
  price: number
  description: string
  category: string
  duration?: string
  disclaimer?: string
  imageUrl?: string
  isActive?: boolean
  metadata?: Record<string, unknown>
}

export interface ArrivalWindow {
  date: Date
  time: string
  timeZone?: string
  flexibilityMinutes?: number
}

export interface BookingError {
  code: string
  message: string
  field?: string
  timestamp: number
}

export interface BookingValidation {
  isValid: boolean
  errors: BookingError[]
  warnings: string[]
}

export interface DebugInfo {
  serviceCount: number
  totalPrice: number
  hasContactInfo: boolean
  hasArrivalWindow: boolean
  version: number
}

interface BookingState {
  selectedServices: Service[]
  contactInfo: string[] | null
  arrivalWindow: ArrivalWindow | null
  additionalDetails: string
  photos: string[]

  isSubmitting: boolean
  isLoading: boolean
  lastError: BookingError | null
  lastBookingId: string | null

  createdAt: number | null
  lastUpdated: number
  version: number
  rehydrated: boolean

  isRehydrated: () => boolean
  addService: (service: Service) => void
  removeService: (id: string) => void
  updateService: (id: string, updates: Partial<Service>) => void
  clearServices: () => void

  setContactInfo: (info: Record<string, string>) => void
  updateContactInfo: (updates: Partial<Record<string, string>>) => void
  clearContactInfo: () => void

  setArrivalWindow: (window: ArrivalWindow) => void
  updateArrivalWindow: (updates: Partial<ArrivalWindow>) => void
  clearArrivalWindow: () => void

  setAdditionalDetails: (details: string) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  reorderPhotos: (startIndex: number, endIndex: number) => void
  clearPhotos: () => void

  submitBooking: () => Promise<string>
  retrySubmission: () => Promise<string>

  reset: (keepContactInfo?: boolean) => void
  clearError: () => void
  setLoading: (loading: boolean) => void

  getTotalPrice: () => number
  getServiceCount: () => number
  isServiceSelected: (serviceId: string) => boolean
  getServiceById: (serviceId: string) => Service | undefined

  validateBooking: () => BookingValidation
  validateContactInfo: () => BookingValidation
  validateServices: () => BookingValidation
  validateArrivalWindow: () => BookingValidation

  getBookingData: () => BookingData | null
  getBookingSummary: () => string
  canSubmit: () => boolean
  getDebugInfo: () => DebugInfo
  exportBookingData: () => string
  importBookingData: (data: string) => void
}

const createBookingError = (code: string, message: string, field?: string): BookingError => ({
  code,
  message,
  field,
  timestamp: Date.now(),
})

export const useBookingStore = create<BookingState>()(
  devtools(
    persist(
      immer((set, get) => ({
        selectedServices: [],
        contactInfo: null,
        arrivalWindow: null,
        additionalDetails: "",
        photos: [],
        isSubmitting: false,
        isLoading: false,
        lastError: null,
        lastBookingId: null,
        createdAt: null,
        lastUpdated: Date.now(),
        version: 1,
        rehydrated: false,

        addService: (service) =>
          set((state) => {
            if (!state.selectedServices.some((s) => s.id === service.id)) {
              state.selectedServices.push(service)
              state.lastUpdated = Date.now()
              if (!state.createdAt) state.createdAt = Date.now()
            }
          }),

        removeService: (id) =>
          set((state) => {
            state.selectedServices = state.selectedServices.filter((s) => s.id !== id)
            state.lastUpdated = Date.now()
          }),

        updateService: (id, updates) =>
          set((state) => {
            const service = state.selectedServices.find((s) => s.id === id)
            if (service) Object.assign(service, updates)
            state.lastUpdated = Date.now()
          }),

        clearServices: () =>
          set((state) => {
            state.selectedServices = []
            state.lastUpdated = Date.now()
          }),

        setContactInfo: (info) =>
          set((state) => {
            state.contactInfo = Object.entries(info).map(([k, v]) => `${k}:${v}`)
            state.lastUpdated = Date.now()
          }),

        updateContactInfo: (updates) =>
          set((state) => {
            if (!state.contactInfo) return
            const info: Record<string, string> = {}
            state.contactInfo.forEach((item) => {
              const [k, v] = item.split(":")
              info[k] = v
            })
            Object.assign(info, updates)
            state.contactInfo = Object.entries(info).map(([k, v]) => `${k}:${v}`)
            state.lastUpdated = Date.now()
          }),

        clearContactInfo: () =>
          set((state) => {
            state.contactInfo = null
            state.lastUpdated = Date.now()
          }),

        setArrivalWindow: (window) =>
          set((state) => {
            state.arrivalWindow = window
            state.lastUpdated = Date.now()
          }),

        updateArrivalWindow: (updates) =>
          set((state) => {
            if (state.arrivalWindow) Object.assign(state.arrivalWindow, updates)
            state.lastUpdated = Date.now()
          }),

        clearArrivalWindow: () =>
          set((state) => {
            state.arrivalWindow = null
            state.lastUpdated = Date.now()
          }),

        setAdditionalDetails: (details) =>
          set((state) => {
            state.additionalDetails = details
            state.lastUpdated = Date.now()
          }),

        addPhoto: (photo) =>
          set((state) => {
            if (photo.startsWith("data:image/") && state.photos.length < 10) {
              state.photos.push(photo)
              state.lastUpdated = Date.now()
            }
          }),

        removePhoto: (index) =>
          set((state) => {
            state.photos.splice(index, 1)
            state.lastUpdated = Date.now()
          }),

        reorderPhotos: (startIndex, endIndex) =>
          set((state) => {
            const [moved] = state.photos.splice(startIndex, 1)
            state.photos.splice(endIndex, 0, moved)
            state.lastUpdated = Date.now()
          }),

        clearPhotos: () =>
          set((state) => {
            state.photos = []
            state.lastUpdated = Date.now()
          }),

        submitBooking: async () => {
          const state = get()
          set({ isSubmitting: true, lastError: null })
          try {
            const validation = state.validateBooking()
            if (!validation.isValid)
              throw new Error(validation.errors.map((e) => e.message).join(", "))

            const bookingData = state.getBookingData()
            if (!bookingData) throw new Error("Invalid booking data")

            const bookingId = await createBooking(bookingData)
            set({ isSubmitting: false, lastBookingId: bookingId })
            return bookingId
          } catch (error: unknown) {
            let message = "Unknown error"
            if (error instanceof Error) {
              message = error.message
            }
            const bookingError = createBookingError("SUBMISSION_FAILED", message)
            set({ isSubmitting: false, lastError: bookingError })
            throw error
          }
        },

        retrySubmission: async () => get().submitBooking(),

        isRehydrated: () => get().rehydrated,

        reset: (keepContactInfo = false) =>
          set((state) => {
            state.selectedServices = []
            state.arrivalWindow = null
            state.additionalDetails = ""
            state.photos = []
            state.isSubmitting = false
            state.isLoading = false
            state.lastError = null
            state.lastBookingId = null
            state.lastUpdated = Date.now()
            state.version++
            if (!keepContactInfo) {
              state.contactInfo = null
              state.createdAt = null
            }
          }),

        clearError: () => set({ lastError: null }),
        setLoading: (loading) => set({ isLoading: loading }),

        getTotalPrice: () => get().selectedServices.reduce((sum, s) => sum + s.price, 0),
        getServiceCount: () => get().selectedServices.length,
        isServiceSelected: (id) => get().selectedServices.some((s) => s.id === id),
        getServiceById: (id) => get().selectedServices.find((s) => s.id === id),

        validateBooking: () => {
          const errors: BookingError[] = []
          const warnings: string[] = []
          if (!get().contactInfo)
            errors.push(createBookingError("MISSING_CONTACT", "Contact required", "contactInfo"))
          if (get().selectedServices.length === 0)
            errors.push(createBookingError("NO_SERVICES", "Add at least one service", "services"))
          return { isValid: errors.length === 0, errors, warnings }
        },

        validateContactInfo: () => ({ isValid: !!get().contactInfo, errors: [], warnings: [] }),
        validateServices: () => ({
          isValid: get().selectedServices.length > 0,
          errors: [],
          warnings: [],
        }),
        validateArrivalWindow: () => ({ isValid: !!get().arrivalWindow, errors: [], warnings: [] }),

        getBookingData: () => {
          const state = get()
          if (!state.contactInfo || !state.arrivalWindow) return null
          const contactObj: Record<string, string> = {}
          state.contactInfo.forEach((entry) => {
            const [key, value] = entry.split(":")
            contactObj[key] = value
          })

          const fullName = `${contactObj.firstName || ""} ${contactObj.lastName || ""}`.trim()
          return {
            services: state.selectedServices.map((s) => ({
              id: s.id,
              name: s.name,
              price: s.price,
              quantity: 1,
            })),
            contactInfo: [
              `name:${fullName}`,
              `email:${contactObj.email}`,
              `phone:${contactObj.phone}`,
              `address:${contactObj.address || ""}`,
              `unit:${contactObj.unit || ""}`,
              `city:${contactObj.city || ""}`,
              `state:${contactObj.state || ""}`,
              `zip:${contactObj.zip || ""}`,
            ],
            arrivalWindow: {
              date: state.arrivalWindow.date.toISOString().split("T")[0],
              time: state.arrivalWindow.time,
            },
            additionalDetails: state.additionalDetails,
            photos: state.photos,
            total: state.getTotalPrice(),
          } satisfies BookingData
        },

        getBookingSummary: () => {
          const s = get()
          const names = s.selectedServices.map((s) => s.name).join(", ")
          return `Services: ${names} | Total: $${s.getTotalPrice()}`
        },

        canSubmit: () => get().validateBooking().isValid && !get().isSubmitting,

        getDebugInfo: () => {
          const s = get()
          return {
            serviceCount: s.selectedServices.length,
            totalPrice: s.getTotalPrice(),
            hasContactInfo: !!s.contactInfo,
            hasArrivalWindow: !!s.arrivalWindow,
            version: s.version,
          }
        },

        exportBookingData: () => JSON.stringify({ ...get(), contactInfo: get().contactInfo }),
        importBookingData: (data) => {
          try {
            const parsed = JSON.parse(data)
            set((state) => {
              state.selectedServices = parsed.selectedServices
              state.contactInfo = parsed.contactInfo
              state.arrivalWindow = parsed.arrivalWindow
                ? { ...parsed.arrivalWindow, date: new Date(parsed.arrivalWindow.date) }
                : null
              state.additionalDetails = parsed.additionalDetails
              state.lastUpdated = Date.now()
            })
          } catch (e: unknown) {
            console.error("Invalid booking data", e)
          }
        },
      })),
      {
        name: "ab-booking-storage",
        storage: createJSONStorage(() => localStorage),
        version: 1,
        // ADDED: Hydration configuration
        partialize: (state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { rehydrated, ...rest } = state
          return rest
        },
        onRehydrateStorage: () => (state, error) => {
          if (state) {
            state.rehydrated = true
          }
          if (error) {
            console.error("Rehydration error:", error)
          }
        },
      }
    )
  )
)
