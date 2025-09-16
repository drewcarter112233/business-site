import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ success: true })

  // Clear cookie by setting it to empty and expired
  res.cookies.set({
    name: process.env.AUTH_COOKIE_NAME!,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // expire immediately
  })

  return res
}
