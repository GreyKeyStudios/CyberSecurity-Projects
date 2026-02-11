"use client"

import { ReactNode, useState, useRef, useEffect } from "react"
import { X, Minimize2, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"

interface DesktopWindowProps {
  id: string
  title: string
  icon: React.ElementType
  iconColor: string
  children: ReactNode
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
  zIndex: number
  onFocus: () => void
  canGoBack?: boolean
  canGoForward?: boolean
  onGoBack?: () => void
  onGoForward?: () => void
}

export function DesktopWindow({
  id,
  title,
  icon: Icon,
  iconColor,
  children,
  onClose,
  onMinimize,
  isMinimized,
  zIndex,
  onFocus,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward
}: DesktopWindowProps) {
  const [position, setPosition] = useState({
    x: Math.random() * 200 + 100,
    y: Math.random() * 80 + 40
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        
        const monitor = document.getElementById('desktop-monitor')
        if (!monitor || !windowRef.current) return
        
        const monitorRect = monitor.getBoundingClientRect()
        const windowRect = windowRef.current.getBoundingClientRect()
        
        // Calculate new position relative to monitor
        let newX = position.x + deltaX
        let newY = position.y + deltaY
        
        // Constrain to monitor boundaries (full viewport)
        const minY = 0
        const maxY = monitorRect.height - 56 - 40 // 56px for taskbar, 40px for title bar
        const minX = -windowRect.width + 100 // Allow partial off-screen but keep some visible
        const maxX = monitorRect.width - 100
        
        newX = Math.max(minX, Math.min(maxX, newX))
        newY = Math.max(minY, Math.min(maxY, newY))
        
        setPosition({ x: newX, y: newY })
        setDragStart({ x: e.clientX, y: e.clientY })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart, position])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    onFocus()
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    onFocus()
  }

  if (isMinimized) return null

  return (
    <div
      ref={windowRef}
      className={`absolute bg-card border-2 border-border shadow-2xl rounded-lg overflow-hidden ${
        isDragging ? '' : 'transition-all duration-200'
      } ${
        isMaximized ? '!left-4 !top-4 !right-4 !bottom-[60px]' : ''
      }`}
      style={{
        left: isMaximized ? undefined : `${position.x}px`,
        top: isMaximized ? undefined : `${position.y}px`,
        width: isMaximized ? 'calc(100% - 32px)' : 'clamp(400px, 60vw, 900px)',
        maxHeight: isMaximized ? 'calc(100vh - 80px)' : 'calc(100vh - 200px)',
        zIndex: zIndex,
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 bg-gradient-to-r ${iconColor} border-b border-border cursor-grab active:cursor-grabbing select-none`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {/* Traffic Lights */}
          <div className="flex gap-1.5 mr-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center group"
              aria-label="Close"
              title="Close"
            >
              <X className="h-2.5 w-2.5 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMinimize()
              }}
              className="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer flex items-center justify-center group"
              aria-label="Minimize"
              title="Minimize"
            >
              <Minimize2 className="h-2.5 w-2.5 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleMaximize()
              }}
              className="w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center group"
              aria-label="Maximize"
              title="Maximize"
            >
              <Maximize2 className="h-2.5 w-2.5 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <Icon className="h-4 w-4" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
      </div>

      {/* Navigation Bar (Browser-style) */}
      {(onGoBack || onGoForward) && (
        <div className="flex items-center gap-1 px-2 py-1.5 bg-muted/30 border-b border-border">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onGoBack?.()
            }}
            disabled={!canGoBack}
            className={`p-1.5 rounded-md transition-colors ${
              canGoBack 
                ? 'hover:bg-accent cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Go back"
            title="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onGoForward?.()
            }}
            disabled={!canGoForward}
            className={`p-1.5 rounded-md transition-colors ${
              canGoForward 
                ? 'hover:bg-accent cursor-pointer' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            aria-label="Go forward"
            title="Go forward"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Window Content */}
      <div className={`overflow-y-auto p-6 bg-card/50 ${
        isMaximized ? 'h-[calc(100vh-140px)]' : 'max-h-[calc(100vh-260px)]'
      }`}>
        {children}
      </div>
    </div>
  )
}
