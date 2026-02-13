"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Linkedin, Mail, Shield } from "lucide-react"

export function Footer() {
  const pathname = usePathname()
  if (pathname === "/resources") return null

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col text-foreground">
              <span className="font-semibold tracking-tight">Michael Walton</span>
              <span className="text-xs text-muted-foreground">Grey Key Security Lab (SOC Portfolio)</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Information Technology Professional. SOC / Cybersecurity Analyst focused on threat detection,
              incident response, and security operations.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/casefiles" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  SOC Casefiles
                </Link>
              </li>
              <li>
                <Link href="/resume" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/GreyKeyStudios/CyberSecurity-Projects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/michael-walton84"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:michaelwalton1984@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            {new Date().getFullYear()} Michael Walton. Grey Key Security Lab (SOC Portfolio).
          </p>
        </div>
      </div>
    </footer>
  )
}
