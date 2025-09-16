import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin/dashboard
  if (pathname.startsWith("/admin/dashboard")) {
    const cookie = req.cookies.get(process.env.AUTH_COOKIE_NAME!)

    if (!cookie || cookie.value !== process.env.AUTH_COOKIE_VALUE) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
}
