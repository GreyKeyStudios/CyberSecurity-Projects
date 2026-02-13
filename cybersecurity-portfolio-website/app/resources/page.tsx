"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Shield, Zap, Compass, FileText, Wrench, BookOpen, FlaskConical, Code2, Briefcase, ExternalLink, ArrowRight, ArrowLeft, Github, X, Monitor, Menu, Power, Sparkles, Target, FolderOpen, ClipboardList, GraduationCap, Radio, Terminal as TerminalIcon, Package, BookA, Dumbbell, Gamepad2, Map, LogIn, BookMarked, FolderDown, Ticket, FolderCog, BarChart2, Globe, CheckSquare, Bell, Image as ImageIcon, Lock, ScrollText, Layers, Plus, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DesktopWindow } from "@/components/desktop-window"
import { AppIntro } from "@/components/app-intro"
import { MarkdownContent } from "@/components/markdown-content"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { UserMenu } from "@/components/auth/user-menu"
import { createClient } from "@/lib/supabase/client"
import { useIsMobile } from "@/hooks/use-mobile"
import { User } from "@supabase/supabase-js"
import resourcesData from "@/data/resources.json"
import projectsData from "@/data/projects.json"

const GITHUB_BASE_URL = "https://github.com/GreyKeyStudios/CyberSecurity-Projects"
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main"

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

const DESKTOP_WIDTH = 1920
const DESKTOP_HEIGHT = 1080
const DESKTOP_ICON_ORDER_KEY = "soc-os-desktop-icon-order"
const DESKTOP_ICON_SIZE_KEY = "soc-os-desktop-icon-size"
const DESKTOP_THEME_KEY = "soc-os-desktop-theme"

type DesktopThemeId = "default" | "emerald" | "synth" | "mono"
const DESKTOP_THEMES: Record<DesktopThemeId, { label: string; wallpaper: string; overlayClass: string }> = {
  default: { label: "Default (Midnight)", wallpaper: "/mockdesktopbackground.png", overlayClass: "bg-black/30" },
  emerald: { label: "Emerald Ops", wallpaper: "/mockdesktopbackground.png", overlayClass: "bg-emerald-950/35" },
  synth: { label: "Synthwave", wallpaper: "/mockdesktopbackground.png", overlayClass: "bg-fuchsia-950/35" },
  mono: { label: "Monochrome", wallpaper: "/mockdesktopbackground.png", overlayClass: "bg-slate-950/45" },
}

interface WindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  navigationStack: string[]
  currentNavIndex: number
}

function DesktopTaskbarClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })
  const date = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  return (
    <div className="text-right text-xs text-white/90 font-mono shrink-0 px-2">
      <div>{time}</div>
      <div className="text-white/60">{date}</div>
    </div>
  )
}

function JumpScareOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 1800)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black animate-in fade-in duration-75"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      aria-label="Close"
    >
      <div className="text-white text-9xl font-black select-none animate-in zoom-in duration-150">
        👻 BOO!
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const { quickStart, templates, cheatSheets, tools, labs, codeExamples, interviewPrep, caseFiles, playbooks, secPlusVault, threatFeed, cliCommands, cliSyntaxGuide, toolbox, glossary, skillDrills, certPath, miniGames, labFiles, tickets, logSamples = [], behavioralBank = [], technicalTrivia = [], appIntros = {}, projectsWalkthrough, projectWalkthroughs = {}, runbooks = [] } = resourcesData
  const isMobile = useIsMobile()
  const [isVMActive, setIsVMActive] = useState(false)
  const [showLoginScreen, setShowLoginScreen] = useState(false)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [desktopTheme, setDesktopTheme] = useState<DesktopThemeId>("default")
  const supabase = createClient()

  // Prevent body scroll when VM is active
  useEffect(() => {
    if (isVMActive) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isVMActive])

  // Check for user session and set up auth listener
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const desktopIcons = [
    // Row 1: Onboarding & Daily Use
    { id: "start-here", label: "Start Here", icon: Sparkles, color: "text-emerald-500", bgColor: "bg-emerald-500/10", titleBar: "from-emerald-500/20 to-emerald-600/20" },
    { id: "missions", label: "Missions", icon: Target, color: "text-sky-500", bgColor: "bg-sky-500/10", titleBar: "from-sky-500/20 to-sky-600/20" },
    { id: "quick-start", label: "Learning Paths", icon: Compass, color: "text-green-500", bgColor: "bg-green-500/10", titleBar: "from-green-500/20 to-green-600/20" },
    
    // Row 2: Documentation & Resources
    { id: "templates", label: "Templates", icon: FileText, color: "text-blue-500", bgColor: "bg-blue-500/10", titleBar: "from-blue-500/20 to-blue-600/20" },
    { id: "case-files", label: "Case Files", icon: FolderOpen, color: "text-violet-500", bgColor: "bg-violet-500/10", titleBar: "from-violet-500/20 to-violet-600/20" },
    { id: "playbooks", label: "Playbooks", icon: ClipboardList, color: "text-rose-500", bgColor: "bg-rose-500/10", titleBar: "from-rose-500/20 to-rose-600/20" },
    { id: "cheat-sheets", label: "Quick Reference", icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-500/10", titleBar: "from-purple-500/20 to-purple-600/20" },
    
    // Row 3: Tools & Reference
    { id: "tools", label: "Daily Tools", icon: Wrench, color: "text-cyan-500", bgColor: "bg-cyan-500/10", titleBar: "from-cyan-500/20 to-cyan-600/20" },
    { id: "log-viewer", label: "Log Viewer", icon: ScrollText, color: "text-amber-600", bgColor: "bg-amber-600/10", titleBar: "from-amber-600/20 to-amber-700/20" },
    { id: "cli-cheats", label: "CLI Cheats", icon: Code2, color: "text-[#4e7cf6]", bgColor: "bg-[#4e7cf6]/10", titleBar: "from-[#4e7cf6]/20 to-[#4e7cf6]/30" },
    { id: "glossary", label: "SOC Dictionary", icon: BookA, color: "text-fuchsia-500", bgColor: "bg-fuchsia-500/10", titleBar: "from-fuchsia-500/20 to-fuchsia-600/20" },
    { id: "ioc-helper", label: "IOC Helper", icon: Shield, color: "text-red-500", bgColor: "bg-red-500/10", titleBar: "from-red-500/20 to-red-600/20" },
    
    // Row 4: Training & Practice
    { id: "labs", label: "Practice Labs", icon: FlaskConical, color: "text-pink-500", bgColor: "bg-pink-500/10", titleBar: "from-pink-500/20 to-pink-600/20" },
    { id: "projects", label: "Projects", icon: Layers, color: "text-sky-600", bgColor: "bg-sky-600/10", titleBar: "from-sky-600/20 to-sky-700/20" },
    { id: "code-examples", label: "Automation Scripts", icon: Code2, color: "text-orange-500", bgColor: "bg-orange-500/10", titleBar: "from-orange-500/20 to-orange-600/20" },
    { id: "threat-feed", label: "Intel Feed", icon: Radio, color: "text-teal-500", bgColor: "bg-teal-500/10", titleBar: "from-teal-500/20 to-teal-600/20" },
    { id: "toolbox", label: "Toolbox", icon: Package, color: "text-slate-400", bgColor: "bg-slate-400/10", titleBar: "from-slate-400/20 to-slate-500/20" },
    
    // Row 4: Skill Building
    { id: "skill-drills", label: "Skill Drills", icon: Dumbbell, color: "text-emerald-400", bgColor: "bg-emerald-400/10", titleBar: "from-emerald-400/20 to-emerald-500/20" },
    { id: "games", label: "Games", icon: Gamepad2, color: "text-pink-400", bgColor: "bg-pink-400/10", titleBar: "from-pink-400/20 to-pink-500/20" },
    
    // Row 5: Practice & Training
    { id: "soc-journal", label: "SOC Journal", icon: BookMarked, color: "text-purple-400", bgColor: "bg-purple-400/10", titleBar: "from-purple-400/20 to-purple-500/20" },
    { id: "tickets", label: "Tickets", icon: Ticket, color: "text-orange-400", bgColor: "bg-orange-400/10", titleBar: "from-orange-400/20 to-orange-500/20" },
    { id: "lab-files", label: "Lab Files", icon: FolderDown, color: "text-cyan-400", bgColor: "bg-cyan-400/10", titleBar: "from-cyan-400/20 to-cyan-500/20" },
    
    // Row 6: Career & Study
    { id: "interview-prep", label: "Interview Prep", icon: Briefcase, color: "text-indigo-500", bgColor: "bg-indigo-500/10", titleBar: "from-indigo-500/20 to-indigo-600/20" },
    { id: "cert-path", label: "Cert Roadmap", icon: Map, color: "text-blue-400", bgColor: "bg-blue-400/10", titleBar: "from-blue-400/20 to-blue-500/20" },
    { id: "sec-plus", label: "Sec+ Vault", icon: GraduationCap, color: "text-amber-500", bgColor: "bg-amber-500/10", titleBar: "from-amber-500/20 to-amber-600/20" },
    
    // Row 7: More SOC tools
    { id: "report-builder", label: "Report Builder", icon: BarChart2, color: "text-amber-500", bgColor: "bg-amber-500/10", titleBar: "from-amber-500/20 to-amber-600/20" },
    { id: "threat-map", label: "Threat Map", icon: Globe, color: "text-red-400", bgColor: "bg-red-400/10", titleBar: "from-red-400/20 to-red-500/20" },
    { id: "compliance", label: "Compliance", icon: CheckSquare, color: "text-green-500", bgColor: "bg-green-500/10", titleBar: "from-green-500/20 to-green-600/20" },
    { id: "runbooks", label: "Runbooks", icon: BookOpen, color: "text-indigo-400", bgColor: "bg-indigo-400/10", titleBar: "from-indigo-400/20 to-indigo-500/20" },
    { id: "alerts", label: "Alerts", icon: Bell, color: "text-yellow-500", bgColor: "bg-yellow-500/10", titleBar: "from-yellow-500/20 to-yellow-600/20" },
    // Row 8: System Utilities
    { id: "utilities", label: "Utilities", icon: FolderCog, color: "text-teal-400", bgColor: "bg-teal-400/10", titleBar: "from-teal-400/20 to-teal-500/20" },
    { id: "terminal", label: "Terminal", icon: TerminalIcon, color: "text-[#4e7cf6]", bgColor: "bg-[#4e7cf6]/10", titleBar: "from-[#4e7cf6]/20 to-[#4e7cf6]/30" },
    // Easter eggs / joke content
    { id: "weird-pics", label: "Weird Pics", icon: ImageIcon, color: "text-rose-400", bgColor: "bg-rose-400/10", titleBar: "from-rose-400/20 to-rose-500/20" },
    { id: "funny-docs", label: "Funny Documents", icon: FileText, color: "text-lime-400", bgColor: "bg-lime-400/10", titleBar: "from-lime-400/20 to-lime-500/20" },
  ]

  const initialWindowsState: WindowState[] = desktopIcons.map(icon => ({
    id: icon.id,
    isOpen: false,
    isMinimized: false,
    zIndex: 10,
    navigationStack: [icon.id],
    currentNavIndex: 0
  }))
  const [windows, setWindows] = useState<WindowState[]>(initialWindowsState)
  const [nextZIndex, setNextZIndex] = useState(11)
  const [maximizedWindowId, setMaximizedWindowId] = useState<string | null>(null)
  const [showJumpScare, setShowJumpScare] = useState(false)
  const hasVisibleWindow = windows.some(w => w.isOpen && !w.isMinimized)

  // Desktop dimensions: fixed size, no scroll. Icon order and size persisted.
  const desktopRef = useRef<HTMLDivElement>(null)
  const [desktopScale, setDesktopScale] = useState(1)
  const [desktopIconOrder, setDesktopIconOrder] = useState<string[]>(() => {
    if (typeof window === "undefined") return desktopIcons.map(i => i.id)
    try {
      const stored = localStorage.getItem(DESKTOP_ICON_ORDER_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        const valid = parsed.filter(id => desktopIcons.some(i => i.id === id))
        const missing = desktopIcons.filter(i => !valid.includes(i.id)).map(i => i.id)
        return [...valid, ...missing]
      }
    } catch (_) {}
    return desktopIcons.map(i => i.id)
  })
  const [desktopIconSize, setDesktopIconSize] = useState<'sm' | 'md' | 'lg'>(() => {
    if (typeof window === "undefined") return "lg"
    try {
      const s = localStorage.getItem(DESKTOP_ICON_SIZE_KEY)
      if (s === "sm" || s === "md" || s === "lg") return s
    } catch (_) {}
    return "lg"
  })

  useEffect(() => {
    try { localStorage.setItem(DESKTOP_ICON_ORDER_KEY, JSON.stringify(desktopIconOrder)) } catch (_) {}
  }, [desktopIconOrder])
  useEffect(() => {
    try { localStorage.setItem(DESKTOP_ICON_SIZE_KEY, desktopIconSize) } catch (_) {}
  }, [desktopIconSize])

  // Desktop scale: base on the actual desktop area (above taskbar),
  // so icons never end up behind the taskbar in larger icon modes.
  useEffect(() => {
    if (!isVMActive) return
    const el = desktopRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      setDesktopScale(Math.min(w / DESKTOP_WIDTH, h / DESKTOP_HEIGHT, 1))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isVMActive])

  // VM session: logged-in = localStorage (persists across tabs/restart); guest = sessionStorage (survives refresh, cleared on exit or new tab)
  const VM_SESSION_KEY = "soc-os-vm-session"
  const VM_GUEST_SESSION_KEY = "soc-os-vm-session-guest"
  const VM_OPEN_KEY = "soc-os-vm-open" // so refresh keeps you in the OS
  const getSessionKey = () => (user?.id ? `${VM_SESSION_KEY}-${user.id}` : null)

  // Restore "in VM" state on refresh so user stays in the OS
  useEffect(() => {
    try {
      if (typeof window === "undefined") return
      if (sessionStorage.getItem(VM_OPEN_KEY) === "1") setIsVMActive(true)
    } catch (_) {}
  }, [])

  // Persist "VM is open" so refresh keeps you in the OS; clear when exiting
  useEffect(() => {
    try {
      if (isVMActive) sessionStorage.setItem(VM_OPEN_KEY, "1")
      else sessionStorage.removeItem(VM_OPEN_KEY)
    } catch (_) {}
  }, [isVMActive])

  // Theme gating: guests always use Default. Signed-in users can choose and persist.
  useEffect(() => {
    if (!user?.id) {
      setDesktopTheme("default")
      return
    }
    try {
      const stored = localStorage.getItem(`${DESKTOP_THEME_KEY}-${user.id}`)
      if (stored && stored in DESKTOP_THEMES) setDesktopTheme(stored as DesktopThemeId)
    } catch (_) {}
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    try {
      localStorage.setItem(`${DESKTOP_THEME_KEY}-${user.id}`, desktopTheme)
    } catch (_) {}
  }, [desktopTheme, user?.id])

  // Restore session when entering VM as logged-in user
  useEffect(() => {
    if (!isVMActive || !user?.id) return
    try {
      const key = getSessionKey()
      if (!key) return
      const raw = localStorage.getItem(key)
      if (!raw) return
      const data = JSON.parse(raw) as { openIds?: string[]; maximizedId?: string | null }
      const openIds = data.openIds ?? []
      const maximizedId = data.maximizedId ?? null
      if (openIds.length === 0) return
      setWindows(prev => {
        const existingIds = new Set(prev.map(w => w.id))
        const next = prev.map(w => ({ ...w, isOpen: openIds.includes(w.id), isMinimized: !openIds.includes(w.id) }))
        openIds.forEach(id => {
          if (!existingIds.has(id)) next.push({ id, isOpen: true, isMinimized: false, zIndex: 10, navigationStack: [id], currentNavIndex: 0 })
        })
        return next
      })
      setMaximizedWindowId(maximizedId)
    } catch (_) {}
  }, [isVMActive, user?.id])

  // Guest entry: restore from sessionStorage if available (e.g. after refresh), else clean desktop
  const prevVMActiveRef = useRef(false)
  useEffect(() => {
    const justEnteredVMAsGuest = isVMActive && !prevVMActiveRef.current && !user
    if (!justEnteredVMAsGuest) {
      prevVMActiveRef.current = isVMActive
      return
    }
    try {
      const raw = sessionStorage.getItem(VM_GUEST_SESSION_KEY)
      if (raw) {
        const data = JSON.parse(raw) as { openIds?: string[]; maximizedId?: string | null }
        const openIds = data.openIds ?? []
        const maximizedId = data.maximizedId ?? null
        if (openIds.length > 0) {
          setWindows(prev => {
            const existingIds = new Set(prev.map(w => w.id))
            const next = prev.map(w => ({ ...w, isOpen: openIds.includes(w.id), isMinimized: !openIds.includes(w.id) }))
            openIds.forEach(id => {
              if (!existingIds.has(id)) next.push({ id, isOpen: true, isMinimized: false, zIndex: 10, navigationStack: [id], currentNavIndex: 0 })
            })
            return next
          })
          setMaximizedWindowId(maximizedId)
        } else {
          setWindows(initialWindowsState)
          setMaximizedWindowId(null)
        }
      } else {
        setWindows(initialWindowsState)
        setMaximizedWindowId(null)
      }
    } catch (_) {
      setWindows(initialWindowsState)
      setMaximizedWindowId(null)
    }
    prevVMActiveRef.current = isVMActive
  }, [isVMActive, user])

  // Persist guest VM state to sessionStorage so refresh keeps their open apps (same tab only)
  useEffect(() => {
    if (!isVMActive || user?.id) return
    try {
      sessionStorage.setItem(VM_GUEST_SESSION_KEY, JSON.stringify({
        openIds: windows.filter(w => w.isOpen).map(w => w.id),
        maximizedId: maximizedWindowId,
      }))
    } catch (_) {}
  }, [isVMActive, user?.id, windows, maximizedWindowId])

  const openWindow = (id: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id)
      if (existing) {
        return prev.map(w => 
          w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZIndex, navigationStack: [id], currentNavIndex: 0 } : w
        )
      } else {
        // Handle special windows like "about" that aren't desktop icons
        return [...prev, {
          id,
          isOpen: true,
          isMinimized: false,
          zIndex: nextZIndex,
          navigationStack: [id],
          currentNavIndex: 0
        }]
      }
    })
    setNextZIndex(prev => prev + 1)
  }

  const closeWindow = (id: string) => {
    setMaximizedWindowId(prev => prev === id ? null : prev)
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w))
  }

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w))
  }

  const restoreWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
    ))
    setNextZIndex(prev => prev + 1)
  }

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ))
    setNextZIndex(prev => prev + 1)
  }

  const navigateInWindow = (windowId: string, path: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== windowId) return w
      
      // Remove forward history when navigating to new path
      const newStack = [...w.navigationStack.slice(0, w.currentNavIndex + 1), path]
      return {
        ...w,
        navigationStack: newStack,
        currentNavIndex: newStack.length - 1
      }
    }))
  }

  const goBack = (windowId: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== windowId || w.currentNavIndex === 0) return w
      return { ...w, currentNavIndex: w.currentNavIndex - 1 }
    }))
  }

  const goForward = (windowId: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== windowId || w.currentNavIndex >= w.navigationStack.length - 1) return w
      return { ...w, currentNavIndex: w.currentNavIndex + 1 }
    }))
  }

  return (
    <>
      {/* Splash Page - Desktop mode entry: back to site or launch OS; no main nav on resources */}
      {!isVMActive && (
        <div className="fixed inset-0 w-full h-full flex flex-col bg-gradient-to-b from-background to-muted/20">
          <Link
            href="/"
            className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-auto z-10 flex items-center justify-center sm:justify-start gap-2 rounded-lg border border-border bg-background/90 px-4 py-3 sm:py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-sm touch-manipulation"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            Back to site
          </Link>
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 min-h-0 overflow-auto">
            <div className="text-center mb-6 sm:mb-10 flex-shrink-0">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary shrink-0" />
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">My SOC Operating System</h1>
              </div>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
                A living toolkit for blue team workflows: investigation templates, IOC tools, Splunk queries, cheat sheets, labs, tickets, and interview prep — all in a desktop OS you can use while studying.
              </p>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Built with AI-assisted development and refined through testing. Goal: consistency.
              </p>
            </div>
            <div className="flex justify-center mb-6 sm:mb-10 flex-shrink-0">
              <Button
                onClick={() => setShowLoginScreen(true)}
                size="lg"
                className="gap-2 px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg bg-primary hover:bg-primary/90 shadow-xl touch-manipulation min-h-[48px]"
              >
                <Monitor className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                Launch SOC Operating System
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl w-full flex-1 min-h-0 overflow-auto">
              <Card className="border-border bg-card/50 overflow-auto">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    What&apos;s Inside
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <div>🎯 <strong>Missions</strong> — Daily & timed practice</div>
                  <div>🧭 <strong>Learning Paths</strong> — Roadmap, TryHackMe, LetsDefend</div>
                  <div>📝 <strong>Templates</strong> — Investigation & IR forms</div>
                  <div>🔧 <strong>Daily Tools</strong> — VirusTotal, AbuseIPDB, Shodan</div>
                  <div>📚 <strong>Quick Reference</strong> — Splunk SPL, logs, MITRE ATT&CK</div>
                  <div>💻 <strong>CLI Cheats</strong> — Command-line cheatbook</div>
                  <div>📖 <strong>SOC Dictionary</strong> — Glossary of terms</div>
                  <div>🛡️ <strong>IOC Helper</strong> — Threat intel lookups (in-window)</div>
                  <div>🎮 <strong>Games</strong> — Mini Games + Corporate Espionage Simulator (coming soon)</div>
                  <div>🧪 <strong>Labs, Tickets, Journal</strong> — Practice & case work</div>
                  <div>🎤 <strong>Interview Prep</strong> — STAR method, questions</div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50 overflow-auto">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    How to Use the Desktop
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  <div>🖱️ <strong>Double-click</strong> any icon to open an app</div>
                  <div>↔️ <strong>Drag</strong> title bar to move; <strong>drag icons</strong> to reorder</div>
                  <div>📐 <strong>Icon size</strong> — Sm / Md / Lg (top-right of desktop)</div>
                  <div>🔴 <strong>Red</strong> close · 🟡 <strong>Yellow</strong> minimize · 🟢 <strong>Green</strong> maximize</div>
                  <div>📊 <strong>Taskbar</strong> — Restore or minimize open apps</div>
                  <div>🚪 <strong>Exit</strong> (top right) returns here</div>
                  <div>💡 Open multiple apps; windows remember size & position</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Login Screen */}
      {showLoginScreen && !isVMActive && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-md w-full mx-auto my-auto">
            <Card className="bg-slate-900/90 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Monitor className="h-14 w-14 sm:h-16 sm:w-16 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Welcome to SOC OS</CardTitle>
                <CardDescription>Choose how you want to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <Button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="w-full py-5 sm:py-6 text-base sm:text-lg min-h-[48px] touch-manipulation"
                  size="lg"
                >
                  <LogIn className="mr-2 h-5 w-5 shrink-0" />
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    setIsGuestMode(true)
                    setIsVMActive(true)
                  }}
                  variant="outline"
                  className="w-full py-5 sm:py-6 text-base sm:text-lg min-h-[48px] touch-manipulation"
                  size="lg"
                >
                  <Power className="mr-2 h-5 w-5 shrink-0" />
                  Continue as Guest
                </Button>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-center text-muted-foreground">
                    <strong>Sign in to unlock:</strong> SOC Journal, Progress Tracking, Saved Notes
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2 hover:bg-white/10"
              >
                ← Back to portfolio
              </Link>
            </div>
          </div>

          {/* Auth Dialog */}
          <AuthDialog 
            open={isAuthDialogOpen} 
            onOpenChange={setIsAuthDialogOpen}
            onSuccess={() => {
              setIsVMActive(true)
              setShowLoginScreen(false)
            }}
          />
        </div>
      )}

      {/* Full-Screen VM Interface */}
      {isVMActive && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Jump scare overlay - triggered from Funny Documents */}
          {showJumpScare && <JumpScareOverlay onClose={() => setShowJumpScare(false)} />}
          {/* Portal target for maximized windows - keeps them above desktop so they receive events */}
          <div id="window-portal-root" className="absolute inset-0 z-[100000]" style={{ pointerEvents: 'none' }} />

          {/* The "Monitor" - Full viewport VM */}
          <div 
            id="desktop-monitor"
            className="relative h-full w-full"
            style={{
              backgroundImage: `url(${DESKTOP_THEMES[desktopTheme].wallpaper})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
          {/* Overlay for better icon contrast */}
          <div className={`absolute inset-0 ${DESKTOP_THEMES[desktopTheme].overlayClass}`} />

          {/* Desktop Content Area */}
            <div className="relative h-full flex flex-col">
            {!isMobile ? (
              <>
            {/* Desktop - fixed dimensions, no scroll; scale to fit; icons reorderable and resizable */}
            <div
              ref={desktopRef}
              className={`flex-1 min-h-0 overflow-hidden flex items-start justify-start ${maximizedWindowId ? "pointer-events-none" : ""}`}
            >
              <div
                className="relative flex flex-col items-start justify-start pt-8 pb-4 pl-8 pr-4"
                style={{
                  width: DESKTOP_WIDTH,
                  height: DESKTOP_HEIGHT,
                  transform: `scale(${desktopScale})`,
                  transformOrigin: "top left",
                }}
              >
                <div className="absolute top-2 right-4 flex items-center gap-2">
                  <span className="text-white/50 text-xs">Icon size:</span>
                  {(["sm", "md", "lg"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setDesktopIconSize(size)}
                      className={`px-2 py-0.5 rounded text-xs uppercase ${
                        desktopIconSize === size ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-10 w-full max-w-[1400px] justify-items-start content-start">
                  {desktopIconOrder.map((id) => {
                    const icon = desktopIcons.find((i) => i.id === id)
                    if (!icon) return null
                    const Icon = icon.icon
                    const window = windows.find((w) => w.id === icon.id)
                    const isActive = window?.isOpen && !window?.isMinimized
                    const sizeClasses = {
                      sm: "p-1.5 gap-1 text-[11px]",
                      md: "p-3 gap-2 text-sm",
                      lg: "p-4 gap-3 text-base",
                    }
                    const tileSizeClasses = {
                      sm: "w-[80px] min-w-[80px] h-[72px] min-h-[72px]",
                      md: "w-[108px] min-w-[108px] h-[104px] min-h-[104px]",
                      lg: "w-[132px] min-w-[132px] h-[128px] min-h-[128px]",
                    }
                    const iconBoxSize = {
                      sm: "h-9 w-9 min-h-9 min-w-9",
                      md: "h-12 w-12 min-h-12 min-w-12",
                      lg: "h-[4.5rem] w-[4.5rem] min-h-[4.5rem] min-w-[4.5rem]",
                    }[desktopIconSize]
                    const iconPixelSize = { sm: "!size-5", md: "!size-8", lg: "!size-14" }[desktopIconSize]
                    return (
                      <button
                        key={icon.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", icon.id)
                          e.dataTransfer.effectAllowed = "move"
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.dataTransfer.dropEffect = "move"
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          const fromId = e.dataTransfer.getData("text/plain")
                          if (!fromId || fromId === icon.id) return
                          setDesktopIconOrder((prev) => {
                            const fromIdx = prev.indexOf(fromId)
                            const toIdx = prev.indexOf(icon.id)
                            if (fromIdx === -1 || toIdx === -1) return prev
                            const next = [...prev]
                            next.splice(fromIdx, 1)
                            next.splice(toIdx, 0, fromId)
                            return next
                          })
                        }}
                        onDoubleClick={() => openWindow(icon.id)}
                        className={`group flex flex-col items-center justify-start rounded-xl transition-all duration-200 cursor-grab active:cursor-grabbing border border-transparent bg-transparent hover:bg-transparent ${sizeClasses[desktopIconSize]} ${tileSizeClasses[desktopIconSize]} ${
                          isActive ? "ring-1 ring-primary/40 ring-inset" : "hover:scale-105"
                        }`}
                      >
                        <div className={`rounded-lg ${icon.bgColor} transition-transform group-hover:scale-110 shadow-lg ring-1 ring-black/20 flex items-center justify-center shrink-0 ${iconBoxSize}`}>
                          <Icon className={`${icon.color} ${iconPixelSize} shrink-0`} />
                        </div>
                        <span className="font-medium text-center leading-tight text-white drop-shadow-md w-full min-w-0 min-h-[1.2em] px-0.5 line-clamp-2 flex-shrink-0">
                          {icon.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
              </>
            ) : (
              /* Mobile: scrollable app grid, no scaled desktop */
              <>
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                  <div
                    className="min-h-full p-4 pb-28"
                    style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px) + 56px)" }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {desktopIconOrder.map((id) => {
                        const icon = desktopIcons.find((i) => i.id === id)
                        if (!icon) return null
                        const Icon = icon.icon
                        const window = windows.find((w) => w.id === icon.id)
                        const isActive = window?.isOpen && !window?.isMinimized
                        return (
                          <button
                            key={icon.id}
                            type="button"
                            onClick={() => openWindow(icon.id)}
                            className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 min-h-[88px] touch-manipulation active:scale-[0.98] transition-transform border border-transparent ${
                              isActive ? "ring-2 ring-primary/50 bg-white/10" : "bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className={`rounded-xl ${icon.bgColor} flex items-center justify-center shrink-0 h-12 w-12 ring-1 ring-black/20 shadow-lg`}>
                              <Icon className={`${icon.color} !size-7`} />
                            </div>
                            <span className="text-sm font-medium text-white drop-shadow-md text-center line-clamp-2 leading-tight">
                              {icon.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Taskbar - Inside the Monitor (desktop + mobile) */}
            <div
              className="h-14 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center px-2 gap-2 relative shrink-0"
              style={{ paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : undefined }}
            >
              {/* Start Menu Button */}
              <button
                onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                className={`p-2 rounded-lg transition-all ${
                  isStartMenuOpen 
                    ? 'bg-primary/40 ring-1 ring-primary/50' 
                    : 'hover:bg-white/10'
                }`}
                title="Start"
              >
                <Menu className="h-5 w-5 text-white" />
              </button>

              {/* Start Menu Popup */}
              {isStartMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsStartMenuOpen(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute bottom-14 left-2 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden">
                    <div className="p-4 space-y-2">
                      <div className="text-xs text-white/50 font-semibold mb-2">SOC OPERATING SYSTEM</div>
                      
                      {!user && (
                        <>
                          <button
                            onClick={() => {
                              setIsAuthDialogOpen(true)
                              setIsStartMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-left"
                          >
                            <LogIn className="h-5 w-5 text-primary" />
                            <div>
                              <div className="text-white font-medium">Sign In</div>
                              <div className="text-xs text-white/50">Unlock all features</div>
                            </div>
                          </button>
                          <div className="border-t border-white/10 my-2" />
                        </>
                      )}
                      
                      <button
                        onClick={() => {
                          openWindow("about")
                          setIsStartMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-left"
                      >
                        <Monitor className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-white font-medium">About / Changelog</div>
                          <div className="text-xs text-white/50">Version history</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          openWindow("settings")
                          setIsStartMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-left"
                      >
                        <Wrench className="h-5 w-5 text-slate-400" />
                        <div>
                          <div className="text-white font-medium">Settings</div>
                          <div className="text-xs text-white/50">Preferences</div>
                        </div>
                      </button>

                      <div className="border-t border-white/10 my-2" />
                      
                      <button
                        onClick={async () => {
                          if (user) {
                            try {
                              const key = getSessionKey()
                              if (key) {
                                localStorage.setItem(key, JSON.stringify({
                                  openIds: windows.filter(w => w.isOpen).map(w => w.id),
                                  maximizedId: maximizedWindowId
                                }))
                              }
                            } catch (_) {}
                            await supabase.auth.signOut()
                            setUser(null)
                            setWindows(initialWindowsState)
                            setMaximizedWindowId(null)
                            try { sessionStorage.removeItem(VM_GUEST_SESSION_KEY) } catch (_) {}
                          } else {
                            setWindows(initialWindowsState)
                            setMaximizedWindowId(null)
                            try { sessionStorage.removeItem(VM_GUEST_SESSION_KEY) } catch (_) {}
                          }
                          setIsVMActive(false)
                          setIsStartMenuOpen(false)
                          setShowLoginScreen(false)
                          setIsGuestMode(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-left"
                      >
                        <Power className="h-5 w-5 text-red-400" />
                        <div>
                          <div className="text-white font-medium">Exit SOC OS</div>
                          <div className="text-xs text-white/50">{user ? 'Sign out & return' : 'Return to portfolio'}</div>
                        </div>
                      </button>

                      <div className="border-t border-white/10 my-2" />

                      <div className="text-xs text-white/50 px-4 py-2">
                        {user ? `Logged in as ${user.email}` : 'Guest Mode'}<br />
                        Version 1.0 • By Michael Walton
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Window Buttons */}
              <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                {windows.filter(w => w.isOpen).map(window => {
                  const icon = desktopIcons.find(i => i.id === window.id)
                  const specialWindows: Record<string, any> = {
                    about: { label: "About", icon: Monitor, color: "text-blue-400" },
                    settings: { label: "Settings", icon: Wrench, color: "text-slate-400" },
                    games: { label: "Games", icon: Gamepad2, color: "text-pink-400" },
                    "mini-game": { label: "Mini Games", icon: Gamepad2, color: "text-pink-400" },
                    "util-hash": { label: "Hash ID", icon: Shield, color: "text-teal-400" },
                    "util-base64": { label: "Base64", icon: FileText, color: "text-teal-400" },
                    "util-timestamp": { label: "Timestamp", icon: Monitor, color: "text-teal-400" },
                    "util-email": { label: "Email Parser", icon: FileText, color: "text-teal-400" },
                    "util-ip": { label: "IP Lookup", icon: Compass, color: "text-teal-400" },
                    "util-port": { label: "Port Lookup", icon: Wrench, color: "text-teal-400" },
                    "util-useragent": { label: "User-Agent", icon: Monitor, color: "text-teal-400" },
                    "util-evidence": { label: "Evidence", icon: ClipboardList, color: "text-teal-400" },
                    "util-timeline": { label: "Timeline", icon: ClipboardList, color: "text-teal-400" },
                  }
                  const windowConfig = icon || specialWindows[window.id]
                  if (!windowConfig) return null
                  const Icon = windowConfig.icon
                  
                  return (
                    <button
                      key={window.id}
                      onClick={() => window.isMinimized ? restoreWindow(window.id) : minimizeWindow(window.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                        window.isMinimized 
                          ? 'bg-white/5 hover:bg-white/10' 
                          : 'bg-primary/30 hover:bg-primary/40 ring-1 ring-primary/50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${windowConfig.color}`} />
                      <span className="text-xs font-medium text-white max-w-[120px] truncate">{windowConfig.label}</span>
                    </button>
                  )
                })}
              </div>
              
              {/* User Menu (if logged in) */}
              {user && (
                <div className="flex items-center gap-2">
                  <UserMenu user={user} onSignOut={() => setUser(null)} />
                </div>
              )}

              {/* Live date & time */}
              <DesktopTaskbarClock />

              <div className="text-xs text-white/70 font-mono shrink-0">
                {user ? `${user.email?.split('@')[0]} • ` : ''}SOC OS v1.0
              </div>
            </div>
          </div>

          {/* Auth Dialog */}
          <AuthDialog 
            open={isAuthDialogOpen} 
            onOpenChange={setIsAuthDialogOpen}
            onSuccess={() => {
              // Refresh user state is handled by the auth listener
            }}
          />

          {/* Render Open Windows - Constrained to Monitor */}
          {windows.filter(w => w.isOpen).map(window => {
            const icon = desktopIcons.find(i => i.id === window.id)
            // Handle special windows like "about" and utilities
            const specialWindows: Record<string, any> = {
              about: { label: "About SOC OS", icon: Monitor, titleBar: "from-blue-400/20 to-blue-500/20" },
              settings: { label: "Settings", icon: Wrench, titleBar: "from-slate-400/20 to-slate-500/20" },
              games: { label: "Games", icon: Gamepad2, titleBar: "from-pink-400/20 to-pink-500/20" },
              "mini-game": { label: "Mini Games", icon: Gamepad2, titleBar: "from-pink-400/20 to-pink-500/20" },
              "util-hash": { label: "Hash Identifier", icon: Shield, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-base64": { label: "Base64 Toolkit", icon: FileText, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-timestamp": { label: "Timestamp Converter", icon: Monitor, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-email": { label: "Email Header Parser", icon: FileText, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-ip": { label: "IP Info Lookup", icon: Compass, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-port": { label: "Port Lookup", icon: Wrench, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-useragent": { label: "User-Agent Parser", icon: Monitor, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-evidence": { label: "Evidence Locker", icon: ClipboardList, titleBar: "from-teal-400/20 to-teal-500/20" },
              "util-timeline": { label: "Timeline Builder", icon: ClipboardList, titleBar: "from-teal-400/20 to-teal-500/20" },
            }
            const windowConfig = icon || specialWindows[window.id]
            if (!windowConfig) return null

            const currentPath = window.navigationStack[window.currentNavIndex]
            const canGoBack = window.currentNavIndex > 0
            const canGoForward = window.currentNavIndex < window.navigationStack.length - 1

            return (
              <DesktopWindow
                key={window.id}
                id={window.id}
                title={`${windowConfig.label}.app`}
                icon={windowConfig.icon}
                iconColor={windowConfig.titleBar}
                isMinimized={window.isMinimized}
                zIndex={window.zIndex}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onFocus={() => focusWindow(window.id)}
                onMaximizeChange={(maximized) => setMaximizedWindowId(maximized ? window.id : null)}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onGoBack={() => goBack(window.id)}
                onGoForward={() => goForward(window.id)}
                fullScreenMobile={isMobile}
              >
                {window.id === "start-here" && <StartHereContent onNavigate={(appId) => openWindow(appId)} />}
                {window.id === "missions" && <MissionsContent onNavigate={(appId) => openWindow(appId)} />}
                {window.id === "quick-start" && <QuickStartContent quickStart={quickStart} />}
                {window.id === "templates" && (
                  <TemplatesContent 
                    templates={templates} 
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                  />
                )}
                {window.id === "case-files" && (
                  <CaseFilesContent 
                    caseFiles={caseFiles}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                    appIntros={appIntros}
                  />
                )}
                {window.id === "playbooks" && (
                  <PlaybooksContent 
                    playbooks={playbooks}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                    appIntros={appIntros}
                  />
                )}
                {window.id === "sec-plus" && <SecPlusVaultContent secPlusVault={secPlusVault} />}
                {window.id === "skill-drills" && <SkillDrillsContent skillDrills={skillDrills} currentPath={currentPath} onNavigate={(path) => navigateInWindow(window.id, path)} onGoBack={() => goBack(window.id)} />}
                {window.id === "games" && <GamesContent onOpenApp={openWindow} />}
                {window.id === "mini-game" && <MiniGameContent miniGames={miniGames} currentPath={currentPath} onNavigate={(path) => navigateInWindow(window.id, path)} onGoBack={() => goBack(window.id)} />}
                {window.id === "cert-path" && <CertPathContent certPath={certPath} appIntros={appIntros} />}
                {window.id === "soc-journal" && <SOCJournalContent user={user} onSignIn={() => setIsAuthDialogOpen(true)} />}
                {window.id === "tickets" && (
                  <TicketsContent
                    tickets={tickets}
                    user={user}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                    onOpenApp={openWindow}
                    appIntros={appIntros}
                    onSignIn={() => setIsAuthDialogOpen(true)}
                  />
                )}
                {window.id === "lab-files" && (
                  <LabFilesContent
                    labFiles={labFiles}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                  />
                )}
                {window.id === "threat-feed" && <ThreatFeedContent threatFeed={threatFeed} />}
                {window.id === "log-viewer" && <LogViewerContent logSamples={logSamples} appIntros={appIntros} currentPath={currentPath} onNavigate={(path) => navigateInWindow(window.id, path)} onGoBack={() => goBack(window.id)} />}
                {window.id === "cli-cheats" && <CLICheatsContent cliCommands={cliCommands} cliSyntaxGuide={cliSyntaxGuide} appIntros={appIntros} />}
                {window.id === "toolbox" && <ToolboxContent toolbox={toolbox} />}
                {window.id === "glossary" && <GlossaryContent glossary={glossary} />}
                {window.id === "tools" && <ToolsContent tools={tools} />}
                {window.id === "utilities" && <UtilitiesContent onNavigate={(appId) => openWindow(appId)} />}
                {window.id === "terminal" && (
                  <TerminalContent
                    onNavigate={(appId) => openWindow(appId)}
                    openWindows={windows.filter(w => w.isOpen).map(w => ({ id: w.id, label: desktopIcons.find(i => i.id === w.id)?.label ?? w.id }))}
                    onCloseWindow={closeWindow}
                    onMinimizeWindow={minimizeWindow}
                    glossary={glossary}
                    tickets={tickets}
                  />
                )}
                {window.id === "about" && <AboutContent />}
                {window.id === "settings" && (
                  <SettingsContent
                    isLoggedIn={!!user}
                    theme={desktopTheme}
                    onThemeChange={setDesktopTheme}
                  />
                )}
                {window.id === "util-hash" && <HashIdentifierUtility />}
                {window.id === "util-base64" && <Base64Utility />}
                {window.id === "util-timestamp" && <TimestampUtility />}
                {window.id === "util-email" && <EmailHeaderUtility />}
                {window.id === "util-ip" && <IPInfoUtility />}
                {window.id === "util-port" && <PortLookupUtility />}
                {window.id === "util-useragent" && <UserAgentUtility />}
                {window.id === "util-evidence" && <EvidenceLockerUtility />}
                {window.id === "util-timeline" && <TimelineBuilderUtility />}
                {window.id === "cheat-sheets" && (
                  <CheatSheetsContent 
                    cheatSheets={cheatSheets}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                  />
                )}
                {window.id === "labs" && <LabsContent labs={labs} />}
                {window.id === "projects" && <ProjectsContent projects={projectsData.projects} appIntros={appIntros} walkthrough={projectsWalkthrough} projectWalkthroughs={projectWalkthroughs} currentPath={currentPath} onNavigate={(path) => navigateInWindow(window.id, path)} onGoBack={() => goBack(window.id)} />}
                {window.id === "code-examples" && (
                  <CodeExamplesContent 
                    codeExamples={codeExamples}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                  />
                )}
                {window.id === "interview-prep" && (
                  <InterviewPrepContent 
                    interviewPrep={interviewPrep}
                    behavioralBank={behavioralBank}
                    technicalTrivia={technicalTrivia}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(window.id, path)}
                  />
                )}
                {window.id === "ioc-helper" && <IOCHelperContent />}
                {window.id === "report-builder" && <ReportBuilderPlaceholder />}
                {window.id === "threat-map" && <ThreatMapPlaceholder />}
                {window.id === "compliance" && <CompliancePlaceholder />}
                {window.id === "runbooks" && <RunbooksContent runbooks={runbooks} appIntros={appIntros} />}
                {window.id === "alerts" && <AlertsContent tickets={tickets} onOpenApp={openWindow} appIntros={appIntros} />}
                {window.id === "weird-pics" && <WeirdPicsContent />}
                {window.id === "funny-docs" && <FunnyDocsContent onJumpScare={() => setShowJumpScare(true)} />}
              </DesktopWindow>
            )
          })}
        </div>
        </div>
      )}
    </>
  )
}

// Window Content Components
function PracticeContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">If I Only Have 30 Minutes Today...</h2>
        <p className="text-muted-foreground mb-6">
          Quick, actionable tasks when you're short on time but want to keep learning.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Quick Wins (10-15 min)
          </h3>
          <div className="space-y-2">
            {[
              { icon: "🔍", title: "Run IOC Helper", desc: "Check 3 random suspicious IPs" },
              { icon: "📝", title: "Review MITRE Techniques", desc: "Pick 5 random ATT&CK techniques" },
              { icon: "💻", title: "Practice SPL Queries", desc: "Write 3 Splunk queries from memory" },
              { icon: "📧", title: "Mock Phishing Triage", desc: "Analyze email from spam folder" }
            ].map((task, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                <span className="text-lg">{task.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground">{task.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Deeper Practice (25-30 min)
          </h3>
          <div className="space-y-2">
            {[
              { icon: "🏋️", title: "Do 1 TryHackMe Room", desc: "Complete one section" },
              { icon: "📋", title: "Write Mini Casefile", desc: "Document recent lab scenario" },
              { icon: "🐍", title: "Run Code Examples", desc: "Test Python script with real data" },
              { icon: "🎤", title: "Practice Interview Answer", desc: "Record STAR method question" }
            ].map((task, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                <span className="text-lg">{task.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{task.title}</div>
                  <div className="text-xs text-muted-foreground">{task.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickStartContent({ quickStart }: { quickStart: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Learning Paths</h2>
        <p className="text-muted-foreground">Where I started. Pick one path and stick with it for 30 days.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {quickStart.map((resource) => (
          <Card key={resource.id} className="bg-card border-border hover:border-green-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">{resource.title}</CardTitle>
              <Badge variant="secondary" className="w-fit">{resource.type}</Badge>
              <CardDescription className="text-sm mt-2">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" size="sm" className="w-full gap-2">
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Visit Site
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function TemplatesContent({ templates, currentPath, onNavigate }: { templates: any[], currentPath: string, onNavigate: (path: string) => void }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Parse current path (e.g., "templates" or "templates:template-id")
  const [view, itemId] = currentPath.split(':')
  const template = itemId ? templates.find(t => t.id === itemId) : null
  
  // Fetch content when viewing a specific template
  useEffect(() => {
    if (template) {
      setLoading(true)
      fetch(`${GITHUB_RAW_BASE}/${template.githubPath}`)
        .then(res => res.ok ? res.text() : null)
        .then(text => {
          setContent(text && text.length > 50 ? text : null)
          setLoading(false)
        })
        .catch(() => {
          setContent(null)
          setLoading(false)
        })
    }
  }, [template])
  
  // If viewing a specific template
  if (template) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">{template.title}</h2>
          </div>
          <p className="text-muted-foreground mb-4">{template.description}</p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={`${GITHUB_BASE_URL}/blob/main/${template.githubPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-3 w-3" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        ) : content ? (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <div className="p-8 text-center border border-border rounded-lg">
            <p className="text-muted-foreground mb-2">Content could not be loaded.</p>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={`${GITHUB_BASE_URL}/blob/main/${template.githubPath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        )}
      </div>
    )
  }
  
  // Default: Show list of templates
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Investigation Templates</h2>
        <p className="text-muted-foreground">Templates I use when investigating. Copy and fill in as you go.</p>
      </div>
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                onClick={() => onNavigate(`templates:${template.id}`)}
                variant="default" 
                size="sm" 
                className="flex-1 gap-2"
              >
                View Content
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href={`${GITHUB_BASE_URL}/blob/main/${template.githubPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ToolsContent({ tools }: { tools: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Daily Tools</h2>
        <p className="text-muted-foreground">Bookmarked in my browser. Check IOCs against at least 3 of these.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {tools.map((tool) => (
          <Card key={tool.id} className="bg-card border-border hover:border-blue-500/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{tool.title}</CardTitle>
              <Badge variant="outline" className="w-fit text-xs">{tool.category}</Badge>
              <CardDescription className="text-xs mt-2">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" size="sm" className="w-full gap-2">
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  Open Tool
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CheatSheetsContent({ cheatSheets, currentPath, onNavigate }: { cheatSheets: any[], currentPath: string, onNavigate: (path: string) => void }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  
  // Parse current path (e.g., "cheat-sheets" or "cheat-sheets:sheet-id")
  const [view, itemId] = currentPath.split(':')
  const sheet = itemId ? cheatSheets.find(s => s.id === itemId) : null
  
  // Fetch content when viewing a specific cheat sheet
  useEffect(() => {
    if (!sheet) {
      setContent(null)
      setFetchError(null)
      return
    }
    setContent(null)
    setFetchError(null)
    setLoading(true)
    const url = `${GITHUB_RAW_BASE}/${sheet.githubPath}`
    fetch(url)
      .then(res => {
        if (!res.ok) {
          setLoading(false)
          setFetchError(`Failed to load (${res.status})`)
          return null
        }
        return res.text()
      })
      .then(text => {
        setLoading(false)
        if (text != null && text.trim().length > 0) {
          setContent(text)
          setFetchError(null)
        } else {
          setFetchError("File is empty or unavailable.")
        }
      })
      .catch(() => {
        setLoading(false)
        setContent(null)
        setFetchError("Network error. Check connection or view on GitHub.")
      })
  }, [sheet?.id])
  
  // If viewing a specific cheat sheet
  if (sheet) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">{sheet.title}</h2>
          </div>
          <p className="text-muted-foreground mb-4">{sheet.description}</p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={`${GITHUB_BASE_URL}/blob/main/${sheet.githubPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-3 w-3" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        ) : content ? (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <div className="p-8 text-center border border-border rounded-lg">
            <p className="text-muted-foreground mb-2">{fetchError || "Content could not be loaded."}</p>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={`${GITHUB_BASE_URL}/blob/main/${sheet.githubPath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        )}
      </div>
    )
  }
  
  // Default: Show list of cheat sheets
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Quick Reference</h2>
        <p className="text-muted-foreground">Keep these open when analyzing logs.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cheatSheets.map((sheet) => (
          <Card key={sheet.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">{sheet.title}</CardTitle>
              <CardDescription className="text-xs">{sheet.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                onClick={() => onNavigate(`cheat-sheets:${sheet.id}`)}
                variant="default" 
                size="sm" 
                className="flex-1 gap-2"
              >
                View
                <ArrowRight className="h-3 w-3" />
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={`${GITHUB_BASE_URL}/blob/main/${sheet.githubPath}`} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function LabsContent({ labs }: { labs: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Practice Labs</h2>
        <p className="text-muted-foreground">Where I practice. Do at least one room per week.</p>
      </div>
      <div className="grid gap-4">
        {labs.map((lab) => (
          <Card key={lab.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">{lab.title}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">{lab.platform}</Badge>
                <Badge variant="outline" className="text-xs">{lab.difficulty}</Badge>
              </div>
              <CardDescription className="text-xs mt-2">{lab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" size="sm" className="w-full gap-2">
                <a href={lab.url} target="_blank" rel="noopener noreferrer">
                  Start Lab
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ProjectsContent({
  projects,
  appIntros,
  walkthrough,
  projectWalkthroughs = {},
  currentPath,
  onNavigate,
  onGoBack,
}: {
  projects: any[]
  appIntros?: Record<string, string>
  walkthrough?: { intro: string; steps: { title: string; body: string }[] }
  projectWalkthroughs?: Record<string, {
    id: string
    title: string
    difficulty?: string
    timeEstimate?: string
    steps: { title: string; body: string }[]
    troubleshooting?: { issue: string; fix: string }[]
    references?: { title: string; url: string }[]
    cliCheatSheet?: { command: string; syntax: string; purpose: string }[]
  }>
  currentPath?: string
  onNavigate?: (path: string) => void
  onGoBack?: () => void
}) {
  const [tab, setTab] = useState<"projects" | "walkthrough">("projects")
  const [stepIndex, setStepIndex] = useState(0)
  const repoSteps = walkthrough?.steps ?? []
  const hasRepoWalkthrough = repoSteps.length > 0

  const pathPart = (currentPath || "projects").split(":")[1]
  const projectWalkthrough = pathPart && projectWalkthroughs[pathPart] ? projectWalkthroughs[pathPart] : null
  const projSteps = projectWalkthrough?.steps ?? []
  const [projectStepIndex, setProjectStepIndex] = useState(0)
  useEffect(() => {
    if (projectWalkthrough) setProjectStepIndex(0)
  }, [pathPart])

  // Per-project walkthrough detail view
  if (projectWalkthrough && projSteps.length > 0) {
    const step = projSteps[projectStepIndex]
    const hasTroubleshooting = (projectWalkthrough.troubleshooting?.length ?? 0) > 0
    const hasReferences = (projectWalkthrough.references?.length ?? 0) > 0
    const hasCliCheatSheet = (projectWalkthrough.cliCheatSheet?.length ?? 0) > 0
    const hasExtraSections = hasTroubleshooting || hasReferences || hasCliCheatSheet
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2 -ml-1" onClick={() => onGoBack?.()}>
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Button>
        <div>
          <h2 className="text-xl font-semibold mb-1">{projectWalkthrough.title}</h2>
          {(projectWalkthrough.difficulty || projectWalkthrough.timeEstimate) && (
            <p className="text-sm text-muted-foreground">
              {[projectWalkthrough.difficulty, projectWalkthrough.timeEstimate].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        <Card className="bg-card border-border">
          <CardHeader className="py-3">
            <CardTitle className="text-base">
              Step {projectStepIndex + 1} of {projSteps.length}: {step.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{step.body}</p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setProjectStepIndex((i) => Math.max(0, i - 1))} disabled={projectStepIndex === 0}>
                <ArrowLeft className="h-3 w-3 mr-1" /> Back
              </Button>
              <Button variant="default" size="sm" onClick={() => setProjectStepIndex((i) => Math.min(projSteps.length - 1, i + 1))} disabled={projectStepIndex === projSteps.length - 1}>
                Next <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
        {hasExtraSections && (
          <Accordion type="multiple" className="w-full">
            {hasTroubleshooting && (
              <AccordionItem value="troubleshooting">
                <AccordionTrigger className="text-sm font-medium">Troubleshooting</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 text-sm">
                    {projectWalkthrough.troubleshooting!.map((item: { issue: string; fix: string }, i: number) => (
                      <li key={i} className="rounded-md border border-border bg-muted/30 p-3">
                        <p className="font-medium text-foreground mb-1">{item.issue}</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">{item.fix}</p>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            {hasReferences && (
              <AccordionItem value="references">
                <AccordionTrigger className="text-sm font-medium">References</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    {projectWalkthrough.references!.map((ref: { title: string; url: string }, i: number) => (
                      <li key={i}>
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {ref.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
            {hasCliCheatSheet && (
              <AccordionItem value="cliCheatSheet">
                <AccordionTrigger className="text-sm font-medium">CLI Cheat Sheet</AccordionTrigger>
                <AccordionContent>
                  <div className="rounded-md border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left p-2 font-medium">Command</th>
                          <th className="text-left p-2 font-medium">Syntax / Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectWalkthrough.cliCheatSheet!.map((row: { command: string; syntax: string; purpose: string }, i: number) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="p-2 font-mono text-xs align-top">{row.command}</td>
                            <td className="p-2 text-muted-foreground">
                              <span className="block font-medium text-foreground text-xs">{row.syntax}</span>
                              <span className="block mt-0.5">{row.purpose}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Projects</h2>
          <p className="text-muted-foreground">Repo project folders with READMEs. Lab walkthroughs and evidence.</p>
        </div>
        {hasRepoWalkthrough && (
          <Tabs value={tab} onValueChange={(v) => { setTab(v as "projects" | "walkthrough"); if (v === "walkthrough") setStepIndex(0) }}>
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="walkthrough">Walkthrough</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      <AppIntro appId="projects" appIntros={appIntros} />
      {tab === "walkthrough" && hasRepoWalkthrough && walkthrough ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{walkthrough.intro}</p>
          <Card className="bg-card border-border">
            <CardHeader className="py-3">
              <CardTitle className="text-base">
                Step {stepIndex + 1} of {repoSteps.length}: {repoSteps[stepIndex].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{repoSteps[stepIndex].body}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={stepIndex === 0}>
                  <ArrowLeft className="h-3 w-3 mr-1" /> Back
                </Button>
                <Button variant="default" size="sm" onClick={() => setStepIndex((i) => Math.min(repoSteps.length - 1, i + 1))} disabled={stepIndex === repoSteps.length - 1}>
                  Next <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4">
          {(projects || []).map((proj: any) => {
            const readmeUrl = `${GITHUB_BASE_URL}/blob/main/${(proj.githubPath || "").replace(/\/?$/, "/")}README.md`
            const hasProjectWalkthrough = projectWalkthroughs[proj.id]
            return (
              <Card key={proj.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm">{proj.title}</CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">{proj.category}</Badge>
                  <CardDescription className="text-xs mt-2">{proj.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button asChild variant="default" size="sm" className="gap-2">
                    <a href={readmeUrl} target="_blank" rel="noopener noreferrer">
                      View README
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                  {hasProjectWalkthrough && (
                    <Button variant="secondary" size="sm" className="gap-2" onClick={() => onNavigate?.("projects:" + proj.id)}>
                      View walkthrough
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  )}
                  {proj.link && (
                    <Button asChild variant="outline" size="sm">
                      <a href={proj.link}>Portfolio page</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function LogViewerContent({ logSamples, appIntros, currentPath, onNavigate, onGoBack }: { logSamples: any[]; appIntros?: Record<string, string>; currentPath?: string; onNavigate?: (path: string) => void; onGoBack?: () => void }) {
  const pathPart = (currentPath || "log-viewer").split(":")[1]
  const selectedId = pathPart || null
  const sample = selectedId ? logSamples.find((s: any) => s.id === selectedId) : null

  if (sample) {
    const lines = (sample.rawLog || "").split("\n")
    const suspiciousSet = new Set((sample.suspiciousLineNumbers || []).map((n: number) => n))

    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2 -ml-1" onClick={() => onGoBack?.()}>
          <ArrowLeft className="h-4 w-4" /> Back to samples
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{sample.title}</h2>
          <Badge variant="secondary" className="mt-1">{sample.logType}</Badge>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Raw log — what&apos;s suspicious?</h3>
          <pre className="bg-muted/50 border rounded-md p-3 text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto">
            {lines.map((line: string, i: number) => (
              <div
                key={i}
                className={suspiciousSet.has(i + 1) ? "bg-destructive/15 text-destructive border-l-2 border-destructive pl-2 -ml-2" : ""}
              >
                {line || " "}
              </div>
            ))}
          </pre>
        </div>
        <Card className="bg-card border-border">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Explanation</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground pt-0">
            {sample.explanation}
          </CardContent>
        </Card>
        {sample.mitreTactic && (
          <p className="text-xs text-muted-foreground">
            <strong>MITRE ATT&amp;CK:</strong> {sample.mitreTactic}
          </p>
        )}
        {sample.splQuery && (
          <div>
            <h3 className="text-sm font-medium mb-2">Example SPL query</h3>
            <pre className="bg-muted/50 border rounded-md p-3 text-xs font-mono overflow-x-auto">
              {sample.splQuery}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Log Viewer</h2>
        <p className="text-muted-foreground">Sample logs with &quot;What&apos;s suspicious?&quot; challenges. Click a sample to see the analysis.</p>
      </div>
      <AppIntro appId="log-viewer" appIntros={appIntros} />
      <div className="grid gap-4">
        {(logSamples || []).map((s: any) => (
          <Card
            key={s.id}
            className="bg-card border-border cursor-pointer hover:border-amber-500/50 transition-colors"
            onClick={() => onNavigate?.("log-viewer:" + s.id)}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{s.title}</CardTitle>
              <Badge variant="outline" className="text-xs w-fit">{s.logType}</Badge>
              <CardDescription className="text-xs mt-1">
                Click to view log snippet and analysis.
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CodeExamplesContent({ codeExamples, currentPath, onNavigate }: { codeExamples: any[], currentPath: string, onNavigate: (path: string) => void }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Parse current path (e.g., "code-examples" or "code-examples:example-id")
  const [view, itemId] = currentPath.split(':')
  const example = itemId ? codeExamples.find(e => e.id === itemId) : null
  
  // Fetch content when viewing a specific example
  useEffect(() => {
    if (example) {
      setLoading(true)
      setError(null)
      fetch(`${GITHUB_RAW_BASE}/${example.githubPath}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`GitHub returned ${res.status}`)
          }
          return res.text()
        })
        .then(text => {
          if (text && text.length > 50 && !text.includes('404') && !text.includes('Not Found')) {
            setContent(text)
          } else {
            throw new Error('Invalid content')
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch:', err)
          setContent(null)
          setError('Content not yet available on GitHub')
          setLoading(false)
        })
    }
  }, [example])
  
  // If viewing a specific code example
  if (example) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">{example.title}</h2>
          </div>
          <p className="text-muted-foreground mb-2">{example.description}</p>
          <Badge variant="secondary" className="mb-4">{example.language}</Badge>
          <div className="mb-4">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={`${GITHUB_BASE_URL}/blob/main/${example.githubPath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-3 w-3" />
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading code...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center border border-border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">{error}</p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              This content exists locally but hasn't been pushed to the GitHub repository yet.
            </p>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={`${GITHUB_BASE_URL}/blob/main/${example.githubPath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                Try GitHub Anyway
              </a>
            </Button>
          </div>
        ) : content ? (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <MarkdownContent content={content} />
          </div>
        ) : null}
      </div>
    )
  }
  
  // Default: Show list of code examples
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Automation Scripts</h2>
        <p className="text-muted-foreground">Scripts I wrote to automate boring stuff.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {codeExamples.map((example) => (
          <Card key={example.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">{example.title}</CardTitle>
              <Badge variant="secondary" className="w-fit text-xs">{example.language}</Badge>
              <CardDescription className="text-xs mt-2">{example.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                onClick={() => onNavigate(`code-examples:${example.id}`)}
                variant="default" 
                size="sm" 
                className="flex-1 gap-2"
              >
                View Code
                <ArrowRight className="h-3 w-3" />
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={`${GITHUB_BASE_URL}/blob/main/${example.githubPath}`} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const STAR_STORIES_KEY = "soc-os-star-stories"

function InterviewPrepContent({ interviewPrep, behavioralBank, technicalTrivia, currentPath, onNavigate }: { interviewPrep: any[], behavioralBank: any[], technicalTrivia: any[], currentPath: string, onNavigate: (path: string) => void }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Parse current path (e.g., "interview-prep" or "interview-prep:resource-id")
  const [view, itemId] = currentPath.split(':')
  const resource = itemId ? interviewPrep.find(r => r.id === itemId) : null
  
  // Fetch content when viewing a specific resource
  useEffect(() => {
    if (resource) {
      setLoading(true)
      setError(null)
      fetch(`${GITHUB_RAW_BASE}/${resource.githubPath}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`GitHub returned ${res.status}`)
          }
          return res.text()
        })
        .then(text => {
          if (text && text.length > 50 && !text.includes('404') && !text.includes('Not Found')) {
            setContent(text)
          } else {
            throw new Error('Invalid content')
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch:', err)
          setContent(null)
          setError('Content not yet available on GitHub')
          setLoading(false)
        })
    }
  }, [resource])
  
  // If viewing a specific resource (guide)
  if (resource) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">{resource.title}</h2>
          </div>
          <p className="text-muted-foreground mb-4">{resource.description}</p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a
              href={`${GITHUB_BASE_URL}/blob/main/${resource.githubPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-3 w-3" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center border border-border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">{error}</p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              This content exists locally but hasn't been pushed to the GitHub repository yet.
            </p>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={`${GITHUB_BASE_URL}/blob/main/${resource.githubPath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                Try GitHub Anyway
              </a>
            </Button>
          </div>
        ) : content ? (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <MarkdownContent content={content} />
          </div>
        ) : null}
      </div>
    )
  }
  
  // Default: Tabbed view (Guides, Mock Interview, STAR Builder, Behavioral Bank, Technical Trivia)
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Interview Prep</h2>
        <p className="text-muted-foreground text-sm">Guides, mock interview, STAR stories, behavioral bank, and technical trivia.</p>
      </div>
      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="mock">Mock Interview</TabsTrigger>
          <TabsTrigger value="star">STAR Builder</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral Bank</TabsTrigger>
          <TabsTrigger value="trivia">Technical Trivia</TabsTrigger>
        </TabsList>
        <TabsContent value="guides" className="mt-4 space-y-4">
          <div className="grid gap-4">
            {interviewPrep.map((r) => (
              <Card key={r.id} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-sm">{r.title}</CardTitle>
                  <CardDescription className="text-xs">{r.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button onClick={() => onNavigate(`interview-prep:${r.id}`)} variant="default" size="sm" className="flex-1 gap-2">
                    Read Guide <ArrowRight className="h-3 w-3" />
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={`${GITHUB_BASE_URL}/blob/main/${r.githubPath}`} target="_blank" rel="noopener noreferrer"><Github className="h-3 w-3" /></a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="mock" className="mt-4">
          <InterviewMockSimulator technicalTrivia={technicalTrivia} behavioralBank={behavioralBank} />
        </TabsContent>
        <TabsContent value="star" className="mt-4">
          <InterviewSTARBuilder />
        </TabsContent>
        <TabsContent value="behavioral" className="mt-4">
          <InterviewBehavioralBank behavioralBank={behavioralBank} />
        </TabsContent>
        <TabsContent value="trivia" className="mt-4">
          <InterviewTechnicalTrivia technicalTrivia={technicalTrivia} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InterviewMockSimulator({ technicalTrivia, behavioralBank }: { technicalTrivia: any[], behavioralBank: any[] }) {
  const pool = [...(technicalTrivia || []).map((t: any) => ({ ...t, type: "technical" })), ...(behavioralBank || []).map((b: any) => ({ ...b, question: b.question, answer: b.sampleAnswer, type: "behavioral" }))]
  const [current, setCurrent] = useState<{ question: string; answer: string } | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [seconds, setSeconds] = useState(120)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running || seconds <= 0) return
    const t = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [running, seconds])
  const pickRandom = () => {
    if (pool.length === 0) return
    const item = pool[Math.floor(Math.random() * pool.length)]
    setCurrent({ question: item.question, answer: item.answer || item.sampleAnswer })
    setRevealed(false)
    setSeconds(120)
    setRunning(true)
  }
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Get a random question and practice answering (2 min). Reveal the sample answer when ready.</p>
      {pool.length === 0 && <p className="text-sm text-muted-foreground">No questions loaded.</p>}
      {pool.length > 0 && !current && (
        <Button onClick={pickRandom}>Start mock question</Button>
      )}
      {current && (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span>
            <Button variant="ghost" size="sm" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Resume"}</Button>
          </div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">Question</CardTitle>
            </CardHeader>
            <CardContent className="text-sm pt-0">{current.question}</CardContent>
          </Card>
          {!revealed ? (
            <Button variant="secondary" onClick={() => setRevealed(true)}>Reveal sample answer</Button>
          ) : (
            <Card className="bg-muted/30 border-border">
              <CardHeader>
                <CardTitle className="text-sm">Sample answer</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap pt-0">{current.answer}</CardContent>
            </Card>
          )}
          <Button onClick={pickRandom}>Next question</Button>
        </>
      )}
    </div>
  )
}

function InterviewSTARBuilder() {
  const [stories, setStories] = useState<{ id: string; title: string; situation: string; task: string; action: string; result: string }[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(STAR_STORIES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [editing, setEditing] = useState<{ title: string; situation: string; task: string; action: string; result: string }>({ title: "", situation: "", task: "", action: "", result: "" })
  const [adding, setAdding] = useState(false)
  const saveToStorage = (next: typeof stories) => {
    setStories(next)
    try { localStorage.setItem(STAR_STORIES_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }
  const addStory = () => {
    if (!editing.title.trim()) return
    saveToStorage([...stories, { ...editing, id: `star-${Date.now()}` }])
    setEditing({ title: "", situation: "", task: "", action: "", result: "" })
    setAdding(false)
  }
  const deleteStory = (id: string) => { saveToStorage(stories.filter((s) => s.id !== id)) }
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Build STAR stories (Situation, Task, Action, Result) and save them for practice. Stored in this browser only.</p>
      {!adding ? (
        <Button onClick={() => setAdding(true)}>Add STAR story</Button>
      ) : (
        <Card className="bg-card border-border p-4 space-y-3">
          <Input placeholder="Story title (e.g. Phishing investigation)" value={editing.title} onChange={(e) => setEditing((x) => ({ ...x, title: e.target.value }))} />
          <Input placeholder="Situation" value={editing.situation} onChange={(e) => setEditing((x) => ({ ...x, situation: e.target.value }))} />
          <Input placeholder="Task" value={editing.task} onChange={(e) => setEditing((x) => ({ ...x, task: e.target.value }))} />
          <Input placeholder="Action" value={editing.action} onChange={(e) => setEditing((x) => ({ ...x, action: e.target.value }))} />
          <Input placeholder="Result" value={editing.result} onChange={(e) => setEditing((x) => ({ ...x, result: e.target.value }))} />
          <div className="flex gap-2">
            <Button onClick={addStory}>Save story</Button>
            <Button variant="outline" onClick={() => { setAdding(false); setEditing({ title: "", situation: "", task: "", action: "", result: "" }) }}>Cancel</Button>
          </div>
        </Card>
      )}
      <div className="space-y-2">
        {stories.map((s) => (
          <Card key={s.id} className="bg-card border-border">
            <CardHeader className="py-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm">{s.title || "Untitled"}</CardTitle>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteStory(s.id)}>Delete</Button>
              </div>
              <CardDescription className="text-xs mt-1"><strong>S:</strong> {s.situation} <strong>T:</strong> {s.task} <strong>A:</strong> {s.action} <strong>R:</strong> {s.result}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

function InterviewBehavioralBank({ behavioralBank }: { behavioralBank: any[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const list = behavioralBank || []
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Common behavioral questions with sample STAR-style answers.</p>
      {list.map((b: any) => (
        <Card key={b.id} className="bg-card border-border">
          <CardHeader className="py-3 cursor-pointer" onClick={() => setOpenId(openId === b.id ? null : b.id)}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">{b.question}</CardTitle>
              <Badge variant="outline" className="text-xs">{b.category}</Badge>
            </div>
          </CardHeader>
          {openId === b.id && (
            <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap pt-0">{b.sampleAnswer}</CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

function InterviewTechnicalTrivia({ technicalTrivia }: { technicalTrivia: any[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const list = technicalTrivia || []
  const item = list[index]
  const next = () => { setIndex((i) => (i + 1) % list.length); setFlipped(false) }
  if (list.length === 0) return <p className="text-sm text-muted-foreground">No trivia loaded.</p>
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Flashcard style. Click to reveal answer, then Next.</p>
      <Card className="bg-card border-border min-h-[120px] flex items-center justify-center p-6 cursor-pointer" onClick={() => setFlipped((f) => !f)}>
        <div className="text-center">
          <p className="font-medium">{flipped ? "Answer" : "Question"}</p>
          <p className="text-sm text-muted-foreground mt-2">{flipped ? item.answer : item.question}</p>
        </div>
      </Card>
      <div className="flex justify-between">
        <span className="text-xs text-muted-foreground">{index + 1} / {list.length}</span>
        <Button onClick={next}>Next</Button>
      </div>
    </div>
  )
}

function IOCHelperContent() {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <iframe
        src="/resources/ioc-helper"
        title="IOC Helper"
        className="flex-1 min-h-0 w-full border-0 rounded bg-background"
      />
    </div>
  )
}

// New Phase 0 + Phase 1 Components

function StartHereContent({ onNavigate }: { onNavigate: (appId: string) => void }) {
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('')
  const [timeAvailable, setTimeAvailable] = useState(0)
  const [suggestedTasks, setSuggestedTasks] = useState<any[]>([])
  
  const generateTasks = (selectedGoal: string, time: number) => {
    const taskMap: Record<string, any> = {
      'sec+_10': [
        { title: "Review port numbers", duration: "10 min", appId: "sec-plus", appName: "Sec+ Vault", description: "Quick review of common ports" },
        { title: "Practice flashcards", duration: "10 min", appId: "cheat-sheets", appName: "Cheat Sheets", description: "Review key concepts" }
      ],
      'sec+_30': [
        { title: "Study one domain", duration: "20 min", appId: "sec-plus", appName: "Sec+ Vault", description: "Deep dive into one Security+ domain" },
        { title: "Practice questions", duration: "10 min", appId: "sec-plus", appName: "Sec+ Vault", description: "Test your knowledge" }
      ],
      'sec+_60': [
        { title: "Complete practice exam", duration: "45 min", appId: "sec-plus", appName: "Sec+ Vault", description: "Full practice test" },
        { title: "Review mistakes", duration: "15 min", appId: "sec-plus", appName: "Sec+ Vault", description: "Learn from errors" }
      ],
      'incident-response_10': [
        { title: "Review a playbook", duration: "10 min", appId: "playbooks", appName: "Playbooks", description: "Quick playbook review" }
      ],
      'incident-response_30': [
        { title: "Read a case file", duration: "20 min", appId: "case-files", appName: "Case Files", description: "Study real investigation" },
        { title: "Review playbook", duration: "10 min", appId: "playbooks", appName: "Playbooks", description: "Response procedures" }
      ],
      'incident-response_60': [
        { title: "Complete case file study", duration: "40 min", appId: "case-files", appName: "Case Files", description: "Full investigation walkthrough" },
        { title: "Practice documentation", duration: "20 min", appId: "templates", appName: "Templates", description: "Write incident notes" }
      ],
      'general_10': [
        { title: "Quick reference review", duration: "10 min", appId: "cheat-sheets", appName: "Cheat Sheets", description: "Browse key concepts" }
      ],
      'general_30': [
        { title: "Try a practice lab", duration: "30 min", appId: "labs", appName: "Practice Labs", description: "Hands-on practice" }
      ],
      'general_60': [
        { title: "Complete full lab", duration: "45 min", appId: "labs", appName: "Labs", description: "Comprehensive lab exercise" },
        { title: "Document findings", duration: "15 min", appId: "templates", appName: "Templates", description: "Practice documentation" }
      ]
    }
    
    const key = `${selectedGoal}_${time}`
    const tasks = taskMap[key] || taskMap['general_30']
    setSuggestedTasks(tasks)
    setStep(3)
  }
  
  // Step 1: Goal selection
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-500" />
            Welcome to SOC OS!
          </h2>
          <p className="text-muted-foreground mb-6">
            Let's get you started with the right tasks for today.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">What are you focusing on today?</h3>
          <div className="grid gap-3">
            {[
              { id: 'sec+', label: 'Security+ Prep', icon: '🎓', desc: 'Study for certification exam' },
              { id: 'incident-response', label: 'Incident Response', icon: '🚨', desc: 'Practice investigations' },
              { id: 'general', label: 'General SOC Skills', icon: '🛡️', desc: 'Broad skill development' }
            ].map((goalOption) => (
              <Card 
                key={goalOption.id}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => {
                  setGoal(goalOption.id)
                  setStep(2)
                }}
              >
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goalOption.icon}</span>
                    <div>
                      <CardTitle className="text-base">{goalOption.label}</CardTitle>
                      <CardDescription className="text-xs">{goalOption.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  // Step 2: Time selection
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">How much time do you have?</h2>
          <p className="text-muted-foreground mb-6">
            I'll suggest tasks that fit your schedule.
          </p>
        </div>
        
        <div className="grid gap-3">
          {[
            { time: 10, label: '10 minutes', icon: '⚡', desc: 'Quick practice' },
            { time: 30, label: '30 minutes', icon: '🎯', desc: 'Focused session' },
            { time: 60, label: '60+ minutes', icon: '🔥', desc: 'Deep dive' }
          ].map((timeOption) => (
            <Card 
              key={timeOption.time}
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => {
                setTimeAvailable(timeOption.time)
                generateTasks(goal, timeOption.time)
              }}
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{timeOption.icon}</span>
                  <div>
                    <CardTitle className="text-base">{timeOption.label}</CardTitle>
                    <CardDescription className="text-xs">{timeOption.desc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <Button variant="ghost" onClick={() => setStep(1)}>
          ← Back
        </Button>
      </div>
    )
  }
  
  // Step 3: Suggested tasks
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Here's what I recommend:</h2>
        <p className="text-muted-foreground mb-6">
          Tasks tailored to your goals and available time.
        </p>
      </div>
      
      <div className="grid gap-4">
        {suggestedTasks.map((task, idx) => (
          <Card key={idx} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{task.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">{task.description}</CardDescription>
                </div>
                <Badge variant="secondary">{task.duration}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => onNavigate(task.appId)} 
                variant="default" 
                size="sm"
                className="w-full gap-2"
              >
                Launch {task.appName}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
        Start Over
      </Button>
    </div>
  )
}

function MissionsContent({ onNavigate }: { onNavigate: (appId: string) => void }) {
  const [tab, setTab] = useState<'daily' | 'practice'>('daily')
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex gap-2 mb-4 border-b border-border pb-4">
        <Button
          variant={tab === 'daily' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('daily')}
        >
          <Target className="h-4 w-4 mr-2" />
          Daily Mission
        </Button>
        <Button
          variant={tab === 'practice' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('practice')}
        >
          <Zap className="h-4 w-4 mr-2" />
          30-Min Practice
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'daily' && <DailyMissionContent onNavigate={onNavigate} />}
        {tab === 'practice' && <PracticeContent />}
      </div>
    </div>
  )
}

const MISSIONS_STORAGE_KEY = "soc-os-missions"
const MISSION_POOL = [
  { id: 1, duration: "10 MIN", badge: "Quick Mission", title: "Review 3 MITRE techniques", description: "Pick a tactic and study 3 techniques", appId: "cheat-sheets", appName: "Cheat Sheets" },
  { id: 2, duration: "30 MIN", badge: "Standard Mission", title: "Read a case file investigation", description: "Study a real SOC investigation walkthrough", appId: "case-files", appName: "Case Files" },
  { id: 3, duration: "60 MIN", badge: "Stretch Mission", title: "Complete a practice lab", description: "Hands-on training from start to finish", appId: "labs", appName: "Labs" },
  { id: 4, duration: "10 MIN", badge: "Quick Mission", title: "Run 5 Skill Drill questions", description: "Test your knowledge with random drills", appId: "skill-drills", appName: "Skill Drills" },
  { id: 5, duration: "30 MIN", badge: "Standard Mission", title: "Review a playbook", description: "Read one incident response playbook", appId: "playbooks", appName: "Playbooks" },
  { id: 6, duration: "15 MIN", badge: "Quick Mission", title: "Check threat intel feed", description: "Skim one threat intel source", appId: "threat-feed", appName: "Intel Feed" },
  { id: 7, duration: "20 MIN", badge: "Standard Mission", title: "Practice one mini game", description: "Play Port Quiz or Spot the Phishing", appId: "games", appName: "Games" },
  { id: 8, duration: "30 MIN", badge: "Standard Mission", title: "Work one incident ticket", description: "Read scenario and guided steps", appId: "tickets", appName: "Tickets" }
]

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const a = [...arr]
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i) | 0
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 16807) % 2147483647
    const j = Math.abs(h) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function DailyMissionContent({ onNavigate }: { onNavigate: (appId: string) => void }) {
  const todayKey = getTodayKey()
  const missions = useMemo(() => seededShuffle(MISSION_POOL, todayKey).slice(0, 3), [todayKey])
  
  const [completedToday, setCompletedToday] = useState<number[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(MISSIONS_STORAGE_KEY)
      if (!raw) return []
      const data = JSON.parse(raw) as Record<string, number[]>
      return data[todayKey] ?? []
    } catch { return [] }
  })

  const [historyDates, setHistoryDates] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem(MISSIONS_STORAGE_KEY)
      if (!raw) return []
      const data = JSON.parse(raw) as Record<string, number[]>
      return Object.keys(data).filter(d => (data[d]?.length ?? 0) > 0).sort().reverse().slice(0, 14)
    } catch { return [] }
  })

  const streak = useMemo(() => {
    try {
      const raw = localStorage.getItem(MISSIONS_STORAGE_KEY)
      if (!raw) return 0
      const data = JSON.parse(raw) as Record<string, number[]>
      let count = 0
      for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        if ((data[key]?.length ?? 0) > 0) count++
        else break
      }
      return count
    } catch { return 0 }
  }, [completedToday, historyDates])

  const markComplete = (id: number) => {
    const next = completedToday.includes(id) ? completedToday.filter(cid => cid !== id) : [...completedToday, id]
    setCompletedToday(next)
    try {
      const raw = localStorage.getItem(MISSIONS_STORAGE_KEY)
      const data: Record<string, number[]> = raw ? JSON.parse(raw) : {}
      data[todayKey] = next
      localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(data))
      setHistoryDates(Object.keys(data).filter(d => (data[d]?.length ?? 0) > 0).sort().reverse().slice(0, 14))
    } catch (_) {}
  }
  
  const getBadgeColor = (duration: string) => {
    if (duration === "10 MIN") return "bg-green-500/10 text-green-500 border-green-500/20"
    if (duration === "30 MIN") return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    return "bg-purple-500/10 text-purple-500 border-purple-500/20"
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Target className="h-6 w-6 text-sky-500" />
          Daily SOC Briefing
        </h2>
        <p className="text-muted-foreground mb-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">🔥</span>
          <span className="font-semibold">Streak: {streak} day{streak !== 1 ? "s" : ""}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {missions.map((mission) => (
          <Card key={mission.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={getBadgeColor(mission.duration)}>{mission.duration}</Badge>
                <Badge variant="outline">{mission.badge}</Badge>
              </div>
              <CardTitle className="text-base">{mission.title}</CardTitle>
              <CardDescription className="text-xs mt-1">{mission.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                onClick={() => onNavigate(mission.appId)} 
                variant="default" 
                size="sm"
                className="flex-1 gap-2"
              >
                Launch
                <ArrowRight className="h-3 w-3" />
              </Button>
              <Button 
                onClick={() => markComplete(mission.id)}
                variant={completedToday.includes(mission.id) ? "default" : "outline"}
                size="sm"
              >
                {completedToday.includes(mission.id) ? '✓ Done' : 'Mark Done'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(completedToday.length / 3) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {completedToday.length} of 3 missions complete
          </p>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Recent activity</CardTitle>
          <CardDescription className="text-xs">Days you completed at least one mission</CardDescription>
        </CardHeader>
        <CardContent>
          {historyDates.length === 0 ? (
            <p className="text-xs text-muted-foreground">Complete a mission to see history here.</p>
          ) : (
            <ul className="text-xs text-muted-foreground space-y-1">
              {historyDates.slice(0, 7).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CaseFilesContent({ caseFiles, currentPath, onNavigate, appIntros }: { caseFiles: any[], currentPath: string, onNavigate: (path: string) => void; appIntros?: Record<string, string> }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [view, itemId] = currentPath.split(':')
  const caseFile = itemId ? caseFiles.find(c => c.id === itemId) : null
  
  useEffect(() => {
    if (caseFile) {
      setLoading(true)
      fetch(`${GITHUB_RAW_BASE}/${caseFile.githubPath}`)
        .then(res => res.ok ? res.text() : null)
        .then(text => {
          setContent(text && text.length > 50 ? text : null)
          setLoading(false)
        })
        .catch(() => {
          setContent(null)
          setLoading(false)
        })
    }
  }, [caseFile])
  
  // Viewing specific case file
  if (caseFile) {
    const getSeverityColor = (severity: string) => {
      if (severity === "Critical") return "bg-red-500/10 text-red-500 border-red-500/20"
      if (severity === "High") return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
    
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="h-5 w-5 text-violet-500" />
            <h2 className="text-2xl font-semibold">{caseFile.title}</h2>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">Case #{caseFile.caseNumber}</Badge>
            <Badge className={getSeverityColor(caseFile.severity)}>{caseFile.severity}</Badge>
            <Badge variant="secondary">{caseFile.duration}</Badge>
          </div>
          <p className="text-muted-foreground mb-4">{caseFile.description}</p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={`${GITHUB_BASE_URL}/blob/main/${caseFile.githubPath}`} target="_blank" rel="noopener noreferrer">
              <Github className="h-3 w-3" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading investigation...</p>
          </div>
        ) : content ? (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <div className="p-8 text-center border border-border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">Content not yet available on GitHub</p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              This case file exists locally but hasn't been pushed to the repository yet.
            </p>
          </div>
        )}
      </div>
    )
  }
  
  // List view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Case Files</h2>
        <p className="text-muted-foreground">Real investigations from my SOC training. Walkthroughs and lessons learned.</p>
      </div>
      <AppIntro appId="case-files" appIntros={appIntros} />
      <div className="grid gap-4">
        {caseFiles.map((caseFile) => {
          const getSeverityColor = (severity: string) => {
            if (severity === "Critical") return "bg-red-500/10 text-red-500 border-red-500/20"
            if (severity === "High") return "bg-orange-500/10 text-orange-500 border-orange-500/20"
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          }
          
          return (
            <Card key={caseFile.id} className="bg-card border-border hover:border-violet-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">Case #{caseFile.caseNumber}</Badge>
                  <Badge className={getSeverityColor(caseFile.severity)}>{caseFile.severity}</Badge>
                </div>
                <CardTitle className="text-base">{caseFile.title}</CardTitle>
                <CardDescription className="text-xs mt-1">{caseFile.description}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">⏱️ {caseFile.duration}</span>
                  <span className="text-xs text-muted-foreground">• {caseFile.date}</span>
                </div>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button 
                  onClick={() => onNavigate(`case-files:${caseFile.id}`)}
                  variant="default" 
                  size="sm" 
                  className="flex-1 gap-2"
                >
                  View Investigation
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`${GITHUB_BASE_URL}/blob/main/${caseFile.githubPath}`} target="_blank" rel="noopener noreferrer">
                    <Github className="h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function PlaybooksContent({ playbooks, currentPath, onNavigate, appIntros }: { playbooks: any[], currentPath: string, onNavigate: (path: string) => void; appIntros?: Record<string, string> }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const [view, itemId] = currentPath.split(':')
  const playbook = itemId ? playbooks.find(p => p.id === itemId) : null
  
  useEffect(() => {
    if (playbook) {
      setLoading(true)
      fetch(`${GITHUB_RAW_BASE}/${playbook.githubPath}`)
        .then(res => res.ok ? res.text() : null)
        .then(text => {
          setContent(text && text.length > 50 ? text : null)
          setLoading(false)
        })
        .catch(() => {
          setContent(null)
          setLoading(false)
        })
    }
  }, [playbook])
  
  // Viewing specific playbook
  if (playbook) {
    const getSeverityColor = (severity: string) => {
      if (severity === "Critical") return "bg-red-500/10 text-red-500 border-red-500/20"
      if (severity === "High") return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
    
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-5 w-5 text-rose-500" />
            <h2 className="text-2xl font-semibold">{playbook.title}</h2>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getSeverityColor(playbook.severity)}>{playbook.severity}</Badge>
            <Badge variant="secondary">⏱️ {playbook.estimatedTime}</Badge>
          </div>
          <p className="text-muted-foreground mb-4">{playbook.description}</p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={`${GITHUB_BASE_URL}/blob/main/${playbook.githubPath}`} target="_blank" rel="noopener noreferrer">
              <Github className="h-3 w-3" />
              View on GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading playbook...</p>
          </div>
        ) : content ? (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <div className="p-8 text-center border border-border rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-2">Content not yet available on GitHub</p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              This playbook exists locally but hasn't been pushed to the repository yet.
            </p>
          </div>
        )}
      </div>
    )
  }
  
  // List view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">SOC Playbooks</h2>
        <p className="text-muted-foreground">Step-by-step response procedures for common security incidents.</p>
      </div>
      <AppIntro appId="playbooks" appIntros={appIntros} />
      <div className="grid gap-4">
        {playbooks.map((playbook) => {
          const getSeverityColor = (severity: string) => {
            if (severity === "Critical") return "bg-red-500/10 text-red-500 border-red-500/20"
            if (severity === "High") return "bg-orange-500/10 text-orange-500 border-orange-500/20"
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          }
          
          return (
            <Card key={playbook.id} className="bg-card border-border hover:border-rose-500/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getSeverityColor(playbook.severity)}>{playbook.severity}</Badge>
                  <Badge variant="outline" className="text-xs">⏱️ {playbook.estimatedTime}</Badge>
                </div>
                <CardTitle className="text-base">{playbook.title}</CardTitle>
                <CardDescription className="text-xs mt-1">{playbook.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button 
                  onClick={() => onNavigate(`playbooks:${playbook.id}`)}
                  variant="default" 
                  size="sm" 
                  className="flex-1 gap-2"
                >
                  View Playbook
                  <ArrowRight className="h-3 w-3" />
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={`${GITHUB_BASE_URL}/blob/main/${playbook.githubPath}`} target="_blank" rel="noopener noreferrer">
                    <Github className="h-3 w-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SecPlusVaultContent({ secPlusVault }: { secPlusVault: any }) {
  const [activeTab, setActiveTab] = useState('overview')
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-amber-500" />
          Security+ Vault
        </h2>
        <p className="text-muted-foreground">Study materials and resources for CompTIA Security+ exam prep.</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'overview', label: 'Study Plan' },
          { id: 'cheatsheets', label: 'Cheat Sheets' },
          { id: 'resources', label: 'Resources' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">{secPlusVault.studyPlan.title}</CardTitle>
              <CardDescription className="text-xs">{secPlusVault.studyPlan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-semibold mb-2">Exam Domains:</p>
                {secPlusVault.studyPlan.topics.map((topic: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
              {secPlusVault.studyPlan.twoWeekPlan && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">2-Week Study Plan:</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">{secPlusVault.studyPlan.twoWeekPlan}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">Study Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Focus on understanding concepts, not just memorization</p>
              <p>• Practice with hands-on labs whenever possible</p>
              <p>• Take regular practice exams to identify weak areas</p>
              <p>• Review port numbers and acronyms daily</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === 'cheatsheets' && (
        <div className="grid gap-4">
          {secPlusVault.cheatSheets.map((sheet: any) => (
            <Card key={sheet.id} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">{sheet.title}</CardTitle>
                <CardDescription className="text-xs">{sheet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{sheet.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {activeTab === 'resources' && (
        <div className="grid gap-4">
          {secPlusVault.resources.map((resource: any, idx: number) => (
            <Card key={idx} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">{resource.title}</CardTitle>
                <Badge variant="secondary" className="w-fit">{resource.type}</Badge>
              </CardHeader>
              <CardContent>
                <Button asChild variant="default" size="sm" className="w-full gap-2">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Visit Resource
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Phase 2 Components

function ThreatFeedContent({ threatFeed }: { threatFeed: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const categories = ['all', 'Government', 'News', 'Research', 'Vendor', 'Threat Intel']
  
  const filteredFeed = useMemo(() => selectedCategory === 'all' ? threatFeed : threatFeed.filter((item: any) => item.category === selectedCategory), [threatFeed, selectedCategory])
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Government': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'News': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Research': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Vendor': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Threat Intel': 'bg-red-500/10 text-red-500 border-red-500/20'
    }
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Radio className="h-6 w-6 text-teal-500" />
            Threat Intelligence Feed
          </h2>
          <p className="text-muted-foreground">Stay current with the latest security advisories and threat intelligence.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Sources' : cat}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="grid gap-4 pr-2">
        {filteredFeed.map((source) => (
          <Card key={source.id} className="bg-card border-border hover:border-teal-500/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={getCategoryColor(source.category)}>{source.category}</Badge>
                <Badge variant="outline" className="text-xs">📡 {source.updateFrequency}</Badge>
              </div>
              <CardTitle className="text-base">{source.title}</CardTitle>
              <CardDescription className="text-xs mt-1">{source.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" size="sm" className="w-full gap-2">
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  Visit Feed
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </div>
  )
}

function CLICheatsContent({ cliCommands, cliSyntaxGuide, appIntros }: { cliCommands: any[]; cliSyntaxGuide?: { sections: { title: string; body: string }[] }; appIntros?: Record<string, string> }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebouncedValue(searchQuery, 300)
  
  const categories = useMemo(() => ['all', ...Array.from(new Set(cliCommands.map((cmd: any) => cmd.category)))], [cliCommands])
  
  const filteredCommands = useMemo(() => cliCommands.filter((cmd: any) => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory
    const q = debouncedSearch.toLowerCase()
    const matchesSearch = !q || cmd.command.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q) || (cmd.syntax && cmd.syntax.toLowerCase().includes(q))
    return matchesCategory && matchesSearch
  }), [cliCommands, selectedCategory, debouncedSearch])
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Code2 className="h-6 w-6 text-[#4e7cf6]" />
            Command Line Cheatbook
          </h2>
          <p className="text-muted-foreground">Essential commands for SOC log analysis and investigation.</p>
        </div>
        <AppIntro appId="cli-cheats" appIntros={appIntros} />

        {cliSyntaxGuide?.sections && cliSyntaxGuide.sections.length > 0 && (
          <Card className="bg-muted/30 border-[#4e7cf6]/20">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Understanding the syntax</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {cliSyntaxGuide.sections.map((s: { title: string; body: string }, i: number) => (
                <div key={i}>
                  <span className="text-xs font-semibold text-foreground">{s.title}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All' : cat}
            </Button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search commands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto mt-4">
        <div className="space-y-3 pr-2">
        {filteredCommands.map((cmd, idx) => (
          <Card key={idx} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="text-xs">{cmd.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">{cmd.description}</p>
                <div className="flex items-start gap-2">
                  <code className="flex-1 block p-3 bg-muted rounded-lg text-sm font-mono overflow-x-auto">
                    {cmd.command}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(cmd.command)}
                    title="Copy to clipboard"
                  >
                    📋
                  </Button>
                </div>
              </div>

              {cmd.syntax && (
                <div>
                  <p className="text-xs font-semibold mb-1">Syntax / breakdown</p>
                  <p className="text-xs text-muted-foreground">{cmd.syntax}</p>
                </div>
              )}
              
              {cmd.examples && cmd.examples.length > 0 && (
                <div>
                  <p className="text-xs font-semibold mb-1">Examples:</p>
                  <div className="space-y-1">
                    {cmd.examples.map((example: string, i: number) => (
                      <code key={i} className="block p-2 bg-muted/50 rounded text-xs font-mono">
                        {example}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredCommands.length === 0 && (
          <div className="text-center p-8 border border-border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No commands found matching your search.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

function ToolboxContent({ toolbox }: { toolbox: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Package className="h-6 w-6 text-slate-400" />
          SOC Analyst Toolbox
        </h2>
        <p className="text-muted-foreground">{toolbox.description}</p>
      </div>
      
      {toolbox.categories.map((category: any, idx: number) => (
        <div key={idx}>
          <h3 className="font-semibold text-lg mb-3">{category.name}</h3>
          <div className="grid gap-4">
            {category.tools.map((tool: any, toolIdx: number) => (
              <Card key={toolIdx} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">{tool.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold mb-1">Installation:</p>
                    <code className="block p-2 bg-muted rounded text-xs font-mono">
                      {tool.install}
                    </code>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full gap-2">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function GlossaryContent({ glossary }: { glossary: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const debouncedSearch = useDebouncedValue(searchQuery, 300)
  
  const categories = useMemo(() => ['all', ...Array.from(new Set(glossary.map((term: any) => term.category)))], [glossary])
  
  const filteredTerms = useMemo(() => glossary.filter((term: any) => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
    const q = debouncedSearch.toLowerCase()
    const matchesSearch = !q || term.term.toLowerCase().includes(q) || term.definition.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  }).sort((a: any, b: any) => a.term.localeCompare(b.term)), [glossary, selectedCategory, debouncedSearch])
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Tools': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Threat Intel': 'bg-red-500/10 text-red-500 border-red-500/20',
      'Attack Technique': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Detection': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Framework': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      'Log Analysis': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      'SIEM': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'Metrics': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      'Attack Type': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      'Vulnerability': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      'Network Analysis': 'bg-teal-500/10 text-teal-500 border-teal-500/20'
    }
    return colors[category] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
  
  return (
    <div className="space-y-4">
      {/* Header - no nested scroll; window content area handles all scrolling */}
      <div className="space-y-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <BookA className="h-6 w-6 text-fuchsia-500" />
            SOC Dictionary
          </h2>
          <p className="text-muted-foreground">Essential security terms and definitions for SOC analysts.</p>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </Button>
          ))}
        </div>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Content - single scroll context from parent window */}
      <div className="space-y-3 pr-2">
          {filteredTerms.map((term, idx) => (
            <Card key={idx} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-base font-bold">{term.term}</CardTitle>
                  <Badge className={getCategoryColor(term.category)}>{term.category}</Badge>
                </div>
                <CardDescription className="text-sm">{term.definition}</CardDescription>
              </CardHeader>
              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <CardContent>
                  <p className="text-xs font-semibold mb-2">Related Terms:</p>
                  <div className="flex flex-wrap gap-2">
                    {term.relatedTerms.map((related: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {related}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
          
          {filteredTerms.length === 0 && (
            <div className="text-center p-8 border border-border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">No terms found matching your search.</p>
            </div>
          )}
      </div>
    </div>
  )
}

// Phase 4 Components

function SkillDrillsContent({ skillDrills, currentPath, onNavigate, onGoBack }: { skillDrills: any; currentPath?: string; onNavigate?: (path: string) => void; onGoBack?: () => void }) {
  const pathCategoryId = (currentPath || "skill-drills").split(":")[1]
  const selectedCategory = pathCategoryId ? skillDrills.categories.find((c: any) => c.id === pathCategoryId) ?? null : null
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizComplete, setQuizComplete] = useState(false)
  
  // Category selection screen
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-emerald-400" />
            Skill Drills
          </h2>
          <p className="text-muted-foreground">Quick practice to sharpen your SOC skills. Test your knowledge with focused quizzes.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {skillDrills.categories.map((cat: any) => (
            <Card 
              key={cat.id}
              className="cursor-pointer hover:border-emerald-500/50 transition-all"
              onClick={() => {
                onNavigate?.("skill-drills:" + cat.id)
                setCurrentQuestion(0)
                setScore(0)
                setShowExplanation(false)
                setSelectedAnswer(null)
                setQuizComplete(false)
              }}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{cat.icon}</span>
                  <CardTitle className="text-base">{cat.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">{cat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-xs">
                  {cat.drills.length} questions
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  
  // Quiz complete screen
  if (quizComplete) {
    const percentage = Math.round((score / selectedCategory.drills.length) * 100)
    const getGrade = () => {
      if (percentage >= 90) return { grade: 'A', message: 'Excellent!', color: 'text-green-500' }
      if (percentage >= 80) return { grade: 'B', message: 'Great job!', color: 'text-blue-500' }
      if (percentage >= 70) return { grade: 'C', message: 'Good effort!', color: 'text-yellow-500' }
      return { grade: 'D', message: 'Keep practicing!', color: 'text-orange-500' }
    }
    const result = getGrade()
    
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>
          <div className={`text-6xl font-bold ${result.color}`}>{percentage}%</div>
          <p className="text-xl">{result.message}</p>
          <p className="text-muted-foreground">
            You got {score} out of {selectedCategory.drills.length} questions correct
          </p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button onClick={() => {
            setCurrentQuestion(0)
            setScore(0)
            setShowExplanation(false)
            setSelectedAnswer(null)
            setQuizComplete(false)
          }}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => onGoBack?.()}>
            Back to Categories
          </Button>
        </div>
      </div>
    )
  }
  
  // Quiz interface
  const drill = selectedCategory.drills[currentQuestion]
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">{selectedCategory.title}</h3>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {selectedCategory.drills.length}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">Score: {score}/{currentQuestion || 0}</p>
          {currentQuestion > 0 && (
            <p className="text-xs text-muted-foreground">
              {Math.round((score / currentQuestion) * 100)}%
            </p>
          )}
        </div>
      </div>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">{drill.question}</CardTitle>
        </CardHeader>
        {drill.log && (
          <CardContent className="pt-0">
            <pre className="p-3 bg-muted rounded-lg text-xs font-mono overflow-x-auto mb-4">
              {drill.log}
            </pre>
          </CardContent>
        )}
        <CardContent className={drill.log ? "pt-0" : ""}>
          <div className="space-y-2">
            {drill.options.map((option: string, idx: number) => (
              <Button
                key={idx}
                variant={selectedAnswer === idx ? 'default' : 'outline'}
                onClick={() => {
                  if (!showExplanation) {
                    setSelectedAnswer(idx)
                    setShowExplanation(true)
                    if (idx === drill.correct) setScore(score + 1)
                  }
                }}
                disabled={showExplanation}
                className={`w-full justify-start text-left h-auto py-3 ${
                  showExplanation 
                    ? idx === drill.correct 
                      ? 'border-green-500 bg-green-500/10' 
                      : idx === selectedAnswer 
                        ? 'border-red-500 bg-red-500/10' 
                        : ''
                    : ''
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          
          {showExplanation && (
            <div className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === drill.correct 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <h4 className="font-semibold mb-2">
                {selectedAnswer === drill.correct ? '✓ Correct!' : '✗ Incorrect'}
              </h4>
              <p className="text-sm">{drill.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        {showExplanation && (
          <Button onClick={() => {
            if (currentQuestion < selectedCategory.drills.length - 1) {
              setCurrentQuestion(currentQuestion + 1)
              setShowExplanation(false)
              setSelectedAnswer(null)
            } else {
              setQuizComplete(true)
            }
          }} className="flex-1">
            {currentQuestion < selectedCategory.drills.length - 1 ? 'Next Question →' : 'Finish Quiz'}
          </Button>
        )}
        <Button variant="outline" onClick={() => onGoBack?.()}>
          Back to Categories
        </Button>
      </div>
    </div>
  )
}

function GamesContent({ onOpenApp, currentPath, onNavigate, onGoBack }: { onOpenApp: (appId: string) => void; currentPath?: string; onNavigate?: (path: string) => void; onGoBack?: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-pink-400" />
          Games
        </h2>
        <p className="text-muted-foreground">Training games and simulations.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20 bg-muted/30 opacity-90">
          <CardHeader>
            <CardTitle className="text-base">Corporate Espionage Simulator</CardTitle>
            <CardDescription>Full game experience — coming soon.</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-pink-400/50 transition-all"
          onClick={() => onOpenApp("mini-game")}
        >
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-pink-400" />
              Mini Games
            </CardTitle>
            <CardDescription>Quick SOC training games (Port Quiz, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" size="sm">Open</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReportBuilderPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-amber-500" />
          Report Builder
        </h2>
        <p className="text-muted-foreground">Build incident reports and post-mortems from templates. Export to PDF or share with stakeholders.</p>
      </div>
      <Card className="border-amber-500/20 bg-muted/30">
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm font-medium">What this will do</p>
          <p className="text-sm text-muted-foreground">Templates for incident reports, executive summaries, and timeline exports. You’ll pick a template, fill in fields, and export or copy the result for tickets and handoffs.</p>
          <Badge variant="secondary">Coming Soon</Badge>
          <p className="text-sm text-muted-foreground mt-2">In the meantime: use the <strong>Templates</strong> app for report structure and the <strong>Tickets</strong> app to document investigations.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function ThreatMapPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Globe className="h-6 w-6 text-red-400" />
          Threat Map
        </h2>
        <p className="text-muted-foreground">Visualize live or sample threat intel data on a world map. See attack origins, targets, and trends.</p>
      </div>
      <Card className="border-red-400/20 bg-muted/30">
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm font-medium">What this will do</p>
          <p className="text-sm text-muted-foreground">An interactive map showing threat feed data: source/target locations, attack types, and time-based filtering for situational awareness and briefings.</p>
          <Badge variant="secondary">Coming Soon</Badge>
          <p className="text-sm text-muted-foreground mt-2">In the meantime: use the <strong>Intel Feed</strong> app for threat sources and the <strong>IOC Helper</strong> to look up IPs and domains.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function CompliancePlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-green-500" />
          Compliance
        </h2>
        <p className="text-muted-foreground">Checklists and mappings for NIST CSF, CIS Controls, and other frameworks. Track control coverage.</p>
      </div>
      <Card className="border-green-500/20 bg-muted/30">
        <CardContent className="pt-6 space-y-3">
          <p className="text-sm font-medium">What this will do</p>
          <p className="text-sm text-muted-foreground">Framework checklists (e.g. NIST CSF, CIS Controls) and control mappings so you can track SOC and security posture coverage for audits and reporting.</p>
          <Badge variant="secondary">Coming Soon</Badge>
          <p className="text-sm text-muted-foreground mt-2">In the meantime: use <strong>Templates</strong> for incident and review docs, and your org’s GRC tool for formal control tracking.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function RunbooksContent({ runbooks, appIntros }: { runbooks: { id: string; title: string; category: string; steps: string[]; githubPath?: string | null }[]; appIntros?: Record<string, string> }) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const debouncedSearch = useDebouncedValue(searchQuery, 300)

  const categories = useMemo(() => ["all", ...Array.from(new Set(runbooks.map((r: any) => r.category)))], [runbooks])
  const filtered = useMemo(() => runbooks.filter((r: any) => {
    const matchCat = categoryFilter === "all" || r.category === categoryFilter
    const q = debouncedSearch.toLowerCase()
    const matchSearch = !q || r.title.toLowerCase().includes(q)
    return matchCat && matchSearch
  }), [runbooks, categoryFilter, debouncedSearch])

  const selected = selectedId ? runbooks.find((r: any) => r.id === selectedId) : null

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2 -ml-1" onClick={() => setSelectedId(null)}>
          <ArrowLeft className="h-4 w-4" /> Back to runbooks
        </Button>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">{selected.title}</CardTitle>
            <Badge variant="secondary">{selected.category}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              {selected.steps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            {selected.githubPath && (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <a href={`${GITHUB_BASE_URL}/blob/main/${selected.githubPath}`} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="h-3 w-3" /> Open full playbook on GitHub <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-400" />
          Runbooks
        </h2>
        <p className="text-muted-foreground">Step-by-step procedures for triage, escalation, and tools.</p>
      </div>
      <AppIntro appId="runbooks" appIntros={appIntros} />
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Button key={c} variant={categoryFilter === c ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(c)}>{c === "all" ? "All" : c}</Button>
        ))}
      </div>
      <Input placeholder="Search by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-xs" />
      <div className="grid gap-3">
        {filtered.map((r: any) => (
          <Card key={r.id} className="bg-card border-border cursor-pointer hover:border-indigo-400/50 transition-colors" onClick={() => setSelectedId(r.id)}>
            <CardContent className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{r.title}</p>
                <Badge variant="outline" className="text-xs mt-1">{r.category}</Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const ALERTS_STORAGE_KEY = "soc-os-alerts"
type AlertStatus = "new" | "assigned" | "in-progress" | "resolved"

function AlertsContent({ tickets, onOpenApp, appIntros }: { tickets: any[]; onOpenApp?: (appId: string) => void; appIntros?: Record<string, string> }) {
  const [alertState, setAlertState] = useState<Record<string, { status: AlertStatus; assignedTo?: string }>>(() => {
    if (typeof window === "undefined") return {}
    try {
      const s = localStorage.getItem(ALERTS_STORAGE_KEY)
      return s ? JSON.parse(s) : {}
    } catch { return {} }
  })
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const saveState = useCallback((next: Record<string, { status: AlertStatus; assignedTo?: string }>) => {
    setAlertState(next)
    try { localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(next)) } catch (_) {}
  }, [])

  const getStatus = (ticketId: string): AlertStatus => alertState[ticketId]?.status ?? "new"
  const getAssigned = (ticketId: string) => alertState[ticketId]?.assignedTo

  const setStatus = (ticketId: string, status: AlertStatus, assignedTo?: string) => {
    saveState({ ...alertState, [ticketId]: { ...alertState[ticketId], status, assignedTo: assignedTo ?? alertState[ticketId]?.assignedTo } })
  }

  const alerts = useMemo(() => {
    let list = tickets.map((t: any) => ({ ...t, status: getStatus(t.id), assignedTo: getAssigned(t.id) }))
    if (statusFilter !== "all") list = list.filter((a: any) => a.status === statusFilter)
    const order: AlertStatus[] = ["new", "assigned", "in-progress", "resolved"]
    list.sort((a: any, b: any) => order.indexOf(a.status) - order.indexOf(b.status))
    return list
  }, [tickets, alertState, statusFilter])

  const selectedTicket = selectedId ? tickets.find((t: any) => t.id === selectedId) : null

  const statusBadge = (status: AlertStatus) => {
    const m: Record<AlertStatus, string> = { new: "bg-amber-500/10 text-amber-500", assigned: "bg-blue-500/10 text-blue-500", "in-progress": "bg-cyan-500/10 text-cyan-500", resolved: "bg-green-500/10 text-green-500" }
    return <Badge className={m[status]} variant="outline">{status}</Badge>
  }

  if (selectedTicket) {
    const status = getStatus(selectedTicket.id)
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2 -ml-1" onClick={() => setSelectedId(null)}>
          <ArrowLeft className="h-4 w-4" /> Back to queue
        </Button>
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base">{selectedTicket.title}</CardTitle>
              {statusBadge(status)}
            </div>
            <Badge variant="secondary" className="mt-1">{selectedTicket.category}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
            {selectedTicket.scenario && (
              <div>
                <p className="text-xs font-semibold mb-1">Scenario</p>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{selectedTicket.scenario}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {status !== "assigned" && status !== "in-progress" && (
                <Button size="sm" variant="outline" onClick={() => { setStatus(selectedTicket.id, "assigned", "Me"); setSelectedId(null) }}>Assign to me</Button>
              )}
              {status !== "in-progress" && status !== "resolved" && (
                <Button size="sm" variant="outline" onClick={() => setStatus(selectedTicket.id, "in-progress")}>Mark in progress</Button>
              )}
              {status !== "resolved" && (
                <Button size="sm" variant="default" onClick={() => { setStatus(selectedTicket.id, "resolved"); setSelectedId(null) }}>Mark resolved</Button>
              )}
              {status === "resolved" && (
                <Button size="sm" variant="ghost" onClick={() => setStatus(selectedTicket.id, "new")}>Reopen</Button>
              )}
              {onOpenApp && (
                <Button size="sm" variant="secondary" onClick={() => { onOpenApp("tickets"); setSelectedId(null) }}>
                  Open in Tickets
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Bell className="h-6 w-6 text-yellow-500" />
          Alerts
        </h2>
        <p className="text-muted-foreground">Triage queue. Assign and track status; open in Tickets for full investigation.</p>
      </div>
      <AppIntro appId="alerts" appIntros={appIntros} />
      <div className="flex flex-wrap gap-2">
        {(["all", "new", "assigned", "in-progress", "resolved"] as const).map((s) => (
          <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>{s === "all" ? "All" : s}</Button>
        ))}
      </div>
      <div className="space-y-2">
        {alerts.map((alert: any) => (
          <Card key={alert.id} className="bg-card border-border cursor-pointer hover:border-yellow-500/50 transition-colors" onClick={() => setSelectedId(alert.id)}>
            <CardContent className="py-3 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-medium text-sm">{alert.title}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{alert.category}</Badge>
                  {statusBadge(alert.status)}
                  {alert.assignedTo && <span className="text-xs text-muted-foreground">→ {alert.assignedTo}</span>}
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                {alert.status === "new" && <Button size="sm" variant="ghost" onClick={() => setStatus(alert.id, "assigned", "Me")}>Assign</Button>}
                {alert.status !== "resolved" && <Button size="sm" variant="ghost" onClick={() => setStatus(alert.id, "resolved")}>Resolve</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Placeholder image URLs - replace with your own generated weird pics in /public/weird-pics/
const WEIRD_PICS = [
  "/weird-pics/1.jpg",
  "/weird-pics/2.jpg",
  "/weird-pics/3.jpg",
  "/weird-pics/4.jpg",
  "/weird-pics/5.jpg",
  "/weird-pics/6.jpg",
].map((src, i) => ({ src, alt: `Weird pic ${i + 1}`, placeholder: `https://picsum.photos/seed/weird${i}/400/400` }))

function WeirdPicsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-rose-400" />
          Weird Pics
        </h2>
        <p className="text-muted-foreground">A folder of strange images. Add your own to <code className="text-xs bg-muted px-1 rounded">/public/weird-pics/</code> (1.jpg–6.jpg) to replace these placeholders.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {WEIRD_PICS.map(({ src, alt, placeholder }, i) => (
          <div key={i} className="aspect-square rounded-lg border-2 border-border bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement
                el.src = placeholder
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const FUNNY_DOCS = [
  { id: "passwords", name: "CEO_PASSWORDS_2026.xlsx", content: "Password1\nPassword2\nPassword123\nhunter2\ncorrecthorsebatterystaple\n(Just kidding. Use a password manager.)", jumpScare: false },
  { id: "aliens", name: "INCIDENT_REPORT_ALIEN_ABDUCTION.pdf", content: "CLASSIFIED\n\nSubject: Unauthorized access to secure facility\n\nThe perpetrator was described as 'green, many eyes, and definitely not from this planet.'\n\nStatus: Escalated to Men in Black.\n\nDo not distribute.", jumpScare: false },
  { id: "cursed", name: "DO_NOT_OPEN.txt", content: "You weren't supposed to open this.", jumpScare: true },
  { id: "secrets", name: "REAL_SECRETS_DO_NOT_OPEN.txt", content: "The real secret is that there are no secrets. Except this one: you're doing great. Keep studying. 🫡", jumpScare: false },
  { id: "budget", name: "SOC_BUDGET_APPROVAL.docx", content: "REQUEST: $4.2M for 'AI that does the job for us'\n\nSTATUS: Denied.\n\nCOMMENT: 'Try caffeine first.' — Management", jumpScare: false },
]

function FunnyDocsContent({ onJumpScare }: { onJumpScare: () => void }) {
  const [openDoc, setOpenDoc] = useState<typeof FUNNY_DOCS[0] | null>(null)
  const open = (doc: typeof FUNNY_DOCS[0]) => {
    setOpenDoc(doc)
    if (doc.jumpScare) setTimeout(onJumpScare, 400)
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <FileText className="h-6 w-6 text-lime-400" />
          Funny Documents
        </h2>
        <p className="text-muted-foreground">Classified. Confidential. Mostly nonsense.</p>
      </div>
      {openDoc ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-mono">{openDoc.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setOpenDoc(null)}>← Back</Button>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg">{openDoc.content}</pre>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {FUNNY_DOCS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => open(doc)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 text-left transition-colors"
            >
              <FileText className="h-5 w-5 text-lime-400 shrink-0" />
              <span className="font-mono text-sm truncate">{doc.name}</span>
              {doc.id === "cursed" && <Badge variant="secondary" className="ml-auto text-xs">???</Badge>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MiniGameContent({ miniGames, currentPath, onNavigate, onGoBack }: { miniGames: any[]; currentPath?: string; onNavigate?: (path: string) => void; onGoBack?: () => void }) {
  const pathGameId = (currentPath || "mini-game").split(":")[1]
  const selectedGame = pathGameId ? miniGames.find((g: any) => g.id === pathGameId) ?? null : null
  
  // Game selection screen
  if (!selectedGame) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-pink-400" />
            SOC Training Games
          </h2>
          <p className="text-muted-foreground">Fun, gamified practice to reinforce SOC skills.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {miniGames.map((game: any) => {
            const getDifficultyColor = (diff: string) => {
              if (diff === "Easy") return "bg-green-500/10 text-green-500 border-green-500/20"
              if (diff === "Medium") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              return "bg-red-500/10 text-red-500 border-red-500/20"
            }
            
            return (
              <Card 
                key={game.id}
                className="cursor-pointer hover:border-pink-400/50 transition-all"
                onClick={() => onNavigate?.("mini-game:" + game.id)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{game.title}</CardTitle>
                  <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                  <CardDescription className="text-xs mt-2">{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="default" size="sm" className="w-full">
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            More games and challenges will be added. Current games are in development!
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Port Quiz Game
  if (selectedGame.id === "port-quiz") {
    return <PortQuizGame onBack={() => onGoBack?.()} />
  }
  
  // Find the Malicious IP
  if (selectedGame.id === "find-malicious-ip") {
    return <FindMaliciousIPGame onBack={() => onGoBack?.()} />
  }
  
  // Spot the Phishing
  if (selectedGame.id === "spot-phishing") {
    return <SpotPhishingGame onBack={() => onGoBack?.()} />
  }
  
  // Decode the Payload
  if (selectedGame.id === "decode-payload") {
    return <DecodePayloadGame onBack={() => onGoBack?.()} />
  }
  
  // MITRE Bingo
  if (selectedGame.id === "mitre-bingo") {
    return <MitreBingoGame onBack={() => onGoBack?.()} />
  }
  
  // Game screen (placeholder for others)
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{selectedGame.title}</h2>
        <Badge variant="secondary">{selectedGame.difficulty}</Badge>
      </div>
      
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Game Mode: {selectedGame.type}</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-muted-foreground mb-4">
            {selectedGame.description}
          </p>
          <p className="text-sm text-muted-foreground/70 mb-6">
            Game mechanics coming soon! Check back for updates.
          </p>
          <Button onClick={() => onGoBack?.()}>
            Back to Games
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PortQuizGame({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [highScore, setHighScore] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const ports = [
    { port: 21, service: 'FTP' },
    { port: 22, service: 'SSH' },
    { port: 23, service: 'Telnet' },
    { port: 25, service: 'SMTP' },
    { port: 53, service: 'DNS' },
    { port: 80, service: 'HTTP' },
    { port: 110, service: 'POP3' },
    { port: 143, service: 'IMAP' },
    { port: 443, service: 'HTTPS' },
    { port: 445, service: 'SMB' },
    { port: 3306, service: 'MySQL' },
    { port: 3389, service: 'RDP' },
    { port: 5432, service: 'PostgreSQL' },
    { port: 8080, service: 'HTTP-Proxy' },
  ]

  const [questions, setQuestions] = useState<typeof ports>([])

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame()
    }
  }, [timeLeft, gameState])

  const startGame = () => {
    const shuffled = [...ports].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setGameState('playing')
    setCurrentQuestion(0)
    setScore(0)
    setTimeLeft(60)
    setUserAnswer('')
    setFeedback(null)
  }

  const endGame = () => {
    setGameState('finished')
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('portQuizHighScore', score.toString())
    }
  }

  const checkAnswer = () => {
    const correct = questions[currentQuestion]
    if (userAnswer.toLowerCase().trim() === correct.service.toLowerCase()) {
      setScore(score + 10)
      setFeedback('correct')
    } else {
      setFeedback('incorrect')
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setUserAnswer('')
        setFeedback(null)
        // Refocus input for next question
        setTimeout(() => inputRef.current?.focus(), 50)
      } else {
        endGame()
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer && !feedback) {
      checkAnswer()
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('portQuizHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  if (gameState === 'start') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>

        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Port Number Speed Quiz</h2>
            <Badge className="text-lg px-4 py-1">Easy</Badge>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div>
                <p className="font-semibold mb-2">Rules:</p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>You'll see port numbers one at a time</li>
                  <li>Type the service name (e.g., SSH, HTTP, RDP)</li>
                  <li>60 seconds to answer as many as you can</li>
                  <li>+10 points for each correct answer</li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="font-semibold mb-2">High Score: {highScore} points</p>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" onClick={startGame} className="text-lg px-8 py-6">
            Start Quiz
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === 'finished') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>

        <div className="text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Final Score: {score} points</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg">
                <p>Questions Answered: {currentQuestion + 1} / {questions.length}</p>
                <p>Accuracy: {Math.round((score / ((currentQuestion + 1) * 10)) * 100)}%</p>
              </div>

              {score > highScore && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-500 font-bold">🎉 New High Score!</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-muted-foreground mb-2">High Score: {Math.max(score, highScore)} points</p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={startGame}>Play Again</Button>
                <Button variant="outline" onClick={onBack}>Back to Games</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentPort = questions[currentQuestion]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => {
          setGameState('start')
          setUserAnswer('')
          setFeedback(null)
        }}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Exit Game
        </Button>

        <div className="flex gap-4 items-center">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant={timeLeft <= 10 ? "destructive" : "default"}>
            Time: {timeLeft}s
          </Badge>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-sm text-muted-foreground">
            Question {currentQuestion + 1} / {questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">What service runs on port:</p>
            <h3 className="text-6xl font-bold text-primary">{currentPort.port}</h3>
          </div>

          <div className="space-y-4">
            <Input
              ref={inputRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type service name..."
              className="text-center text-2xl h-16"
              autoFocus
              disabled={feedback !== null}
            />

            {feedback === 'correct' && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                <p className="text-green-500 font-bold">✓ Correct! +10 points</p>
              </div>
            )}

            {feedback === 'incorrect' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                <p className="text-red-500 font-bold">✗ Incorrect! Answer: {currentPort.service}</p>
              </div>
            )}

            {!feedback && (
              <Button 
                onClick={checkAnswer} 
                className="w-full h-12 text-lg"
                disabled={!userAnswer}
              >
                Submit Answer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        Tip: Press Enter to submit your answer
      </div>
    </div>
  )
}

function FindMaliciousIPGame({ onBack }: { onBack: () => void }) {
  const ROUNDS = 5
  const IPS_PER_ROUND = 6
  const CLEAN_IPS = [
    "10.0.1.50", "192.168.1.105", "10.10.20.33", "172.16.0.12", "192.168.50.100",
    "10.0.0.99", "172.31.22.11", "192.168.2.1", "10.5.5.5", "192.168.100.10",
  ]
  const MALICIOUS_IPS = [
    "185.243.56.22", "45.142.212.61", "91.92.240.100", "103.253.145.33", "198.235.24.50",
  ]
  const [phase, setPhase] = useState<"start" | "playing" | "finished">("start")
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [currentIPs, setCurrentIPs] = useState<{ ip: string; malicious: boolean }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("findMaliciousIPHighScore")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  useEffect(() => {
    if (phase === "finished" && score > highScore && score > 0) {
      setHighScore(score)
      try { localStorage.setItem("findMaliciousIPHighScore", score.toString()) } catch { /* ignore */ }
    }
  }, [phase, score, highScore])

  const startRound = () => {
    const maliciousIP = MALICIOUS_IPS[Math.floor(Math.random() * MALICIOUS_IPS.length)]
    const cleanPool = [...CLEAN_IPS].sort(() => Math.random() - 0.5).slice(0, IPS_PER_ROUND - 1)
    const combined = [...cleanPool.map((ip) => ({ ip, malicious: false })), { ip: maliciousIP, malicious: true }]
    setCurrentIPs(combined.sort(() => Math.random() - 0.5))
    setSelected(null)
    setFeedback(null)
  }

  const startGame = () => {
    setPhase("playing")
    setRound(0)
    setScore(0)
    startRound()
  }

  const handleClick = (ip: string, malicious: boolean) => {
    if (feedback !== null) return
    setSelected(ip)
    if (malicious) {
      setScore((s) => s + 10)
      setFeedback("correct")
    } else {
      setFeedback("wrong")
    }
  }

  const nextRound = () => {
    if (round + 1 >= ROUNDS) {
      setPhase("finished")
      return
    }
    setRound((r) => r + 1)
    startRound()
  }

  if (phase === "start") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold mb-2">Find the Malicious IP</h2>
          <Badge className="text-lg px-4 py-1">Easy</Badge>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <p className="text-sm text-muted-foreground">
                You’ll see a list of IPs from &quot;network traffic.&quot; One is tied to a known-bad C2 server. Click the malicious IP. +10 per correct pick; {ROUNDS} rounds.
              </p>
              <p className="text-sm font-medium">High Score: {highScore} pts</p>
            </CardContent>
          </Card>
          <Button size="lg" onClick={startGame}>Start Game</Button>
        </div>
      </div>
    )
  }

  if (phase === "finished") {
    const isNewHigh = score > highScore && score > 0
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Game Over</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Final Score: {score} pts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="text-muted-foreground">Rounds: {ROUNDS}</p>
              {isNewHigh && (
                <p className="text-green-500 font-bold">New high score!</p>
              )}
              <div className="flex gap-2 justify-center pt-2">
                <Button onClick={startGame}>Play Again</Button>
                <Button variant="outline" onClick={onBack}>Back to Games</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const maliciousIP = currentIPs.find((x) => x.malicious)?.ip

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="flex gap-4">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Round {round + 1} / {ROUNDS}</Badge>
        </div>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Which IP is tied to the C2 server? Click it.</CardTitle>
          <CardDescription>Traffic from one of these IPs was linked to malicious C2. Pick the malicious one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {currentIPs.map(({ ip, malicious }) => (
              <Button
                key={ip}
                variant={selected === ip ? (malicious ? "default" : "destructive") : "outline"}
                className="font-mono text-sm"
                onClick={() => handleClick(ip, malicious)}
                disabled={feedback !== null}
              >
                {ip}
              </Button>
            ))}
          </div>
          {feedback === "correct" && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-500 font-bold">Correct! +10 pts</p>
              <Button className="mt-2" onClick={nextRound}>Next round</Button>
            </div>
          )}
          {feedback === "wrong" && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-500 font-bold">That IP was clean. Malicious: {maliciousIP}</p>
              <Button className="mt-2" onClick={nextRound}>Next round</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const PHISHING_EMAILS: { subject: string; from: string; body: string; isPhish: boolean; why: string }[] = [
  { subject: "Urgent: Verify your account", from: "support@amaz0n-security.com", body: "Your account will be locked in 24 hours. Click here to confirm your identity and avoid suspension.", isPhish: true, why: "Spoofed brand (amaz0n with zero), urgency, link to 'confirm' — classic credential harvest." },
  { subject: "Your receipt #48392", from: "receipts@stripe.com", body: "Thanks for your payment of $29.00. Receipt and invoice are attached. Questions? Reply to this email.", isPhish: false, why: "Legitimate payment receipt; real Stripe domain; no urgency or link to enter credentials." },
  { subject: "You've won! Claim your prize", from: "noreply@prizes-winner.com", body: "Congratulations! To claim your prize, enter your bank details at the link below. Offer expires in 2 hours.", isPhish: true, why: "Too-good-to-be-true, unknown sender, request for bank details and urgent deadline." },
  { subject: "Password reset request", from: "security@github.com", body: "We received a request to reset your password. If this wasn't you, ignore this email. No action needed.", isPhish: false, why: "Real GitHub security; clear 'ignore if not you' — standard safe reset flow." },
  { subject: "Wire transfer needed today", from: "ceo@yourcompany.com", body: "I'm in a meeting. Need you to process an urgent wire to our new vendor. Reply with your cell so I can call you.", isPhish: true, why: "CEO impersonation, urgency, request for wire + personal contact — common BEC pattern." },
  { subject: "Your delivery is on the way", from: "shipments@fedex.com", body: "Track your package: [link]. Delivery by 6 PM. If you're not home, we'll leave it at the nearest location.", isPhish: false, why: "Normal shipping notice; FedEx domain; no request for credentials or payment." },
]

function SpotPhishingGame({ onBack }: { onBack: () => void }) {
  const ROUNDS = 5
  const [phase, setPhase] = useState<"start" | "playing" | "finished">("start")
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [pool, setPool] = useState<typeof PHISHING_EMAILS>([])
  const [choice, setChoice] = useState<"legit" | "phish" | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("spotPhishingHighScore")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  useEffect(() => {
    if (phase === "finished" && score > highScore && score > 0) {
      setHighScore(score)
      try { localStorage.setItem("spotPhishingHighScore", score.toString()) } catch { /* ignore */ }
    }
  }, [phase, score, highScore])

  const startGame = () => {
    const shuffled = [...PHISHING_EMAILS].sort(() => Math.random() - 0.5).slice(0, ROUNDS)
    setPool(shuffled)
    setPhase("playing")
    setRound(0)
    setScore(0)
    setChoice(null)
    setFeedback(null)
  }

  const currentEmail = pool[round]
  const handleGuess = (guess: "legit" | "phish") => {
    if (feedback !== null || !currentEmail) return
    setChoice(guess)
    const correct = (guess === "phish" && currentEmail.isPhish) || (guess === "legit" && !currentEmail.isPhish)
    setFeedback(correct ? "correct" : "wrong")
    if (correct) setScore((s) => s + 10)
  }

  const nextRound = () => {
    setChoice(null)
    setFeedback(null)
    if (round + 1 >= ROUNDS) setPhase("finished")
    else setRound((r) => r + 1)
  }

  if (phase === "start") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold mb-2">Spot the Phishing</h2>
          <Badge className="text-lg px-4 py-1">Medium</Badge>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <p className="text-sm text-muted-foreground">
                Read each email. Is it <strong>Legit</strong> or <strong>Phish</strong>? Click your answer. +10 per correct; {ROUNDS} rounds.
              </p>
              <p className="text-sm font-medium">High Score: {highScore} pts</p>
            </CardContent>
          </Card>
          <Button size="lg" onClick={startGame}>Start Game</Button>
        </div>
      </div>
    )
  }

  if (phase === "finished") {
    const isNewHigh = score > highScore && score > 0
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Game Over</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Final Score: {score} pts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {isNewHigh && <p className="text-green-500 font-bold">New high score!</p>}
              <div className="flex gap-2 justify-center pt-2">
                <Button onClick={startGame}>Play Again</Button>
                <Button variant="outline" onClick={onBack}>Back to Games</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentEmail) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="flex gap-4">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Round {round + 1} / {ROUNDS}</Badge>
        </div>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Is this email Legit or Phish?</CardTitle>
          <CardDescription>Read the headers and snippet, then choose.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4 text-left space-y-2 font-sans text-sm">
            <p><strong>From:</strong> {currentEmail.from}</p>
            <p><strong>Subject:</strong> {currentEmail.subject}</p>
            <p className="text-muted-foreground pt-2">{currentEmail.body}</p>
          </div>
          {!feedback ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleGuess("legit")}>Legit</Button>
              <Button variant="outline" onClick={() => handleGuess("phish")}>Phish</Button>
            </div>
          ) : (
            <>
              <div className={feedback === "correct" ? "p-4 bg-green-500/10 border border-green-500/20 rounded-lg" : "p-4 bg-red-500/10 border border-red-500/20 rounded-lg"}>
                <p className={feedback === "correct" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {feedback === "correct" ? "Correct! +10 pts" : `Wrong — it was ${currentEmail.isPhish ? "Phish" : "Legit"}.`}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{currentEmail.why}</p>
              </div>
              <Button onClick={nextRound}>Next round</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const DECODE_PAYLOADS: { b64: string; correct: string; wrong: string[] }[] = [
  { b64: "aHR0cDovL2MyaS5ldmlsLmNvbS9iZWFjb24=", correct: "C2 callback URL", wrong: ["PowerShell one-liner", "Dumped credentials", "Ransom note"] },
  { b64: "Y21kIC9jIHdob2FtaQ==", correct: "Recon command (whoami)", wrong: ["Malware config", "Encrypted payload", "C2 beacon"] },
  { b64: "eyJob3N0IjogIjEwLjAuMC4xIiwgInBvcnQiOiA0NDMzfQ==", correct: "C2 config (JSON)", wrong: ["Cookie steal", "Phishing HTML", "Shellcode"] },
  { b64: "UG93ZXJTaGVsbCAtTm9QIC1DIElybSAoTmV3LU9iamVjdCBOZXQuV2ViQ2xpZW50KS5Eb3dubG9hZFN0cmluZygnaHR0cDovL2V4YW1wbGUuY29tL3AucHMxJyk=", correct: "PowerShell download cradle", wrong: ["SSH key", "DNS tunnel config", "RAT config"] },
  { b64: "PHNjcmlwdD5hbGVydChkb2N1bWVudC5jb29raWUpPC9zY3JpcHQ+", correct: "Cookie-stealing script snippet", wrong: ["Legitimate JS library", "Encrypted config", "Log file"] },
]

function DecodePayloadGame({ onBack }: { onBack: () => void }) {
  const ROUNDS = 5
  const [phase, setPhase] = useState<"start" | "playing" | "finished">("start")
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [pool, setPool] = useState<typeof DECODE_PAYLOADS>([])
  const [revealed, setRevealed] = useState(false)
  const [choice, setChoice] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("decodePayloadHighScore")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  useEffect(() => {
    if (phase === "finished" && score > highScore && score > 0) {
      setHighScore(score)
      try { localStorage.setItem("decodePayloadHighScore", score.toString()) } catch { /* ignore */ }
    }
  }, [phase, score, highScore])

  const startGame = () => {
    const shuffled = [...DECODE_PAYLOADS].sort(() => Math.random() - 0.5).slice(0, ROUNDS)
    setPool(shuffled)
    setPhase("playing")
    setRound(0)
    setScore(0)
    setRevealed(false)
    setChoice(null)
    setFeedback(null)
  }

  const current = pool[round]
  const options = current ? [current.correct, ...current.wrong].sort(() => Math.random() - 0.5) : []
  const decoded = current ? (() => { try { return atob(current.b64) } catch { return "(invalid base64)" } })() : ""

  const handleChoice = (opt: string) => {
    if (feedback !== null || !current) return
    setChoice(opt)
    setFeedback(opt === current.correct ? "correct" : "wrong")
    if (opt === current.correct) setScore((s) => s + 10)
  }

  const nextRound = () => {
    setRevealed(false)
    setChoice(null)
    setFeedback(null)
    if (round + 1 >= ROUNDS) setPhase("finished")
    else setRound((r) => r + 1)
  }

  if (phase === "start") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold mb-2">Decode the Payload</h2>
          <Badge className="text-lg px-4 py-1">Medium</Badge>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <p className="text-sm text-muted-foreground">
                Each round shows a Base64-encoded string. Decode it (or reveal), then pick what it best describes. +10 per correct; {ROUNDS} rounds.
              </p>
              <p className="text-sm font-medium">High Score: {highScore} pts</p>
            </CardContent>
          </Card>
          <Button size="lg" onClick={startGame}>Start Game</Button>
        </div>
      </div>
    )
  }

  if (phase === "finished") {
    const isNewHigh = score > highScore && score > 0
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Game Over</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Final Score: {score} pts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {isNewHigh && <p className="text-green-500 font-bold">New high score!</p>}
              <div className="flex gap-2 justify-center pt-2">
                <Button onClick={startGame}>Play Again</Button>
                <Button variant="outline" onClick={onBack}>Back to Games</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="flex gap-4">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Round {round + 1} / {ROUNDS}</Badge>
        </div>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>What does this Base64 payload describe?</CardTitle>
          <CardDescription>Decode it (or reveal below), then choose the best answer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <pre className="rounded-lg border bg-muted/30 p-3 text-xs font-mono break-all">{current.b64}</pre>
          {!revealed ? (
            <Button variant="secondary" size="sm" onClick={() => setRevealed(true)}>Reveal decoded</Button>
          ) : (
            <div className="rounded-lg border bg-muted/30 p-3 text-xs font-mono break-all text-muted-foreground">{decoded}</div>
          )}
          {!feedback ? (
            <div className="grid grid-cols-1 gap-2">
              {options.map((opt) => (
                <Button key={opt} variant="outline" onClick={() => handleChoice(opt)} className="justify-start text-left h-auto py-2">
                  {opt}
                </Button>
              ))}
            </div>
          ) : (
            <>
              <div className={feedback === "correct" ? "p-4 bg-green-500/10 border border-green-500/20 rounded-lg" : "p-4 bg-red-500/10 border border-red-500/20 rounded-lg"}>
                <p className={feedback === "correct" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {feedback === "correct" ? "Correct! +10 pts" : `Wrong. Answer: ${current.correct}`}
                </p>
              </div>
              <Button onClick={nextRound}>Next round</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const MITRE_TACTICS_3X3 = [
  "Initial Access",
  "Execution",
  "Persistence",
  "Privilege Escalation",
  "Defense Evasion",
  "Credential Access",
  "Discovery",
  "Lateral Movement",
  "Collection",
]

const MITRE_SCENARIOS: { scenario: string; correct: string; wrong: string[] }[] = [
  { scenario: "Attacker sent a phishing link; user clicked and malware ran.", correct: "Initial Access", wrong: ["Execution", "Persistence", "Credential Access"] },
  { scenario: "Malware runs a script from a scheduled task after reboot.", correct: "Execution", wrong: ["Initial Access", "Discovery", "Collection"] },
  { scenario: "Backdoor installed to run every time the user logs in.", correct: "Persistence", wrong: ["Execution", "Lateral Movement", "Defense Evasion"] },
  { scenario: "Attacker exploits a vulnerability to get admin from a normal user.", correct: "Privilege Escalation", wrong: ["Initial Access", "Credential Access", "Collection"] },
  { scenario: "Malware disables Windows Defender and deletes its logs.", correct: "Defense Evasion", wrong: ["Execution", "Discovery", "Persistence"] },
  { scenario: "Attacker dumps LSASS to harvest NTLM hashes from memory.", correct: "Credential Access", wrong: ["Lateral Movement", "Collection", "Persistence"] },
  { scenario: "Malware runs whoami, ipconfig, and net view to map the network.", correct: "Discovery", wrong: ["Execution", "Lateral Movement", "Collection"] },
  { scenario: "Attacker uses PsExec to run commands on another workstation.", correct: "Lateral Movement", wrong: ["Execution", "Persistence", "Credential Access"] },
  { scenario: "Ransomware copies files from shared drives before encrypting.", correct: "Collection", wrong: ["Lateral Movement", "Defense Evasion", "Credential Access"] },
]

function hasBingoLine(marked: Set<string>): boolean {
  const rows = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  return rows.some((indices) => indices.every((i) => marked.has(MITRE_TACTICS_3X3[i])))
}

function MitreBingoGame({ onBack }: { onBack: () => void }) {
  const ROUNDS = 5
  const [phase, setPhase] = useState<"start" | "playing" | "finished">("start")
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [marked, setMarked] = useState<Set<string>>(new Set())
  const [pool, setPool] = useState<typeof MITRE_SCENARIOS>([])
  const [choice, setChoice] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [bingoAwarded, setBingoAwarded] = useState(false)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("mitreBingoHighScore")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  useEffect(() => {
    if (phase === "finished" && score > highScore && score > 0) {
      setHighScore(score)
      try { localStorage.setItem("mitreBingoHighScore", score.toString()) } catch { /* ignore */ }
    }
  }, [phase, score, highScore])

  const startGame = () => {
    const shuffled = [...MITRE_SCENARIOS].sort(() => Math.random() - 0.5).slice(0, ROUNDS)
    setPool(shuffled)
    setPhase("playing")
    setRound(0)
    setScore(0)
    setMarked(new Set())
    setChoice(null)
    setFeedback(null)
    setBingoAwarded(false)
  }

  const current = pool[round]
  const options = current ? [current.correct, ...current.wrong].sort(() => Math.random() - 0.5) : []

  const handleChoice = (opt: string) => {
    if (feedback !== null || !current) return
    setChoice(opt)
    const correct = opt === current.correct
    setFeedback(correct ? "correct" : "wrong")
    if (correct) {
      setScore((s) => s + 10)
      setMarked((m) => new Set(m).add(current.correct))
      if (!bingoAwarded && hasBingoLine(new Set([...marked, current.correct]))) {
        setBingoAwarded(true)
        setScore((s) => s + 20)
      }
    }
  }

  const nextRound = () => {
    setChoice(null)
    setFeedback(null)
    if (round + 1 >= ROUNDS) setPhase("finished")
    else setRound((r) => r + 1)
  }

  if (phase === "start") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold mb-2">MITRE Bingo</h2>
          <Badge className="text-lg px-4 py-1">Medium</Badge>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>How to Play</CardTitle>
            </CardHeader>
            <CardContent className="text-left space-y-4">
              <p className="text-sm text-muted-foreground">
                Match each scenario to the correct MITRE ATT&amp;CK tactic. Correct answers mark the card. +10 per correct, +20 bonus for a bingo (3 in a row). {ROUNDS} rounds.
              </p>
              <p className="text-sm font-medium">High Score: {highScore} pts</p>
            </CardContent>
          </Card>
          <Button size="lg" onClick={startGame}>Start Game</Button>
        </div>
      </div>
    )
  }

  if (phase === "finished") {
    const isNewHigh = score > highScore && score > 0
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Game Over</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Final Score: {score} pts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {bingoAwarded && <p className="text-green-500 font-bold">Bingo! +20 bonus</p>}
              {isNewHigh && <p className="text-green-500 font-bold">New high score!</p>}
              <div className="flex gap-2 justify-center pt-2">
                <Button onClick={startGame}>Play Again</Button>
                <Button variant="outline" onClick={onBack}>Back to Games</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Games
        </Button>
        <div className="flex gap-4">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Round {round + 1} / {ROUNDS}</Badge>
          {bingoAwarded && <Badge className="bg-green-500/20 text-green-600">Bingo!</Badge>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-md">
        {MITRE_TACTICS_3X3.map((tactic, i) => (
          <div
            key={tactic}
            className={`rounded-lg border p-2 text-center text-xs font-medium ${marked.has(tactic) ? "bg-green-500/20 border-green-500/50" : "bg-muted/30 border-border"}`}
          >
            {marked.has(tactic) ? "✓ " : ""}{tactic}
          </div>
        ))}
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Which tactic does this scenario match?</CardTitle>
          <CardDescription>{current.scenario}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!feedback ? (
            <div className="grid grid-cols-1 gap-2">
              {options.map((opt) => (
                <Button key={opt} variant="outline" onClick={() => handleChoice(opt)} className="justify-start text-left h-auto py-2">
                  {opt}
                </Button>
              ))}
            </div>
          ) : (
            <>
              <div className={feedback === "correct" ? "p-4 bg-green-500/10 border border-green-500/20 rounded-lg" : "p-4 bg-red-500/10 border border-red-500/20 rounded-lg"}>
                <p className={feedback === "correct" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {feedback === "correct" ? `Correct! +10${bingoAwarded ? " (Bingo +20!)" : ""}` : `Wrong. Answer: ${current.correct}`}
                </p>
              </div>
              <Button onClick={nextRound}>Next round</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const CERT_PATH_KEY = "soc-os-cert-path"
const ROADMAP_TEMPLATES: Record<string, { current: any[]; planned: any[] }> = {
  "SOC Analyst": {
    current: [{ name: "Security+", provider: "CompTIA", description: "Foundation", started: "2024-01", target: "2024-03", progress: 50 }],
    planned: [
      { name: "CySA+", provider: "CompTIA", description: "Cybersecurity Analyst", prerequisite: "Security+", estimatedTime: "3-4 months" },
      { name: "CEH", provider: "EC-Council", description: "Ethical Hacker", estimatedTime: "2-3 months" }
    ]
  },
  "Pentester": {
    current: [],
    planned: [
      { name: "eJPT", provider: "eLearnSecurity", description: "Junior Penetration Tester", estimatedTime: "1-2 months" },
      { name: "CEH", provider: "EC-Council", description: "Ethical Hacker", estimatedTime: "2-3 months" },
      { name: "OSCP", provider: "Offensive Security", description: "Offensive Security Certified Professional", prerequisite: "Strong fundamentals", estimatedTime: "4-6 months" }
    ]
  },
  "GRC": {
    current: [],
    planned: [
      { name: "Security+", provider: "CompTIA", description: "Foundation", estimatedTime: "2-3 months" },
      { name: "CISM", provider: "ISACA", description: "Certified Information Security Manager", prerequisite: "5 years exp", estimatedTime: "3-4 months" },
      { name: "CRISC", provider: "ISACA", description: "Risk and Information Systems Control", estimatedTime: "3-4 months" }
    ]
  }
}

const DEFAULT_CERT_PICKER_LIST = [
  { name: "Security+", provider: "CompTIA", description: "Foundation", estimatedTime: "2-3 months", prerequisite: "" },
  { name: "CySA+", provider: "CompTIA", description: "Cybersecurity Analyst", estimatedTime: "3-4 months", prerequisite: "Security+" },
  { name: "CEH", provider: "EC-Council", description: "Ethical Hacker", estimatedTime: "2-3 months", prerequisite: "" },
  { name: "OSCP", provider: "Offensive Security", description: "Offensive Security Certified Professional", estimatedTime: "4-6 months", prerequisite: "Strong fundamentals" },
  { name: "CISSP", provider: "(ISC)²", description: "CISSP", estimatedTime: "3-6 months", prerequisite: "" },
  { name: "CISM", provider: "ISACA", description: "CISM", estimatedTime: "3-4 months", prerequisite: "" },
  { name: "CRISC", provider: "ISACA", description: "CRISC", estimatedTime: "3-4 months", prerequisite: "" }
]

function CertPathContent({ certPath, appIntros }: { certPath: any; appIntros?: Record<string, string> }) {
  const defaultPath = { current: certPath?.current ?? [], completed: certPath?.completed ?? [], planned: certPath?.planned ?? [] }
  const certPickerList = certPath?.certPickerList ?? DEFAULT_CERT_PICKER_LIST
  const [roadmap, setRoadmap] = useState<{ current: any[]; completed: any[]; planned: any[] }>(() => {
    if (typeof window === "undefined") return defaultPath
    try {
      const s = localStorage.getItem(CERT_PATH_KEY)
      if (s) {
        const parsed = JSON.parse(s)
        return { current: parsed.current ?? defaultPath.current, completed: parsed.completed ?? defaultPath.completed, planned: parsed.planned ?? defaultPath.planned }
      }
    } catch (_) {}
    return defaultPath
  })

  const saveRoadmap = useCallback((next: typeof roadmap) => {
    setRoadmap(next)
    try { localStorage.setItem(CERT_PATH_KEY, JSON.stringify(next)) } catch (_) {}
  }, [])

  const applyTemplate = (name: string) => {
    const t = ROADMAP_TEMPLATES[name]
    if (!t) return
    saveRoadmap({ ...roadmap, current: t.current, planned: t.planned })
  }

  const setProgress = (idx: number, pct: number) => {
    const next = [...roadmap.current]
    next[idx] = { ...next[idx], progress: Math.min(100, Math.max(0, pct)) }
    saveRoadmap({ ...roadmap, current: next })
  }

  const moveToCompleted = (idx: number) => {
    const cert = roadmap.current[idx]
    saveRoadmap({
      current: roadmap.current.filter((_, i) => i !== idx),
      completed: [...roadmap.completed, { ...cert, completedDate: new Date().toLocaleDateString("en-US") }],
      planned: roadmap.planned
    })
  }

  const removeFromPlanned = (idx: number) => {
    saveRoadmap({ ...roadmap, planned: roadmap.planned.filter((_, i) => i !== idx) })
  }

  const resetToDefault = () => {
    if (confirm("Reset roadmap to default? Your customizations will be lost.")) saveRoadmap(defaultPath)
  }

  const addFromPicker = (cert: { name: string; provider: string; description?: string; estimatedTime?: string; prerequisite?: string }, to: "current" | "planned") => {
    if (to === "current") {
      saveRoadmap({
        ...roadmap,
        current: [...roadmap.current, { ...cert, progress: 0, started: "", target: "" }]
      })
    } else {
      saveRoadmap({
        ...roadmap,
        planned: [...roadmap.planned, { name: cert.name, provider: cert.provider, description: cert.description ?? "", prerequisite: cert.prerequisite, estimatedTime: cert.estimatedTime }]
      })
    }
  }

  const [manualForm, setManualForm] = useState({ name: "", provider: "", description: "", prerequisite: "", started: "", target: "", estimatedTime: "" })
  const [addCertOpen, setAddCertOpen] = useState(false)
  const addManualCert = (to: "current" | "planned") => {
    if (!manualForm.name.trim()) return
    const cert = { name: manualForm.name.trim(), provider: manualForm.provider.trim() || "—", description: manualForm.description.trim() || "", prerequisite: manualForm.prerequisite.trim() || undefined, estimatedTime: manualForm.estimatedTime.trim() || undefined }
    if (to === "current") {
      saveRoadmap({
        ...roadmap,
        current: [...roadmap.current, { ...cert, progress: 0, started: manualForm.started.trim() || undefined, target: manualForm.target.trim() || undefined }]
      })
    } else {
      saveRoadmap({
        ...roadmap,
        planned: [...roadmap.planned, cert]
      })
    }
    setManualForm({ name: "", provider: "", description: "", prerequisite: "", started: "", target: "", estimatedTime: "" })
    setAddCertOpen(false)
  }

  const isEmpty = roadmap.current.length === 0 && roadmap.planned.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Map className="h-6 w-6 text-blue-400" />
            Certification Roadmap
          </h2>
          <p className="text-muted-foreground text-sm">Customize your path. Stored in this browser.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Template:</span>
          {Object.keys(ROADMAP_TEMPLATES).map((name) => (
            <Button key={name} variant="outline" size="sm" onClick={() => applyTemplate(name)}>{name}</Button>
          ))}
          <Button variant="ghost" size="sm" onClick={resetToDefault}>Reset</Button>
        </div>
      </div>
      <AppIntro appId="cert-path" appIntros={appIntros} />

      {isEmpty && (
        <Card className="bg-muted/30 border-border">
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground text-center">
              No certs yet. Apply a template above or add one from the list / form below.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground">Add from list</h3>
        <div className="flex flex-wrap gap-2">
          {certPickerList.map((cert: any, i: number) => (
            <div key={i} className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 text-sm">
              <span className="font-medium">{cert.name}</span>
              <span className="text-muted-foreground">({cert.provider})</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addFromPicker(cert, "planned")}>Planned</Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addFromPicker(cert, "current")}>Current</Button>
            </div>
          ))}
        </div>
      </div>

      <Collapsible open={addCertOpen} onOpenChange={setAddCertOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add custom cert
            <ChevronDown className={`h-4 w-4 transition-transform ${addCertOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="mt-3 bg-card border-border">
            <CardContent className="pt-4 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Name" value={manualForm.name} onChange={(e) => setManualForm((f) => ({ ...f, name: e.target.value }))} className="bg-background" />
                <Input placeholder="Provider" value={manualForm.provider} onChange={(e) => setManualForm((f) => ({ ...f, provider: e.target.value }))} className="bg-background" />
              </div>
              <Input placeholder="Description (optional)" value={manualForm.description} onChange={(e) => setManualForm((f) => ({ ...f, description: e.target.value }))} className="bg-background" />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Prerequisite (optional)" value={manualForm.prerequisite} onChange={(e) => setManualForm((f) => ({ ...f, prerequisite: e.target.value }))} className="bg-background" />
                <Input placeholder="Estimated time (optional)" value={manualForm.estimatedTime} onChange={(e) => setManualForm((f) => ({ ...f, estimatedTime: e.target.value }))} className="bg-background" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Started (optional)" value={manualForm.started} onChange={(e) => setManualForm((f) => ({ ...f, started: e.target.value }))} className="bg-background" />
                <Input placeholder="Target (optional)" value={manualForm.target} onChange={(e) => setManualForm((f) => ({ ...f, target: e.target.value }))} className="bg-background" />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => addManualCert("planned")} disabled={!manualForm.name.trim()}>Add to Planned</Button>
                <Button variant="default" size="sm" onClick={() => addManualCert("current")} disabled={!manualForm.name.trim()}>Add to Current</Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {roadmap.current.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">🎯 Currently Working On</h3>
          <div className="space-y-4">
            {roadmap.current.map((cert: any, idx: number) => (
              <Card key={idx} className="bg-card border-border border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{cert.provider}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-500/10 text-blue-500">In Progress</Badge>
                      <Button variant="outline" size="sm" onClick={() => moveToCompleted(idx)}>Mark done</Button>
                    </div>
                  </div>
                  <CardDescription className="text-xs mt-2">{cert.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{cert.progress}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={cert.progress ?? 0} onChange={(e) => setProgress(idx, parseInt(e.target.value, 10))} className="w-full h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Started: {cert.started ?? "—"}</span>
                      <span>Target: {cert.target ?? "—"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {roadmap.completed.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">✅ Completed</h3>
          <div className="space-y-3">
            {roadmap.completed.map((cert: any, idx: number) => (
              <Card key={idx} className="bg-card border-border border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{cert.provider}</Badge>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                  </div>
                  <CardDescription className="text-xs mt-2">Completed: {cert.completedDate ?? "—"}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {roadmap.planned.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">📋 Planned</h3>
          <div className="space-y-3">
            {roadmap.planned.map((cert: any, idx: number) => (
              <Card key={idx} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{cert.provider}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">Planned</Badge>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeFromPlanned(idx)}>Remove</Button>
                    </div>
                  </div>
                  <CardDescription className="text-xs mt-2">{cert.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cert.prerequisite && (
                    <p className="text-xs text-muted-foreground">📌 Prerequisite: {cert.prerequisite}</p>
                  )}
                  <p className="text-xs text-muted-foreground">⏱️ Estimated time: {cert.estimatedTime ?? "—"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Phase 3 Components - SOC Journal, Tickets, Lab Files

function SOCJournalContent({ user, onSignIn }: { user: User | null; onSignIn?: () => void }) {
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const supabase = createClient()

  // Load entries
  useEffect(() => {
    if (user) {
      loadEntries()
    } else {
      setIsLoading(false)
    }
  }, [user])

  // Debounce search term (inline so hook order is always the same)
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(t)
  }, [searchTerm])
  const filteredEntries = useMemo(() => entries.filter((entry: any) => {
    const q = debouncedSearch.toLowerCase()
    const matchesSearch = !q || entry.title?.toLowerCase().includes(q) || entry.content?.toLowerCase().includes(q)
    const matchesType = filterType === "all" || entry.entry_type === filterType
    return matchesSearch && matchesType
  }), [entries, debouncedSearch, filterType])

  const loadEntries = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createEntry = async (entry: any) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: user!.id,
          ...entry
        }])

      if (error) throw error
      await loadEntries()
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating entry:', error)
      alert('Failed to create entry')
    }
  }

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    
    try {
      const { error} = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadEntries()
      setSelectedEntry(null)
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry')
    }
  }

  // Not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <BookMarked className="h-16 w-16 text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">SOC Journal</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Track your learning journey, document labs, and build your personal knowledge base.
          Sign in to start journaling.
        </p>
        <Button variant="default" onClick={() => onSignIn?.()}>Sign In to Start</Button>
      </div>
    )
  }

  // Creating new entry
  if (isCreating) {
    return <JournalEntryForm onSave={createEntry} onCancel={() => setIsCreating(false)} />
  }

  // Viewing entry detail
  if (selectedEntry) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(null)}>
            <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
            Back
          </Button>
          <div className="flex-1" />
          <Button variant="destructive" size="sm" onClick={() => deleteEntry(selectedEntry.id)}>
            Delete
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedEntry.title}</CardTitle>
                <CardDescription>
                  {new Date(selectedEntry.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge>{selectedEntry.entry_type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">{selectedEntry.content}</div>
            {selectedEntry.tags && selectedEntry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedEntry.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <BookMarked className="h-6 w-6 text-purple-400" />
              SOC Journal
            </h2>
            <p className="text-sm text-muted-foreground">{entries.length} entries</p>
          </div>
          <Button onClick={() => setIsCreating(true)}>New Entry</Button>
        </div>

        <Input
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2">
          {["all", "study", "lab", "incident", "general"].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {isLoading ? (
          <div className="text-center p-8">Loading...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {searchTerm ? "No entries match your search." : "No entries yet. Create your first one!"}
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="cursor-pointer hover:border-purple-500/50 transition-all"
                onClick={() => setSelectedEntry(entry)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{entry.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{entry.entry_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function JournalEntryForm({ onSave, onCancel }: { onSave: (entry: any) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [entryType, setEntryType] = useState("general")
  const [tags, setTags] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      content,
      entry_type: entryType,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex-1" />
        <Button type="submit">Save Entry</Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you learn today?"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Type</label>
          <div className="flex gap-2 mt-2">
            {["study", "lab", "incident", "general"].map((type) => (
              <Button
                key={type}
                type="button"
                variant={entryType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setEntryType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full min-h-[300px] p-3 rounded-lg border bg-background"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tags (comma-separated)</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="splunk, windows, malware"
          />
        </div>
      </div>
    </form>
  )
}

function TicketsContent({ tickets, user, currentPath, onNavigate, onOpenApp, appIntros, onSignIn }: { tickets: any[]; user: User | null; currentPath: string; onNavigate: (path: string) => void; onOpenApp?: (appId: string) => void; appIntros?: Record<string, string>; onSignIn?: () => void }) {
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const pathParts = currentPath.split(':')
  const ticketId = pathParts[1]
  const modeFromPath = (pathParts[2] === 'guided' || pathParts[2] === 'expert') ? pathParts[2] : null
  const selectedTicket = ticketId ? tickets.find(t => t.id === ticketId) : null

  if (!selectedTicket) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Ticket className="h-6 w-6 text-orange-400" />
            Incident Ticket Simulator
          </h2>
          <p className="text-muted-foreground">
            Practice SOC analyst skills with realistic incident tickets. Investigate, document, and resolve incidents.
          </p>
        </div>
        <AppIntro appId="tickets" appIntros={appIntros} />
        <div className="grid gap-4">
          {tickets.map((ticket) => {
            const getDifficultyColor = (diff: string) => {
              if (diff === "easy") return "bg-green-500/10 text-green-500 border-green-500/20"
              if (diff === "medium") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              return "bg-red-500/10 text-red-500 border-red-500/20"
            }

            return (
              <Card key={ticket.id} className="cursor-pointer hover:border-orange-400/50 transition-all" onClick={() => onNavigate(`tickets:${ticket.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{ticket.title}</CardTitle>
                      <Badge className="mt-1" variant="outline">{ticket.category}</Badge>
                    </div>
                    <Badge className={getDifficultyColor(ticket.difficulty)}>
                      {ticket.difficulty.charAt(0).toUpperCase() + ticket.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-2">{ticket.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="default" size="sm">Start Investigation</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {!user && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">💡 Sign in to save progress</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>Create an account to track completed tickets, save notes, and monitor your progress over time.</p>
              <Button variant="default" size="sm" onClick={() => onSignIn?.()}>Sign In</Button>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Mode selection: choose Guided or Expert (locked for this ticket)
  if (selectedTicket && !modeFromPath) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Choose investigation mode</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {selectedTicket.title} — pick a mode. You can’t switch until you go back to the ticket list.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            className="cursor-pointer hover:border-orange-400/50 transition-all"
            onClick={() => onNavigate(`tickets:${ticketId}:guided`)}
          >
            <CardHeader>
              <CardTitle className="text-base">Guided Mode</CardTitle>
              <CardDescription>
                Step-by-step checklist, tool links, and investigation steps shown.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="default" size="sm" className="w-full">Start Guided</Button>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:border-orange-400/50 transition-all"
            onClick={() => onNavigate(`tickets:${ticketId}:expert`)}
          >
            <CardHeader>
              <CardTitle className="text-base">Expert Mode</CardTitle>
              <CardDescription>
                No steps shown. Use hints and solution only when you need them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">Start Expert</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Ticket detail view (mode locked from path; use window back/forward for navigation)
  const mode = modeFromPath ?? 'guided'
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Ticket #{selectedTicket.id.toUpperCase()}</CardTitle>
              <CardDescription>{selectedTicket.title}</CardDescription>
            </div>
            <Badge variant="secondary">{mode === 'guided' ? 'Guided' : 'Expert'} mode</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {onOpenApp && (
            <div>
              <h3 className="font-semibold mb-2">Investigation tools</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => onOpenApp("util-evidence")} className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Evidence Locker
                </Button>
                <Button variant="outline" size="sm" onClick={() => onOpenApp("util-timeline")} className="gap-2">
                  <Map className="h-4 w-4" />
                  Timeline Builder
                </Button>
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold mb-2">Scenario</h3>
            <div className="text-sm whitespace-pre-wrap">{selectedTicket.scenario}</div>
          </div>

          {selectedTicket.logs && (
            <div>
              <h3 className="font-semibold mb-2">Logs</h3>
              <pre className="p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                {selectedTicket.logs}
              </pre>
            </div>
          )}

          {mode === 'guided' && selectedTicket.guidedSteps && (
            <div>
              <h3 className="font-semibold mb-2">Investigation Steps</h3>
              <div className="space-y-2">
                {selectedTicket.guidedSteps.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-muted-foreground">{idx + 1}.</span>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHints(!showHints)}>
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSolution(!showSolution)}>
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
          </div>

          {showHints && selectedTicket.hints && (
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-sm">💡 Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {selectedTicket.hints.map((hint: string, idx: number) => (
                    <li key={idx}>• {hint}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {showSolution && selectedTicket.solution && (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-sm">✓ Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap">{selectedTicket.solution}</div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LabFilesContent({ labFiles, currentPath, onNavigate }: { labFiles: any[]; currentPath: string; onNavigate: (path: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const pathParts = currentPath.split(':')
  const fileId = pathParts[1]
  const selectedFile = useMemo(() => fileId ? labFiles.find((f: any) => f.id === fileId) : null, [fileId, labFiles])

  const categories = ["all", "pcap", "event-logs", "sample-logs", "email"]

  const filteredFiles = useMemo(() => selectedCategory === "all" ? labFiles : labFiles.filter((f: any) => f.category === selectedCategory), [labFiles, selectedCategory])

  if (selectedFile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedFile.title}</CardTitle>
                <CardDescription>{selectedFile.description}</CardDescription>
              </div>
              <Badge>{selectedFile.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">📁 File Details</h3>
              <div className="text-sm space-y-1">
                <div>Category: {selectedFile.category}</div>
                <div>Size: {selectedFile.fileSize}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🎯 Objectives</h3>
              <ul className="space-y-1 text-sm">
                {selectedFile.objectives.map((obj: string, idx: number) => (
                  <li key={idx}>• {obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🛠️ Recommended Tools</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFile.tools.map((tool: string) => (
                  <Badge key={tool} variant="outline">{tool}</Badge>
                ))}
              </div>
            </div>

            {selectedFile.hints && (
              <div>
                <h3 className="font-semibold mb-2">💡 Hints</h3>
                <ul className="space-y-1 text-sm">
                  {selectedFile.hints.map((hint: string, idx: number) => (
                    <li key={idx}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedFile.available && selectedFile.path ? (
              <Button asChild className="w-full">
                <a href={selectedFile.path} download>
                  <FolderDown className="h-4 w-4 mr-2" />
                  Download Lab File
                </a>
              </Button>
            ) : selectedFile.available ? (
              <Button className="w-full" disabled>
                <FolderDown className="h-4 w-4 mr-2" />
                Download (path not set)
              </Button>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                  Lab files coming soon! Check back later for downloadable practice files.
                </CardContent>
              </Card>
            )}

            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-sm">⚠️ Safety Notice</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                All lab files are sanitized and safe for analysis. However, always practice good security hygiene:
                use isolated VMs, don't execute unknown code, and treat all samples as potentially malicious.
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 space-y-4 pb-4 border-border">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <FolderDown className="h-6 w-6 text-cyan-400" />
            Lab Files
          </h2>
          <p className="text-muted-foreground">
            Download safe, realistic samples for hands-on practice with industry tools.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "all" ? "All Files" : cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        <div className="grid gap-3">
        {filteredFiles.map((file) => {
            const getDifficultyColor = (diff: string) => {
              if (diff === "Easy") return "bg-green-500/10 text-green-500 border-green-500/20"
              if (diff === "Medium") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              return "bg-red-500/10 text-red-500 border-red-500/20"
            }

            return (
              <Card
                key={file.id}
                className="cursor-pointer hover:border-cyan-400/50 transition-all"
                onClick={() => onNavigate(`lab-files:${file.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{file.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {file.category.toUpperCase()} • {file.fileSize}
                      </CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(file.difficulty)}>
                      {file.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{file.description}</p>
                </CardContent>
              </Card>
            )
          })}
        {filteredFiles.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No files in this category yet.
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

// Phase 5 Components - Utilities & Terminal

function UtilitiesContent({ onNavigate }: { onNavigate: (appId: string) => void }) {
  const utilities = [
    { id: "util-hash", name: "Hash Identifier", description: "Identify hash types (MD5, SHA1, SHA256, etc.)", icon: "🔐" },
    { id: "util-base64", name: "Base64 Toolkit", description: "Encode/decode Base64 strings", icon: "📝" },
    { id: "util-timestamp", name: "Timestamp Converter", description: "Convert between Unix timestamps and dates", icon: "⏰" },
    { id: "util-email", name: "Email Header Parser", description: "Parse and analyze email headers", icon: "📧" },
    { id: "util-ip", name: "IP Info Lookup", description: "Quick IP address information", icon: "🌐" },
    { id: "util-port", name: "Port Lookup", description: "Common port numbers and services", icon: "🔌" },
    { id: "util-useragent", name: "User-Agent Parser", description: "Decode browser user-agent strings", icon: "🖥️" },
    { id: "util-evidence", name: "Evidence Locker", description: "Temporary evidence notes", icon: "📋" },
    { id: "util-timeline", name: "Timeline Builder", description: "Build investigation timelines", icon: "📅" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <FolderCog className="h-6 w-6 text-teal-400" />
          SOC Utilities
        </h2>
        <p className="text-muted-foreground">Quick tools for common SOC analyst tasks</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {utilities.map((utility) => (
          <Card
            key={utility.id}
            className="cursor-pointer hover:border-teal-400/50 transition-all"
            onClick={() => onNavigate(utility.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{utility.icon}</span>
                <div>
                  <CardTitle className="text-base">{utility.name}</CardTitle>
                  <CardDescription className="text-xs">{utility.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Individual Utility Components (Simplified)

function HashIdentifierUtility() {
  const [hash, setHash] = useState("")
  const [result, setResult] = useState("")

  const identifyHash = (h: string) => {
    const len = h.trim().length
    if (len === 32) return "Likely MD5 (32 hex characters)"
    if (len === 40) return "Likely SHA-1 (40 hex characters)"
    if (len === 64) return "Likely SHA-256 (64 hex characters)"
    if (len === 128) return "Likely SHA-512 (128 hex characters)"
    return "Unknown hash type"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔐 Hash Identifier</CardTitle>
        <CardDescription>Paste a hash to identify its type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter hash value..."
          value={hash}
          onChange={(e) => {
            setHash(e.target.value)
            setResult(identifyHash(e.target.value))
          }}
        />
        {result && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Base64Utility() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const encode = () => {
    try {
      setOutput(btoa(input))
    } catch (e) {
      setOutput("Error encoding")
    }
  }

  const decode = () => {
    try {
      setOutput(atob(input))
    } catch (e) {
      setOutput("Error decoding - invalid Base64")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 Base64 Toolkit</CardTitle>
        <CardDescription>Encode or decode Base64 strings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Input</label>
          <textarea
            className="w-full p-3 rounded-lg border bg-background mt-2"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text or Base64..."
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={encode}>Encode</Button>
          <Button onClick={decode} variant="outline">Decode</Button>
        </div>
        {output && (
          <div>
            <label className="text-sm font-medium">Output</label>
            <div className="p-3 bg-muted rounded-lg mt-2 font-mono text-sm break-all">
              {output}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TimestampUtility() {
  const [timestamp, setTimestamp] = useState("")
  const [result, setResult] = useState("")

  const convert = () => {
    try {
      const ts = parseInt(timestamp)
      const date = new Date(ts * 1000)
      setResult(date.toLocaleString())
    } catch (e) {
      setResult("Invalid timestamp")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>⏰ Timestamp Converter</CardTitle>
        <CardDescription>Convert Unix timestamps to readable dates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter Unix timestamp..."
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />
        <Button onClick={convert}>Convert</Button>
        {result && (
          <div className="p-3 bg-muted rounded-lg">
            <p>{result}</p>
          </div>
        )}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Current timestamp: <span className="font-mono">{Math.floor(Date.now() / 1000)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function EmailHeaderUtility() {
  const [headers, setHeaders] = useState("")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>📧 Email Header Parser</CardTitle>
        <CardDescription>Analyze email headers for investigation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="w-full p-3 rounded-lg border bg-background"
          rows={10}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder="Paste email headers here..."
        />
        <div className="text-sm text-muted-foreground">
          <p>Look for:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Return-Path (sender email)</li>
            <li>Received: (mail server chain)</li>
            <li>X-Originating-IP (sender IP)</li>
            <li>Authentication-Results (SPF, DKIM, DMARC)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function IPInfoUtility() {
  const [ip, setIp] = useState("")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>🌐 IP Info Lookup</CardTitle>
        <CardDescription>Quick IP address information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Enter IP address..."
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <div className="space-y-2">
          <Button className="w-full" onClick={() => window.open(`https://www.abuseipdb.com/check/${ip}`, '_blank')}>
            Check on AbuseIPDB
          </Button>
          <Button className="w-full" variant="outline" onClick={() => window.open(`https://www.virustotal.com/gui/ip-address/${ip}`, '_blank')}>
            Check on VirusTotal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function PortLookupUtility() {
  const [search, setSearch] = useState("")
  const commonPorts = [
    { port: 20, service: "FTP Data", protocol: "TCP" },
    { port: 21, service: "FTP Control", protocol: "TCP" },
    { port: 22, service: "SSH", protocol: "TCP" },
    { port: 23, service: "Telnet", protocol: "TCP" },
    { port: 25, service: "SMTP", protocol: "TCP" },
    { port: 53, service: "DNS", protocol: "TCP/UDP" },
    { port: 80, service: "HTTP", protocol: "TCP" },
    { port: 110, service: "POP3", protocol: "TCP" },
    { port: 143, service: "IMAP", protocol: "TCP" },
    { port: 443, service: "HTTPS", protocol: "TCP" },
    { port: 445, service: "SMB", protocol: "TCP" },
    { port: 3306, service: "MySQL", protocol: "TCP" },
    { port: 3389, service: "RDP", protocol: "TCP" },
    { port: 5432, service: "PostgreSQL", protocol: "TCP" },
    { port: 8080, service: "HTTP Proxy", protocol: "TCP" },
  ]

  const filtered = commonPorts.filter(p => 
    p.port.toString().includes(search) || 
    p.service.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔌 Port Lookup</CardTitle>
        <CardDescription>Common ports and their services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search by port or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filtered.map((p) => (
            <div key={p.port} className="p-3 bg-muted rounded-lg flex justify-between items-center">
              <div>
                <span className="font-mono font-bold">{p.port}</span>
                <span className="text-muted-foreground ml-2">{p.service}</span>
              </div>
              <Badge variant="outline">{p.protocol}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function UserAgentUtility() {
  const [ua, setUa] = useState("")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>🖥️ User-Agent Parser</CardTitle>
        <CardDescription>Decode browser and device information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="w-full p-3 rounded-lg border bg-background"
          rows={4}
          value={ua}
          onChange={(e) => setUa(e.target.value)}
          placeholder="Paste User-Agent string..."
        />
        <div className="text-sm text-muted-foreground">
          <p>User-Agent strings contain:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Browser name and version</li>
            <li>Operating system</li>
            <li>Device type</li>
            <li>Rendering engine</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function EvidenceLockerUtility() {
  const [notes, setNotes] = useState("")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Evidence Locker</CardTitle>
        <CardDescription>Temporary notes for current investigation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="w-full p-3 rounded-lg border bg-background font-mono text-sm"
          rows={15}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Document evidence here...

IOCs found:
- IP: 
- Domain: 
- Hash: 

Timeline:
- 

Notes:
- "
        />
        <p className="text-xs text-muted-foreground">
          ⚠️ Notes are stored locally in browser and will be lost on refresh. Use SOC Journal for permanent storage.
        </p>
      </CardContent>
    </Card>
  )
}

function TimelineBuilderUtility() {
  const [events, setEvents] = useState("")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>📅 Timeline Builder</CardTitle>
        <CardDescription>Build investigation timeline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="w-full p-3 rounded-lg border bg-background font-mono text-sm"
          rows={15}
          value={events}
          onChange={(e) => setEvents(e.target.value)}
          placeholder="Build your timeline...

Format:
[TIME] - EVENT DESCRIPTION

Example:
[14:23 UTC] - Failed login attempts detected
[14:25 UTC] - Account locked automatically
[14:30 UTC] - User contacted helpdesk
[14:45 UTC] - Incident escalated to SOC
"
        />
      </CardContent>
    </Card>
  )
}

function TerminalContent({ onNavigate, openWindows = [], onCloseWindow, onMinimizeWindow, glossary = [], tickets = [] }: { onNavigate: (appId: string) => void; openWindows?: { id: string; label: string }[]; onCloseWindow?: (id: string) => void; onMinimizeWindow?: (id: string) => void; glossary?: any[]; tickets?: any[] }) {
  const [history, setHistory] = useState<string[]>([
    "╔══════════════════════════════════════════════════════════╗",
    "║  SOC OS Terminal v1.0 - Command Center                  ║",
    "╚══════════════════════════════════════════════════════════╝",
    "",
    "💡 New to command lines? Type 'help' to see what you can do!",
    "   Or try: 'open journal', 'apps', 'ticket list'",
    ""
  ])
  const [input, setInput] = useState("")

  const addToHistory = (lines: string[]) => {
    setHistory(prev => [...prev, ...lines])
  }

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    
    if (!trimmed) return

    // Add command to history
    addToHistory([`$ ${cmd}`])

    // Parse command and args
    const parts = trimmed.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    // Clear command
    if (command === "clear") {
      setHistory([])
      return
    }

    // System info commands
    if (command === "whoami") {
      addToHistory(["soc-analyst", ""])
      return
    }

    if (command === "sysinfo") {
      addToHistory([
        "SOC OS v1.0",
        "Build: 2024.02",
        "Runtime: Browser-based Virtual Environment",
        "Apps: 21 installed",
        ""
      ])
      return
    }

    if (command === "time") {
      addToHistory([new Date().toLocaleString(), ""])
      return
    }

    if (command === "uptime") {
      addToHistory([`System uptime: ${Math.floor(Math.random() * 100)} hours`, ""])
      return
    }

    if (command === "motd") {
      addToHistory([
        "╔══════════════════════════════════════╗",
        "║   Welcome to SOC OS                  ║",
        "║   Your Personal Blue Team Desktop    ║",
        "╚══════════════════════════════════════╝",
        ""
      ])
      return
    }

    // Help system
    if (command === "help") {
      if (args.length === 0) {
        addToHistory([
          "Available Commands:",
          "",
          "SYSTEM:",
          "  whoami, sysinfo, time, uptime, motd, clear",
          "",
          "APPS:",
          "  apps              - list all applications",
          "  open <app>        - open application",
          "",
          "TOOLS:",
          "  check-ip <ip>     - lookup IP address",
          "  decode <base64>   - decode Base64 string",
          "  hash <string>     - identify hash type",
          "  parse-header      - open email header parser",
          "",
          "TICKETS:",
          "  ticket list       - list all tickets",
          "  ticket open <id>  - open specific ticket",
          "",
          "JOURNAL:",
          "  journal add [note] - open journal (or add quick note)",
          "  journal search    - search journal",
          "",
          "WINDOWS:",
          "  ls                - list open windows",
          "  close <app>       - close a window",
          "  minimize <app>    - minimize a window",
          "",
          "SEARCH:",
          "  find <query>      - search glossary & tickets",
          "",
          "Type 'help <command>' for detailed information",
          ""
        ])
      } else {
        const helpCmd = args[0].toLowerCase()
        const helpText: Record<string, string[]> = {
          open: [
            "USAGE: open <app-name>",
            "",
            "Opens a desktop application.",
            "Example: open journal, open tickets, open utilities",
            ""
          ],
          "check-ip": [
            "USAGE: check-ip <ip-address>",
            "",
            "Opens IP Info Lookup tool with the specified IP.",
            "Example: check-ip 192.168.1.1",
            ""
          ],
          decode: [
            "USAGE: decode <base64-string>",
            "",
            "Opens Base64 Toolkit with the string ready to decode.",
            "Example: decode SGVsbG8gV29ybGQ=",
            ""
          ],
          hash: [
            "USAGE: hash <hash-string>",
            "",
            "Opens Hash Identifier with the hash value.",
            "Example: hash 5d41402abc4b2a76b9719d911017c592",
            ""
          ],
          ticket: [
            "USAGE: ticket <list|open> [id]",
            "",
            "Manage incident tickets.",
            "  ticket list    - show all tickets",
            "  ticket open 1  - open ticket by number",
            ""
          ],
          find: [
            "USAGE: find <search-query>",
            "",
            "Search glossary and ticket titles. Shows matching terms and tickets.",
            "Example: find 4625",
            ""
          ],
          ls: ["USAGE: ls", "", "List all open windows. Use with close <id> or minimize <id>.", ""],
          close: ["USAGE: close <app-id>", "", "Close a window. Use 'ls' to see open windows.", ""],
          minimize: ["USAGE: minimize <app-id>", "", "Minimize a window to the taskbar.", ""]
        }

        if (helpText[helpCmd]) {
          addToHistory(helpText[helpCmd])
        } else {
          addToHistory([`No help available for '${helpCmd}'`, ""])
        }
      }
      return
    }

    // Apps command
    if (command === "apps") {
      addToHistory([
        "Installed Applications:",
        "",
        "  journal          SOC Journal",
        "  tickets          Incident Tickets",
        "  playbooks        SOC Playbooks",
        "  case-files       Case Files",
        "  utilities        Utilities Folder",
        "  terminal         Terminal",
        "  glossary         SOC Dictionary",
        "  cli-cheats       CLI Cheatbook",
        "  threat-feed      Intel Feed",
        "  toolbox          Blue Team Toolbox",
        "  skill-drills     Skill Drills",
        "  cert-path        Cert Roadmap",
        "  sec-plus         Sec+ Vault",
        "  interview-prep   Interview Prep",
        "  ioc-helper       IOC Helper",
        "  lab-files        Lab Files",
        "  projects         Projects",
        "",
        "Use 'open <app-name>' to launch",
        ""
      ])
      return
    }

    // Open command
    if (command === "open") {
      if (args.length === 0) {
        addToHistory(["Usage: open <app-name>", "Type 'apps' to see available applications", ""])
        return
      }

      const appMap: Record<string, string> = {
        journal: "soc-journal",
        tickets: "tickets",
        playbooks: "playbooks",
        "case-files": "case-files",
        cases: "case-files",
        utilities: "utilities",
        utils: "utilities",
        terminal: "terminal",
        glossary: "glossary",
        dictionary: "glossary",
        "cli-cheats": "cli-cheats",
        cli: "cli-cheats",
        "threat-feed": "threat-feed",
        intel: "threat-feed",
        toolbox: "toolbox",
        tools: "toolbox",
        "skill-drills": "skill-drills",
        drills: "skill-drills",
        "cert-path": "cert-path",
        certs: "cert-path",
        "sec-plus": "sec-plus",
        secplus: "sec-plus",
        interview: "interview-prep",
        ioc: "ioc-helper",
        labs: "lab-files",
        projects: "projects"
      }

      const appName = args[0].toLowerCase()
      const appId = appMap[appName]

      if (appId) {
        addToHistory([`Opening ${appName}...`, ""])
        setTimeout(() => onNavigate(appId), 100)
      } else {
        addToHistory([`Unknown application: ${appName}`, "Type 'apps' for list", ""])
      }
      return
    }

    // IP lookup
    if (command === "check-ip") {
      if (args.length === 0) {
        addToHistory(["Usage: check-ip <ip-address>", ""])
        return
      }
      addToHistory([`Opening IP Lookup for ${args[0]}...`, ""])
      setTimeout(() => onNavigate("util-ip"), 100)
      return
    }

    // Base64 decode
    if (command === "decode") {
      if (args.length === 0) {
        addToHistory(["Usage: decode <base64-string>", ""])
        return
      }
      addToHistory([`Opening Base64 Toolkit...`, ""])
      setTimeout(() => onNavigate("util-base64"), 100)
      return
    }

    // Hash identifier
    if (command === "hash") {
      if (args.length === 0) {
        addToHistory(["Usage: hash <hash-string>", ""])
        return
      }
      addToHistory([`Opening Hash Identifier...`, ""])
      setTimeout(() => onNavigate("util-hash"), 100)
      return
    }

    // Email parser
    if (command === "parse-header") {
      addToHistory(["Opening Email Header Parser...", ""])
      setTimeout(() => onNavigate("util-email"), 100)
      return
    }

    // ls - list open windows
    if (command === "ls") {
      if (openWindows.length === 0) {
        addToHistory(["No windows open.", "Use 'open <app>' to launch an application.", ""])
      } else {
        addToHistory(["Open windows:", "", ...openWindows.map(w => `  ${w.id.padEnd(20)} ${w.label}`), ""])
      }
      return
    }

    // close <app> - close window
    if (command === "close") {
      if (args.length === 0) {
        addToHistory(["Usage: close <app-id>", "Use 'ls' to see open windows", ""])
        return
      }
      const q = args.join(" ").toLowerCase().replace(/\s+/g, "-")
      const win = openWindows.find(w => w.id === q || w.id.replace(/-/g, " ") === args.join(" ").toLowerCase() || w.label.toLowerCase().includes(args.join(" ").toLowerCase()))
      if (win && onCloseWindow) {
        onCloseWindow(win.id)
        addToHistory([`Closed ${win.label}.`, ""])
      } else {
        addToHistory([`No open window: ${args.join(" ")}`, "Type 'ls' for open windows", ""])
      }
      return
    }

    // minimize <app>
    if (command === "minimize") {
      if (args.length === 0) {
        addToHistory(["Usage: minimize <app-id>", "Use 'ls' to see open windows", ""])
        return
      }
      const q = args.join(" ").toLowerCase().replace(/\s+/g, "-")
      const win = openWindows.find(w => w.id === q || w.id.replace(/-/g, " ") === args.join(" ").toLowerCase() || w.label.toLowerCase().includes(args.join(" ").toLowerCase()))
      if (win && onMinimizeWindow) {
        onMinimizeWindow(win.id)
        addToHistory([`Minimized ${win.label}.`, ""])
      } else {
        addToHistory([`No open window: ${args.join(" ")}`, ""])
      }
      return
    }

    // Ticket commands
    if (command === "ticket") {
      if (args.length === 0 || args[0] === "list") {
        const lines = ["Incident Tickets:", ""]
        tickets.slice(0, 10).forEach((t: any, i: number) => {
          lines.push(`  ${i + 1}. ${t.title} (${t.difficulty})`)
        })
        lines.push("", "Use 'open tickets' to view, or 'ticket open <number>'", "")
        addToHistory(lines)
        return
      }

      if (args[0] === "open" && args[1]) {
        const num = parseInt(args[1], 10)
        if (num >= 1 && num <= tickets.length) {
          addToHistory(["Opening Tickets...", ""])
          setTimeout(() => onNavigate("tickets"), 100)
        } else {
          addToHistory([`Invalid ticket number: ${args[1]}`, ""])
        }
        return
      }

      if (args[0] === "open") {
        addToHistory(["Opening Tickets app...", ""])
        setTimeout(() => onNavigate("tickets"), 100)
        return
      }
    }

    // Journal commands
    if (command === "journal") {
      if (args.length === 0 || args[0] === "add") {
        addToHistory(["Opening SOC Journal...", "(Sign in to add entries)", ""])
        setTimeout(() => onNavigate("soc-journal"), 100)
        return
      }

      if (args[0] === "search") {
        addToHistory(["Opening SOC Journal...", ""])
        setTimeout(() => onNavigate("soc-journal"), 100)
        return
      }
    }

    // Find/Search command - search glossary and ticket titles
    if (command === "find") {
      if (args.length === 0) {
        addToHistory(["Usage: find <search-query>", "Example: find 4625", ""])
        return
      }
      const query = args.join(" ").toLowerCase()
      const glossaryMatches = glossary.filter((t: any) => (t.term?.toLowerCase().includes(query) || t.definition?.toLowerCase().includes(query))).slice(0, 5)
      const ticketMatches = tickets.filter((t: any) => (t.title?.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query))).slice(0, 3)
      const lines = [`Results for "${query}":`, ""]
      if (glossaryMatches.length > 0) {
        lines.push("Glossary:")
        glossaryMatches.forEach((t: any) => lines.push(`  • ${t.term}: ${(t.definition || "").slice(0, 60)}...`))
        lines.push("")
      }
      if (ticketMatches.length > 0) {
        lines.push("Tickets:")
        ticketMatches.forEach((t: any) => lines.push(`  • ${t.title}`))
        lines.push("")
      }
      if (glossaryMatches.length === 0 && ticketMatches.length === 0) {
        lines.push("No matches. Try 'open glossary' or 'open tickets'.", "")
      } else {
        lines.push("Use 'open glossary' or 'open tickets' for full content.", "")
      }
      addToHistory(lines)
      return
    }

    // Unknown command
    addToHistory([
      `Command not found: ${command}`,
      "Type 'help' for available commands",
      ""
    ])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input)
      setInput("")
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-black text-[#4e7cf6] font-mono text-sm p-4 rounded-lg flex-1 overflow-y-auto">
        {history.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-[#4e7cf6]">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent outline-none border-none text-[#4e7cf6] placeholder:text-[#4e7cf6]/60"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

function AboutContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Monitor className="h-6 w-6 text-blue-400" />
          About SOC OS
        </h2>
        <p className="text-muted-foreground">Personal SOC analyst training platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Version 1.0</CardTitle>
          <CardDescription>February 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What is SOC OS?</h3>
            <p className="text-sm text-muted-foreground">
              SOC OS is a personal learning platform designed to help aspiring SOC analysts practice, document, and track their cybersecurity journey. It simulates a desktop operating system with specialized tools, training materials, and hands-on challenges.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Built With</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Next.js 16</Badge>
              <Badge variant="outline">React 19</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">Supabase</Badge>
              <Badge variant="outline">shadcn/ui</Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Changelog</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">v1.0 - February 2024</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>Initial release with 20 desktop apps</li>
                  <li>Authentication system with Supabase</li>
                  <li>SOC Journal with full CRUD</li>
                  <li>Incident Ticket Simulator</li>
                  <li>Lab Files for hands-on practice</li>
                  <li>9 SOC utilities tools</li>
                  <li>Skill Drills and practice quizzes</li>
                  <li>Certification roadmap tracking</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Developer</h3>
            <p className="text-sm text-muted-foreground">
              Built by <strong>Michael Walton</strong> as part of a cybersecurity portfolio and personal learning platform.
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => window.open('https://github.com/GreyKeyStudios', '_blank')}>
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button size="sm" variant="outline" onClick={() => window.open('https://resume.greykeystudios.dev', '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Resume
              </Button>
            </div>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-xs text-muted-foreground">
              <p>
                This project was scaffolded and developed with AI assistance (Claude + Cursor).
                All code and content are original implementations for educational purposes.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsContent({
  isLoggedIn,
  theme,
  onThemeChange,
}: {
  isLoggedIn: boolean
  theme: DesktopThemeId
  onThemeChange: (t: DesktopThemeId) => void
}) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Wrench className="h-6 w-6 text-slate-400" />
          Settings
        </h2>
        <p className="text-muted-foreground">Customize your SOC OS experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme{" "}
                {!isLoggedIn && (
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Sign in to unlock more
                  </span>
                )}
              </p>
            </div>
            <select
              value={theme}
              onChange={(e) => onThemeChange(e.target.value as DesktopThemeId)}
              className="px-3 py-2 rounded-lg border bg-background"
            >
              {(Object.keys(DESKTOP_THEMES) as DesktopThemeId[]).map((id) => (
                <option key={id} value={id} disabled={!isLoggedIn && id !== "default"}>
                  {DESKTOP_THEMES[id].label}
                  {!isLoggedIn && id !== "default" ? " (Locked)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reduced Motion</p>
              <p className="text-sm text-muted-foreground">Minimize animations</p>
            </div>
            <Button
              variant={reducedMotion ? "default" : "outline"}
              size="sm"
              onClick={() => setReducedMotion(!reducedMotion)}
            >
              {reducedMotion ? "ON" : "OFF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audio</CardTitle>
          <CardDescription>Sound preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Effects</p>
              <p className="text-sm text-muted-foreground">Enable UI sound effects (Coming Soon)</p>
            </div>
            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              disabled
            >
              {soundEnabled ? "ON" : "OFF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Manage your local data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Clear Local Storage</p>
            <p className="text-sm text-muted-foreground mb-3">
              This will clear temporary data stored in your browser (Evidence Locker, Timeline Builder notes).
              Your journal and progress are stored in your account and won't be affected.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Clear all local temporary data?")) {
                  localStorage.clear()
                  alert("Local storage cleared!")
                }
              }}
            >
              Clear Local Data
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="font-medium mb-2 text-red-500">Reset SOC OS</p>
            <p className="text-sm text-muted-foreground mb-3">
              Close all windows and return to the splash screen. This does not delete any data.
            </p>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Close all windows and return to splash screen?")) {
                  window.location.reload()
                }
              }}
            >
              Reset OS
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6 text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> Some settings are placeholders for future features.
            Theme switching and sound effects will be added in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
