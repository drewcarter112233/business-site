import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { password } = await req.json()

  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true })

    // Set secure cookie
    res.cookies.set({
      name: process.env.AUTH_COOKIE_NAME!,
      value: process.env.AUTH_COOKIE_VALUE!,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })

    return res
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
