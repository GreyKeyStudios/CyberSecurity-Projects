#!/usr/bin/env node
/**
 * Copy repo content into public/content/ for static export.
 * Run from cybersecurity-portfolio-website (npm run build / prebuild).
 * Repo root = parent of cwd.
 */
import { cpSync, mkdirSync, readFileSync, existsSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const websiteRoot = join(__dirname, "..")
const repoRoot = join(websiteRoot, "..")
const publicContent = join(websiteRoot, "public", "content")

const CONTENT_DIRS = [
  "Templates",
  "SOC-Notes",
  "Code-Examples",
  "Interview-Prep",
  "SOC-Casefiles",
]

function main() {
  mkdirSync(publicContent, { recursive: true })

  for (const dir of CONTENT_DIRS) {
    const src = join(repoRoot, dir)
    const dest = join(publicContent, dir)
    if (existsSync(src)) {
      cpSync(src, dest, { recursive: true })
      console.log(`Copied ${dir}/ → public/content/${dir}/`)
    } else {
      console.warn(`Skip (missing): ${src}`)
    }
  }

  const projectsPath = join(websiteRoot, "data", "projects.json")
  if (!existsSync(projectsPath)) return
  const { projects } = JSON.parse(readFileSync(projectsPath, "utf-8"))
  for (const p of projects || []) {
    const githubPath = p.githubPath
    if (!githubPath || typeof githubPath !== "string") continue
    const readmePath = githubPath.replace(/\/?$/, "") + "/README.md"
    const src = join(repoRoot, readmePath)
    const dest = join(publicContent, readmePath)
    if (existsSync(src)) {
      mkdirSync(dirname(dest), { recursive: true })
      cpSync(src, dest)
      console.log(`Copied project README: ${readmePath}`)
    }
  }
}

main()
