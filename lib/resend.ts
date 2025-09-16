"use server"

import { Resend } from "resend"
import { BookingData } from "@/lib/appwrite"

// Initialize Resend
const resendApi = process.env.RESEND_API_KEY
const resend = new Resend(resendApi)

export interface EmailBookingData extends BookingData {
  bookingId: string
  createdAt: string
}

// Helper to parse contact info
const parseContactInfo = (info: string[]) => {
  const map: Record<string, string> = {}
  info.forEach((entry) => {
    const [key, value] = entry.split(":")
    map[key] = value
  })
  return map
}

// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Generate HTML email template
const generateBookingEmailHTML = (booking: EmailBookingData): string => {
  const contact = parseContactInfo(booking.contactInfo)
  const subtotal = booking.services.reduce((sum, service) => sum + service.price, 0)
  const tax = 0 // Adjust as needed
  const total = subtotal + tax

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .header {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .booking-id {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 10px;
          font-size: 14px;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        .info-item {
          background-color: #f1f5f9;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        .info-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          color: #1e293b;
          font-weight: 500;
        }
        .service-item {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
        }
        .service-header {
          display: flex;
          justify-content: between;
          align-items: start;
          margin-bottom: 10px;
        }
        .service-name {
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
        }
        .service-price {
          font-size: 20px;
          font-weight: bold;
          color: #059669;
        }
        .service-description {
          color: #64748b;
          margin-bottom: 8px;
        }
        .service-duration {
          color: #6b7280;
          font-size: 14px;
        }
        .pricing-summary {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }
        .pricing-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
        }
        .pricing-total {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
        }
        .status-badge {
          background-color: #fef3c7;
          color: #d97706;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          display: inline-block;
        }
        .additional-details {
          background-color: #fef7ff;
          border: 1px solid #e9d5ff;
          border-radius: 8px;
          padding: 20px;
          margin-top: 15px;
        }
        .footer {
          text-align: center;
          color: #64748b;
          font-size: 14px;
          margin-top: 30px;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
        }
        .alert {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .alert-text {
          color: #dc2626;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .header, .content {
            padding: 20px;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Booking Received</h1>
        <div class="booking-id">Booking ID: ${booking.bookingId}</div>
      </div>

      <div class="content">
        <div class="section">
          <div class="section-title">📋 Booking Status</div>
          <span class="status-badge">Pending Confirmation</span>
          <div style="margin-top: 10px; color: #64748b;">
            Booking received on ${new Date(booking.createdAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div class="section">
          <div class="section-title">📅 Appointment Details</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Date</div>
              <div class="info-value">${formatDate(booking.arrivalWindow.date)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Time</div>
              <div class="info-value">${booking.arrivalWindow.time}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">👤 Customer Information</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Name</div>
              <div class="info-value">${contact.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${contact.email}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone</div>
              <div class="info-value">${contact.phone}</div>
            </div>
          </div>
          
          ${
            contact.address
              ? `
          <div class="info-item" style="margin-top: 15px;">
            <div class="info-label">Service Address</div>
            <div class="info-value">
              ${contact.address}${contact.unit ? `, ${contact.unit}` : ""}<br>
              ${contact.city}, ${contact.state} ${contact.zip}
            </div>
          </div>
          `
              : ""
          }
        </div>

        <div class="section">
          <div class="section-title">🧹 Selected Services</div>
          ${booking.services
            .map(
              (service) => `
            <div class="service-item">
              <div class="service-header">
                <div>
                  <div class="service-name">${service.name}</div>
                  ${
                    service.description
                      ? `<div class="service-description">${service.description}</div>`
                      : ""
                  }
                  ${
                    service.duration
                      ? `<div class="service-duration">⏱️ Duration: ${service.duration}</div>`
                      : ""
                  }
                </div>
                <div class="service-price">${formatCurrency(service.price)}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="section">
          <div class="section-title">💰 Pricing Summary</div>
          <div class="pricing-summary">
            <div class="pricing-row">
              <span>Subtotal:</span>
              <span><strong>${formatCurrency(subtotal)}</strong></span>
            </div>
            <div class="pricing-row">
              <span>Tax:</span>
              <span><strong>${formatCurrency(tax)}</strong></span>
            </div>
            <div class="pricing-total">
              <div class="pricing-row" style="margin-bottom: 0;">
                <span style="font-size: 18px;"><strong>Total Amount:</strong></span>
                <span style="font-size: 24px;"><strong>${formatCurrency(total)}</strong></span>
              </div>
            </div>
          </div>
        </div>

        ${
          booking.additionalDetails
            ? `
        <div class="section">
          <div class="section-title">📝 Additional Details</div>
          <div class="additional-details">
            ${booking.additionalDetails.replace(/\n/g, "<br>")}
          </div>
        </div>
        `
            : ""
        }

        ${
          booking.photos && booking.photos.length > 0
            ? `
        <div class="section">
          <div class="section-title">📸 Reference Photos</div>
          <div style="color: #64748b; font-style: italic;">
            ${booking.photos.length} photo${
                booking.photos.length !== 1 ? "s" : ""
              } uploaded by customer
          </div>
        </div>
        `
            : ""
        }

        <div class="alert">
          <div class="alert-text">
            ⚠️ This booking requires confirmation. Please contact the customer to confirm the appointment details.
          </div>
        </div>
      </div>

      <div class="footer">
        <p><strong>AB Carpet Cleaning</strong></p>
        <p>This is an automated notification from booking system.</p>
        <p style="font-size: 12px; color: #9ca3af;">
          Copyright © ${new Date().getFullYear()} Web Nurture. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `
}

// Generate plain text email
const generateBookingEmailText = (booking: EmailBookingData): string => {
  const contact = parseContactInfo(booking.contactInfo)
  const subtotal = booking.services.reduce((sum, service) => sum + service.price, 0)
  const tax = 0
  const total = subtotal + tax

  return `
NEW BOOKING RECEIVED - HOFFMAN CLEANING

Booking ID: ${booking.bookingId}
Status: Pending Confirmation
Received: ${new Date(booking.createdAt).toLocaleString()}

APPOINTMENT DETAILS
Date: ${formatDate(booking.arrivalWindow.date)}
Time: ${booking.arrivalWindow.time}

CUSTOMER INFORMATION
Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone}
${
  contact.address
    ? `
Address: ${contact.address}${contact.unit ? `, ${contact.unit}` : ""}
         ${contact.city}, ${contact.state} ${contact.zip}
`
    : ""
}

SELECTED SERVICES
${booking.services
  .map(
    (service, index) => `
${index + 1}. ${service.name} - ${formatCurrency(service.price)}
   ${service.description || ""}
   ${service.duration ? `Duration: ${service.duration}` : ""}
`
  )
  .join("")}

PRICING SUMMARY
Subtotal: ${formatCurrency(subtotal)}
Tax: ${formatCurrency(tax)}
Total: ${formatCurrency(total)}

${
  booking.additionalDetails
    ? `
ADDITIONAL DETAILS
${booking.additionalDetails}
`
    : ""
}

${
  booking.photos && booking.photos.length > 0
    ? `
PHOTOS
${booking.photos.length} reference photo${booking.photos.length !== 1 ? "s" : ""} uploaded
`
    : ""
}

⚠️ This booking requires confirmation. Please contact the customer to confirm the appointment details.

---
AB Carpet Cleaning 
Automated Booking Notification
  `
}

// Send booking confirmation email to admin
export const sendBookingNotification = async (
  bookingData: EmailBookingData
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Validate required environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is required")
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL environment variable is required")
    }

    const contact = parseContactInfo(bookingData.contactInfo)

    const emailData = {
      from: "onboarding@resend.dev",
      to: [process.env.ADMIN_EMAIL],
      subject: `New Booking: ${contact.name} - ${formatDate(bookingData.arrivalWindow.date)}`,
      html: generateBookingEmailHTML(bookingData),
      text: generateBookingEmailText(bookingData),
      tags: [
        {
          name: "category",
          value: "booking-notification",
        },
        {
          name: "booking-id",
          value: bookingData.bookingId,
        },
      ],
    }

    const { data, error } = await resend.emails.send(emailData)

    if (error) {
      console.error("Resend email error:", error)
      return {
        success: false,
        error: error.message || "Failed to send email notification",
      }
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error("Error sending booking notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
