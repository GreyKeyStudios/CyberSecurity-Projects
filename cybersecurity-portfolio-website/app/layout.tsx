import React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: 'Michael Walton - Cybersecurity Portfolio',
  description: 'Cybersecurity portfolio by Michael Walton demonstrating SOC analyst skills including Splunk log analysis, threat intelligence automation, and incident investigation workflows. 9+ years IT support experience (10 years in March 2026), Security+ and CCST Cybersecurity certified.',
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
