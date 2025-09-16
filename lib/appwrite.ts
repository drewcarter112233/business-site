import { Client, Databases, ID, Query, Storage, Models } from "appwrite"
import { sendBookingNotification, EmailBookingData } from "./resend"

export interface ContactInfo {
  name: string
  email: string
  phone: string
  address?: string
}

export interface ArrivalWindow {
  date: string
  time: string
}

export interface BookingService {
  id: string
  name: string
  price: number
  quantity?: number
  description?: string
  duration?: string
}

export interface BookingData {
  services: BookingService[]
  contactInfo: string[]
  arrivalWindow: ArrivalWindow
  additionalDetails?: string
  photos?: string[]
  total: number
}

export interface BookingDocumentRaw extends Models.Document {
  services: string[]
  contact: string[]
  arrival_date: string
  arrival_time: string
  additional_details: string
  photos: string[]
  status: "pending" | "confirmed" | "cancelled"
  total_amount: number
}

export type BookingDocument = Omit<BookingDocumentRaw, "services"> & {
  services: BookingService[]
}

// Configuration validation
const requiredEnvVars = {
  PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  DATABASE_ID: process.env.NEXT_PUBLIC_DATABASE_ID,
  COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NAME,
  BUCKET_ID: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
} as const

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`Missing required environment variable: NEXT_PUBLIC_${key}`)
  }
}

// Initialize Appwrite client
const createAppwriteClient = () => {
  try {
    const client = new Client()
      .setEndpoint("https://nyc.cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    return client
  } catch (error) {
    console.error("Failed to initialize Appwrite client:", error)
    throw new Error("Appwrite client initialization failed")
  }
}

const client = createAppwriteClient()
const databases = new Databases(client)
const storage = new Storage(client)

const DATABASE_ID = requiredEnvVars.DATABASE_ID!
const BOOKINGS_COLLECTION_ID = requiredEnvVars.COLLECTION_ID!
const PHOTOS_BUCKET_ID = requiredEnvVars.BUCKET_ID!

// Helpers
const validateBase64Image = (dataUrl: string): boolean => {
  if (!dataUrl || typeof dataUrl !== "string") return false
  const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/
  return base64Pattern.test(dataUrl)
}

const convertBase64ToFile = (dataUrl: string, filename: string): File => {
  try {
    const [header, base64Data] = dataUrl.split(",")
    if (!base64Data) throw new Error("Invalid base64 data format")

    const mimeMatch = header.match(/data:([^;]+);/)
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png"

    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return new File([bytes], filename, { type: mimeType })
  } catch (error) {
    throw new Error(
      `Failed to convert base64 to file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }
}

const generateUniqueFilename = (extension = "png"): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 10)
  return `photo-${timestamp}-${random}.${extension}`
}

const validateBookingData = (data: BookingData): void => {
  const errors: string[] = []

  if (!data.services || data.services.length === 0) {
    errors.push("At least one service must be selected")
  }

  if (!data.contactInfo || !Array.isArray(data.contactInfo)) {
    errors.push("Contact information is required")
  } else {
    const contactObj: Record<string, string> = {}
    data.contactInfo.forEach((entry) => {
      const [key, value] = entry.split(":")
      contactObj[key] = value
    })

    const hasName =
      contactObj.name?.trim() || (contactObj.firstName?.trim() && contactObj.lastName?.trim())

    if (!hasName) errors.push("Contact name is required")
    if (!contactObj.email?.trim()) errors.push("Contact email is required")
    if (!contactObj.phone?.trim()) errors.push("Contact phone is required")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (contactObj.email && !emailRegex.test(contactObj.email)) {
      errors.push("Invalid email format")
    }
  }

  if (!data.arrivalWindow || typeof data.arrivalWindow !== "object") {
    errors.push("Arrival window is required")
  } else {
    const { date, time } = data.arrivalWindow
    if (!date?.trim()) errors.push("Arrival date is required")
    if (!time?.trim()) errors.push("Arrival time is required")
    if (date && isNaN(Date.parse(date))) {
      errors.push("Invalid arrival date format")
    }
  }

  if (typeof data.total !== "number" || data.total < 0) {
    errors.push("Valid total amount is required")
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`)
  }
}

// Transform helper
const parseBookingDocument = (booking: BookingDocumentRaw): BookingDocument => ({
  ...booking,
  services: booking.services.map((s: string) => JSON.parse(s) as BookingService),
})

// Main functions
export const createBooking = async (data: BookingData): Promise<string> => {
  try {
    if (!DATABASE_ID || !BOOKINGS_COLLECTION_ID || !PHOTOS_BUCKET_ID) {
      throw new Error("Missing required configuration. Please check your environment variables.")
    }

    validateBookingData(data)

    const photoIds: string[] = []

    if (data.photos?.length) {
      for (let i = 0; i < data.photos.length; i++) {
        const photo = data.photos[i]
        try {
          if (!validateBase64Image(photo)) {
            console.warn(`Skipping invalid photo at index ${i}`)
            continue
          }
          const filename = generateUniqueFilename()
          const file = convertBase64ToFile(photo, filename)
          const uploadResponse = await storage.createFile(PHOTOS_BUCKET_ID, ID.unique(), file)
          photoIds.push(uploadResponse.$id)
        } catch (photoError) {
          console.error(`Error uploading photo ${i}:`, photoError)
        }
      }
    }

    const docData = {
      services: data.services.map((s) => JSON.stringify(s)),
      contact: data.contactInfo,
      arrival_date: new Date(data.arrivalWindow.date).toISOString(),
      arrival_time: data.arrivalWindow.time,
      additional_details: data.additionalDetails || "",
      photos: photoIds,
      status: "pending" as const,
      total_amount: data.total,
    }

    const response = await databases.createDocument(
      DATABASE_ID,
      BOOKINGS_COLLECTION_ID,
      ID.unique(),
      docData
    )

    try {
      const emailBookingData: EmailBookingData = {
        ...data,
        bookingId: response.$id,
        createdAt: response.$createdAt,
      }
      await sendBookingNotification(emailBookingData)
    } catch (emailError) {
      console.error("Email notification error (booking still successful):", emailError)
    }

    return response.$id
  } catch (error) {
    console.error("Booking creation failed:", error)
    throw new Error(
      `Failed to create booking: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export const listBookings = async (): Promise<BookingDocument[]> => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, BOOKINGS_COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
    ])

    const docs = response.documents as unknown as BookingDocumentRaw[]
    const parsed: BookingDocument[] = docs.map(parseBookingDocument)

    return parsed
  } catch (error) {
    console.error("Error fetching bookings:", error)
    throw new Error(
      `Failed to fetch bookings: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export const getBookingById = async (id: string): Promise<BookingDocument> => {
  try {
    if (!id) throw new Error("Valid booking ID is required")
    const response = await databases.getDocument(DATABASE_ID, BOOKINGS_COLLECTION_ID, id)
    return parseBookingDocument(response as unknown as BookingDocumentRaw)
  } catch (error) {
    console.error("Error fetching booking:", error)
    throw new Error(
      `Failed to fetch booking: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export const getPhotoUrl = (fileId: string): string =>
  storage.getFileView(PHOTOS_BUCKET_ID, fileId).toString()

export const getPhotoPreviewUrl = (fileId: string, width = 400, height = 400): string =>
  storage.getFilePreview(PHOTOS_BUCKET_ID, fileId, width, height).toString()

export const updateBookingStatus = async (
  id: string,
  status: "confirmed" | "cancelled"
): Promise<BookingDocument> => {
  try {
    if (!id) throw new Error("Valid booking ID is required")
    if (!status) throw new Error("Status must be either 'confirmed' or 'cancelled'")

    const response = await databases.updateDocument(DATABASE_ID, BOOKINGS_COLLECTION_ID, id, {
      status,
    })

    return parseBookingDocument(response as unknown as BookingDocumentRaw)
  } catch (error) {
    console.error("Error updating booking status:", error)
    throw new Error(
      `Failed to update booking status: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    if (!id) throw new Error("Valid booking ID is required")

    const booking = await getBookingById(id)
    if (booking.photos?.length) {
      for (const photoId of booking.photos) {
        try {
          await storage.deleteFile(PHOTOS_BUCKET_ID, photoId)
        } catch (photoError) {
          console.warn(`Failed to delete photo ${photoId}:`, photoError)
        }
      }
    }

    await databases.deleteDocument(DATABASE_ID, BOOKINGS_COLLECTION_ID, id)
  } catch (error) {
    console.error("Error deleting booking:", error)
    throw new Error(
      `Failed to delete booking: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export const getStorageInfo = async () => {
  try {
    const files = await storage.listFiles(PHOTOS_BUCKET_ID)
    return {
      total: files.total,
      files: files.files,
      bucketId: PHOTOS_BUCKET_ID,
    }
  } catch (error) {
    console.error("Storage bucket error:", error)
    throw new Error(
      `Failed to access storage: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}
