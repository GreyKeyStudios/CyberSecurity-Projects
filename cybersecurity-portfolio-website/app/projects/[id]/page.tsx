import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectBadge } from "@/components/project-badge"
import { projects, getGitHubUrl } from "@/lib/projects"
import { MarkdownContent } from "@/components/markdown-content"
import { ScreenshotGallery } from "@/components/screenshot-gallery"
import { fetchReadme, projectScreenshots } from "@/lib/project-content"

// Cloudflare Pages requires Edge Runtime for dynamic routes
export const runtime = 'edge'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  const githubUrl = getGitHubUrl(project.githubPath)
  const readmeContent = await fetchReadme(project.githubPath)
  const screenshots = projectScreenshots[id] || []

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>
            <ProjectBadge type={project.badge} label={project.badgeLabel} />
          </div>
          <p className="text-lg text-muted-foreground">
            {project.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 rounded-md bg-secondary">{project.category}</span>
            <span>•</span>
            <span className="capitalize">{project.priority} priority</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-12">
          <Button asChild className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              View on GitHub
            </Link>
          </Button>
          {project.link && project.link !== `/projects/${project.id}` && (
            <Button asChild variant="outline" className="gap-2 border-border hover:border-primary hover:text-primary bg-transparent">
              <Link href={project.link}>
                <ExternalLink className="h-4 w-4" />
                View Project
              </Link>
            </Button>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills Demonstrated */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Skills Demonstrated</h2>
            <ul className="space-y-2">
              {project.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{skill}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Tools Used */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Tools Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Screenshots Section */}
        {screenshots.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Screenshots</h2>
            <ScreenshotGallery
              screenshots={screenshots}
              githubPath={project.githubPath}
              projectTitle={project.title}
            />
          </section>
        )}

        {/* README Documentation Section */}
        {readmeContent && (
          <section className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentation
              </h2>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href={`${githubUrl}README.md`} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <MarkdownContent content={readmeContent} />
            </div>
          </section>
        )}

        {/* Evidence Section */}
        {project.evidence.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Evidence</h2>
            <ul className="space-y-2 rounded-lg border border-border bg-card p-6">
              {project.evidence.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Projects */}
        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Related Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects
              .filter((p) => p.id !== project.id && p.category === project.category)
              .slice(0, 2)
              .map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.id}`}
                  className="group block rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {relatedProject.title}
                    </h3>
                    <ProjectBadge type={relatedProject.badge} className="scale-75" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedProject.description}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  )
}
