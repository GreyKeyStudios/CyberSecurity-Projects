import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// GitHub URL constants — single source of truth
export const GITHUB_REPO = "https://github.com/GreyKeyStudios/CyberSecurity-Projects"
export const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main"

export function getGitHubTreeUrl(githubPath: string): string {
  return `${GITHUB_REPO}/tree/main/${githubPath}`
}

export function getGitHubBlobUrl(githubPath: string): string {
  return `${GITHUB_REPO}/blob/main/${githubPath}`
}

export function getGitHubRawUrl(filePath: string): string {
  return `${GITHUB_RAW_BASE}/${filePath}`
}

// Career start date: March 2016
const CAREER_START = new Date(2016, 2, 1)

export function getExperienceYears(): number {
  const now = new Date()
  const diffMs = now.getTime() - CAREER_START.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25))
}
