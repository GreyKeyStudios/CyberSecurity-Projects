"use client"

import { ReactNode, useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
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
  onMaximizeChange?: (maximized: boolean) => void
  canGoBack?: boolean
  canGoForward?: boolean
  onGoBack?: () => void
  onGoForward?: () => void
  /** When true, window is fixed full-screen (for mobile); no drag, single close. */
  fullScreenMobile?: boolean
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
  onMaximizeChange,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  fullScreenMobile = false,
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
    onMaximizeChange?.(!isMaximized)
    onFocus()
  }

  // When window is closed (not just minimized), clear maximized so parent can re-enable desktop scroll.
  // Do not clear maximized on minimize so restoring from taskbar remembers maximized state.

  useEffect(() => {
    return () => { onMaximizeChange?.(false) }
  }, [onMaximizeChange])

  if (isMinimized) return null

  // Mobile full-screen: fixed overlay, no drag, single close, safe area
  if (fullScreenMobile) {
    return (
      <div
        ref={windowRef}
        className="fixed inset-0 z-[99998] flex flex-col bg-card border-0 rounded-none overflow-hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={onFocus}
      >
        {/* Title bar: back/close + title */}
        <div className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${iconColor} border-b border-border shrink-0`}>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="flex items-center justify-center w-10 h-10 -ml-1 rounded-lg hover:bg-black/20 transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <Icon className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold truncate flex-1 min-w-0">{title}</span>
        </div>
        {/* Nav bar if needed */}
        {(onGoBack || onGoForward) && (
          <div className="flex items-center gap-1 px-2 py-2 bg-muted/30 border-b border-border shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onGoBack?.(); }}
              disabled={!canGoBack}
              className={`p-2 rounded-md touch-manipulation ${canGoBack ? 'hover:bg-accent' : 'opacity-30'}`}
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onGoForward?.(); }}
              disabled={!canGoForward}
              className={`p-2 rounded-md touch-manipulation ${canGoForward ? 'hover:bg-accent' : 'opacity-30'}`}
              aria-label="Go forward"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
        {/* Content: scrollable, flex-1 */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 pb-8 bg-card/50">
          {children}
        </div>
      </div>
    )
  }

  const windowEl = (
    <div
      ref={windowRef}
      className={`absolute bg-card border-2 border-border shadow-2xl rounded-lg overflow-hidden ${
        isDragging ? '' : 'transition-all duration-200'
      } ${
        isMaximized ? '!left-0 !top-0 !right-0 !bottom-14' : ''
      }`}
      style={{
        left: isMaximized ? undefined : `${position.x}px`,
        top: isMaximized ? undefined : `${position.y}px`,
        width: isMaximized ? '100%' : 'clamp(400px, 60vw, 900px)',
        height: isMaximized ? 'calc(100vh - 56px)' : undefined,
        maxHeight: isMaximized ? undefined : 'calc(100vh - 200px)',
        zIndex: isMaximized ? 99999 : zIndex,
        cursor: isDragging ? 'grabbing' : 'auto',
        pointerEvents: 'auto',
        isolation: 'isolate'
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
      <div className={`overflow-y-auto p-6 bg-card/50 min-h-0 ${
        isMaximized ? 'h-[calc(100vh-8rem)]' : 'max-h-[calc(100vh-260px)]'
      }`}>
        {children}
      </div>
    </div>
  )

  // When maximized, render into a portal above the desktop so the window reliably receives pointer/scroll
  if (isMaximized && typeof document !== 'undefined') {
    const portalTarget = document.getElementById('window-portal-root')
    if (portalTarget) {
      return createPortal(windowEl, portalTarget)
    }
  }

  return windowEl
}
