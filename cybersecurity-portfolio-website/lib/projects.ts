import projectsData from "@/data/projects.json"
import type { BadgeType } from "@/components/project-badge"
import { getGitHubTreeUrl } from "@/lib/utils"

export interface Project {
  id: string
  title: string
  category: string
  badge: BadgeType
  badgeLabel: string
  status: "complete" | "planned"
  priority: "high" | "medium" | "low"
  description: string
  skills: string[]
  tools: string[]
  evidence: string[]
  link: string
  githubPath: string
  featured: boolean
}

export interface BadgeInfo {
  id: string
  label: string
  icon: string
  color: string
  description: string
}

export interface Stats {
  total: number
  complete: number
  planned: number
  verified: number
}

// Export data from JSON
export const projects: Project[] = projectsData.projects as Project[]
export const badges: BadgeInfo[] = projectsData.badges
export const stats: Stats = projectsData.stats

// Extract unique categories from projects (since categories in JSON might be objects)
export const categories: string[] = Array.from(
  new Set(projects.map((p) => p.category))
).sort()

// Helper functions
export const featuredProjects = projects.filter((p) => p.featured)
export const completeProjects = projects.filter((p) => p.status === "complete")
export const plannedProjects = projects.filter((p) => p.status === "planned")
export const verifiedProjects = projects.filter(
  (p) => p.badge === "verified-complete" || p.badge === "verified-api"
)

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter((p) => p.category === category)
}

export function getProjectsByBadge(badge: BadgeType): Project[] {
  return projects.filter((p) => p.badge === badge)
}

// Re-export for backward compatibility
export { getGitHubTreeUrl as getGitHubUrl } from "@/lib/utils"
