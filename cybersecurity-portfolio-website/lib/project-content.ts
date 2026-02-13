import { readFile } from "fs/promises"
import { join } from "path"
import { GITHUB_RAW_BASE } from "@/lib/utils"

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

/** Read README from public/content at build time (static export). */
export async function readReadmeFromBuild(githubPath: string): Promise<string | null> {
  try {
    const segment = githubPath.replace(/\/?$/, "") + "/README.md"
    const path = join(process.cwd(), "public", "content", segment)
    return await readFile(path, "utf-8")
  } catch {
    return null
  }
}
