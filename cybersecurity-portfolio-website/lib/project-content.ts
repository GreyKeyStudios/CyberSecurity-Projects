// Project content cache - README content for each project
// This can be fetched from GitHub or stored here for static generation

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/GreyKeyStudios/CyberSecurity-Projects/main"

export interface ProjectScreenshots {
  [projectId: string]: string[]
}

export const projectScreenshots: ProjectScreenshots = {
  "log-analysis": [
    "screenshots/failed login atempts dashboard.png",
    "screenshots/system events dashboard.png",
    "screenshots/syslog events dashboard.png",
    "screenshots/Sudo Commands Dashboard.png",
    "screenshots/Splunk Messages.png",
    "screenshots/Screenshot 2025-03-03 195502.png",
  ],
  "wireshark": [
    "screenshots/juice-shop-review.png",
    "screenshots/juice-shop-review-2.png",
    "screenshots/bighint-1.png",
    "screenshots/solution-2.png",
    "screenshots/multidae-serverdown.png",
  ],
  "firewall-setup": [
    "screenshots/pre-rule-verbose.png",
    "screenshots/post-rule-numbered.png",
    "screenshots/nmap.png",
  ],
}

export function getReadmeUrl(githubPath: string): string {
  return `${GITHUB_RAW_BASE}/${githubPath}README.md`
}

export async function fetchReadme(githubPath: string): Promise<string | null> {
  try {
    const url = getReadmeUrl(githubPath)
    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour
    if (!response.ok) {
      return null
    }
    return await response.text()
  } catch (error) {
    console.error(`Failed to fetch README for ${githubPath}:`, error)
    return null
  }
}
