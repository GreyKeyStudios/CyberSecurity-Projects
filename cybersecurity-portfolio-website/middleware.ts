import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/** When host is OS subdomain (e.g. os.greykeystudios.dev), send root to /resources (splash). */
export function middleware(request: NextRequest) {
  const host = request.nextUrl.hostname
  const isOsSubdomain = host.startsWith("os.")
  if (isOsSubdomain && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/resources", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/",
}
