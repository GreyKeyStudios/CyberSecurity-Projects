import React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

const siteUrl = "https://soc.greykeystudios.dev"

export const metadata: Metadata = {
  title: {
    default: "Michael Walton - Cybersecurity Portfolio",
    template: "%s | Michael Walton",
  },
  description: "Cybersecurity portfolio by Michael Walton demonstrating SOC analyst skills including Splunk log analysis, threat intelligence automation, and incident investigation workflows. Security+ and CCST Cybersecurity certified.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Michael Walton - Cybersecurity Portfolio",
    title: "Michael Walton - Cybersecurity Portfolio",
    description: "SOC Analyst portfolio showcasing hands-on security analysis skills including Splunk log analysis, threat intelligence automation, and incident investigation workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Michael Walton - Cybersecurity Portfolio",
    description: "SOC Analyst portfolio showcasing hands-on security analysis skills including Splunk log analysis, threat intelligence automation, and incident investigation workflows.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
