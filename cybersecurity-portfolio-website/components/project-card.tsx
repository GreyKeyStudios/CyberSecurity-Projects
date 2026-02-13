import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectBadge, type BadgeType } from "@/components/project-badge"
import { GITHUB_REPO, getGitHubTreeUrl } from "@/lib/utils"

export interface ProjectCardProps {
  id: string
  title: string
  description: string
  skills: string[]
  tools: string[]
  badge: BadgeType
  badgeLabel?: string
  githubPath?: string
  featured?: boolean
}

export function ProjectCard({
  id,
  title,
  description,
  skills,
  tools,
  badge,
  badgeLabel,
  githubPath,
  featured = false,
}: ProjectCardProps) {
  const githubUrl = githubPath ? getGitHubTreeUrl(githubPath) : GITHUB_REPO

  return (
    <Card
      className={`group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${
        featured ? "md:col-span-1" : ""
      }`}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <ProjectBadge type={badge} label={badgeLabel} />
        </div>
        <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Skills */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tools</span>
          <div className="flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center rounded-md border border-border px-2 py-1 text-xs text-muted-foreground"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 gap-2 border-border hover:border-primary hover:text-primary bg-transparent"
          >
            <Link href={`/projects/${id}`}>
              <ExternalLink className="h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
