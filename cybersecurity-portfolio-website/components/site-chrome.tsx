"use client"

import { useState, useEffect } from "react"

/** Wraps Navbar/Footer and hides them on os.* subdomain (client-side only, for static export). */
export function SiteChrome({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode
  navbar: React.ReactNode
  footer: React.ReactNode
}) {
  const [showChrome, setShowChrome] = useState(true)

  useEffect(() => {
    const host = typeof window !== "undefined" ? window.location.hostname : ""
    setShowChrome(!host.startsWith("os."))
  }, [])

  return (
    <>
      {showChrome && navbar}
      {children}
      {showChrome && footer}
    </>
  )
}
