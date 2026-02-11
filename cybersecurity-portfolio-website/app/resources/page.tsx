"use client"

import { useState, useEffect } from "react"
import { Shield, Zap, Compass, FileText, Wrench, BookOpen, FlaskConical, Code2, Briefcase, ExternalLink, ArrowRight, Github, X, Monitor, Menu, Power, Sparkles, Target, FolderOpen, ClipboardList, GraduationCap, Radio, Terminal, Package, BookA, Dumbbell, Gamepad2, Map, LogIn, BookMarked, FolderDown, Ticket } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DesktopWindow } from "@/components/desktop-window"
import { MarkdownContent } from "@/components/markdown-content"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { UserMenu } from "@/components/auth/user-menu"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import resourcesData from "@/data/resources.json"

const GITHUB_BASE_URL = "https://github.com/KreerB/CyberSecurity-Projects"
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main"

interface WindowState {
  id: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  navigationStack: string[]
  currentNavIndex: number
}

export default function ResourcesPage() {
  const { quickStart, templates, cheatSheets, tools, labs, codeExamples, interviewPrep, caseFiles, playbooks, secPlusVault, threatFeed, cliCommands, toolbox, glossary, skillDrills, certPath, miniGames, labFiles, tickets } = resourcesData
  const [isVMActive, setIsVMActive] = useState(false)
  const [showLoginScreen, setShowLoginScreen] = useState(false)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
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
    { id: "daily-mission", label: "Daily Mission", icon: Target, color: "text-sky-500", bgColor: "bg-sky-500/10", titleBar: "from-sky-500/20 to-sky-600/20" },
    { id: "30min-practice", label: "30-Min Practice", icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-500/10", titleBar: "from-yellow-500/20 to-yellow-600/20" },
    { id: "quick-start", label: "Learning Paths", icon: Compass, color: "text-green-500", bgColor: "bg-green-500/10", titleBar: "from-green-500/20 to-green-600/20" },
    
    // Row 2: Documentation & Resources
    { id: "templates", label: "Templates", icon: FileText, color: "text-blue-500", bgColor: "bg-blue-500/10", titleBar: "from-blue-500/20 to-blue-600/20" },
    { id: "case-files", label: "Case Files", icon: FolderOpen, color: "text-violet-500", bgColor: "bg-violet-500/10", titleBar: "from-violet-500/20 to-violet-600/20" },
    { id: "playbooks", label: "Playbooks", icon: ClipboardList, color: "text-rose-500", bgColor: "bg-rose-500/10", titleBar: "from-rose-500/20 to-rose-600/20" },
    { id: "cheat-sheets", label: "Quick Reference", icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-500/10", titleBar: "from-purple-500/20 to-purple-600/20" },
    
    // Row 3: Tools & Reference
    { id: "tools", label: "Daily Tools", icon: Wrench, color: "text-cyan-500", bgColor: "bg-cyan-500/10", titleBar: "from-cyan-500/20 to-cyan-600/20" },
    { id: "cli-cheats", label: "CLI Cheats", icon: Terminal, color: "text-lime-500", bgColor: "bg-lime-500/10", titleBar: "from-lime-500/20 to-lime-600/20" },
    { id: "glossary", label: "SOC Dictionary", icon: BookA, color: "text-fuchsia-500", bgColor: "bg-fuchsia-500/10", titleBar: "from-fuchsia-500/20 to-fuchsia-600/20" },
    { id: "ioc-helper", label: "IOC Helper", icon: Shield, color: "text-red-500", bgColor: "bg-red-500/10", titleBar: "from-red-500/20 to-red-600/20" },
    
    // Row 4: Training & Practice
    { id: "labs", label: "Practice Labs", icon: FlaskConical, color: "text-pink-500", bgColor: "bg-pink-500/10", titleBar: "from-pink-500/20 to-pink-600/20" },
    { id: "code-examples", label: "Automation Scripts", icon: Code2, color: "text-orange-500", bgColor: "bg-orange-500/10", titleBar: "from-orange-500/20 to-orange-600/20" },
    { id: "threat-feed", label: "Intel Feed", icon: Radio, color: "text-teal-500", bgColor: "bg-teal-500/10", titleBar: "from-teal-500/20 to-teal-600/20" },
    { id: "toolbox", label: "Toolbox", icon: Package, color: "text-slate-400", bgColor: "bg-slate-400/10", titleBar: "from-slate-400/20 to-slate-500/20" },
    
    // Row 4: Skill Building
    { id: "skill-drills", label: "Skill Drills", icon: Dumbbell, color: "text-emerald-400", bgColor: "bg-emerald-400/10", titleBar: "from-emerald-400/20 to-emerald-500/20" },
    { id: "mini-game", label: "Mini Game", icon: Gamepad2, color: "text-pink-400", bgColor: "bg-pink-400/10", titleBar: "from-pink-400/20 to-pink-500/20" },
    
    // Row 5: Practice & Training
    { id: "soc-journal", label: "SOC Journal", icon: BookMarked, color: "text-purple-400", bgColor: "bg-purple-400/10", titleBar: "from-purple-400/20 to-purple-500/20" },
    { id: "tickets", label: "Tickets", icon: Ticket, color: "text-orange-400", bgColor: "bg-orange-400/10", titleBar: "from-orange-400/20 to-orange-500/20" },
    { id: "lab-files", label: "Lab Files", icon: FolderDown, color: "text-cyan-400", bgColor: "bg-cyan-400/10", titleBar: "from-cyan-400/20 to-cyan-500/20" },
    
    // Row 6: Career & Study
    { id: "interview-prep", label: "Interview Prep", icon: Briefcase, color: "text-indigo-500", bgColor: "bg-indigo-500/10", titleBar: "from-indigo-500/20 to-indigo-600/20" },
    { id: "cert-path", label: "Cert Roadmap", icon: Map, color: "text-blue-400", bgColor: "bg-blue-400/10", titleBar: "from-blue-400/20 to-blue-500/20" },
    { id: "sec-plus", label: "Sec+ Vault", icon: GraduationCap, color: "text-amber-500", bgColor: "bg-amber-500/10", titleBar: "from-amber-500/20 to-amber-600/20" },
  ]

  const [windows, setWindows] = useState<WindowState[]>(
    desktopIcons.map(icon => ({ 
      id: icon.id, 
      isOpen: false, 
      isMinimized: false, 
      zIndex: 10,
      navigationStack: [icon.id],
      currentNavIndex: 0
    }))
  )
  const [nextZIndex, setNextZIndex] = useState(11)

  const openWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZIndex, navigationStack: [id], currentNavIndex: 0 } : w
    ))
    setNextZIndex(prev => prev + 1)
  }

  const closeWindow = (id: string) => {
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
      {/* Splash Page - Default View */}
      {!isVMActive && (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-12 w-12 text-primary" />
                <h1 className="text-5xl font-bold">My SOC Operating System</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
                This is my personal SOC Operating System — a living toolkit I use while studying and practicing blue team workflows. 
                It includes investigation templates, IOC lookup tools, Splunk queries, cheat sheets, practice labs, and interview prep notes.
              </p>
              <p className="text-base text-muted-foreground max-w-3xl mx-auto">
                Much of the structure was built using AI-assisted development, then refined through testing and hands-on learning. 
                The goal isn&apos;t perfection — it&apos;s consistency.
              </p>
            </div>

            {/* Launch Button */}
            <div className="flex justify-center mb-16">
              <Button
                onClick={() => setShowLoginScreen(true)}
                size="lg"
                className="gap-3 px-8 py-6 text-lg bg-primary hover:bg-primary/90 shadow-xl"
              >
                <Monitor className="h-6 w-6" />
                Launch SOC Operating System
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    What&apos;s Inside
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>✨ <strong>30-Minute Practice</strong> - Quick wins and deep practice tasks</div>
                  <div>🧭 <strong>Learning Paths</strong> - Roadmap.sh, TryHackMe, LetsDefend</div>
                  <div>📝 <strong>Templates</strong> - Investigation and incident response forms</div>
                  <div>🔧 <strong>Daily Tools</strong> - VirusTotal, AbuseIPDB, Shodan, etc.</div>
                  <div>📚 <strong>Cheat Sheets</strong> - Splunk SPL, Windows logs, MITRE ATT&CK</div>
                  <div>🧪 <strong>Practice Labs</strong> - Hands-on SOC scenarios</div>
                  <div>💻 <strong>Automation Scripts</strong> - Python IOC enrichment, log parsing</div>
                  <div>🎤 <strong>Interview Prep</strong> - STAR method, common questions</div>
                  <div>🛡️ <strong>IOC Helper</strong> - Quick threat intel lookups</div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    How to Use the Desktop OS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>🖱️ <strong>Double-click</strong> any icon to launch that app</div>
                  <div>↔️ <strong>Drag</strong> the title bar to move windows around</div>
                  <div>🔴 <strong>Red button</strong> closes the window</div>
                  <div>🟡 <strong>Yellow button</strong> minimizes to taskbar</div>
                  <div>🟢 <strong>Green button</strong> maximizes the window</div>
                  <div>📊 <strong>Taskbar</strong> at bottom shows all open apps</div>
                  <div>🚪 <strong>Exit button</strong> (top right) returns here</div>
                  <div>💡 <strong>Tip:</strong> Open multiple apps at once!</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Login Screen */}
      {showLoginScreen && !isVMActive && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <Card className="bg-slate-900/90 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Monitor className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome to SOC OS</CardTitle>
                <CardDescription>Choose how you want to continue</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    setIsGuestMode(true)
                    setIsVMActive(true)
                  }}
                  variant="outline"
                  className="w-full py-6 text-lg"
                  size="lg"
                >
                  <Power className="mr-2 h-5 w-5" />
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLoginScreen(false)}
                className="text-white/70 hover:text-white"
              >
                ← Back to Portfolio
              </Button>
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

          {/* The "Monitor" - Full viewport VM */}
          <div 
            id="desktop-monitor"
            className="relative h-full w-full"
            style={{
              backgroundImage: 'url(/mockdesktopbackground.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
          {/* Overlay for better icon contrast */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Desktop Content Area */}
          <div className="relative h-full flex flex-col">
            {/* Desktop Icons Grid */}
            <div className="flex-1 p-8 overflow-auto">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                {desktopIcons.map(icon => {
                  const Icon = icon.icon
                  const window = windows.find(w => w.id === icon.id)
                  const isActive = window?.isOpen && !window?.isMinimized
                  
                  return (
                    <button
                      key={icon.id}
                      onDoubleClick={() => openWindow(icon.id)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 ${
                        isActive ? 'bg-white/10' : 'hover:scale-105'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${icon.bgColor} transition-transform group-hover:scale-110 shadow-lg`}>
                        <Icon className={`h-8 w-8 ${icon.color}`} />
                      </div>
                      <span className="text-xs font-medium text-center leading-tight text-white drop-shadow-lg">
                        {icon.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Taskbar - Inside the Monitor */}
            <div className="h-14 bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center px-2 gap-2 relative">
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
                        onClick={async () => {
                          // Sign out if user is logged in
                          if (user) {
                            await supabase.auth.signOut()
                            setUser(null)
                          }
                          // Reset all states
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
                  if (!icon) return null
                  const Icon = icon.icon
                  
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
                      <Icon className={`h-4 w-4 ${icon.color}`} />
                      <span className="text-xs font-medium text-white max-w-[120px] truncate">{icon.label}</span>
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

              <div className="text-xs text-white/70 font-mono">
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
          {desktopIcons.map(icon => {
            const window = windows.find(w => w.id === icon.id)
            if (!window?.isOpen) return null

            const currentPath = window.navigationStack[window.currentNavIndex]
            const canGoBack = window.currentNavIndex > 0
            const canGoForward = window.currentNavIndex < window.navigationStack.length - 1

            return (
              <DesktopWindow
                key={icon.id}
                id={icon.id}
                title={`${icon.label}.app`}
                icon={icon.icon}
                iconColor={icon.titleBar}
                isMinimized={window.isMinimized}
                zIndex={window.zIndex}
                onClose={() => closeWindow(icon.id)}
                onMinimize={() => minimizeWindow(icon.id)}
                onFocus={() => focusWindow(icon.id)}
                canGoBack={canGoBack}
                canGoForward={canGoForward}
                onGoBack={() => goBack(icon.id)}
                onGoForward={() => goForward(icon.id)}
              >
                {icon.id === "start-here" && <StartHereContent onNavigate={(appId) => openWindow(appId)} />}
                {icon.id === "daily-mission" && <DailyMissionContent onNavigate={(appId) => openWindow(appId)} />}
                {icon.id === "30min-practice" && <PracticeContent />}
                {icon.id === "quick-start" && <QuickStartContent quickStart={quickStart} />}
                {icon.id === "templates" && (
                  <TemplatesContent 
                    templates={templates} 
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(icon.id, path)}
                  />
                )}
                {icon.id === "case-files" && (
                  <CaseFilesContent 
                    caseFiles={caseFiles}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(icon.id, path)}
                  />
                )}
                {icon.id === "playbooks" && (
                  <PlaybooksContent 
                    playbooks={playbooks}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(icon.id, path)}
                  />
                )}
                {icon.id === "sec-plus" && <SecPlusVaultContent secPlusVault={secPlusVault} />}
                {icon.id === "skill-drills" && <SkillDrillsContent skillDrills={skillDrills} />}
                {icon.id === "mini-game" && <MiniGameContent miniGames={miniGames} />}
                {icon.id === "cert-path" && <CertPathContent certPath={certPath} />}
                {icon.id === "soc-journal" && <SOCJournalContent user={user} />}
                {icon.id === "tickets" && <TicketsContent tickets={tickets} user={user} />}
                {icon.id === "lab-files" && <LabFilesContent labFiles={labFiles} />}
                {icon.id === "threat-feed" && <ThreatFeedContent threatFeed={threatFeed} />}
                {icon.id === "cli-cheats" && <CLICheatsContent cliCommands={cliCommands} />}
                {icon.id === "toolbox" && <ToolboxContent toolbox={toolbox} />}
                {icon.id === "glossary" && <GlossaryContent glossary={glossary} />}
                {icon.id === "tools" && <ToolsContent tools={tools} />}
                {icon.id === "cheat-sheets" && (
                  <CheatSheetsContent 
                    cheatSheets={cheatSheets}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(icon.id, path)}
                  />
                )}
                {icon.id === "labs" && <LabsContent labs={labs} />}
                {icon.id === "code-examples" && (
                  <CodeExamplesContent 
                    codeExamples={codeExamples}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(icon.id, path)}
                  />
                )}
                {icon.id === "interview-prep" && (
                  <InterviewPrepContent 
                    interviewPrep={interviewPrep}
                    currentPath={currentPath}
                    onNavigate={(path) => navigateInWindow(icon.id, path)}
                  />
                )}
                {icon.id === "ioc-helper" && <IOCHelperContent />}
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
  
  // Parse current path (e.g., "cheat-sheets" or "cheat-sheets:sheet-id")
  const [view, itemId] = currentPath.split(':')
  const sheet = itemId ? cheatSheets.find(s => s.id === itemId) : null
  
  // Fetch content when viewing a specific cheat sheet
  useEffect(() => {
    if (sheet) {
      setLoading(true)
      fetch(`${GITHUB_RAW_BASE}/${sheet.githubPath}`)
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
  }, [sheet])
  
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
            <p className="text-muted-foreground mb-2">Content could not be loaded.</p>
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

function InterviewPrepContent({ interviewPrep, currentPath, onNavigate }: { interviewPrep: any[], currentPath: string, onNavigate: (path: string) => void }) {
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
  
  // If viewing a specific resource
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
  
  // Default: Show list of resources
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Interview Prep</h2>
        <p className="text-muted-foreground">Questions I've been asked. Study these while job hunting.</p>
      </div>
      <div className="grid gap-4">
        {interviewPrep.map((resource) => (
          <Card key={resource.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm">{resource.title}</CardTitle>
              <CardDescription className="text-xs">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                onClick={() => onNavigate(`interview-prep:${resource.id}`)}
                variant="default" 
                size="sm" 
                className="flex-1 gap-2"
              >
                Read Guide
                <ArrowRight className="h-3 w-3" />
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={`${GITHUB_BASE_URL}/blob/main/${resource.githubPath}`} target="_blank" rel="noopener noreferrer">
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

function IOCHelperContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">IOC Helper Tool</h2>
        <p className="text-muted-foreground mb-4">
          Quick tool to check IPs, domains, and hashes. Get threat intel links + auto-generated notes.
        </p>
      </div>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-base">Launch Full IOC Helper</CardTitle>
          <CardDescription>
            Opens in a new browser tab with full functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="default" size="lg" className="w-full gap-2">
            <a href="/resources/ioc-helper" target="_blank" rel="noopener noreferrer">
              Open IOC Helper
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
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

function DailyMissionContent({ onNavigate }: { onNavigate: (appId: string) => void }) {
  const [missions] = useState([
    { 
      id: 1, 
      duration: "10 MIN", 
      badge: "Quick Mission",
      title: "Review 3 MITRE techniques",
      description: "Pick a tactic and study 3 techniques",
      appId: "cheat-sheets",
      appName: "Cheat Sheets"
    },
    { 
      id: 2, 
      duration: "30 MIN", 
      badge: "Standard Mission",
      title: "Read a case file investigation",
      description: "Study a real SOC investigation walkthrough",
      appId: "case-files",
      appName: "Case Files"
    },
    { 
      id: 3, 
      duration: "60 MIN", 
      badge: "Stretch Mission",
      title: "Complete a practice lab",
      description: "Hands-on training from start to finish",
      appId: "labs",
      appName: "Labs"
    }
  ])
  
  const [completedToday, setCompletedToday] = useState<number[]>([])
  
  const markComplete = (id: number) => {
    if (completedToday.includes(id)) {
      setCompletedToday(completedToday.filter(cid => cid !== id))
    } else {
      setCompletedToday([...completedToday, id])
    }
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
          <span className="font-semibold">Keep the streak going!</span>
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
    </div>
  )
}

function CaseFilesContent({ caseFiles, currentPath, onNavigate }: { caseFiles: any[], currentPath: string, onNavigate: (path: string) => void }) {
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

function PlaybooksContent({ playbooks, currentPath, onNavigate }: { playbooks: any[], currentPath: string, onNavigate: (path: string) => void }) {
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
  
  const filteredFeed = selectedCategory === 'all' 
    ? threatFeed 
    : threatFeed.filter(item => item.category === selectedCategory)
  
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
      {/* Fixed header section */}
      <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Radio className="h-6 w-6 text-teal-500" />
            Threat Intelligence Feed
          </h2>
          <p className="text-muted-foreground">Stay current with the latest security advisories and threat intelligence.</p>
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
              {cat === 'all' ? 'All Sources' : cat}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Scrollable content */}
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

function CLICheatsContent({ cliCommands }: { cliCommands: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const categories = ['all', ...Array.from(new Set(cliCommands.map(cmd => cmd.category)))]
  
  const filteredCommands = cliCommands.filter(cmd => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory
    const matchesSearch = cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Fixed header section */}
      <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Terminal className="h-6 w-6 text-lime-500" />
            Command Line Cheatbook
          </h2>
          <p className="text-muted-foreground">Essential commands for SOC log analysis and investigation.</p>
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
              {cat === 'all' ? 'All' : cat}
            </Button>
          ))}
        </div>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search commands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto mt-4">
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
  
  const categories = ['all', ...Array.from(new Set(glossary.map(term => term.category)))]
  
  const filteredTerms = glossary.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          term.definition.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => a.term.localeCompare(b.term))
  
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
    <div className="flex flex-col h-full">
      {/* Fixed header section */}
      <div className="flex-shrink-0 space-y-4 pb-4 border-b border-border">
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
      
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto mt-4">
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
    </div>
  )
}

// Phase 4 Components

function SkillDrillsContent({ skillDrills }: { skillDrills: any }) {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
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
                setSelectedCategory(cat)
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
          <Button variant="outline" onClick={() => setSelectedCategory(null)}>
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
        <Button variant="outline" onClick={() => setSelectedCategory(null)}>
          Back to Categories
        </Button>
      </div>
    </div>
  )
}

function MiniGameContent({ miniGames }: { miniGames: any[] }) {
  const [selectedGame, setSelectedGame] = useState<any | null>(null)
  
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
                onClick={() => setSelectedGame(game)}
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
  
  // Game screen (placeholder for now)
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
            Game mechanics coming soon! This will be a fun, interactive way to practice SOC skills.
          </p>
          <Button onClick={() => setSelectedGame(null)}>
            Back to Games
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function CertPathContent({ certPath }: { certPath: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Map className="h-6 w-6 text-blue-400" />
          Certification Roadmap
        </h2>
        <p className="text-muted-foreground">My certification journey and planned progression.</p>
      </div>
      
      {/* Current Certifications */}
      {certPath.current && certPath.current.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">🎯 Currently Working On</h3>
          <div className="space-y-4">
            {certPath.current.map((cert: any, idx: number) => (
              <Card key={idx} className="bg-card border-border border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{cert.provider}</Badge>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-500">In Progress</Badge>
                  </div>
                  <CardDescription className="text-xs mt-2">{cert.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{cert.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${cert.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Started: {cert.started}</span>
                      <span>Target: {cert.target}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Completed Certifications */}
      {certPath.completed && certPath.completed.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">✅ Completed</h3>
          <div className="space-y-3">
            {certPath.completed.map((cert: any, idx: number) => (
              <Card key={idx} className="bg-card border-border border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{cert.provider}</Badge>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                  </div>
                  <CardDescription className="text-xs mt-2">
                    Completed: {cert.completedDate}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Planned Certifications */}
      {certPath.planned && certPath.planned.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">📋 Planned</h3>
          <div className="space-y-3">
            {certPath.planned.map((cert: any, idx: number) => (
              <Card key={idx} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{cert.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{cert.provider}</Badge>
                    </div>
                    <Badge variant="outline">Planned</Badge>
                  </div>
                  <CardDescription className="text-xs mt-2">{cert.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cert.prerequisite && (
                    <p className="text-xs text-muted-foreground">
                      📌 Prerequisite: {cert.prerequisite}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    ⏱️ Estimated time: {cert.estimatedTime}
                  </p>
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

function SOCJournalContent({ user }: { user: User | null }) {
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
        <Button variant="default">Sign In to Start</Button>
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
                {selectedEntry.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Entry list
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || entry.entry_type === filterType
    return matchesSearch && matchesType
  })

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

function TicketsContent({ tickets, user }: { tickets: any[]; user: User | null }) {
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)
  const [mode, setMode] = useState<'guided' | 'expert'>('guided')
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

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

        <div className="grid gap-4">
          {tickets.map((ticket) => {
            const getDifficultyColor = (diff: string) => {
              if (diff === "easy") return "bg-green-500/10 text-green-500 border-green-500/20"
              if (diff === "medium") return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              return "bg-red-500/10 text-red-500 border-red-500/20"
            }

            return (
              <Card key={ticket.id} className="cursor-pointer hover:border-orange-400/50 transition-all" onClick={() => setSelectedTicket(ticket)}>
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
            <CardContent className="text-sm text-muted-foreground">
              Create an account to track completed tickets, save notes, and monitor your progress over time.
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Ticket detail view
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => {
          setSelectedTicket(null)
          setShowHints(false)
          setShowSolution(false)
        }}>
          <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
          Back to Tickets
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Ticket #{selectedTicket.id.toUpperCase()}</CardTitle>
              <CardDescription>{selectedTicket.title}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={mode === 'guided' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('guided')}
              >
                Guided
              </Button>
              <Button
                variant={mode === 'expert' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('expert')}
              >
                Expert
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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

function LabFilesContent({ labFiles }: { labFiles: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFile, setSelectedFile] = useState<any | null>(null)

  const categories = ["all", "pcap", "event-logs", "email"]

  const filteredFiles = selectedCategory === "all" 
    ? labFiles 
    : labFiles.filter(f => f.category === selectedCategory)

  if (selectedFile) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
            <ArrowRight className="h-4 w-4 rotate-180 mr-2" />
            Back to Files
          </Button>
        </div>

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

            {selectedFile.available ? (
              <Button className="w-full">
                <FolderDown className="h-4 w-4 mr-2" />
                Download Lab File
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
                onClick={() => setSelectedFile(file)}
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
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No files in this category yet.
          </div>
        )}
      </div>
    </div>
  )
}
