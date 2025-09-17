import { Client, TablesDB, ID, Query, Storage, Models } from "appwrite"
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

export interface BookingDocumentRaw extends Models.Row {
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

const requiredEnvVars = {
  PROJECT_ID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  DATABASE_ID: process.env.NEXT_PUBLIC_DATABASE_ID,
  COLLECTION_ID: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_NAME,
  BUCKET_ID: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
  ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1",
} as const

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.warn(`Missing required environment variable: NEXT_PUBLIC_${key}`)
  }
}

const createAppwriteClient = () => {
  try {
    const client = new Client()
      .setEndpoint(requiredEnvVars.ENDPOINT)
      .setProject(requiredEnvVars.PROJECT_ID!)
    return client
  } catch (err) {
    console.error("Failed to initialize Appwrite client:", err)
    throw new Error("Appwrite client initialization failed")
  }
}

const client = createAppwriteClient()
const tables = new TablesDB(client)
const storage = new Storage(client)

const DATABASE_ID = requiredEnvVars.DATABASE_ID!
const BOOKINGS_TABLE_ID = requiredEnvVars.COLLECTION_ID!
const PHOTOS_BUCKET_ID = requiredEnvVars.BUCKET_ID!

const validateBase64Image = (dataUrl: string): boolean => {
  if (!dataUrl || typeof dataUrl !== "string") return false
  const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/
  return base64Pattern.test(dataUrl)
}

const convertBase64ToFile = (
  dataUrl: string,
  filename: string
): File | { buffer: Buffer; mimeType: string; filename: string } => {
  const [header, base64Data] = dataUrl.split(",")
  if (!base64Data) throw new Error("Invalid base64 data format")

  const mimeMatch = header.match(/data:([^;]+);/)
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png"

  // Browser environment -> return File
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    // File is available in browser
    return new File([bytes], filename, { type: mimeType })
  }

  // Node / server environment -> return Buffer wrapper
  const buffer = Buffer.from(base64Data, "base64")
  return { buffer, mimeType, filename }
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
      // prevent adding undefined keys
      if (key && value !== undefined) contactObj[key] = value
    })

    const hasName =
      !!contactObj.name?.trim() || (!!contactObj.firstName?.trim() && !!contactObj.lastName?.trim())

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

const parseBookingDocument = (booking: BookingDocumentRaw): BookingDocument => ({
  ...booking,
  services: booking.services.map((s: string) => JSON.parse(s) as BookingService),
})

export const getPhotoUrl = (fileId: string, fallback = ""): string => {
  try {
    return storage
      .getFileView({
        bucketId: PHOTOS_BUCKET_ID,
        fileId,
      })
      .toString()
  } catch (error) {
    console.error("getPhotoUrl error", error)
    return fallback
  }
}

export const getPhotoPreviewUrl = (fileId: string, width = 400, height = 400): string => {
  try {
    return storage
      .getFilePreview({
        bucketId: PHOTOS_BUCKET_ID,
        fileId,
        width,
        height,
      })
      .toString()
  } catch (error) {
    console.error("getPhotoPreviewUrl error", error)
    return ""
  }
}

export const createBooking = async (data: BookingData): Promise<string> => {
  try {
    if (!DATABASE_ID || !BOOKINGS_TABLE_ID || !PHOTOS_BUCKET_ID) {
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

          // generate filename and convert
          const extensionMatch = photo.match(/^data:image\/([^;]+);/)
          const extension = extensionMatch ? extensionMatch[1] : "png"
          const filename = generateUniqueFilename(extension)
          const converted = convertBase64ToFile(photo, filename)

          if (typeof window !== "undefined" && converted instanceof File) {
            const uploadResponse = await storage.createFile({
              bucketId: PHOTOS_BUCKET_ID,
              fileId: ID.unique(),
              file: converted,
            })
            photoIds.push(uploadResponse.$id)
          } else {
            const nodeFile = converted as { buffer: Buffer; mimeType: string; filename: string }
            const file = new File([new Uint8Array(nodeFile.buffer)], nodeFile.filename, {
              type: nodeFile.mimeType,
              lastModified: Date.now(),
            })
            const uploadResponse = await storage.createFile({
              bucketId: PHOTOS_BUCKET_ID,
              fileId: ID.unique(),
              file,
            })
            photoIds.push(uploadResponse.$id)
          }
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

    const response = await tables.createRow({
      databaseId: DATABASE_ID,
      tableId: BOOKINGS_TABLE_ID,
      rowId: ID.unique(),
      data: docData,
    })

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
    const response = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: BOOKINGS_TABLE_ID,
      queries: [Query.orderDesc("$createdAt")],
    })

    const docs = response.rows as unknown as BookingDocumentRaw[]
    return docs.map(parseBookingDocument)
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
    const response = await tables.getRow({
      databaseId: DATABASE_ID,
      tableId: BOOKINGS_TABLE_ID,
      rowId: id,
    })
    return parseBookingDocument(response as unknown as BookingDocumentRaw)
  } catch (error) {
    console.error("Error fetching booking:", error)
    throw new Error(
      `Failed to fetch booking: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export const updateBookingStatus = async (
  id: string,
  status: "confirmed" | "cancelled"
): Promise<BookingDocument> => {
  if (!id) {
    throw new Error("Valid booking ID is required")
  }

  try {
    const response = await tables.updateRow({
      databaseId: DATABASE_ID,
      tableId: BOOKINGS_TABLE_ID,
      rowId: id,
      data: { status },
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
          await storage.deleteFile({
            bucketId: PHOTOS_BUCKET_ID,
            fileId: photoId,
          })
        } catch (photoError) {
          // continue even if photo deletion fails
          console.warn(`Failed to delete photo ${photoId}:`, photoError)
        }
      }
    }

    await tables.deleteRow({
      databaseId: DATABASE_ID,
      tableId: BOOKINGS_TABLE_ID,
      rowId: id,
    })
  } catch (error) {
    console.error("Error deleting booking:", error)
    throw new Error(
      `Failed to delete booking: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}

export const getStorageInfo = async () => {
  try {
    const files = await storage.listFiles({
      bucketId: PHOTOS_BUCKET_ID,
    })
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
