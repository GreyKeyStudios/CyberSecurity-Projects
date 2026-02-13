// Resource content utilities (build-time read from public/content/)

import { readFile } from "fs/promises"
import { join } from "path"

export async function readResourceContentFromBuild(githubPath: string): Promise<string | null> {
  try {
    const path = join(process.cwd(), "public", "content", githubPath)
    const text = await readFile(path, "utf-8")
    if (text.length < 50 || text.includes("404") || text.includes("Not Found")) {
      return null
    }
    return text
  } catch {
    return null
  }
}

export function getResourceGitHubUrl(githubPath: string): string {
  return `https://github.com/GreyKeyStudios/CyberSecurity-Projects/blob/main/${githubPath}`
}
