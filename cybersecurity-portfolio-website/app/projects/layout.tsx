import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Browse all cybersecurity projects with complete documentation, working code, and verified evidence.",
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
