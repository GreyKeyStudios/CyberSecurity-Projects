"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ScreenshotGalleryProps {
  screenshots: string[]
  githubPath: string
  projectTitle: string
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main"

export function ScreenshotGallery({ screenshots, githubPath, projectTitle }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (screenshots.length === 0) {
    return null
  }

  const getImageUrl = (screenshot: string) => {
    // Handle both relative paths and full URLs
    if (screenshot.startsWith("http")) {
      return screenshot
    }
    // Remove leading slash if present
    const cleanPath = screenshot.startsWith("/") ? screenshot.slice(1) : screenshot
    return `${GITHUB_RAW_BASE}/${githubPath}${cleanPath}`
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedIndex === null) return
    
    if (direction === "prev") {
      setSelectedIndex(selectedIndex === 0 ? screenshots.length - 1 : selectedIndex - 1)
    } else {
      setSelectedIndex(selectedIndex === screenshots.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className="group relative aspect-video rounded-lg border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => openLightbox(index)}
          >
            <img
              src={getImageUrl(screenshot)}
              alt={`${projectTitle} screenshot ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
            <div className="relative w-full h-[90vh] flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
                onClick={closeLightbox}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Previous Button */}
              {screenshots.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => navigateImage("prev")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              )}

              {/* Image */}
              <img
                src={getImageUrl(screenshots[selectedIndex])}
                alt={`${projectTitle} screenshot ${selectedIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Next Button */}
              {screenshots.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => navigateImage("next")}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                {selectedIndex + 1} / {screenshots.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
